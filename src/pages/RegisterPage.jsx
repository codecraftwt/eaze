import React, { useState, useEffect } from "react";
import AuthHeader from "../components/AuthHeader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, getSalesforceToken } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import logo from '../assets/image.png';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { salesforceToken, status,portalUserId } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  /* =========================================
     FETCH SALESFORCE TOKEN IF NOT AVAILABLE
  ========================================== */
  useEffect(() => {
    if (!salesforceToken) {
      dispatch(getSalesforceToken());
    }
  }, [dispatch, salesforceToken]);

  /* =========================================
     HANDLE FORM INPUTS
  ========================================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================
     VALIDATION
  ========================================== */
  const validateForm = () => {
    const { email, password, confirmPassword } = formData;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  /* =========================================
     SUBMIT FORM → REGISTER API
  ========================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!salesforceToken) {
      toast.error("Unable to connect to Salesforce, please try again.");
      return;
    }

    setLoading(true);
    // toast.info("Connecting...");

    try {
      await dispatch(
        registerUser({
          email: formData.email,
          password: formData.password,
          accountId: portalUserId, // if needed later
          token:salesforceToken
        })
      ).unwrap();

      // toast.success("Account created successfully!");

      // clear form
      setFormData({ email: "", password: "", confirmPassword: "" });

      navigate("/login");
    } catch (err) {
      // error already handled globally inside slice
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side */}
      {/* <div className="w-full md:w-1/2 bg-blue-500 hidden md:block">
        <AuthHeader />
      </div> */}

      {/* Right side */}
      <div className="w-full flex flex-col justify-start items-center bg-[#e9f2f7] overflow-auto h-full md:ml-auto mt-8 md:mt-0">
        <div className="text-center mt-10 px-4">
                    <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
          </div>

          <h2 className="text-3xl font-semibold text-blue-600">
            Create Your Account
          </h2>
          <p className="mt-2 text-gray-500">
            Enter your details to get started with EAZE Consulting.
          </p>
        </div>

        <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-md"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Sign In
            </Link>
          </span>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          © 2025 EAZE Consulting. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
