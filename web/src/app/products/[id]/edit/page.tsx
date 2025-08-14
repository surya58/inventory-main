import { EditProductForm } from "@/components/dashboard/edit-product-form"
import { ArrowLeft} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProduct({ params }: EditProductPageProps) {
  return (
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
        
        <EditProductForm productId={{ id: params.id }} />
      </div>
    </main>
  )
}