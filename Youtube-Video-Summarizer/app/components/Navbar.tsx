'use client';

import Link from 'next/link';
import { Poppins } from "next/font/google";
import Login from './Login';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function Navbar() {
    return (
        <nav className={`${poppins.className} flex justify-between items-center overflow-x-hidden px-6 py-3 fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/10 border-b border-white/20`}>
            <div className="flex items-center">
                <Link href="/" className={`text-white text-2xl text-gray-300 font-bold`}>Summarify</Link>
            </div>
            <div className="flex gap-4">
                <Link href="/pro" className="text-white text-sm px-4 py-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50">Pro</Link>
                <Login />
            </div>
        </nav>
    );
}
