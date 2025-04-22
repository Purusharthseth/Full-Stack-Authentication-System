import { connect } from '@/dbconfig/dbconfig';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, name, email, password } = reqBody;

        const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }]});
          
        if (existingUser) {
            if(existingUser.email === email ) return NextResponse.json({ error: `User with email already exists` }, { status: 400 });
            else return NextResponse.json({ error: `Username already taken.` }, { status: 400 });
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
        return NextResponse.json({ error: 'Error creating user. Please try again.' }, { status: 500 });
    }
}