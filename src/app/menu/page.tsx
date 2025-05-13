import CoffeeList from "../../component/coffee-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Coffee Menu | Brew Haven",
  description: "Explore our selection of premium coffees and beverages",
}

export default function MenuPage() {
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
          <CoffeeList category="all" />
        </TabsContent>
        <TabsContent value="hot">
          <CoffeeList category="hot" />
        </TabsContent>
        <TabsContent value="cold">
          <CoffeeList category="cold" />
        </TabsContent>
        <TabsContent value="specialty">
          <CoffeeList category="specialty" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
