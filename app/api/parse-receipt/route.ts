import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Normally you'd extract the image here and parse it with OCR

  return NextResponse.json({
    description: 'Restaurant Bill',
    amount: '750.00',
    date: '2025-05-15',
  });
}
