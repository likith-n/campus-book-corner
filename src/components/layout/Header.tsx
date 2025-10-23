import { Link, useLocation } from "react-router-dom";
import { BookOpen, User, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">BookShare</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/") ? "text-primary" : "text-foreground"
            }`}
          >
            Discover
          </Link>
          <Link
            to="/listings"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/listings") ? "text-primary" : "text-foreground"
            }`}
          >
            Browse Books
          </Link>
          <Link
            to="/sell"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/sell") ? "text-primary" : "text-foreground"
            }`}
          >
            Sell
          </Link>
          <Link
            to="/requests"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/requests") ? "text-primary" : "text-foreground"
            }`}
          >
            My Requests
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/profile/1" className="cursor-pointer">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/login" className="cursor-pointer">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/signup" className="cursor-pointer">Sign Up</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container mx-auto space-y-2 px-4 py-4">
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
              to="/profile/1"
              className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
