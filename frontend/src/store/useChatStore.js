import { create } from "zustand";
import toast from "react-hot-toast";
import { api } from "../lib/axios.js";
import { useSocketStore } from "./useSocketStore.js";

export const useChatStore = create((set, get) => ({
    selectedUser: null,
    isReceiverTyping: false,
    isShowSettings: false,
    
    getUsers: async () => {
        try{
            const res = await api.get("/message/users");
            return res.data
        } catch (error){
            toast.error(error.response.data.message);
            throw error;
        }
    },

    getMessages: async(selectedUserId) => {
        if (!selectedUserId) throw new Error("No User Selected");
        
        try {
            const res = await api.get(`/message/${selectedUserId}`);
            return res.data
        } catch (error){
            toast.error( "Error" || error.response.data.message);
            throw error;
        } 
    },

    sendMessage: async(messageData) => {
        const {selectedUser} = get();
        if (!selectedUser) throw new Error("No User Selected");
        
        try{
            const res = await api.post(`/message/send/${selectedUser._id}`, messageData);
            return res.data
        } catch (error){
            toast.error(error.response.data.message);
            throw error;
        }
    },

    updateMessage: (queryClient) => {
        const socket = useSocketStore.getState().socket;
        const { selectedUser } = get();

        if (!selectedUser || !socket) return;

        const handleNewMessage = (newMessage) => {
            const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageFromSelectedUser) return;

            queryClient.setQueryData(['messages', selectedUser._id], (oldMessages) => {
                return oldMessages ? [...oldMessages, newMessage] : [newMessage]
            });
        };

        socket.on("newMessage", handleNewMessage);
        return handleNewMessage
    },

    closeMessage: () => {
        const socket = useSocketStore.getState().socket;
        if (!socket) return;
        socket.off("newMessage");
    },

    isTyping: () => {
        // Emit this only to the user we are talking to
        const { selectedUser } = useChatStore.getState();
        const { socket } = useSocketStore.getState();

        if (!selectedUser._id) return;

        socket.emit("typing", { receiverId: selectedUser._id, isTyping: true });
        setTimeout(() => {
            socket.emit("typing", { receiverId: selectedUser._id, isTyping: false });
        }, 2000);
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),
}));