import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server} from "./lib/socket.js";
const PORT = process.env.PORT;
const __dirname = path.resolve();
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use((req, res, next) => {
    // If the request reaches this point, no route handled it.
    console.log(`404: Route Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
        success: false, 
        message: 'Resource Not Found. Check the API URL and method.' 
    });
});

// 2. Global Error Handler Middleware (Handles errors thrown from within your routes)
app.use((err, req, res, next) => {
    // Log the error stack for debugging in the server logs
    console.error("--- Global Error Caught ---");
    console.error(err.stack);
    
    // Send a generic 500 error response to the client
    res.status(err.statusCode || 500).json({ 
        success: false, 
        message: 'Server Error', 
        error: err.message || 'An unknown error occurred'
    });
});

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
