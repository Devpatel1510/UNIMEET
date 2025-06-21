import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useauthstore } from "../store/auth.store";

function Otp1() {
  const [otpArray, setOtpArray] = useState(["", "", "", ""]);
  const [agree, setAgree] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const {signup} = useauthstore();
  

  
  const location = useLocation();
const { email, password } = location.state || {};
const formdata = { email, password };

  

  useEffect(() => {
    if (!email) {
      toast.error("Email is missing. Please sign up again.");
      navigate("/signup");
    }
    inputsRef.current[0]?.focus();
  }, [email, navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otpArray[index]) {
        const newOtp = [...otpArray];
        newOtp[index] = "";
        setOtpArray(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    if (!agree) return toast.error("You must agree to the privacy policy.");
    const otp = otpArray.join("");
    if (otp.length !== 4) return toast.error("Enter complete 4-digit OTP");

    try {
      const res = await axios.post("http://localhost:5001/api/verify-otp", {
        email,
        otp,
      });

      if (res.data.verified) {
        toast.success("OTP verified! 🎉");
        signup(formdata);

        
        navigate("/"); 
      } else {
        toast.error("Invalid OTP.");
      }
    } catch (err) {
      toast.error("Verification failed.");
      console.error("OTP verification error:", err);
    }
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center min-h-screen p-6" style={{ fontFamily: "'Anton', sans-serif" }}>
      <h1 className="text-black text-[48px] font-extrabold mb-16">UNIMEET</h1>

      <div className="flex gap-6 mb-16">
        {otpArray.map((digit, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            ref={(el) => (inputsRef.current[i] = el)}
            className="w-[80px] h-[80px] rounded-3xl border border-gray-300 text-center text-5xl font-bold focus:outline-none focus:ring-2 focus:ring-[#4B22D1]"
          />
        ))}
      </div>

      <label className="flex items-center gap-3 mb-16 text-black font-sans text-sm max-w-[400px]">
        <input
          type="checkbox"
          checked={agree}
          onChange={() => setAgree(!agree)}
          className="w-5 h-5 border-2 border-black rounded-none"
        />
        <span className="font-normal text-[14px] leading-5">
          I agree to the Privacy Policy and understand my data is securely protected.
        </span>
      </label>

      <button
        onClick={handleVerify}
        className="bg-[#4B22D1] text-white font-extrabold text-lg px-12 py-4 rounded-full hover:brightness-110 transition"
      >
        PROCEED
      </button>
    </div>
  );
}

export default Otp1;
