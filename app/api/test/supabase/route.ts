import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('[Test] Supabase Configuration Check:');
    console.log('[Test] URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
    console.log('[Test] Key:', supabaseKey ? '✓ Set' : '✗ Missing');

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase credentials',
        details: {
          url: !!supabaseUrl,
          key: !!supabaseKey,
          message: 'Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local',
        },
      }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Check connection
    console.log('[Test] Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('ai_sessions')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('[Test] Connection error:', testError);
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to Supabase',
        details: {
          message: testError.message,
          code: testError.code,
          hint: testError.hint,
        },
      }, { status: 500 });
    }

    // Test 2: Get table info
    console.log('[Test] Fetching ai_sessions table info...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('ai_sessions')
      .select('*')
      .limit(5);

    if (sessionsError) {
      console.error('[Test] Sessions error:', sessionsError);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch sessions',
        details: {
          message: sessionsError.message,
          code: sessionsError.code,
          hint: sessionsError.hint,
        },
      }, { status: 500 });
    }

    console.log('[Test] Success! Found', sessions?.length || 0, 'sessions');

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      details: {
        url: supabaseUrl,
        tableExists: true,
        sessionCount: sessions?.length || 0,
        sampleData: sessions?.[0] || null,
      },
    });
  } catch (error) {
    console.error('[Test] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
