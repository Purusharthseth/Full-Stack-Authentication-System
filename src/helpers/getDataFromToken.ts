import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (req: NextRequest) => {
    try {
        const token = req.cookies.get("token")?.value || "";
        if (!token) return null;
        const data:any = jwt.verify(token, process.env.TOKEN_SECRET as string);
        return data.id;
    } catch (error: any) {
        console.error("Error in getDataFromToken:", error.message);
    }
}; 