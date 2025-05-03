"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  _id: string;
  email: string;
  username: string;
  isVerified: boolean;
}
export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [verified, setVerified] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const id = useParams<{id: string}>().id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/profile");
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      if (user._id !== id) router.push("/profile");
      setVerified(user.isVerified);
    }
  }, [user, id, router]);

  const verifyUser = async () => {
    setSendingEmail(true);
    try {
      await axios.post("/api/users/sendVerificationEmail", {
        email: user?.email,
        userId: user?._id,
      });
      setTimeout(() => {
        setSendingEmail(false);
      }, 60000);
    } catch (error) {
        const err = error as any;
      toast.error("Error verifying user. Please try again.");
      console.error(err.response?.data?.message || err.message);
      setSendingEmail(false);
    }
  };


  return (
    <div className="max-w-md mx-auto mt-32 p-6 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        {verified ? "Verified User ✅" : "Unverified User ❌"}
      </h1>
      <p className="text-sm text-center text-gray-700 dark:text-gray-300">
        This is the profile page of:{" "}
        {user && <span className="text-red-400 text-md">{user.username}</span>}
      </p>

      {!verified && (
        <button
          onClick={verifyUser}
          disabled={sendingEmail}
          className={`px-4 py-2 w-full cursor-pointer bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
            ${sendingEmail ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {sendingEmail ? "Resend available in 60s" : "Verify User"}
        </button>
      )}

      <div className="flex flex-col gap-4 items-center">
        
        <button onClick={() => router.push("/forgot-password")}
          className={`px-4 py-2 w-full cursor-pointer bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 
          `}
        >
          Reset Password
        </button>
      </div>
        <button onClick={() => router.push("/profile")}
        className="px-4 py-2 w-full cursor-pointer bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
          Go Back to Profile
        </button>
    </div>
  );
}
