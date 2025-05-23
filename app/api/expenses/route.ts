import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Expense from '@/models/Expense';

// POST: Add a new expense
export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();

  try {
    const expense = await Expense.create(data);
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ message: 'Failed to add expense' }, { status: 500 });
  }
}

// GET: Fetch all expenses
export async function GET() {
  await dbConnect();

  try {
    const expenses = await Expense.find().sort({ date: -1 }); // latest first
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ message: 'Failed to fetch expenses' }, { status: 500 });
  }
}

// DELETE: Remove an expense by ID
export async function DELETE(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Expense ID is required' }, { status: 400 });
    }

    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'Failed to delete expense' }, { status: 500 });
  }
}
