import { io } from "socket.io-client";
import {create} from "zustand";
import { useChatStore } from "./useChatStore";
import { useAuthStore } from "./useAuthStore";

const SOCKET_BASE_URL = import.meta.env.MODE === "development" ? "http://192.168.5.136:5001" : "/";

export const useSocketStore = create((set,get) => ({
    socket: null,
    onlineUsers: [],
    isTyping: false,

    connectSocket: (authUser) => {
        const { socket } = get();
        // authUser is coming from the useAuthStore state; where if user is not authenticated, return.
        if (!authUser || socket?.connected) return;

        const newSocket = io(SOCKET_BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });

        newSocket.connect();

        set({socket: newSocket})

        newSocket.on("getOnlineUsers", (userIds) => {          
            set({onlineUsers: userIds});
        });

        newSocket.on("isTyping", ({userId, isTyping}) => {
            set({isTyping: isTyping});
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

}));