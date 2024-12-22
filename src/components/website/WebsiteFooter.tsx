import { Facebook, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export function WebsiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
              Limitless Lab
            </h3>
            <p className="text-gray-600 text-sm">
              Empowering organizations to innovate and create meaningful impact.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/product" className="text-gray-600 hover:text-primary-600 text-sm">
                  Product
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-primary-600 text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-primary-600 text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-primary-600 text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary-600 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary-600 text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2">
              <a
                href="mailto:contact@limitlesslab.org"
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600 text-sm"
              >
                <Mail className="h-4 w-4" />
                contact@limitlesslab.org
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © {currentYear} Limitless Lab. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="https://twitter.com/limitlesslab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://linkedin.com/company/limitlesslab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="https://github.com/limitlesslab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://facebook.com/limitlesslab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}