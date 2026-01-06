import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, getSalesforceToken } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from '../assets/image.png';

const ForgotPasswordPage2 = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status ,error, salesforceToken} = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  /**
     * -------------------------------------------------------
     * 1. Get Salesforce Token on Load
     * -------------------------------------------------------
     */
    useEffect(() => {
      if (!salesforceToken) {
        dispatch(getSalesforceToken());
      }
    }, [dispatch, salesforceToken]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(forgotPassword({ email }));
      console.log(result,'result---')
      if (result.meta.requestStatus === "fulfilled") {
        // toast.success("If the email exists, a reset link has been sent.");
        // navigate("/reset-password"); // Redirect to Reset Password Page (you can adjust the route)
      } else {
        // toast.error(result.payload || "Failed to request password reset.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full flex justify-center items-center bg-[#e9f2f7]">
        <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
          </div>

          <h2 className="text-3xl font-semibold text-blue-600">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-gray-500">Enter your email address to reset your password.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-blue-600 text-white rounded-md"
            >
              {status === "loading" ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            © 2025 EAZE Consulting. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage2;
