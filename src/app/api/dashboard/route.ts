import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/userschema";
import Experience from "../../../../models/experienceroute";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';


export async function POST(req: Request) { 
 await connectDB();
  
  const cookieStore = await cookies();
  const token = cookieStore.get("DashboardToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  let userId: string | null = null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    userId = (payload as any).id;
  } catch (e) {
    console.error("Invalid token:", e);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const data = await req.json();
  const { Title, start, end, details } = data;

  if (!Title || !start || !end || !details) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    // Create experience
    const experience = await Experience.create({ Title, start, end, details });

    // Link to user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { experience: experience._id }, // if array: { $push: { experience: experience._id } }
      { new: true }
    ).populate("experience");

    return NextResponse.json(
      { message: "Experience added successfully", user: updatedUser },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating experience:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



export async function GET(req: Request) {
  await connectDB();
  const experiences = await Experience.find()
  return NextResponse.json({ experiences }, { status: 200 });
}
