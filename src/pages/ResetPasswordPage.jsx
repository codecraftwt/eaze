import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSalesforceToken, resetPassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [email, setEmail] = useState(null);  // Store email
  const [token, setToken] = useState(null);  // Store token

  // Function to get query params (email and token)
  const getQueryParams = () => {
    const urlParams = new URLSearchParams(location.search);
    return {
      token: urlParams.get("token"),
      email: urlParams.get("email"),
    };
  };

  // Effect to get the token and email from URL
  useEffect(() => {
    dispatch(getSalesforceToken());
    const { token, email } = getQueryParams();
    if (token && email) {
      setToken(token);  // Set token
      setEmail(email);   // Set email
    } else {
      toast.error("Invalid or expired reset link.");
      navigate("/forgot-password");
    }
  }, [location.search, navigate]);

  // Handle form input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      const result = await dispatch(
        resetPassword({
          email,
          token,
          newPassword: formData.newPassword,
        })
      );

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Password has been reset successfully!");
        navigate("/login");  // Redirect to login after successful reset
      } else {
        toast.error(result.payload || "Failed to reset password.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full flex justify-center items-center bg-[#e9f2f7]">
        <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-semibold text-blue-600">Reset Your Password</h2>
          <p className="mt-2 text-gray-500">Enter your new password below.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* New Password */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-blue-600 text-white rounded-md"
            >
              {status === "loading" ? "Resetting..." : "Reset Password"}
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

export default ResetPasswordPage;
