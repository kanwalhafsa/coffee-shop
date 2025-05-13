import { Mail, Phone, MapPin, Clock } from "lucide-react"
import ContactForm from "@/component/contact-form"

export const metadata = {
  title: "Contact Us | Brew Haven",
  description: "Get in touch with us for any inquiries or feedback",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We'd love to hear from you. Reach out to us with any questions, feedback, or inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
          <ContactForm />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Our Information</h2>
          <div className="bg-muted/30 rounded-lg p-6">
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Address</h3>
                  <p className="text-muted-foreground">
                    123 Coffee Street
                    <br />
                    Brew City, BC 12345
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-muted-foreground">info@brewhaven.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-6 w-6 text-primary mr-4 mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Friday: 7:00 AM - 8:00 PM
                    <br />
                    Saturday - Sunday: 8:00 AM - 9:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-medium mb-4">Our Location</h3>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              {/* This would be a Google Map in a real implementation */}
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <MapPin className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Map would be displayed here</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
