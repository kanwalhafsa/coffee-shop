"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Coffee } from "lucide-react"
import { toast } from "sonner"

export default function IconGenerator() {
  const [generating, setGenerating] = useState(false)

  const generateIcon = (size: number) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) return null

    canvas.width = size
    canvas.height = size

    // Background
    const gradient = ctx.createLinearGradient(0, 0, size, size)
    gradient.addColorStop(0, "#4F46E5")
    gradient.addColorStop(1, "#7C3AED")

    ctx.fillStyle = gradient
    ctx.roundRect(0, 0, size, size, size * 0.125)
    ctx.fill()

    // Coffee cup icon
    const centerX = size / 2
    const centerY = size / 2
    const cupWidth = size * 0.4
    const cupHeight = size * 0.5

    // Cup body
    ctx.fillStyle = "white"
    ctx.fillRect(centerX - cupWidth / 2, centerY - cupHeight / 4, cupWidth, cupHeight * 0.7)

    // Cup handle
    ctx.strokeStyle = "white"
    ctx.lineWidth = size * 0.02
    ctx.beginPath()
    ctx.arc(centerX + cupWidth / 2 + size * 0.05, centerY, size * 0.08, 0, Math.PI * 2)
    ctx.stroke()

    // Steam
    ctx.strokeStyle = "white"
    ctx.lineWidth = size * 0.015
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(centerX - cupWidth / 4 + (i * cupWidth) / 4, centerY - cupHeight / 2)
      ctx.quadraticCurveTo(
        centerX - cupWidth / 4 + (i * cupWidth) / 4 + size * 0.02,
        centerY - cupHeight / 2 - size * 0.08,
        centerX - cupWidth / 4 + (i * cupWidth) / 4,
        centerY - cupHeight / 2 - size * 0.12,
      )
      ctx.stroke()
    }

    return canvas.toDataURL("image/png")
  }

  const downloadIcon = (size: number) => {
    const dataUrl = generateIcon(size)
    if (!dataUrl) return

    const link = document.createElement("a")
    link.download = `icon-${size}x${size}.png`
    link.href = dataUrl
    link.click()
  }

  const generateAllIcons = async () => {
    setGenerating(true)

    try {
      const sizes = [192, 384, 512]

      for (const size of sizes) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        downloadIcon(size)
      }

      toast.success("All icons generated and downloaded!")
    } catch (error) {
      toast.error("Failed to generate icons")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="h-5 w-5" />
          Icon Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Generate PWA icons for your coffee shop app</p>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => downloadIcon(192)} variant="outline" size="sm">
            192x192
          </Button>
          <Button onClick={() => downloadIcon(384)} variant="outline" size="sm">
            384x384
          </Button>
          <Button onClick={() => downloadIcon(512)} variant="outline" size="sm">
            512x512
          </Button>
        </div>

        <Button onClick={generateAllIcons} disabled={generating} className="w-full">
          {generating ? (
            "Generating..."
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate All Icons
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>After downloading:</p>
          <ol className="list-decimal list-inside space-y-1 mt-1">
            <li>
              Create a <code>public/icons/</code> folder
            </li>
            <li>Move the downloaded PNG files there</li>
            <li>Refresh your app</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
