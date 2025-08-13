import { AppSidebar } from "@/components/app-sidebar"
import { EditProductForm } from "@/components/dashboard/edit-product-form"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { notFound } from "next/navigation"
import { ArrowLeft} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

export default function EditProduct({ params }: ProductDetailPageProps) {
    const product = mockProducts.find(p => p.id === params.id)
    if (!product) {
        notFound()
        }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 p-8 pt-6">
          <div className="max-w-2xl">
            <div className="flex items-center my-4 gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
              <p className="text-gray-600">Update the product details</p>
            </div>
            
            <EditProductForm productId={product} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
