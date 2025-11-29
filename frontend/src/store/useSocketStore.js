import { io } from "socket.io-client";
import {create} from "zustand";

const SOCKET_BASE_URL = import.meta.env.MODE === "development" ? `http://${window.location.hostname}:5001` : "/";

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

        console.log('connection');

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