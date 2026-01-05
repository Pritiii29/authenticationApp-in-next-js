import connection from "@/dbConfig/dbConfig";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connection();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("Request body:", reqBody);
    const { username, email, password } = reqBody;

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // check if user already exists
    const user = await User.findOne({ email });
    console.log("Existing user found:", !!user);

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser.email);

    //send verification email

    await sendEmail({email, emailType: 'VERIFY', 
      userId: savedUser._id
    })

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      user: savedUser,
    });
  } catch (error: any) {
    console.log("Signup error:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 400 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
