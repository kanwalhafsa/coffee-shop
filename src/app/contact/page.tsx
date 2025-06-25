"use client"

import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ContactFormAPI from "@/component/contact-form-api"
import GoogleMap from "@/component/google-map"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We'd love to hear from you! Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactFormAPI />
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">123 Coffee Street, Brew City, BC 12345</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">
                    <a href="mailto:kanwalhafsa47@gmail.com" className="hover:text-primary">
                      kanwalhafsa47@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p className="text-muted-foreground">Mon-Fri: 7AM-8PM</p>
                  <p className="text-muted-foreground">Sat-Sun: 8AM-6PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map */}
          <GoogleMap address="123 Coffee Street, Brew City, BC 12345" />
        </div>
      </div>
    </div>
  )
}
