import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
   
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
     profilePic: {
      type: String,
      default: "/display-pic (1).png",
    },
     firstName: String,
  lastName: String,
  
  phone: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  bio: String,
   
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;