import Cookies from 'js-cookie';

export function setCookie(name: string, value: string) {
  Cookies.set(name, value, {
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
}

export function getCookie(name: string) {
  return Cookies.get(name);
}
