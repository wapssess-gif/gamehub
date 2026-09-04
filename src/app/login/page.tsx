import { AuthForm } from "@/components/AuthForm";
import { loginUser } from "@/lib/actions/auth";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="mb-6 text-2xl font-semibold">Вход</h1>
      <AuthForm
        action={loginUser}
        submitLabel="Войти"
        fields={[
          { name: "email", label: "Email", type: "email", autoComplete: "email" },
          { name: "password", label: "Пароль", type: "password", autoComplete: "current-password" },
        ]}
      />
    </div>
  );
}
