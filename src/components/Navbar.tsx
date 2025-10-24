import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">A</span>
            </div>
            <span className="text-xl font-bold">Aidora</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium transition-smooth hover:text-primary">
              Home
            </Link>
            <Link to="/services" className="text-sm font-medium transition-smooth hover:text-primary">
              Browse Services
            </Link>
            <Link to="/services" className="text-sm font-medium transition-smooth hover:text-primary">
              Categories
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="transition-smooth">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="default" className="transition-smooth">
              List Your Service
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
