import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/userschema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
  await connectDB();
  const users = await User.find(); // ✅ now TypeScript knows this is callable
  return NextResponse.json(users);
}

export async function POST(req: Request) {
 await connectDB();
  const data = await req.json();
  data.password = await bcrypt.hash(data.password, 10);
  if(!data){
    return NextResponse.json({error:"data was not found "},{status:400})
  }
  const newUser = await User.create(data); 
  return NextResponse.json(newUser, { status: 201 });
}
