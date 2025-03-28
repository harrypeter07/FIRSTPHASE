import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { email, password, fullName, companyName } = await req.json();

  if (!email || !password || !fullName || !companyName) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Register Interviewer in Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        companyName,
        role: 'interviewer',
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Interviewer Registered', data });
}
