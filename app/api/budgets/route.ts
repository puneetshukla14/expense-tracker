import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Budget from '@/models/Budget';

export async function POST(req: NextRequest) {
  try {
    const { category, amount } = await req.json();
    if (!category || !amount) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    await dbConnect();
    const newBudget = await Budget.create({ category, amount });
    return NextResponse.json(newBudget);
  } catch (error) {
    console.error('POST /budgets error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const budgets = await Budget.find().sort({ createdAt: -1 });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('GET /budgets error:', error);
    return NextResponse.json({ message: 'Failed to fetch budgets' }, { status: 500 });
  }
}
