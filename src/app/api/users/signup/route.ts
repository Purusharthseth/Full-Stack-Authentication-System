import { connect } from '@/dbconfig/dbconfig';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import { log } from 'console';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, name, email, password } = reqBody;

        if (!username || !name || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }]});
          
        if (existingUser) {
            const field = existingUser.email === email ? 'Email' : 'Username';
            return NextResponse.json({ error: `${field} already exists` }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const savedUser= await new User({
            username,
            name,
            email,
            password: hashedPassword,
        }).save(); // creates the new user first, and then save sit too.
        console.log(savedUser);
        return NextResponse.json({ message: 'User created successfully', success:true, savedUser }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }
}