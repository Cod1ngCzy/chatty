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
        // authUser is coming from the useAuthStore state; where if user is not authenticated, return.
        if (!authUser || get().socket?.connected) return;

        const socket = io(SOCKET_BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });

        socket.connect();

        set({socket: socket})

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds});
        });

        socket.on("isTyping", ({userId, isTyping}) => {
            set({isTyping: isTyping});
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

}));