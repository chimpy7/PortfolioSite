import { connectDB } from "../../../../lib/mongodb";
import User from "../../../../models/userschema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { CreateUserSchema } from "../../../../lib/myzodschema";

export async function POST(req: Request) {
    await connectDB();
    const data = await req.json();

    const validation = CreateUserSchema.safeParse(data);
    if (!validation.success) {
        return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    }


    try {
        data.password = await bcrypt.hash(data.password, 10);
        if(data.email == null || data.password == null ||data.name == ""){
            return NextResponse.json({error:"Email and password are required"},{status:400});
        }

        if (data.password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
        }
        if (data.name.length < 3) {
            return NextResponse.json({ error: "Name must be at least 3 characters long" }, { status: 400 });
        }

        const newUser = await User.create(data);
        return NextResponse.json({ status: 201 });
    } catch (err) {
        console.error("Error creating user:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }   
}