"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react"
import { Product } from "@/types/product"
import Link from "next/link"

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusVariant = (status: Product['status']) => {
    switch (status) {
      case 'In Stock':
        return 'default'
      case 'Low Stock':
        return 'secondary'
      case 'Out of Stock':
        return 'destructive'
      default:
        return 'outline'
    }
  }

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

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Products</h2>
        <Link href="/products/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search products by name, SKU, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm uppercase tracking-wide">
                PRODUCT
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm uppercase tracking-wide">
                SKU
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm uppercase tracking-wide">
                CATEGORY
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm uppercase tracking-wide">
                STOCK
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm uppercase tracking-wide">
                PRICE
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm uppercase tracking-wide">
                STATUS
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm uppercase tracking-wide">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.description}</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {product.sku}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {product.category}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {product.stock}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  ${product.price}
                </td>
                <td className="py-4 px-4">
                  <Badge className={getStatusColor(product.status)}>
                    {product.status}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/products/${product.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}