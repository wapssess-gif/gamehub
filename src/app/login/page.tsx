import { AuthForm } from "@/components/AuthForm";
import { loginUser } from "@/lib/actions/auth";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function LoginPage() {
  const t = getDictionary(await getLocale()).auth;

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
    </div>
  );
}
