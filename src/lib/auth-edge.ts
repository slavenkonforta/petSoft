import { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';
import { getUserByEmail } from './server-utils';
import prisma from './db';

export const nextAuthEdgeConfig = {
  pages: {
    signIn: '/login',
  },
  //   session: {
  //     maxAge: 30 * 24 * 60 * 60,
  //     strategy: 'jwt',
  //   },
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

      if (isLoggedIn && !isTryingToAccessApp && !auth?.user.hasAccess) {
        if (
          request.nextUrl.pathname.includes('/login') ||
          request.nextUrl.pathname.includes('/signup')
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
        const userFromDb = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
        });
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
  providers: [],
} satisfies NextAuthConfig;
