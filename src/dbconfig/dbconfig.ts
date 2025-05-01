import mongoose from "mongoose";

export async function connect() {
    if (mongoose.connection.readyState === 1) {
        console.log("Already connected to MongoDB.");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        const  connection = mongoose.connection;
        connection.on("error", (err)=>{
            console.error("MonogoDB error, please make sure Mongodb is running." + err);
            process.exit();
        })
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}
