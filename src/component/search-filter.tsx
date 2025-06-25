// src/components/search-filter.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface Categories {
  hot: boolean
  cold: boolean
  specialty: boolean
}

export default function SearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [priceRange, setPriceRange] = useState([0, 10])
  const [categories, setCategories] = useState<Categories>({
    hot: searchParams.get("category") === "hot",
    cold: searchParams.get("category") === "cold",
    specialty: searchParams.get("category") === "specialty",
  })
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    
    if (searchQuery) {
      params.set("q", searchQuery)
    }
    
    const selectedCategories = Object.entries(categories)
      .filter(([_, isSelected]) => isSelected)
      .map(([category]) => category)
    
    if (selectedCategories.length === 1) {
      params.set("category", selectedCategories[0])
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 10) {
      params.set("minPrice", priceRange[0].toString())
      params.set("maxPrice", priceRange[1].toString())
    }
    
    router.push(`/menu?${params.toString()}`)
  }
  
  const handleReset = () => {
    setSearchQuery("")
    setPriceRange([0, 10])
    setCategories({
      hot: false,
      cold: false,
      specialty: false,
    })
    
    router.push("/menu")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryChange = (category: keyof Categories, checked: boolean) => {
    setCategories(prev => ({
      ...prev,
      [category]: checked
    }))
  }

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
  }

  const handleApplyFilters = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    
    if (searchQuery) {
      params.set("q", searchQuery)
    }
    
    const selectedCategories = Object.entries(categories)
      .filter(([_, isSelected]) => isSelected)
      .map(([category]) => category)
    
    if (selectedCategories.length === 1) {
      params.set("category", selectedCategories[0])
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 10) {
      params.set("minPrice", priceRange[0].toString())
      params.set("maxPrice", priceRange[1].toString())
    }
    
    router.push(`/menu?${params.toString()}`)
  }
  
  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search coffees..."
            className="pl-8"
            value={searchQuery}
            onChange={handleInputChange}
          />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" type="button">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Options</SheetTitle>
              <SheetDescription>
                Refine your search with these filters
              </SheetDescription>
            </SheetHeader>
            
            <div className="py-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Categories</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hot"
                      checked={categories.hot}
                      onCheckedChange={(checked) => 
                        handleCategoryChange('hot', !!checked)
                      }
                    />
                    <Label htmlFor="hot">Hot Coffee</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cold"
                      checked={categories.cold}
                      onCheckedChange={(checked) => 
                        handleCategoryChange('cold', !!checked)
                      }
                    />
                    <Label htmlFor="cold">Cold Coffee</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="specialty"
                      checked={categories.specialty}
                      onCheckedChange={(checked) => 
                        handleCategoryChange('specialty', !!checked)
                      }
                    />
                    <Label htmlFor="specialty">Specialty Drinks</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  <span className="text-sm text-muted-foreground">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  min={0}
                  max={10}
                  step={0.5}
                  onValueChange={handlePriceRangeChange}
                />
              </div>
            </div>
            
            <SheetFooter>
              <Button variant="outline" onClick={handleReset}>
                Reset Filters
              </Button>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        <Button type="submit">Search</Button>
      </form>
    </div>
  )
}