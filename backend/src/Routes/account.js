import express from "express";
import UserData from "../models/UserData.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      country,
      profilePicture, // Cloudinary URL
    } = req.body;

    const newUser = new UserData({
      Firstname: firstName,
      Lastname: lastName,
      PhoneNo: phone,
      Country: country,
      ProfilePicture: profilePicture,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
