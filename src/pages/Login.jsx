import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import eazeLogo from "../assets/eaze-logo.png";
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login - replace with actual authentication later
    setTimeout(() => {
      // Store the username for display on dashboard
      sessionStorage.setItem("partnerUsername", username);
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };
  return (
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
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-xs md:text-sm font-medium"
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <a href="#" className="text-primary hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-10 md:h-11 font-medium touch-manipulation"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Login;
