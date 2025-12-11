import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthHeader from "../components/AuthHeader";
import { changePassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import logo from '../assets/image.png';

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await dispatch(changePassword(formData));

    if (result.meta.requestStatus === "fulfilled") {
      // toast.success("Your password has been updated successfully!");
      navigate("/login");
    } else {
      // 🔥 Show proper API error message
      // toast.error(result.payload || "Failed to change password.");
    }

  } catch (error) {
    // 🔥 Catch unexpected JS/Runtime errors
    toast.error("Something went wrong. Please try again.");
  }
};


  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* LEFT SIDE */}
      {/* <div className="w-full md:w-1/2">
        <AuthHeader />
      </div> */}

      {/* RIGHT SIDE */}
      <div className="w-full flex justify-center items-center bg-[#e9f2f7]">
        <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
          </div>

          <h2 className="text-3xl font-semibold text-blue-600">
            Reset Your Password
          </h2>
          <p className="mt-2 text-gray-500">
            Enter your email and passwords to reset your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Old Password */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Enter your old password"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* New Password */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">New Password</label>
            <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-blue-600 text-white rounded-md"
            >
              {status === "loading" ? "Updating…" : "Reset Password"}
            </button>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link to="/login" className="text-blue-600">
                  Back to Login
                </Link>
              </span>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            © 2025 EAZE Consulting. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
