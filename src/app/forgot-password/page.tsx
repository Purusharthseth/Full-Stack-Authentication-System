"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const resetPassword = async () => {
        setLoading(true);
        try {
            await axios.post("/api/users/forgotPasswordEmail", {
                email: email
            });
            setTimeout(() => {
                setLoading(false);
            }, 60000);
            toast.success("Password reset link sent to your email.");
        } catch (error: any) {
            toast.error("Error sending password reset link: " + error.response?.data?.error || error.message);
            console.error(error.response?.data?.error || error.message);
            setLoading(false);
        }
    };
    return (
        <div className="max-w-md mx-auto mt-30 p-6 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Forgot Password
            </h1>

            <p className="text-sm text-gray-700 dark:text-gray-300">
                Please enter your email address to reset your password.
            </p>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    resetPassword();
                }}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Email
                    </label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit" disabled={loading}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading? "Wait before requesting again":"Send Reset Link"}
                </button>
            </form>
        </div>
    );
}
