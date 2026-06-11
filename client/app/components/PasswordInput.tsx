// components/Password.tsx
'use client';

import Error from './Error';
import { modalInput } from '../libs/modalStyles';

type PasswordProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Password({ value, onChange, ...props }: PasswordProps) {
  const isStrongPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/.test(password);

  const showError = value.length > 0 && !isStrongPassword(value);

  return (
    <div>
      <input
        {...props}
        type="password"
        value={value}
        onChange={onChange}
        placeholder="Create a strong Password"
        className={`${modalInput} ${props.className || ''}`}
      />
      {showError && (
        <Error message="Password must be at least 8 characters, include uppercase, lowercase, number, and special character." />
      )}
    </div>
  );
}
