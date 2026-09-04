import { AuthForm } from "@/components/AuthForm";
import { registerUser } from "@/lib/actions/auth";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="mb-6 text-2xl font-semibold">Регистрация</h1>
      <AuthForm
        action={registerUser}
        submitLabel="Создать аккаунт"
        fields={[
          { name: "email", label: "Email", type: "email", autoComplete: "email" },
          { name: "username", label: "Ник", autoComplete: "username" },
          { name: "password", label: "Пароль (мин. 8 символов)", type: "password", autoComplete: "new-password" },
        ]}
      />
    </div>
  );
}
