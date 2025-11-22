import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, data } = await request.json();
  await inngest.send({
    name: name,
    data: data,
  });
  return NextResponse.json({ message: "Event sent" }, {
    status: 200, headers: {
      'Content-Type': 'application/json'
  }
  })
}