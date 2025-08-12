import { AppSidebar } from "@/components/app-sidebar"
import { ProductDetail } from "@/components/dashboard/product-detail"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { notFound } from "next/navigation"

// Mock data - replace with actual data fetching
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
  // Add other products as needed
]

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = mockProducts.find(p => p.id === params.id)
  
  if (!product) {
    notFound()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 p-8 pt-6">
          <ProductDetail product={product} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}