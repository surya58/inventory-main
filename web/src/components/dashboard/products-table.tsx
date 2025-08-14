"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, Search, Eye, Edit, Trash2, Loader2, Package } from "lucide-react"
import { Product } from "@/types/product"
import { useDeleteProductApiProductsIdDeleteMutation } from "@/store/api/enhanced/product"
import Link from "next/link"

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteProduct] = useDeleteProductApiProductsIdDeleteMutation()

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeletingId(productId)
      await deleteProduct({ id: parseInt(productId) }).unwrap()
      
      // Show success message (you can add toast library)
      console.log(`Product "${productName}" deleted successfully`)
    } catch (error) {
      console.error('Failed to delete product:', error)
      // Show error message
      alert('Failed to delete product. Please try again.')
    } finally {
      setDeletingId(null)
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
        <h2 className="text-xl font-semibold text-gray-900">
          Products ({products.length})
        </h2>
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

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {searchTerm ? (
              <>
                <Search className="w-12 h-12 mx-auto mb-4" />
                <p>No products found matching &quot;{searchTerm}&quot;</p>
              </>
            ) : (
              <>
                <Package className="w-12 h-12 mx-auto mb-4" />
                <p>No products in inventory</p>
              </>
            )}
          </div>
          {!searchTerm && (
            <Link href="/products/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </Link>
          )}
        </div>
      ) : (
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
                        <Button variant="ghost" size="sm" title="View Product">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/products/${product.id}/edit?from=/`}>
                        <Button variant="ghost" size="sm" title="Edit Product">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Delete Product"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {deletingId === product.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}