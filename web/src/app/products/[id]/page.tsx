import { ProductDetail } from "@/components/dashboard/product-detail"

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <main className="flex-1 p-8 pt-6">
      <ProductDetail productId={params.id} />
    </main>
  )
}