import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-6">
            <img 
              src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
              alt="Limitless Lab"
              className="h-8 w-auto"
            />
            <div className="space-y-4">
              <p className="text-gray-600">Join our newsletter to stay up to date on insights, features, and releases.</p>
              <div className="space-y-2">
                <Input type="email" placeholder="Enter your email" />
                <Button className="w-full bg-[#393CA0] hover:bg-[#393CA0]/90">Subscribe to our newsletter</Button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 hover:text-primary-600">About</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-primary-600">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-600 hover:text-primary-600">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/blog" className="text-gray-600 hover:text-primary-600">Blog & Updates</Link></li>
              <li><Link to="/case-studies" className="text-gray-600 hover:text-primary-600">Case Studies</Link></li>
              <li><Link to="/tools" className="text-gray-600 hover:text-primary-600">Tools</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Follow us</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://www.facebook.com/thelimitlesslab/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                  <Facebook size={20} />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/thelimitlesslab/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                  <Instagram size={20} />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/limitlesslab/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/channel/UCl_uNGwqTRMq_1dr7_BBs2g" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                  <Youtube size={20} />
                  <span>Youtube</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
          <p>© 2024 Limitless Lab Innovations Pte. Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}