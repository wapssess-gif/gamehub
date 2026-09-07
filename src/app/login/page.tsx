import { AuthForm } from "@/components/AuthForm";
import { GoogleButton } from "@/components/GoogleButton";
import { loginUser } from "@/lib/actions/auth";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function LoginPage() {
  const t = getDictionary(await getLocale()).auth;
  const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="mb-6 text-2xl font-semibold">{t.loginTitle}</h1>
      <AuthForm
        action={loginUser}
        submitLabel={t.loginSubmit}
        pendingLabel={t.pending}
        fields={[
          { name: "email", label: t.emailLabel, type: "email", autoComplete: "email" },
          { name: "password", label: t.passwordLabel, type: "password", autoComplete: "current-password" },
        ]}
      />
      {googleEnabled && (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-black/40 dark:text-white/40">
            <span className="h-px flex-1 bg-black/15 dark:bg-white/15" />
            {t.or}
            <span className="h-px flex-1 bg-black/15 dark:bg-white/15" />
          </div>
          <GoogleButton label={t.continueWithGoogle} />
        </>
      )}
    </div>
  );
}
