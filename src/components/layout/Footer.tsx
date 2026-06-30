import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Footer = () => {
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
              <li>
                <Link to="/login" className="text-muted-foreground transition-colors hover:text-foreground">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-muted-foreground transition-colors hover:text-foreground">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/profile/1" className="text-muted-foreground transition-colors hover:text-foreground">
                  My Profile
                </Link>
              </li>
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
