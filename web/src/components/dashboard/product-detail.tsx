"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Edit, Loader2 } from "lucide-react"
import { useGetProductApiProductsIdGetQuery } from "@/store/api/enhanced/product"
import Link from "next/link"
import { calculateTotalValue } from "@/lib/utils"

interface ProductDetailProps {
  productId: string
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const productIdNum = parseInt(productId)
  const { data: product, isLoading, error } = useGetProductApiProductsIdGetQuery({ 
    id: productIdNum 
  })

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        
        <Card className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center">
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              <span className="text-gray-600">Loading product...</span>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        
        <Card className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">
              {('status' in error! && error.status === 404) 
                ? "Product not found" 
                : "Error loading product"}
            </p>
            <Link href="/">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const getStatusColor = (stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-800 hover:bg-red-100/80'
    if (stock < 20) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
    return 'bg-green-100 text-green-800 hover:bg-green-100/80'
  }

  const getStatus = (stock: number) => {
    if (stock === 0) return 'Out of Stock'
    if (stock < 20) return 'Low Stock'
    return 'In Stock'
  }

  const totalValue = calculateTotalValue(product.stock, product.price)
  const status = getStatus(product.stock)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        <Link href={`/products/${product.id}/edit?from=/products/${product.id}`}>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Edit Product
          </Button>
        </Link>
      </div>

      {/* Product Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">SKU: {product.sku}</span>
          <Badge className={getStatusColor(product.stock)}>
            {status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Product Information
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Category</h3>
                <p className="text-gray-900">{product.category}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Price</h3>
                <p className="text-gray-900">${product.price}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {/* Since API doesn't have description, show category-based description */}
              This is a {product.category.toLowerCase()} product with SKU {product.sku}. 
              Currently priced at ${product.price} with {product.stock} units in stock.
            </p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Stock Information
            </h2>
            
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-900 mb-2">{product.stock}</p>
              <p className="text-gray-600">Units Available</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Value:</h3>
                <p className="text-lg font-semibold text-gray-900">${totalValue.toFixed(2)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Unit Price:</h3>
                <p className="text-lg font-semibold text-gray-900">${product.price}</p>
              </div>
              
              {product.stock < 20 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ {product.stock === 0 ? 'Out of stock' : 'Low stock alert'}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Product Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Product ID:</h3>
                <p className="text-sm text-gray-900">#{product.id}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Category:</h3>
                <p className="text-sm text-gray-900">{product.category}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">SKU:</h3>
                <p className="text-sm text-gray-900 font-mono">{product.sku}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}