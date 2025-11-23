import { create } from "zustand";
import toast from "react-hot-toast";
import { api } from "../lib/axios.js";
import { useSocketStore } from "./useSocketStore.js";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isReceiverTyping: false,

    getUsers: async () => {
        set({ isUserLoading: true});
        try{
            const res = await api.get("/message/users");
            set({users: res.data});
        } catch (error){
            toast.error(error.response.data.message);
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async(selectedUserId) => {
        set({ isMessagesLoading: true});
        try {
            const res = await api.get(`/message/${selectedUserId}`);
            set({messages: res.data});
        } catch (error){
            toast.error( "Error" || error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async(messageData) => {
        const {selectedUser, messages} = get();
        try{
            const res = await api.post(`/message/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data]});
        } catch (error){
            toast.error(error.response.data.message);
        }
    },

    updateMessage: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useSocketStore.getState().socket;
        

        socket.on("newMessage", (newMessage) => {
            const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageFromSelectedUser) return;
            set({
                messages: [...get().messages, newMessage]
            });
        });
    },

    closeMessage: () => {
        const socket = useSocketStore.getState().socket;
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