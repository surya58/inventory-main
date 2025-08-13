import { AppSidebar } from "@/components/app-sidebar"
import { CreateProductForm } from "@/components/dashboard/create-product-form"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ArrowLeft} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CreateProduct() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 p-8 pt-6">
          <div className="max-w-2xl">
             <div className="flex items-center my-4 gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Product</h1>
              <p className="text-gray-600">Add a new product to your inventory</p>
            </div>
            
            <CreateProductForm />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}