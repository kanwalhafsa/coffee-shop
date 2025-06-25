"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { formatPrice } from "@/lib/utils"
import { Plus, Edit, Trash2, Search, Coffee } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  featured: boolean
  image: string
  available: boolean
  createdAt: string
}

const categories = ["Hot Coffee", "Cold Coffee", "Specialty Coffee", "Pastries", "Snacks"]

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const fetchProducts = async () => {
    try {
      // Get products from localStorage instead of API
      const menuItems = JSON.parse(localStorage.getItem("menuItems") || "[]")
      setProducts(menuItems)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      let updatedProducts

      if (editingProduct?.id) {
        // Update existing product
        updatedProducts = products.map((product) =>
          product.id === editingProduct.id ? { ...product, ...productData } : product,
        )
        toast.success("Product updated successfully")
      } else {
        // Create new product
        const newProduct: Product = {
          id: Date.now().toString(),
          name: productData.name || "",
          description: productData.description || "",
          price: productData.price || 0,
          category: productData.category || "Hot Coffee",
          featured: productData.featured || false,
          image: productData.image || "/placeholder.svg?height=400&width=400",
          available: true,
          createdAt: new Date().toISOString(),
        }
        updatedProducts = [...products, newProduct]
        toast.success("Product created successfully")
      }

      // Save to localStorage
      localStorage.setItem("menuItems", JSON.stringify(updatedProducts))
      setProducts(updatedProducts)
      setEditingProduct(null)
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("Failed to save product")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const updatedProducts = products.filter((product) => product.id !== id)
      localStorage.setItem("menuItems", JSON.stringify(updatedProducts))
      setProducts(updatedProducts)
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product")
    }
  }

  const toggleProductAvailability = (id: string) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, available: !product.available } : product,
    )
    localStorage.setItem("menuItems", JSON.stringify(updatedProducts))
    setProducts(updatedProducts)
    toast.success("Product availability updated")
  }

  const resetForm = () => {
    setEditingProduct(null)
  }

  if (loading) {
    return <div>Loading products...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Product Management</h3>
          <p className="text-sm text-muted-foreground">Manage your coffee shop menu items</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProduct?.id ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 flex-1">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{product.name}</h4>
                      {product.featured && <Badge>Featured</Badge>}
                      <Badge variant={product.available ? "default" : "secondary"}>
                        {product.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium text-primary">{formatPrice(product.price)}</span>
                      <span className="text-muted-foreground">{product.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(product)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleProductAvailability(product.id)}>
                    {product.available ? "Disable" : "Enable"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Coffee className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Start by adding your first product"}
          </p>
          {!searchTerm && selectedCategory === "all" && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null
  onSave: (data: Partial<Product>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "Hot Coffee",
    featured: product?.featured || false,
    image: product?.image || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value: string) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="/placeholder.svg?height=400&width=400"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          className="rounded border-input"
        />
        <Label htmlFor="featured">Featured Product</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Save Product
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
