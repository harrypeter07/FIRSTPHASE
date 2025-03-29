import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('sb-access-token')?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const role = data.user?.user_metadata?.role;

  if (req.nextUrl.pathname.startsWith('/dashboard/job-seeker') && role !== 'job_seeker') {
    return NextResponse.redirect(new URL('/dashboard/interviewer', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/dashboard/interviewer') && role !== 'interviewer') {
    return NextResponse.redirect(new URL('/dashboard/job-seeker', req.url));
  }

  return NextResponse.next();
}

// Apply middleware to dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
