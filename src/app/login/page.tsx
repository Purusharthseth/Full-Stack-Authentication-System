"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
  }); 
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login response:", response.data.message);
      router.push("/profile");
    } catch (error: any) {
      console.warn("Login error:", error.response.data.error);
      toast.error(error.response.data.error);
    }finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(user.email && user.password){
      setButtonDisabled(false)
    }else{
      setButtonDisabled(true)
    }
  }, [user])
  return (
    <div className="max-w-md mx-auto mt-30 p-6 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Login
      </h1>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={user?.email}
          onChange={(e) => setUser({ ...user, email: e.target.value.toLocaleLowerCase().trim() })}
          placeholder="Enter your email"
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={user?.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Enter a secure password"
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={onLogin}
        disabled={buttonDisabled||loading}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Loggin in..." : "Login"}
      </button>
        <Link
          href="/signup"
          className="text-sm text-center mt-4 text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition duration-200"
        >
          Want to create a new account?{" "}
          <span className="font-medium">Signup instead.</span>
        </Link>
    </div>
  );
}
