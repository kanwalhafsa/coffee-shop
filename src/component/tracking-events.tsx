"use client"
import { event } from "@/lib/gtag"

// Track add to cart events
export const trackAddToCart = (productName: string, price: number) => {
  event({
    action: "add_to_cart",
    category: "ecommerce",
    label: productName,
    value: Math.round(price * 100), // Convert to cents
  })
}

// Track purchase events
export const trackPurchase = (orderId: string, value: number) => {
  event({
    action: "purchase",
    category: "ecommerce",
    label: orderId,
    value: Math.round(value * 100), // Convert to cents
  })
}

// Track page views
export const trackPageView = (pageName: string) => {
  event({
    action: "page_view",
    category: "engagement",
    label: pageName,
  })
}

// Track form submissions
export const trackFormSubmission = (formName: string) => {
  event({
    action: "form_submit",
    category: "engagement",
    label: formName,
  })
}
