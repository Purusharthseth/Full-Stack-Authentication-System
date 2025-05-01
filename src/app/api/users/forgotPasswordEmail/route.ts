import { sendEmail } from "@/helpers/mailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, userId } = await request.json();
        await sendEmail({ email, emailType: "RESET", userId });
        return NextResponse.json({message: "Reset password email sent successfully"}, { status: 200 });
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}