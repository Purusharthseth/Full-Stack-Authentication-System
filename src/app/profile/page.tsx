"use client";
import axios from "axios";
import { set } from "mongoose";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
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
  const [userId, setUserId] = useState<any>(null);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { data } = await axios.get("/api/users/getUserID");
        setUserId(data.userId);
      } catch (error: any) {
        console.log("Error fetching user ID:", error.response.data.error);
        toast.error(error.response.data.error);
      }
    };
    fetchUserId();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-30 p-6 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        User Logged In
      </h1>
      <hr />
      <button
        onClick={logout}
        className="mt-4 w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition duration-200 
             disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-600 dark:hover:bg-red-700"
      >
        Logout
      </button>
      <Link
        href={userId ? `/profile/${userId}` : "#"}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-center transition duration-200"
      >
        CLick to View User Profile
      </Link>
    </div>
  );
}
