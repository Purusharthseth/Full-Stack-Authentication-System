"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function userProfile({ params }: any) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [verieied, setVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const p = use(params);
    const id = p.id;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res: any = await axios.get("/api/users/profile");
                setUser(res.data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            if (user._id != id) router.push("/profile");
            setVerified(user.isVerified);
        }
    }, [user]);

    const verifyUser = async () => {
        setIsVerifying(true); // Disable button immediately on click
        try {
            await axios.post("/api/users/sendVerificationEmail", {
                email: user.email,
                userId: user._id,
            });
            setTimeout(() => {
                setIsVerifying(false);
            }, 60000);
        } catch (error: any) {
            toast.error("Error verifying user. Please try again.");
            console.error(error.response?.data?.message || error.message);
            setIsVerifying(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-32 p-6 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                {verieied ? "Verified User ✅" : "Unverified User ❌"}
            </h1>
            <p className="text-sm text-center text-gray-700 dark:text-gray-300">
                This is the profile page of:{" "}
                {user&&(<span className="text-red-400 text-md">{user.username}</span>)}
            </p>

            {!verieied && (
                <button
                    onClick={verifyUser}
                    disabled={isVerifying}
                    className={`px-4 py-2 w-full cursor-pointer bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isVerifying ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {isVerifying ? 'Resend available in 60s' : 'Verify User'}
                </button>
            )}

            {/* Forget Password Section */}
            <div className="flex flex-col gap-4 items-center">
                <button className="px-4 py-2 w-full cursor-pointer bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
                    Forget Password
                </button>
            </div>

            {/* Go Back to Profile Section */}
            <Link href="/profile" className="flex flex-col gap-4 items-center">
                <button className="px-4 py-2 w-full cursor-pointer bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                    Go Back to Profile
                </button>
            </Link>
        </div>
    );
}
