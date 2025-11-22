import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, websocket } from "../lib/socket.js";

export const getUsers = async (req, res) =>{
    try{
        const currentUserId = req.user._id;
        const getUsers = await User.find({_id: {$ne: currentUserId}}).select("-password");
        
        res.status(200).json(getUsers);

    } catch (error) {
        console.log("Error fetching users:", error);
        return res.status(500).json({message: `Error fetching users: ${error.message}`});
    }
};

export const getMessages = async (req, res) =>{
    try{
        const {id: userToChatId} = req.params; // ID of the User to chat with
        const currentUserId = req.user._id; // ID of the logged-in User

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userToChatId }, // Messages sent by current user to the other user
                { senderId: userToChatId, receiverId: currentUserId } // Messages sent by the other user to current user
            ]
        });

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error fetching messages:", error);
        return res.status(500).json({message: `Error fetching messages: ${error.message}`});
    }
};

export const sendMessage = async (req, res) =>{
    try{
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        // Image Handling goes here: // TODO

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId){
            websocket.to(receiverSocketId).emit("newMessage", newMessage);
        } 

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error sending message:", error);
        return res.status(500).json({message: `Error sending message: ${error.message}`});
    }
}