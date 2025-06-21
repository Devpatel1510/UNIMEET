import express from "express";
import authroutes from "./Routes/auth.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import otpRoutes from "./Routes/otp.route.js"
import messageRoute from "./Routes/message.route.js"
import { app, server } from "./lib/socket.js";
import { initSocketServer } from "./lib/socket.js";
import accountRoutes from "./Routes/account.js";
initSocketServer();
dotenv.config(); 


const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));




app.use(express.json());    
app.use(cookieParser());
app.use("/api/auth", authroutes);
app.use("/api/messages", messageRoute);
app.use("/api", otpRoutes);
app.use("/api/account", accountRoutes);



server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
