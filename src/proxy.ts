export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/library/:path*", "/profile/:path*"],
};
