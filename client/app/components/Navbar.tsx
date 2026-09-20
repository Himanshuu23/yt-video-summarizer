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
        <nav className={`${poppins.className} flex justify-between items-center overflow-x-hidden px-6 py-4 fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/10 border-b border-white/20`}>
            <div className="flex items-center min-w-0">
                <Link href="/" className="text-white text-2xl md:text-3xl font-bold truncate">{name}</Link>
            </div>
            <div className="flex gap-3 md:gap-4 items-center shrink-0">
                <div className="text-white text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-gray-700/50 hover:bg-gray-600/50 whitespace-nowrap">
                    <span className="inline-block w-4 h-4 bg-contain bg-no-repeat mr-2 align-middle" style={{ backgroundImage: 'url("/Token.png")' }} />
                    {user ? user.token : "—"}
                    {user?.role && (
                      <span className="ml-2 text-[10px] md:text-xs uppercase tracking-wide text-white/60">
                        {user.role}
                      </span>
                    )}
                </div>
                <a href="https://himanshusagar.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-gray-700/50 hover:bg-gray-600/50">Docs</a>
                <Link href="/pricing" className="text-white text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-gray-700/50 hover:bg-gray-600/50">
                    Pricing
                </Link>
                <Login />
            </div>
        </nav>
    );
}
