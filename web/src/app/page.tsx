"use client";

import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { ProductsTable } from "@/components/dashboard/products-table"
import { useListProductsApiProductsGetQuery } from "@/store/api/enhanced/product"
import { useMemo } from "react"

export default function Dashboard() {
  const { data: products = [], isLoading, error } = useListProductsApiProductsGetQuery()

  // Calculate stats dynamically from API data
  const stats = useMemo(() => {
    if (!products.length) {
      return {
        totalProducts: 0,
        totalStock: 0,
        lowStockItems: 0,
        totalValue: 0
      }
    }

    const totalProducts = products.length
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
    const lowStockItems = products.filter(product => product.stock < 20).length // Define low stock threshold
    const totalValue = products.reduce((sum, product) => sum + (product.stock * product.price), 0)

    return {
      totalProducts,
      totalStock,
      lowStockItems,
      totalValue
    }
  }, [products])

  // Convert API products to UI format
  const uiProducts = useMemo(() => {
    return products.map(product => ({
      id: product.id.toString(),
      name: product.name,
      description: `${product.category} product`, // API doesn't have description, using category
      sku: product.sku,
      category: product.category,
      stock: product.stock,
      price: product.price,
      status: (product.stock === 0 ? 'Out of Stock' : 
               product.stock < 20 ? 'Low Stock' : 
               'In Stock') as 'In Stock' | 'Low Stock' | 'Out of Stock',
      createdAt: new Date().toISOString(), // API doesn't provide timestamps
      updatedAt: new Date().toISOString()
    }))
  }, [products])

  if (error) {
    return (
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h3 className="font-medium">Error loading products</h3>
          <p className="text-sm mt-1">
            {('data' in error) ? 
              `API Error: ${error.status}` : 
              'Network error - please check if the API is running'}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your product inventory</p>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        ) : (
          <>
            <DashboardStats stats={stats} />
            <ProductsTable products={uiProducts} />
          </>
        )}
      </div>
    </main>
  )
}