import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/userschema";
import Experience from "../../../../models/experienceroute";
import { NextResponse } from "next/server";
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
    const experience = await Experience.create({ Title, start, end, details });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { experience: experience._id } },
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
  const cookieStore = await cookies();
  const token = cookieStore.get("DashboardToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const userId = (payload as any).id;

    const user = await User.findById(userId).populate("experience");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { experiences: user.experience ?? [] },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error verifying token:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}


export async function PATCH (req: Request) {
  await connectDB();
  const data = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("DashboardToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {


 
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const userId = (payload as any).id;

    const user = await User.findById(userId)
    const { expId, updatedData } = data;
    if (!expId || !updatedData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const updatedExperience = await Experience.findByIdAndUpdate(
      expId,
      updatedData,
      { new: true }
    );

    if (!updatedExperience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }
    
    return NextResponse.json(
      { message: "Experience updated successfully", experience: updatedExperience },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error verifying token:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }   
}

export async function DELETE(req: Request) {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("DashboardToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const userId = (payload as any).id;

    const { expId } = await req.json();

    if (!expId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const experience = await Experience.findById(expId);

    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    await User.findByIdAndUpdate(userId, { $pull: { experience: expId } });
    await Experience.findByIdAndDelete(expId);

    return NextResponse.json(
      { message: "Experience deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting experience:", err);

    if (err instanceof Error && err.message.includes("decode")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
