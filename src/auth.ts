import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

/** Random handle placeholder ("u" + 8 chars); the user picks a real one at /onboarding. */
function placeholderUsername(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "u";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

/** Finds the user for a verified OAuth email, creating one (unonboarded) if needed. */
async function resolveOAuthUser(email: string, name?: string | null, picture?: string | null) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.user.create({
        data: {
          email,
          username: placeholderUsername(),
          displayName: name ?? null,
          avatarUrl: picture ?? null,
          onboardedAt: null,
        },
      });
    } catch (error) {
      // retry only on a username collision; anything else bubbles up
      const code = (error as { code?: string }).code;
      if (code !== "P2002" || attempt === 2) throw error;
    }
  }
  throw new Error("could not allocate a username");
}

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email" },
      password: { label: "Пароль", type: "password" },
    },
    authorize: async (credentials) => {
      const email = credentials?.email as string | undefined;
      const password = credentials?.password as string | undefined;
      if (!email || !password) return null;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) return null;

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.username,
        needsOnboarding: !user.onboardedAt,
      };
    },
  }),
];

if (googleEnabled) providers.push(Google);

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return true;

      const email = typeof profile?.email === "string" ? profile.email.toLowerCase() : null;
      if (!email || profile?.email_verified === false) return false;

      const dbUser = await resolveOAuthUser(
        email,
        typeof profile?.name === "string" ? profile.name : null,
        typeof profile?.picture === "string" ? profile.picture : null,
      );

      // carried into jwt() below
      user.id = dbUser.id;
      user.needsOnboarding = !dbUser.onboardedAt;
      return true;
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.needsOnboarding = user.needsOnboarding ?? false;
      }
      if (trigger === "update" && token.id) {
        const fresh = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { onboardedAt: true },
        });
        token.needsOnboarding = !fresh?.onboardedAt;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string;
        session.user.needsOnboarding = Boolean(token.needsOnboarding);
      }
      return session;
    },

    authorized({ auth: session, request: { nextUrl } }) {
      if (!session?.user) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      if (session.user.needsOnboarding && nextUrl.pathname !== "/onboarding") {
        return Response.redirect(new URL("/onboarding", nextUrl));
      }
      return true;
    },
  },
});
