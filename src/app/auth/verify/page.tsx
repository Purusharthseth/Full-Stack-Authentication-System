"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        if (token) {
            verify(token);
        } else {
            setLoading(false);
            setSuccess(false); 
            console.error("No token found in  URL");
        }
    }, []);

    const verify= async (token:any)=>{   
        try {
            await axios.post("/api/users/verifyEmail", { token });
            setSuccess(true);
            setLoading(false);

            setTimeout(() => {
                router.push("/profile");
            }, 2000);
            
        } catch (error: any) {
            setSuccess(false);
            setLoading(false);
            console.error("Error verifying email:", error.response?.data);
        }
    } 

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 dark:text-gray-300">Verifying...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {success ? (
              <p className="text-green-500 text-lg font-semibold">Email verified successfully✅! You will be redirected to your profile soon.</p>
            ) : (
              <p className="text-red-500 text-lg font-semibold">Failed to verify email.</p>
            )}
          </div> 
        )}
      </div>
    )
}