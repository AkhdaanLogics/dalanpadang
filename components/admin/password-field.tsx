"use client";

import { useState } from "react";

type PasswordFieldProps = {
  id?: string;
  name?: string;
  required?: boolean;
};

export function PasswordField({
  id = "password",
  name = "password",
  required = true,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        required={required}
        className="field-ui pr-11"
      />
      <button
        type="button"
        onClick={() => setShowPassword((value) => !value)}
        className="absolute inset-y-1.5 right-1.5 inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6d5443] transition hover:bg-[#efe3d4]"
        aria-label={
          showPassword ? "Sembunyikan password" : "Tampilkan password"
        }
        aria-pressed={showPassword}
      >
        {showPassword ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="M3 3l18 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M9.5 5.4A10.8 10.8 0 0 1 12 5c5.6 0 9.4 4.3 10.5 6.1a1.6 1.6 0 0 1 0 1.8 18.7 18.7 0 0 1-4.5 4.8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.8 6.8a18.6 18.6 0 0 0-5.3 4.3 1.6 1.6 0 0 0 0 1.8C2.6 14.7 6.4 19 12 19c1.2 0 2.3-.2 3.4-.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="M1.5 12.9a1.6 1.6 0 0 1 0-1.8C2.6 9.3 6.4 5 12 5s9.4 4.3 10.5 6.1a1.6 1.6 0 0 1 0 1.8C21.4 14.7 17.6 19 12 19s-9.4-4.3-10.5-6.1Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
