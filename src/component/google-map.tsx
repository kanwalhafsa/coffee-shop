"use client"

import { useState } from "react"
import { MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface GoogleMapProps {
  address?: string
  lat?: number
  lng?: number
}

export default function GoogleMap({
  address = "123 Coffee Street, Brew City, BC 12345",
  lat = 40.7128,
  lng = -74.006,
}: GoogleMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}`

  const handleMapClick = () => {
    window.open(googleMapsUrl, "_blank")
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && !mapLoaded ? (
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapLoaded(true)}
              className="rounded-lg"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50 cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={handleMapClick}
            >
              <MapPin className="h-12 w-12 text-primary mb-3" />
              <span className="text-lg font-medium text-foreground mb-1">Brew Haven Coffee</span>
              <span className="text-sm text-muted-foreground mb-4 text-center px-4">{address}</span>

              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View in Google Maps
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
