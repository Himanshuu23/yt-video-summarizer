// components/Email.tsx
'use client';

import Error from './Error';

type EmailProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Email({ value, onChange, ...props }: EmailProps) {
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const showError = value.length > 0 && !isValidEmail(value);

  return (
    <div>
      <input
        {...props}
        type="email"
        value={value}
        onChange={onChange}
        placeholder="Email"
        className={`p-2 w-full rounded bg-gray-800 text-white placeholder-gray-400 ${props.className || ''}`}
      />
      {showError && <Error message="Please enter a valid email address." />}
    </div>
  );
}
