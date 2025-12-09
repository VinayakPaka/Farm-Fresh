import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import authRoutes from "./routes/auth.routes.js";
import productsRouter from './routes/product.routes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Grocery App API Server");
});

app.use("/api/auth/", authRoutes);
app.use('/products', productsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("Server accessible at:");
    console.log(`  - http://localhost:${PORT}`);
    console.log(`  - http://192.168.29.117:${PORT}`);
});