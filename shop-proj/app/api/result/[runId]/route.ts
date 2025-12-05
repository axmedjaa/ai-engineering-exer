import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { runId: string } } // ✅ params is a plain object
) {
  try {
    const { runId } = await params; // ✅ no await needed

    const db = await getDb();
    const result = await db.collection('results').findOne({ runId });

    if (!result) {
      return NextResponse.json({ error: 'Run not found' }, { status: 404 });
    }

    return NextResponse.json({
      runId: result.runId,
      input: result.input || result.state?.productQuery || null,
      status: result.status,
      progress: result.progress || {},
      state: result.state || {},
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      completedAt: result.completedAt || null,
      error: result.error || null,
    });
  } catch (error) {
    console.error('Error fetching result:', error);
    return NextResponse.json({ error: 'Failed to fetch result' }, { status: 500 });
  }
}
