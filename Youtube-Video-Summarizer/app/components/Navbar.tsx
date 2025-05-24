'use client';

import Link from 'next/link';
import { Poppins } from "next/font/google";
import Login from './LoginButton';
import { NavProps } from '../types/props';
import { useEffect, useState } from 'react';
import { getCookie } from '../libs/cookie';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function Navbar({ name }: NavProps) {
    const [userData, setUserData] = useState<any>({ name: "", email: "", token: 100, role: "FREE" })
    const [token, setToken] = useState<any>(100)

    useEffect(() => {
        async function getToken() {
            const data = JSON.parse(await getCookie("user") || "")
            setToken(data.token)
        }

        getToken()
    }, [userData])

    return (
        <nav className={`${poppins.className} flex justify-between items-center overflow-x-hidden px-6 py-3 fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/10 border-b border-white/20`}>
            <div className="flex items-center">
                <Link href="/" className={`text-white text-2xl text-gray-300 font-bold`}>{name}</Link>
            </div>
            <div className="flex gap-4">
                <div className="text-white text-sm px-4 py-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50"><span  className="inline-block w-4 h-4 bg-contain bg-no-repeat mr-2 pt-2" style={{ backgroundImage: 'url("/Token.png")' }}></span>{token}</div>
                <Link href="/pro" className="text-white text-sm px-4 py-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50">Pro</Link>
                <Login userData={userData} setUserData={setUserData} />
            </div>
        </nav>
    );
}
