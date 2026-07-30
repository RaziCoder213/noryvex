import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { eventId } = await req.json();
    return NextResponse.json({ success: true, eventId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

