// components/Email.tsx
'use client';

import Error from './Error';
import { modalInput } from '../libs/modalStyles';

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
        className={`${modalInput} ${props.className || ''}`}
      />
      {showError && <Error message="Please enter a valid email address." />}
    </div>
  );
}
