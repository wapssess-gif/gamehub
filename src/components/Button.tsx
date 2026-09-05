import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    const baseStyles = "rounded-md px-4 py-2 font-medium transition-all duration-200";

    const variants = {
      primary: "bg-white text-black hover:bg-red-900 hover:text-white active:bg-red-950",
      secondary:
        "border border-white/30 text-white hover:bg-red-900 hover:border-red-900 active:bg-red-950 transition-colors",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
