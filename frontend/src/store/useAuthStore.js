import {create} from "zustand";
import {api} from "../lib/axios.js";
import toast from "react-hot-toast";
import { useSocketStore } from "./useSocketStore.js";

const BASE_URL = import.meta.env.MODE === "development" ? "http://192.168.5.136:5001/api/v1" : "/";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () =>{
        const socket = useSocketStore.getState();
        try{
            const res = await api.get("/auth/check");
            set({authUser: res.data});

            socket.connectSocket(res.data);
        } catch (error){
            console.error("Auth check failed", error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async (formData) => {
        set({isSigningUp: true});
        const socket = useSocketStore.getState();

        try{
            const res = await api.post("/auth/sign-up", formData);
            toast.success("Account Created");
            set({authUser: res.data});

            socket.connectSocket(get().authUser);
        } catch (error){
            console.log("Backend Error: Error Signing Up");
            toast.error(error.response.data.message);
        } finally {
            set({isSigningUp: false})
        }
    },

    logout: async () => {
        const socket = useSocketStore.getState();
        try{
            await api.post("/auth/sign-out");
            set({authUser: null});
            toast.success("User Logged Out");

            socket.disconnectSocket();
        } catch (error){
            toast.error(error.response.data.message);
        }
    },

    login: async (formData) => {
        set({isLoggingIn: true});
        const socket = useSocketStore.getState();
        try{
            const res = await api.post("/auth/sign-in", formData);

            const userData = res.data.userData;

            toast.success("Logged In");
            set({authUser: userData});

            socket.connectSocket(userData);
        } catch (error){
            toast.error(error.response.data.message);
        } finally {
            set({isLoggingIn: false})
        }
    },

    updateProfile: async (data) => {
        const currentUser = get().authUser; // get() comes from zustand API
        if (!currentUser?._id) {
            toast.error("User not loaded");
            return;
        }

        set({ isUpdatingProfile: true });
        try {
            console.log(currentUser);
            const res = await api.put(`/auth/update-profile/${currentUser._id}`, data)
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error updating profile", error);
            toast.error(error.response?.data?.message || "Error updating profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    
}));