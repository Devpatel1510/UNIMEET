import express from "express";
import OtpModel from "../models/otp.js"; 
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString(); 
}


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "talentedartist0@gmail.com",        
    pass: "bxleqnhgcdviqwxd",           
  },
});


router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const otp = generateOTP();

  try {
    await OtpModel.create({ phoneOrEmail: email, otp });

    await transporter.sendMail({
      from: "talentedartist0@gmail.com",
      to: email,
      subject: "Your OTP Code",
      html: `<h3>Your OTP code is: <b>${otp}</b></h3><p>This OTP will expire in 5 minutes.</p>`,
    });

    console.log(`OTP ${otp} sent to ${email}`);
    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});


router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  const existing = OtpModel.findOne({ phoneOrEmail: email, otp })
  if (!existing) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  res.json({ verified: true });
});


export default router;
