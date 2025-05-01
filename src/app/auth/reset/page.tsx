"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPage() {
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const router = useRouter();

    const resetPassword = async () => {
        setLoading(true);
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");

            if (!token) {
                toast.error("No token found in URL");
                console.error("No token found in URL");
                setLoading(false);
                return;
            }

            await axios.post("/api/users/resetPassword", {
                token,
                password: pass,
            });

            toast.success("Password reset successfully!");
            await axios.get("/api/users/logout");
            router.push("/login");
        } catch (err: any) {
            setError(err.response?.data.error);
            console.error("Error resetting password:", err.response?.data.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (pass !== confirmPass) {
            setError("Passwords do not match");
            setButtonDisabled(true);
        } else {
            setError("");
            setButtonDisabled(pass === "");
        }
    }, [pass, confirmPass]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                resetPassword();
            }}
            className="max-w-md mx-auto mt-30 p-6 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl flex flex-col gap-4"
        >
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Reset Password
            </h1>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="Enterpassword"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Enter Password
                </label>
                <input
                    id="Enterpassword"
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="Enter a secure password"
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label
                    htmlFor="Confirmpassword"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Confirm Password
                </label>
                <input
                    id="Confirmpassword"
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Confirm your password"
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {error && <p className="text-red-500 font-light">{error}</p>}

            <button
                type="submit"
                disabled={buttonDisabled || loading}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 
                    cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    );
}
