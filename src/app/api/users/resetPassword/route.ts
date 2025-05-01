import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request: NextRequest){
    try {
        const {token, password}= await request.json();
        const user = await User.findOne({ forgotPasswordToken: token, forgotPasswordTokenExpiry: { $gt: Date.now() } })
        if(!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();
        return NextResponse.json({ message: "Password reset successfully", success: true}, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}