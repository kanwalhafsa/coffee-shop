"use client"

import { Suspense } from "react"
import CoffeeList from "../../component/coffee-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function MenuPageContent() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Coffee Menu</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our handcrafted selection of premium coffees and beverages, made with the finest ingredients.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="hot">Hot Coffee</TabsTrigger>
          <TabsTrigger value="cold">Cold Coffee</TabsTrigger>
          <TabsTrigger value="specialty">Specialty</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Suspense fallback={<div>Loading coffee list...</div>}>
            <CoffeeList category="all" />
          </Suspense>
        </TabsContent>
        <TabsContent value="hot">
          <Suspense fallback={<div>Loading coffee list...</div>}>
            <CoffeeList category="hot" />
          </Suspense>
        </TabsContent>
        <TabsContent value="cold">
          <Suspense fallback={<div>Loading coffee list...</div>}>
            <CoffeeList category="cold" />
          </Suspense>
        </TabsContent>
        <TabsContent value="specialty">
          <Suspense fallback={<div>Loading coffee list...</div>}>
            <CoffeeList category="specialty" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div>Loading menu...</div>}>
      <MenuPageContent />
    </Suspense>
  )
}