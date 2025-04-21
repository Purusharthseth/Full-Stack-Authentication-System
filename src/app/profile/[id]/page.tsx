export default function userProfile({params}: any) {
    return (
        <div className="max-w-md mx-auto mt-32 p-6 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Profile
        </h1>
        <p className="text-sm text-center text-gray-700 dark:text-gray-300">
            This is the profile page of: {" "}
            <span className="text-red-400 text-md">{params.id}</span>
        </p>
        </div>
    );
}