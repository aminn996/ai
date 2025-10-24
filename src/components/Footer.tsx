import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">A</span>
              </div>
              <span className="text-xl font-bold">Aidora</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting Tunisia with trusted local service providers.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-bold">For Users</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-muted-foreground transition-smooth hover:text-foreground">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground transition-smooth hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground transition-smooth hover:text-foreground">
                  Safety Tips
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">For Providers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground transition-smooth hover:text-foreground">
                  List Your Service
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground transition-smooth hover:text-foreground">
                  Provider Guidelines
                </Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground transition-smooth hover:text-foreground">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground transition-smooth hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-smooth hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-smooth hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Aidora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
