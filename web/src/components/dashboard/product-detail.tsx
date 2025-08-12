"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import { Product } from "@/types/product"
import Link from "next/link"
import { formatDate, calculateTotalValue } from "@/lib/utils"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 hover:bg-green-100/80'
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
      case 'Out of Stock':
        return 'bg-red-100 text-red-800 hover:bg-red-100/80'
      default:
        return ''
    }
  }

  const totalValue = calculateTotalValue(product.stock, product.price)

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
        <Button>
          <Edit className="w-4 h-4 mr-2" />
          Edit Product
        </Button>
      </div>

      {/* Product Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">SKU: {product.sku}</span>
          <Badge className={getStatusColor(product.status)}>
            {product.status}
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
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
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
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Timestamps
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Created:</h3>
                <p className="text-sm text-gray-900">{formatDate(product.createdAt)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Last Updated:</h3>
                <p className="text-sm text-gray-900">{formatDate(product.updatedAt)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}