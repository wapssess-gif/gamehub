"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/actions/auth";

type Field = {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
};

export function AuthForm({
  action,
  fields,
  submitLabel,
  pendingLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  fields: Field[];
  submitLabel: string;
  pendingLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {fields.map((field) => (
        <label key={field.name} className="flex flex-col gap-1 text-sm">
          {field.label}
          <input
            name={field.name}
            type={field.type ?? "text"}
            autoComplete={field.autoComplete}
            required
            className="rounded-md border border-black/20 bg-transparent px-3 py-2 outline-none focus:border-foreground dark:border-white/20"
          />
        </label>
      ))}

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-white px-4 py-2 text-black font-medium transition-all duration-200 hover:bg-red-900 hover:text-white active:bg-red-950 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
