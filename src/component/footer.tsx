import Link from "next/link"
import { Coffee, Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Coffee className="h-6 w-6" />
              <span className="font-bold">Brew Haven</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Serving premium coffee in a cozy atmosphere since 2010.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.linkedin.com/in/hafsa-kanwal-2945442b7" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="https://github.com/kanwalhafsa" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://x.com/kanwal51911" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-muted-foreground hover:text-primary">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-muted-foreground hover:text-primary">
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Shipping & Delivery
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Contact Us</h3>
            <address className="not-italic text-sm text-muted-foreground space-y-2">
              <p>123 Coffee Street</p>
              <p>Brew City, BC 12345</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Email: info@brewhaven.com</p>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Brew Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
