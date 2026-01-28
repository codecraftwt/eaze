import React, { useState, useEffect } from "react";
import AuthHeader from "../components/AuthHeader";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, getSalesforceToken } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import logo from '../assets/image.png';
import sample from '../assets/image (5).png';
import { FaInfoCircle } from "react-icons/fa";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import eazeLogo from "../assets/eaze-logo.png";
import { Eye, EyeOff } from "lucide-react";
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error, salesforceToken } = useSelector((state) => state.auth);
const [showTooltip, setShowTooltip] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
   const [showPassword, setShowPassword] = useState(false);

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

  /**
   * -------------------------------------------------------
   * Handle Input Change
   * -------------------------------------------------------
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * -------------------------------------------------------
   * Handle Login Submit
   * -------------------------------------------------------
   */
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!salesforceToken) {
    toast.warning("Connecting to Salesforce… Please wait");
    return;
  }

  try {
    const result = await dispatch(loginUser(formData));
    console.log(result,'result----')
    if (result.meta.requestStatus === "fulfilled") {
      // toast.success("Login successful!");
      setTimeout(() => navigate("/dashboard"), 900);
    } else {
      console.log(result.payload)
      // 🔥 result.payload contains your API error (e.g., "Invalid email or password")
      toast.error(result.payload || "Login failed");
      if(result.payload=='Request failed with status code 401'){
        localStorage.clear()
        dispatch(getSalesforceToken());
      }
    }

  } catch (error) {
    // 🔥 Catch unexpected runtime errors
    toast.error("Something went wrong. Please try again.");
  }
};


  return (
    <>
    
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 safe-area-inset bg-background">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-4 pb-4 md:pb-6 px-4 md:px-6">
          <div className="flex justify-center">
            <img
              src={eazeLogo}
              alt="Eaze Consulting Logo"
              className="h-12 md:h-16 object-contain"
            />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              Sign in to access your partner dashboard
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-xs md:text-sm font-medium"
              >
                Username
              </Label>
              <Input
                id="username"
                name="email"
                type="text"
                placeholder="Enter your username"
                value={formData.email}
              onChange={handleChange}
                required
                className="h-10 md:h-11 text-base"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs md:text-sm font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
              onChange={handleChange}
                  required
                  className="h-10 md:h-11 pr-10 text-base"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors touch-manipulation"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs md:text-sm">
              <label className="flex items-center gap-2 cursor-pointer touch-manipulation">
                <input
                  type="checkbox"
                  className="rounded border-input h-4 w-4"
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              {/* <a href="#" className="text-primary hover:underline font-medium">
                Forgot password?
              </a> */}
              <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                Forget Password
              </Link>
            </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 md:h-11 font-medium touch-manipulation text-white"
               disabled={status === "loading" || !salesforceToken}
            >
              {status === "loading"
                ? "Signing In..."
                : !salesforceToken
                ? "Connecting..."
                : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default LoginPage;
