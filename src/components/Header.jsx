import { useState } from "react";
import { LogOut, Menu } from "lucide-react";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import eazeLogo from "../assets/eaze-logo.png";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { persistor } from "../store/store";
// Updated items to match your Sidebar exactly
const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "report", label: "My Report" },
  { id: "affiliate", label: "Become an Affiliate" },
  // { id: "loan", label: "Loan" },
  { id: "funded", label: "Funded" },
  // { id: "applications", label: "Applications" },
//   { id: "resources", label: "Resources" },
];

export function Header({ activeTab, onTabChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (tabId) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    persistor.purge();
    navigate("/login");
  };

  const isActive = (path) =>{
    console.log(path,'path')
    console.log(location.pathname,'location.pathname')
     return location.pathname === path
        ? "bg-blue-100 text-blue-600 font-semibold"
        : "text-gray-500 hover:text-blue-600";
  }

  return (
    <header className="bg-card border-b border-border px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4 md:gap-8">
        {/* Logo */}
        <img
          src={eazeLogo}
          alt="EAZE Consulting"
          className="h-8 md:h-10 object-contain"
        />

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
  key={item.id}
  to={`/${item.id}`} // Adjust this path logic based on your routing
//   onClick={() => onTabChange(item.id)}
  className={`font-medium px-3 py-2 rounded-lg transition-all text-sm no-underline inline-flex items-center ${isActive(`/${item.id}`)}`}
>
  {item.label}
</Link>
          ))}
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Desktop Logout Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 text-red-500 hover:text-red-600 border-red-100 hover:bg-red-50"
        >
          <LogOut size={16} />
          Logout
        </Button>

        {/* Mobile/Tablet Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="xl:hidden h-9 w-9">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <p className="font-semibold text-foreground">Navigation</p>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`w-full justify-start font-medium px-4 py-3 rounded-lg ${
                      activeTab === item.id
                        ? "text-foreground bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    {item.label}
                  </Button>
                ))}
                <hr className="my-2 border-border" />
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium px-4 py-3 rounded-lg text-red-500 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </Button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
