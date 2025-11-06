import { verifyUserToken } from '@/app/_lib/auth';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
): Promise<
  NextResponse<{ isLoggedIn: boolean; role: 'user' | 'admin'; id: string }>
> {
  const token = req.cookies.get('token')?.value;
  let isLoggedIn = false;
  let role: 'user' | 'admin' = 'user';
  let id = '';

  if (token) {
    try {
      const payload = await verifyUserToken(token);

      if (payload && (payload.role === 'user' || payload.role === 'admin')) {
        isLoggedIn = true;
        role = payload.role;
        id = payload.id;
      }
    } catch (error) {
      console.error('Error:', error);
      isLoggedIn = false;
      id = '';
    }
  }

  return NextResponse.json({ isLoggedIn, role, id });
}
