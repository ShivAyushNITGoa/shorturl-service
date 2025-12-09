import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { aiId, aiName, action, userId, timestamp } = body;

    // Validate required fields
    if (!aiId || !action) {
      return NextResponse.json(
        { error: 'aiId and action are required' },
        { status: 400 }
      );
    }

    // Log to Supabase
    const { data, error } = await supabase
      .from('ai_sessions')
      .insert({
        ai_id: aiId,
        ai_name: aiName || 'Unknown',
        action: action, // 'open', 'close', etc.
        user_id: userId || 'anonymous',
        timestamp: timestamp || new Date().toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to log to Supabase', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'AI usage logged', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json(
      { error: 'Tracking request failed' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
