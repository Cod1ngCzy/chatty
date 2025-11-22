import express from "express";
import { signUp, signIn, signOut, updateUser } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello Welcome to Chatty API");
});

router.post("/sign-up", signUp);

router.post("/sign-in", signIn);

router.post("/sign-out", signOut);

router.put("/update-profile/:id", authenticateToken, updateUser);

router.get("/check", authenticateToken, (req, res) => {
    res.status(200).json(req.user)
});

export default router;