import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticateToken = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;

        if (!token) return res.status(401).json({message: "Unauthorized: No Token Provided"});

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) return res.status(401).json({message: "Unauthorized: Token Verification Failed"});

        const user = await User.findById(decodedToken.userId).select("-password");

        if (!user) return res.status(401).json({message: "Unauthorized: User not found"});

        req.user = user;

        next();

    } catch (error){
        console.error("Auth check error:", error.message);
        // Handle specific JWT errors
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        
        res.status(500).json({ message: "Server error" });
    }
}


