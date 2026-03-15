import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-brand-dark border-t border-brand-charcoal">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold text-primary-foreground">
                Blitz<span className="text-primary">Kart</span>
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/50 font-body">
              Lightning-fast grocery delivery. Fresh produce at your doorstep in 10 minutes.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/50 font-body">
              <li><Link to="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/50 font-body">
              <li><Link to="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-semibold text-primary-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/50 font-body">
              <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-charcoal mt-8 pt-8 text-center text-sm text-primary-foreground/40 font-body">
          © 2026 BlitzKart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
