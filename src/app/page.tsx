import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import FeaturedCoffees from "@/component/featured-coffees"
import Testimonials from "@/component/testimonials"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center">
  <div className="absolute inset-0 z-0 w-full">
    <Image
      src="/images/bgimg.jpg"
      alt="Coffee shop hero image"
      width={1920}
      height={1100}
      className="object-cover w-full h-full brightness-75 object-position-center"
      priority
    />
  </div>
  <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl text-white">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Experience the Perfect Brew</h1>
      <p className="text-lg md:text-xl mb-8">
        Discover our handcrafted coffee selection made with premium beans from around the world.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" asChild>
          <Link href="/menu">
            View Our Menu <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="bg-transparent text-white border-white hover:bg-white/10"
          asChild
        >
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  </div>
</section>

      {/* About Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image 
              src="/images/ourstory.jpg" 
              alt="Our coffee shop" 
              width={600}
              height={800}
              className="object-cover" />
              
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-6">
                Founded in 2010, our coffee shop has been serving the community with the finest coffee beans sourced
                from ethical farms around the world. We take pride in our brewing techniques and the warm atmosphere
                we've created for our customers.
              </p>
              <p className="text-muted-foreground mb-6">
                Every cup is crafted with care by our expert baristas who are passionate about delivering the perfect
                coffee experience.
              </p>
              <Button variant="outline" asChild>
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Coffees */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Featured Coffees</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our selection of premium coffees, each with its unique flavor profile and character.
            </p>
          </div>
          <FeaturedCoffees />
          <div className="text-center mt-10">
            <Button asChild>
              <Link href="/menu">
                View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our customers have to say about their experience.
            </p>
          </div>
          <Testimonials />
          <div className="text-center mt-10">
            <Button variant="outline" asChild>
              <Link href="/feedback">Leave Your Feedback</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Our Coffee?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Visit our shop or order online for a taste of our premium coffee selection.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/menu">Order Online</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent border-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/contact">Find Our Location</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
