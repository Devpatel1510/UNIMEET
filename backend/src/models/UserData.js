import mongoose from "mongoose";

const userdataSchema = new mongoose.Schema(
  {
   
    PhoneNo: { type: String, required: true, minlength: 6 },
    Country: { type: String, required: true, minlength: 6 },
   
  },
  { timestamps: true }
);

const UserData = mongoose.model("UserData", userdataSchema);
export default UserData;
