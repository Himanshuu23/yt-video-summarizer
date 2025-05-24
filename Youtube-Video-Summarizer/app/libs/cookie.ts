"use server"

import { cookies } from 'next/headers';

export async function setCookie(name: string, value: string) {
  cookies().set(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',  
});
}

export async function getCookie(name: string) {
  return cookies().get(name)?.value;
}
