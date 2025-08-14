// src/components/dashboard/test-products.tsx
import { useListProductsApiProductsGetQuery } from '../../store/api/generated/product'

export function TestProducts() {
  const { data: products, isLoading, error } = useListProductsApiProductsGetQuery()

  console.log('RTK Query State:', { products, isLoading, error })

  if (isLoading) return <div className="p-4">🔄 Loading products...</div>
  
  if (error) {
    console.error('API Error:', error)
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700">
        ❌ Error: {JSON.stringify(error, null, 2)}
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">✅ RTK Query is Working</h2>
      <p className="mb-2">Found {products?.length || 0} products:</p>
      {products?.map((product) => (
        <div key={product.id} className="bg-gray-100 p-2 mb-2 rounded">
          {product.name} - ${product.price}
        </div>
      ))}
    </div>
  )
}