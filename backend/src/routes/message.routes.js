import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { getUsers, getMessages, sendMessage} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/",(req, res)=> {
    res.send("Message Route");
});

router.get("/users", authenticateToken, getUsers);

// ID of the User to chat with
router.get("/:id", authenticateToken, getMessages);

router.post("/send/:id", authenticateToken, sendMessage);

export default router;