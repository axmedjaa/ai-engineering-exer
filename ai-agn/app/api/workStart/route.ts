import { inngest } from "@/inngest/client";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function POST(request: Request) {
    const { name, data } = await request.json();
    await inngest.send({
        name: name,
        data: { 
            requestId: data.requestId, 
            approved: data.action
        },
    });
    return NextResponse.json({ message: "Event sent" }, {
        status: 200
    })
}