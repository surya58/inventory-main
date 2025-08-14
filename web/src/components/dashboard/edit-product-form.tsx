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
import { productSchema, type ProductFormData } from "@/lib/validation/product-schema"

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
    stock: 0,
    price: 0,
    description: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({})


  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "",
        stock: product.stock || 0,
        price: product.price || 0,
        description: "", //
      })
    }
  }, [product])

  
  const validateForm = (): boolean => {
    const result = productSchema.safeParse(formData)

    if (result.success) {
      setErrors({})
      return true
    }

    const newErrors: Partial<Record<keyof ProductFormData, string>> = {}
    result.error.issues.forEach((err) => {
    const field = err.path[0] as keyof ProductFormData
    newErrors[field] = err.message
    })
    setErrors(newErrors)
    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const updateData = {
        name: formData.name.trim(),
        sku: formData.sku.trim().toUpperCase(),
        category: formData.category,
        stock: formData.stock,
        price: formData.price
      }

      await updateProduct({ 
        id: productIdNum, 
        productUpdate: updateData 
      }).unwrap()
      
      console.log("Product updated successfully")
      router.push("/")
    } catch (error: unknown) {
      console.error("Failed to update product:", error)
      
      const apiError = error as { data?: { detail?: string | Array<{ loc?: string[]; msg?: string }> } }
      if (apiError.data?.detail) {
        if (typeof apiError.data.detail === 'string') {
          if (apiError.data.detail.includes('SKU must be unique')) {
            setErrors({ sku: "SKU already exists. Please use a different SKU." })
          } else {
            alert(`Error: ${apiError.data.detail}`)
          }
        } else if (Array.isArray(apiError.data.detail)) {
          const validationErrors: Partial<Record<keyof ProductFormData, string>> = {}
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
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      [field]: field === 'stock' || field === 'price' ? 
        (value === '' ? 0 : parseFloat(value) || 0) : value
    }))
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

  const characterCount = formData.description?.length || 0
  const maxCharacters = 500

  if (isLoadingProduct) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
          <span className="text-gray-600">Loading product...</span>
        </div>
      </Card>
    )
  }

  if (fetchError) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600 mb-4">
          {('status' in fetchError && fetchError.status === 404) 
            ? "Product not found" 
            : "Error loading product"}
        </p>
        <Button onClick={() => router.push("/")} variant="outline">
          Back to Dashboard
        </Button>
      </Card>
    )
  }

  if (!product) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600 mb-4">Product not found</p>
        <Button onClick={() => router.push("/")} variant="outline">
          Back to Dashboard
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name + SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Product Name *</label>
            <Input
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleInputChange("name")}
              className={errors.name ? "border-red-500" : ""}
              disabled={isUpdating}
              required
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">SKU * (Format: 123-456-78)</label>
            <Input
              placeholder="123-456-78"
              value={formData.sku}
              onChange={handleInputChange("sku")}
              className={errors.sku ? "border-red-500" : ""}
              disabled={isUpdating}
              required
            />
            {errors.sku && <p className="text-sm text-red-600">{errors.sku}</p>}
          </div>
        </div>

        {/* Stock + Price + Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium">Stock Quantity *</label>
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
            {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Price ($) *</label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={handleInputChange("price")}
              min="0"
              step="0.01"
              className={errors.price ? "border-red-500" : ""}
              disabled={isUpdating}
              required
            />
            {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Category *</label>
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
            {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            placeholder="Enter product description (optional)"
            value={formData.description || ""}
            onChange={handleInputChange("description")}
            maxLength={maxCharacters}
            className="min-h-[100px]"
            disabled={isUpdating}
          />
          <p className="text-xs text-gray-500">
            {characterCount}/{maxCharacters} characters
          </p>
        </div>

        {/* Actions */}
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
