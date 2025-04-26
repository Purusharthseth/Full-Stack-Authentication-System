"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user.email && user.password && user.username && user.name) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSignUp = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("signup response", response.data.message);
      router.push("/login");
    } catch (error: any) {
      console.warn("Signup error:", error.response.data.error);
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSignUp();
      }}
      className="max-w-md mx-auto mt-30 p-6 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Sign Up
      </h1>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="username"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          required
          value={user?.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="Create your username"
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="name"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={user?.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="Enter your full name"
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

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
          required
          value={user?.email}
          onChange={(e) =>
            setUser({
              ...user,
              email: e.target.value.toLocaleLowerCase().trim(),
            })
          }
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
          required
          value={user?.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Enter a secure password"
          className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={buttonDisabled || loading}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 
      cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>

      <Link
        href="/login"
        className="text-sm text-center mt-4 text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 
      dark:hover:text-blue-300 transition duration-200"
      >
        Already have an account?{" "}
        <span className="font-medium">Login instead.</span>
      </Link>
    </form>
  );
}


//https://nextjs.org/docs/app/guides/authentication have this implemented in your site later on.
