import { Link } from "wouter";
import { Logo } from "@/components/ui/logo";
import { Facebook, Instagram, Globe, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Logo variant="light" />
            </div>
            <p className="text-sm mb-4">
              Empowering Kenyans to make informed decisions about solar energy
              solutions for residential, commercial, and industrial use.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/calculator">
                  <a className="text-sm hover:text-white transition-colors">
                    Solar Calculator
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/installers">
                  <a className="text-sm hover:text-white transition-colors">
                    Find Installers
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/calculator">
                  <a className="text-sm hover:text-white transition-colors">
                    ROI Analysis
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <a className="text-sm hover:text-white transition-colors">
                    Energy Efficiency Tips
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <a className="text-sm hover:text-white transition-colors">
                    Solar Financing
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/resources">
                  <a className="text-sm hover:text-white transition-colors">
                    FAQ
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <a className="text-sm hover:text-white transition-colors">
                    Solar Guide
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <a className="text-sm hover:text-white transition-colors">
                    Blog
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <a className="text-sm hover:text-white transition-colors">
                    Case Studies
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/resources">
                  <a className="text-sm hover:text-white transition-colors">
                    Government Policies
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span className="text-sm">Nairobi, Kenya</span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-1" />
                <span className="text-sm">info@solarconnect.co.ke</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-1" />
                <span className="text-sm">+254 700 000 000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-8 pt-6 flex flex-col md:flex-row justify-between">
          <p className="text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SolarConnect. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/privacy">
              <a className="text-sm hover:text-white transition-colors">
                Privacy Policy
              </a>
            </Link>
            <Link href="/terms">
              <a className="text-sm hover:text-white transition-colors">
                Terms of Service
              </a>
            </Link>
            <Link href="/cookies">
              <a className="text-sm hover:text-white transition-colors">
                Cookies Policy
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
