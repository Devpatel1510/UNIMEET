import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";


import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useauthstore = create((set,get) => ({
  authUser: null,

  isSigningup: false,
  isLoginin: false,
  isprofileupade: false,
  isUpdatingProfile: false,
  ischeckingAuth: false,
  onlineUsers: [],
  socket :null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
      
    } catch (error) {
      set({ authUser: null });
      console.log("its erron in auth 12 ", error)
      
    } finally {
      set({ ischeckingAuth: false })

    }


  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup",data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Account created successfully");
      const audio = new Audio('/noti2.mp3'); 
        audio.play();
      

    } catch (error) {
      toast.error(error.response.data.message);
      console.log("hello1", error)
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
       const audio = new Audio('/noti2.mp3'); 
        audio.play();
      


    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful");
      get().disconnectSocket();
      const audio = new Audio('/noti2.mp3'); 
        audio.play();
      
    } catch (error) {
      toast.error("Logout failed");
      console.log("Logout error:", error);
    }
  },
   updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
   connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },



})
)

