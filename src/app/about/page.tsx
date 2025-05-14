import Image from "next/image"
import Link from "next/link"
import { Coffee, Users, Clock, Award } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "About Us | Brew Haven",
  description: "Learn about our coffee shop, our story, and our mission",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Brew Haven</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our story, our passion for coffee, and our commitment to quality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-muted-foreground mb-6">
            Founded in 2010, Brew Haven began as a small coffee cart in the local farmers' market. Our founder, 
            Sarah Mitchell, had a passion for coffee that she wanted to share with the community.
          </p>
          <p className="text-muted-foreground mb-6">
            What started as a weekend hobby quickly grew into a beloved local institution. Within two years, 
            we opened our first brick-and-mortar location, and we've been serving the community ever since.
          </p>
          <p className="text-muted-foreground">
            Today, Brew Haven is known for its carefully sourced beans, expertly trained baristas, and 
            warm, welcoming atmosphere. We remain committed to our original mission: serving exceptional 
            coffee in a space that feels like home.
          </p>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image 
            src="/images/story.jpg" 
            alt="Our coffee shop story" 
            width={600}
            height={800}
            className="object-cover" 
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Coffee className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality</h3>
                <p className="text-muted-foreground">
                  We source only the finest beans and ingredients, ensuring every cup meets our high standards.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-muted-foreground">
                  We believe in creating spaces where people can connect, collaborate, and feel at home.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Craft</h3>
                <p className="text-muted-foreground">
                  We take the time to perfect our techniques, treating coffee-making as the art form it is.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
                <p className="text-muted-foreground">
                  We're committed to ethical sourcing and environmentally friendly practices.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground mb-6">
              Behind every great cup of coffee is our dedicated team of coffee enthusiasts. Our baristas are 
              not just employees – they're coffee artists who take pride in their craft.
            </p>
            <p className="text-muted-foreground mb-6">
              Each team member undergoes extensive training to ensure they can create the perfect brew and 
              provide exceptional service to our customers.
            </p>
            <Button asChild>
              <Link href="/contact">Meet Our Team</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-40 rounded-lg overflow-hidden">
              <Image 
                src="/images/timg1.jpg" 
                alt="Team member" 
                width={300}
                height={300}
                className="object-cover" 
              />
            </div>
            <div className="relative h-40 rounded-lg overflow-hidden">
              <Image 
                 src="/images/timg2.jpg" 
                 alt="Team member" 
                 width={300}
                 height={300}
                className="object-cover" 
              />
            </div>
            <div className="relative h-40 rounded-lg overflow-hidden">
              <Image 
                src="/images/timg3.jpg" 
                alt="Team member" 
                width={300}
                height={300} 
                className="object-cover" 
              />
            </div>
            <div className="relative h-40 rounded-lg overflow-hidden">
              <Image 
                src="/images/timg4.jpg" 
                alt="Team member" 
                width={300}
                height={300}
                className="object-cover" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Visit Us Today</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          We'd love to welcome you to our coffee shop and share our passion for great coffee with you.
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">Find Our Location</Link>
        </Button>
      </div>
    </div>
  )
}