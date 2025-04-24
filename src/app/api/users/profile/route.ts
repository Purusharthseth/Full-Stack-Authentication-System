import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconfig";

connect();
export async function GET(request: NextRequest) {
    try {
        const userId = await  getDataFromToken(request);
        const user = await User.findById(userId).select('-password -isAdmin')
        return NextResponse.json({message: "User found succesfully", user}, { status: 200 });
    } catch (error: any) {
        console.error("Error in internal server.");
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}