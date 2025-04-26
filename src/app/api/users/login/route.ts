import { connect } from '@/dbconfig/dbconfig';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken"
connect();
export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
        }
        const tokenData = { 
            id: user._id
        };
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '2d' });
        const response = NextResponse.json({ message: 'Login successful', success: true}, { status: 200 });
        response.cookies.set("token", token, {
            httpOnly: true,
        })
        return response;
    } catch (error: any) {
        return NextResponse.json({ error: 'Error logging in. Please try again.' }, { status: 500 });
    }
}