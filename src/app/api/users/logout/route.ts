import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = NextResponse.json({ message: "Logout successful", success: true }, { status: 200 });
        res.cookies.delete("token");
        return res;
    } catch (error) {
        return NextResponse.json({ error: "Error logging out. Please try again." }, { status: 500 });
    }
}