import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, User, Menu, Moon, Sun, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { authAPI } from "@/services/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Re-check user on every route change
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]); // re-runs on every page change

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    authAPI.logout();
    localStorage.removeItem('user');
    setUser(null);
    setMobileMenuOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const profileLink = user ? `/profile/${user.user_id || user.userId}` : '/login';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">BookShare</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary" : "text-foreground"}`}>
            Discover
          </Link>
          <Link to="/listings" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/listings") ? "text-primary" : "text-foreground"}`}>
            Browse Books
          </Link>
          {user && (
            <>
              <Link to="/sell" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/sell") ? "text-primary" : "text-foreground"}`}>
                Sell
              </Link>
              <Link to="/requests" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/requests") ? "text-primary" : "text-foreground"}`}>
                My Requests
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Desktop user menu */}
          <div className="hidden md:block">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.name || user.user?.name}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to={profileLink} className="cursor-pointer">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container mx-auto space-y-1 px-4 py-4">
            <Link
              to="/"
              className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Discover
            </Link>
            <Link
              to="/listings"
              className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Books
            </Link>

            {user ? (
              <>
                <Link
                  to="/sell"
                  className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sell
                </Link>
                <Link
                  to="/requests"
                  className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Requests
                </Link>
                <Link
                  to={profileLink}
                  className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="px-3 py-1 text-xs text-muted-foreground">
                    Signed in as {user.name || user.user?.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-border pt-2 mt-2 space-y-1">
                <Link
                  to="/signup"
                  className="block rounded-md px-3 py-2 text-sm font-medium bg-primary text-primary-foreground text-center transition-colors hover:opacity-90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="block rounded-md px-3 py-2 text-sm font-medium text-center transition-colors hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
