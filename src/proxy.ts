export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/library/:path*",
    "/profile/:path*",
    "/friends/:path*",
    "/users/:path*",
    "/u/:path*",
  ],
};
