import { AuthForm } from "@/components/AuthForm";
import { registerUser } from "@/lib/actions/auth";
import { getLocale } from "@/i18n/getLocale";
import { getDictionary } from "@/i18n/dictionaries";

export default async function RegisterPage() {
  const t = getDictionary(await getLocale()).auth;

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="mb-6 text-2xl font-semibold">{t.registerTitle}</h1>
      <AuthForm
        action={registerUser}
        submitLabel={t.registerSubmit}
        pendingLabel={t.pending}
        fields={[
          { name: "email", label: t.emailLabel, type: "email", autoComplete: "email" },
          { name: "username", label: t.usernameLabel, autoComplete: "username" },
          { name: "password", label: t.passwordHintLabel, type: "password", autoComplete: "new-password" },
        ]}
      />
    </div>
  );
}
