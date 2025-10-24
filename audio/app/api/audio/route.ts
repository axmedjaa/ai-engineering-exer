import { NextResponse , NextRequest} from "next/server";
import fs from "fs/promises";
import path from "path";
import { Audio, connectToDatabase,  } from "@/lib/mongodb";
export async function POST(req: NextRequest) {
  await connectToDatabase();
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);
  const url=`/uploads/${fileName}`
  const audiodoc=await Audio.create({title:file.name,url:url})
  return NextResponse.json({success:true,audiodoc});
}
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const id = req.nextUrl.searchParams.get("id");

    if (id) {
      // Get video by ID
      const audiodoc = await Audio.findById(id);
      if (!audiodoc) {
        return NextResponse.json({ success: false, error: "Video not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, audiodoc });
    } else {
      // Get all videos
      const audiodocs = await Audio.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, audiodocs });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "No id provided" }, { status: 400 });
    }
    const audiodoc = await Audio.findByIdAndDelete(id);
    if (!audiodoc) {
      return NextResponse.json({ success: false, error: "audio not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, audiodoc });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}