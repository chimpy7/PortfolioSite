import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/userschema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, username: user.name },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  const response = NextResponse.json({
    message: "Login successful",
    redirectTo: "/dashboard",
  });

  response.cookies.set({
    name: "DashboardToken",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60,
    path: "/",
  });

  

  return response;
}
