"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { smoothScroll } from "@/lib/utils";

export function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Company */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-center sm:text-left">
                <li>
                  <Link 
                    href="/about" 
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                {isHomePage ? (
                  <li>
                    <a 
                      href="#features" 
                      className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={(e) => smoothScroll(e, "features")}
                    >
                      Features
                    </a>
                  </li>
                ) : (
                  <li>
                    <Link 
                      href="/" 
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Features
                    </Link>
                  </li>
                )}
                {isHomePage ? (
                  <li>
                    <a 
                      href="#pricing" 
                      className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={(e) => smoothScroll(e, "pricing")}
                    >
                      Pricing
                    </a>
                  </li>
                ) : (
                  <li>
                    <Link 
                      href="/" 
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Pricing
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Support */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-center sm:text-left">
                <li>
                  <Link 
                    href="/contact" 
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
                {isHomePage ? (
                  <li>
                    <a 
                      href="#faq" 
                      className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={(e) => smoothScroll(e, "faq")}
                    >
                      FAQ
                    </a>
                  </li>
                ) : (
                  <li>
                    <Link 
                      href="/" 
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      FAQ
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Legal */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-center sm:text-left">
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/terms" 
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="font-semibold mb-4">Social</h3>
              <ul className="space-y-3 text-center sm:text-left">
                <li>
                  <a 
                    href="https://x.com/404_monetizer" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.instagram.com/404_monetizer/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.facebook.com/profile.php?id=61577221176073/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8">
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} 404 Monetizer. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 