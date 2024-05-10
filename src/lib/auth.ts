import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from './server-utils';
import { authSchema } from './validations';
import { NextResponse } from 'next/server';

const config = {
  pages: {
    signIn: '/login',
  },
  //   session: {
  //     maxAge: 30 * 24 * 60 * 60,
  //     strategy: 'jwt',
  //   },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const validatedFormData = authSchema.safeParse(credentials);
        if (!validatedFormData.success) {
          return null;
        }
        // runs on login
        const { email, password } = validatedFormData.data;

        const user = await getUserByEmail(email);
        if (!user) {
          console.log('User not found');
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordsMatch) {
          console.log('Invalid credentials');
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = !!auth?.user;
      const isTryingToAccessApp = request.nextUrl.pathname.includes('/app');

      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      }

      if (isLoggedIn && isTryingToAccessApp && !auth?.user.hasAccess) {
        return NextResponse.redirect(new URL('/payment', request.nextUrl));
      }

      if (isLoggedIn && isTryingToAccessApp && auth?.user.hasAccess) {
        return true;
      }

      if (
        isLoggedIn &&
        (request.nextUrl.pathname.includes('/login') ||
          request.nextUrl.pathname.includes('/signup')) &&
        auth?.user.hasAccess
      ) {
        return NextResponse.redirect(new URL('/app/dashboard', request.nextUrl));
      }

      if (isLoggedIn && !isTryingToAccessApp) {
        if (
          (request.nextUrl.pathname.includes('/login') ||
            request.nextUrl.pathname.includes('/signup')) &&
          !auth?.user.hasAccess
        ) {
          return NextResponse.redirect(new URL('/payment', request.nextUrl));
        }

        return true;
      }

      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }

      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user && user.id) {
        // on sign in
        token.userId = user.id;
        token.hasAccess = user.hasAccess;
      }

      if (trigger === 'update') {
        // on every request
        const userFromDb = await getUserByEmail(token.email);
        if (userFromDb) token.hasAccess = userFromDb?.hasAccess;
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;
      session.user.hasAccess = token.hasAccess;

      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
