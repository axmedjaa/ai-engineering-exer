import { inngest } from "@/inngest/client";
import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { input, limit = 1 } = await request.json();

        // Validate input
        if (!input || typeof input !== 'string') {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        // Generate unique runId
        const runId = `run_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        console.log('📝 [API] Generated runId:', runId);

        // Save initial workflow state to MongoDB
        try {
            const db = await getDb();
            const insertResult = await db.collection('results').insertOne({
                runId,
                input,
                limit,
                status: 'running',
                progress: {},  // track agent completion
                state: {},     // store intermediate data
                createdAt: new Date(),
            });
            console.log('✅ [API] Initial DB record created:', insertResult.insertedId);
        } catch (dbError) {
            console.error('❌ [API] MongoDB error:', dbError);
            throw dbError;
        }

        // Trigger Inngest workflow asynchronously
        await inngest.send({
            name: "workflow/start",
            data: {
                input,
                runId,
                limit
            }
        });

        // Immediate response to client
        return NextResponse.json({
            status: 'running',
            runId,
            message: 'Agents running in background',
            input,
            limit
        });

    } catch (error) {
        console.error('❌ Error running inngest:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
