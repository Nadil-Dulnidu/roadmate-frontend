import { Link } from "react-router";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import Logo from "@/assets/logo.png"; // Update with your logo path

export function Footer() {
  return (
    <footer className="bg-black text-white pt-10 pb-8">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* About Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3 ">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Press & Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Join Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Corporate Rentals
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Become a Host
                </Link>
              </li>
            </ul>
          </div>

          {/* Other Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support & Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Support Center
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-secondary transition-colors"
                >
                  Terms and conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Social</h3>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="text-gray-400 hover:text-secondary transition-colors"
              >
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-secondary transition-colors"
              >
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-secondary transition-colors"
              >
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-secondary transition-colors"
              >
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/40">
          <div className="mb-4 md:mb-0 flex items-center space-x-2">
            <img
              src={Logo}
              alt="RoadMate Logo"
              className="size-8 rounded-full"
            />
            <span className="font-semibold text-2xl">RoadMate</span>
          </div>
          <p className="text-gray-400 text-sm">
            RoadMate Inc. © Copyright 2025. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
