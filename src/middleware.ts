// export function middleware(req: Request, res: Response) {
//   console.log('🚀 ~ middleware ~ req.url:', req.url);
//   return NextResponse.next();
// }

import { auth } from './lib/auth';

export default auth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
