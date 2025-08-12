import { AppSidebar } from "@/components/app-sidebar"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { ProductsTable } from "@/components/dashboard/products-table"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

// Mock data - replace with actual data fetching
const mockStats = {
  totalProducts: 6,
  totalStock: 411,
  lowStockItems: 1,
  totalValue: 20285.89
}

const mockProducts = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "Premium wireless headphones with noise cancellation",
    sku: "WBH-001",
    category: "Electronics",
    stock: 45,
    price: 89.99,
    status: "In Stock" as const,
    createdAt: "2024-01-15T04:30:00Z",
    updatedAt: "2024-01-15T04:30:00Z"
  },
  {
    id: "2",
    name: "Organic Cotton T-Shirt",
    description: "Soft organic cotton t-shirt in multiple colors",
    sku: "OCT-002",
    category: "Clothing",
    stock: 120,
    price: 24.99,
    status: "In Stock" as const,
    createdAt: "2024-01-15T04:30:00Z",
    updatedAt: "2024-01-15T04:30:00Z"
  },
  {
    id: "3",
    name: "Smart Water Bottle",
    description: "Temperature tracking smart water bottle with app connectivity",
    sku: "SWB-003",
    category: "Health & Fitness",
    stock: 78,
    price: 34.99,
    status: "In Stock" as const,
    createdAt: "2024-01-15T04:30:00Z",
    updatedAt: "2024-01-15T04:30:00Z"
  },
  {
    id: "4",
    name: "Ergonomic Office Chair",
    description: "Adjustable ergonomic chair with lumbar support",
    sku: "EOC-004",
    category: "Furniture",
    stock: 12,
    price: 299.99,
    status: "Low Stock" as const,
    createdAt: "2024-01-15T04:30:00Z",
    updatedAt: "2024-01-15T04:30:00Z"
  },
  {
    id: "5",
    name: "LED Desk Lamp",
    description: "Adjustable LED desk lamp with USB charging port",
    sku: "LDL-005",
    category: "Home & Garden",
    stock: 67,
    price: 49.99,
    status: "In Stock" as const,
    createdAt: "2024-01-15T04:30:00Z",
    updatedAt: "2024-01-15T04:30:00Z"
  },
  {
    id: "6",
    name: "Yoga Mat Premium",
    description: "Non-slip premium yoga mat with carrying strap",
    sku: "YMP-006",
    category: "Health & Fitness",
    stock: 89,
    price: 39.99,
    status: "In Stock" as const,
    createdAt: "2024-01-15T04:30:00Z",
    updatedAt: "2024-01-15T04:30:00Z"
  }
]

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 space-y-4 p-8 pt-6">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Overview of your product inventory</p>
            </div>
            
            <DashboardStats stats={mockStats} />
            <ProductsTable products={mockProducts} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}