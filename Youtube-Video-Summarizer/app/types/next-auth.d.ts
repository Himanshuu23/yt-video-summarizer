import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      token?: number;
    };
  }

  interface User {
    role?: string;
    token?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    token?: number;
  }
}
