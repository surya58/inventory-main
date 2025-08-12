import { AppSidebar } from "@/components/app-sidebar"
import { CreateProductForm } from "@/components/dashboard/create-product-form"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function CreateProduct() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1 p-8 pt-6">
          <div className="max-w-2xl">
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