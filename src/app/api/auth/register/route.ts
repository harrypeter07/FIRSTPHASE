import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Map role values to table names
const ROLE_TABLE_MAP = {
  'job-seeker': 'job_seeker_profiles',
  'interviewer': 'interviewer_profiles',
  'company': 'company_profiles',
} as const;

export async function POST(request: Request) {
  try {
    const { username, email, password, role } = await request.json();

    // Validate required fields
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role
    if (!Object.keys(ROLE_TABLE_MAP).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Create base profile
    const { error: baseProfileError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: authData.user!.id,
          username,
          email,
          role,
        },
      ]);

    if (baseProfileError) {
      return NextResponse.json(
        { error: 'Failed to create base profile' },
        { status: 500 }
      );
    }

    // Create role-specific profile
    const { error: roleProfileError } = await supabase
      .from(ROLE_TABLE_MAP[role as keyof typeof ROLE_TABLE_MAP])
      .insert([
        {
          user_id: authData.user!.id,
          username,
          email,
        },
      ]);

    if (roleProfileError) {
      // If role profile creation fails, delete the base profile
      await supabase
        .from('profiles')
        .delete()
        .eq('user_id', authData.user!.id);
      
      return NextResponse.json(
        { error: 'Failed to create role-specific profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Registration successful', userId: authData.user!.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 