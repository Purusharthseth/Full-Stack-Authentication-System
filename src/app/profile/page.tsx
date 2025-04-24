"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const router = useRouter();
    const logout = async () => {
        try {
            await axios.get("/api/users/logout");
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error: any) {
            console.log("Logout error:", error.response.data.error);
            toast.error(error.response.data.error);
        }
    };
    const [userId, setUserId] = useState <any>(null);

    const getUser= async ()=>{
      const res:any =  await axios.get("/api/users/profile")
      setUserId(res.data.user._id)
    }
  return (
    <div className="max-w-md mx-auto mt-30 p-6 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Profile
      </h1>
      <p className="text-sm text-center text-gray-700 dark:text-gray-300">
        This is the profile page.
      </p>
      <hr />
      <button onClick={logout}
        className="mt-4 w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition duration-200 
             disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-600 dark:hover:bg-red-700"
      >
        Logout
      </button>
      <Link
  href={userId ? `/profile/${userId}` : "#"}
  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-center transition duration-200"
>
  {userId ? "View Profile" : "Click below to get user profile..."}
</Link>

<button
  className="mt-4 w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  onClick={getUser}
>
  Get User Details
</button>
    </div>
  );
}
