import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
}

export const getDataFromToken = (req: NextRequest): string | null => {
    try {
        const token = req.cookies.get("token")?.value || "";
        if (!token) return null;

        const data = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
        return data.id;
    } catch (error) {
        const err = error as Error;
        console.error("Error in getDataFromToken:", err.message);
        return null;
    }
};
