"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useUpdateProductApiProductsIdPutMutation, useGetProductApiProductsIdGetQuery } from "@/store/api/enhanced/product"
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

interface EditProductFormProps {
  productId: { id: string }
}

export function EditProductForm({ productId }: EditProductFormProps) {
  const router = useRouter()
  const productIdNum = parseInt(productId.id)
  
  const { data: product, isLoading: isLoadingProduct, error: fetchError } = useGetProductApiProductsIdGetQuery({ 
    id: productIdNum 
  })
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductApiProductsIdPutMutation()
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    sku: "",
    category: "",
    stock: "0",
    price: "0.00",
    description: "",
  })
  const [errors, setErrors] = useState<Partial<ProductFormData>>({})

  // Populate form with existing product data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "",
        stock: product.stock?.toString() || "0",
        price: product.price?.toString() || "0.00",
        description: "", // API doesn't have description field
      })
    }
  }, [product])

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
      const updateData = {
        name: formData.name.trim(),
        sku: formData.sku.trim().toUpperCase(),
        category: formData.category,
        stock: parseInt(formData.stock),
        price: parseFloat(formData.price)
      }

      await updateProduct({ 
        id: productIdNum, 
        productUpdate: updateData 
      }).unwrap()
      
      console.log("Product updated successfully")
      
      // Redirect back to dashboard or product detail
      router.push("/")
    } catch (error: unknown) {
      console.error("Failed to update product:", error)
      
      // Handle specific API errors
      const apiError = error as { data?: { detail?: string | Array<{ loc?: string[]; msg?: string }> } }
      if (apiError.data?.detail) {
        if (typeof apiError.data.detail === 'string') {
          if (apiError.data.detail.includes('SKU must be unique')) {
            setErrors({ sku: "SKU already exists. Please use a different SKU." })
          } else {
            alert(`Error: ${apiError.data.detail}`)
          }
        } else if (Array.isArray(apiError.data.detail)) {
          // Handle validation errors
          const validationErrors: Partial<ProductFormData> = {}
          apiError.data.detail.forEach((err: { loc?: string[]; msg?: string }) => {
            if (err.loc && err.loc.length > 1) {
              const field = err.loc[1] as keyof ProductFormData
              validationErrors[field] = err.msg
            }
          })
          setErrors(validationErrors)
        }
      } else {
        alert("Failed to update product. Please try again.")
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

  // Loading state while fetching product
  if (isLoadingProduct) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center">
            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            <span className="text-gray-600">Loading product...</span>
          </div>
        </div>
      </Card>
    )
  }

  // Error state if product not found
  if (fetchError) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {('status' in fetchError && fetchError.status === 404) 
              ? "Product not found" 
              : "Error loading product"}
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </Card>
    )
  }

  if (!product) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Button onClick={() => router.push("/")} variant="outline">
            Back to Dashboard
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
              className={errors.name ? "border-red-500" : ""}
              disabled={isUpdating}
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
              disabled={isUpdating}
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
              disabled={isUpdating}
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
              disabled={isUpdating}
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
              disabled={isUpdating}
              required
              value={formData.category}
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
            disabled={isUpdating}
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
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating Product...
              </>
            ) : (
              "Update Product"
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}