import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { authAPI } from "@/services/api";
import { toast } from "sonner";

const Footer = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const profileLink = user ? `/profile/${user.user_id || user.userId}` : '/login';

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-bold">BookShare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Buy and sell used academic books with fellow students. Save money, help others.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/listings" className="text-muted-foreground transition-colors hover:text-foreground">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-muted-foreground transition-colors hover:text-foreground">
                  Sell Your Books
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Account</h3>
            <ul className="space-y-2 text-sm">
              {user ? (
                <>
                  <li>
                    <Link to={profileLink} className="text-muted-foreground transition-colors hover:text-foreground">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/requests" className="text-muted-foreground transition-colors hover:text-foreground">
                      My Requests
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <LogOut className="h-3 w-3" />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/signup" className="text-muted-foreground transition-colors hover:text-foreground">
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-muted-foreground transition-colors hover:text-foreground">
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                  Safety Tips
                </a>
              </li>
              <li>
                <a href="mailto:nlikith54@gmail.com" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 BookShare. Built for students, by students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
