import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, getSalesforceToken, resetPassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../assets/image.png';

const ForgotResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error, salesforceToken } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [token, setToken] = useState(null);  // Store token from URL

  // Check for email and token in URL (indicates reset password page)
  const getQueryParams = () => {
    const urlParams = new URLSearchParams(location.search);
    return {
      token: urlParams.get("token"),
      email: urlParams.get("email"),
    };
  };

  useEffect(() => {
      dispatch(getSalesforceToken());
//   if (!salesforceToken) {
//   }
}, [dispatch, salesforceToken]);
  // Extract email and token from URL when the page loads
  useEffect(() => {
    if (salesforceToken && !token) {
      const { token, email } = getQueryParams();
      if (token && email) {
        setToken(token);  // Set token from query params
        setEmail(email);   // Set email from query params
      }
    }
  }, [dispatch, salesforceToken, token, location.search]);

  // Handle email change for Forgot Password form
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle form data change for Reset Password form
  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Forgot Password form submission (send reset link)
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(forgotPassword({ email }));
      console.log(result, 'result---');

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("If the email exists, a reset link has been sent.");
        navigate(`/login`);
      } else {
        toast.error(result.payload || "Failed to request password reset.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Reset Password form submission (reset the password)
  const handleResetPasswordSubmit = async (e) => {
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
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
          </div>

          {token && email ? (
            // Show Reset Password form if token and email exist in the URL
            <>
              <h2 className="text-3xl font-semibold text-blue-600">Reset Your Password</h2>
              <p className="mt-2 text-gray-500">Enter your new password below.</p>

              <form onSubmit={handleResetPasswordSubmit} className="mt-8 space-y-6">
                {/* New Password */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleFormChange}
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
                    onChange={handleFormChange}
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
            </>
          ) : (
            // Show Forgot Password form if no token in the URL
            <>
              <h2 className="text-3xl font-semibold text-blue-600">Forgot Your Password?</h2>
              <p className="mt-2 text-gray-500">Enter your Username to reset your password.</p>

              <form onSubmit={handleForgotPasswordSubmit} className="mt-8 space-y-6">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600">Username</label>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your username"
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
            </>
          )}

          <div className="mt-6 text-center text-xs text-gray-500">
            © 2025 EAZE Consulting. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotResetPasswordPage;
