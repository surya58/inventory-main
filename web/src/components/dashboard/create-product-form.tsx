"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useCreateProductApiProductsPostMutation } from "@/store/api/enhanced/product"
import { Loader2 } from "lucide-react"

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

export function CreateProductForm() {
  const router = useRouter()
  const [createProduct, { isLoading }] = useCreateProductApiProductsPostMutation()
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    sku: "",
    category: "",
    stock: "0",
    price: "0.00",
    description: "",
  })
  const [errors, setErrors] = useState<Partial<ProductFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {}
    
    if (!formData.name.trim()) newErrors.name = "Product name is required"
    if (!formData.sku.trim()) newErrors.sku = "SKU is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (parseInt(formData.stock) < 0) newErrors.stock = "Stock cannot be negative"
    if (parseFloat(formData.price) <= 0) newErrors.price = "Price must be greater than 0"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const productData = {
        name: formData.name.trim(),
        sku: formData.sku.trim().toUpperCase(),
        category: formData.category,
        stock: parseInt(formData.stock),
        price: parseFloat(formData.price)
      }

      const result = await createProduct({ productCreate: productData }).unwrap()
      
      console.log("Product created with ID:", result)
      
      // Redirect to dashboard with success
      router.push("/")
    } catch (error: unknown) {
      console.error("Failed to create product:", error)
      
      // Handle specific API errors
      interface ApiError {
        data?: {
          detail?: unknown
        }
      }

      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as ApiError).data === "object" &&
        (error as ApiError).data !== null &&
        "detail" in (error as ApiError).data!
      ) {
        const detail = (error as ApiError).data!.detail
        if (typeof detail === 'string') {
          if (detail.includes('SKU must be unique')) {
            setErrors({ sku: "SKU already exists. Please use a different SKU." })
          } else {
            alert(`Error: ${detail}`)
          }
        } else if (Array.isArray(detail)) {
          // Handle validation errors
          const validationErrors: Partial<ProductFormData> = {}
          detail.forEach((err: { loc?: unknown[]; msg?: string }) => {
            if (err.loc && err.loc.length > 1) {
              const field = err.loc[1] as keyof ProductFormData
              validationErrors[field] = err.msg ?? ""
            }
          })
          setErrors(validationErrors)
        }
      } else {
        alert("Failed to create product. Please try again.")
      }
    }
  }

  const handleInputChange = (field: keyof ProductFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }))
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: undefined }))
    }
  }

  const characterCount = formData.description.length
  const maxCharacters = 500

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
              className={errors.name ? "border-red-500" : ""}
              disabled={isLoading}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              SKU *
            </label>
            <Input
              placeholder="Enter SKU code"
              value={formData.sku}
              onChange={handleInputChange("sku")}
              className={errors.sku ? "border-red-500" : ""}
              disabled={isLoading}
              required
            />
            {errors.sku && (
              <p className="text-sm text-red-600">{errors.sku}</p>
            )}
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
              className={errors.stock ? "border-red-500" : ""}
              disabled={isLoading}
              required
            />
            {errors.stock && (
              <p className="text-sm text-red-600">{errors.stock}</p>
            )}
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
              min="0.01"
              step="0.01"
              className={errors.price ? "border-red-500" : ""}
              disabled={isLoading}
              required
            />
            {errors.price && (
              <p className="text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category *
            </label>
            <Select 
              onValueChange={handleSelectChange} 
              disabled={isLoading}
              required
            >
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
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
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            placeholder="Enter product description (optional)"
            value={formData.description}
            onChange={handleInputChange("description")}
            maxLength={maxCharacters}
            className="min-h-[100px]"
            disabled={isLoading}
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
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Product...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}