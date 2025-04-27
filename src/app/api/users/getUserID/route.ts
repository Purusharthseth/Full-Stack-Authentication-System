import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const userId = await  getDataFromToken(request);
        return NextResponse.json({message: "UserId retracted", userId}, { status: 200 });
    } catch (error: any) {
        console.error("Error in internal server.");
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}