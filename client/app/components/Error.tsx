import { Poppins } from "next/font/google";
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function Error({ message }: { message: string }) {
  return (
    <div className={`${poppins.className} flex items-center text-sm text-red-500 mt-2`}>
      {message && <ExclamationCircleIcon className="h-4 w-4 mr-1 text-red-550" />}
      {message}
    </div>
  );
}