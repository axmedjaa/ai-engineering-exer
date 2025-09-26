import { connectToDatabase } from "@/lib/db";
import Review from "@/model/review";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDatabase();
    const review = await Review.find();
    return NextResponse.json({ review });
}
export async function POST(req: Request) {
    await connectToDatabase();
    const body = await req.json();
    const review = await Review.create(body);
    return NextResponse.json({ review });
}