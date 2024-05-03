import { NextResponse } from 'next/server';

export function middleware(req: Request, res: Response) {
  console.log('🚀 ~ middleware ~ req.url:', req.url);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
