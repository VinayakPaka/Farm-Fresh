import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";
import authRoutes from "./routes/auth.routes.js";
dotenv.config()
connectDB()

const app = express();

app.use("/api/auth/", authRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});