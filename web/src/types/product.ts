export interface Product {
  id: string
  name: string
  description: string
  sku: string
  category: string
  stock: number
  price: number
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalProducts: number
  totalStock: number
  lowStockItems: number
  totalValue: number
}