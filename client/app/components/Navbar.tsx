'use client';

import Link from 'next/link';
import { Poppins } from "next/font/google";
import Login from './LoginButton';
import { NavProps } from '../types/props';
import { useAuth } from '../contexts/AuthContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function Navbar({ name }: NavProps) {
    const { user } = useAuth();

    return (
        <nav className={`${poppins.className} flex justify-between items-center overflow-x-hidden px-6 py-3 fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/10 border-b border-white/20`}>
            <div className="flex items-center min-w-0">
                <Link href="/" className="text-white text-2xl font-bold truncate">{name}</Link>
            </div>
            <div className="flex gap-4 items-center shrink-0">
                <div className="text-white text-sm px-4 py-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 whitespace-nowrap">
                    <span className="inline-block w-4 h-4 bg-contain bg-no-repeat mr-2 align-middle" style={{ backgroundImage: 'url("/Token.png")' }} />
                    {user?.token ?? 100}
                </div>
                <Link href="/pro" className="text-white text-sm px-4 py-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50">Pro</Link>
                <Login />
            </div>
        </nav>
    );
}
