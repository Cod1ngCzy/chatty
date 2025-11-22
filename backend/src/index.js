import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import dotenv from "dotenv";   
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app, server} from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const PORT = process.env.PORT || 5001;

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.5.136:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  
  // Serve static files
  app.use(express.static(frontendPath));

  // REMOVED the catch-all route - not needed for ngrok testing
  // You only need this when deploying to production where 
  // frontend and backend are served from the same domain
}

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});