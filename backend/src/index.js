import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import dotenv from "dotenv";   
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app, server} from "./lib/socket.js";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 5001;
const _dirname = path.resolve();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.5.136:5173", "https://44db45a24e8f.ngrok-free.app"],
    credentials: true, // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allow preflight
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB();
});