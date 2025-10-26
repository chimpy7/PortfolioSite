import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/userschema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    await connectDB();
    const data = await req.json();

    try {
        data.password = await bcrypt.hash(data.password, 10);
        if(data.email == null || data.password == null ||data.name == ""){
            return NextResponse.json({error:"Email and password are required"},{status:400});
        }
        const newUser = await User.create(data);
        return NextResponse.json(newUser, { status: 201 });
    } catch (err) {
        console.error("Error creating user:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }   
}