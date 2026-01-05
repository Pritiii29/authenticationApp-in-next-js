import connection from "@/dbConfig/dbConfig";
import User from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connection();


export async function POST(request: NextRequest) {
    try {
       const reqBody = await request.json();
       const {email, password} = reqBody;
       console.log("Login attempt:", { email, password: "***" });
        
    //    check if user exists
    const user = await User.findOne({email});
    console.log("User found:", user ? "Yes" : "No");

    if(!user){
        console.log("User does not exist:", email);
        return NextResponse.json({error: "User does not exist"}, {status: 400})
    }

    console.log("User password hash exists:", user.password ? "Yes" : "No");

    // Check if the password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    console.log("Password valid:", validPassword ? "Yes" : "No");

    if(!validPassword){
        console.log("Invalid password for:", email);
        return NextResponse.json({error: "Invalid credentials"}, {status: 400})
    }

    // create token data

    const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email
    }

    // create token
    console.log("Creating token for user:", user.email);
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"});
    console.log("Token generated successfully");

    // set token in cookie
    console.log("Setting token in cookie");
    const response = NextResponse.json({
        message: "Login successful",
        success: true,
        token: token  // Send token in response body
    })
    response.cookies.set("token",token, {httpOnly: true} )
    console.log("Response sent with token");

    return response;



    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
        
    }
}



