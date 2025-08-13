"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Product } from "@/types/product"

const categories = [
  "Electronics",
  "Clothing",
  "Health & Fitness",
  "Furniture",
  "Home & Garden",
  "Books",
  "Toys & Games",
  "Sports",
]

interface ProductFormData {
  name: string
  sku: string
  category: string
  stock: string
  price: string
  description: string
}

interface EditProductFormProps {
  productId: Product
}

export function EditProductForm({ productId: product }: EditProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    sku: "",
    category: "",
    stock: "0",
    price: "0.00",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Populate form with existing product data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "",
        stock: product.stock?.toString() || "0",
        price: product.price?.toString() || "0.00",
        description: product.description || "",
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      // Since there's no real API, we'll just simulate the update
      // In a real app, you would submit to your API endpoint here
      console.log("Product updated:", {
        id: product.id,
        ...formData,
        stock: parseInt(formData.stock),
        price: parseFloat(formData.price),
      })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect back to dashboard
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating the product')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProductFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }))
  }

  const characterCount = formData.description.length
  const maxCharacters = 500

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => setError(null)} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Product Name *
            </label>
            <Input
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleInputChange("name")}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              SKU *
            </label>
            <Input
              placeholder="Enter SKU code"
              value={formData.sku}
              onChange={handleInputChange("sku")}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Stock Quantity *
            </label>
            <Input
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={handleInputChange("stock")}
              min="0"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Price ($) *
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={handleInputChange("price")}
              min="0"
              step="0.01"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category *
            </label>
            <Select 
              onValueChange={handleSelectChange} 
              required 
              disabled={loading}
              value={formData.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            placeholder="Enter product description"
            value={formData.description}
            onChange={handleInputChange("description")}
            maxLength={maxCharacters}
            className="min-h-[100px]"
            disabled={loading}
          />
          <p className="text-xs text-gray-500">
            {characterCount}/{maxCharacters} characters
          </p>
        </div>

        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Product"}
          </Button>
        </div>
      </form>
    </Card>
  )
}