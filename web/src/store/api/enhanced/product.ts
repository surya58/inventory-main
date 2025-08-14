import { moviesApi } from "../generated/product";

export const productsApi = moviesApi.enhanceEndpoints({
    addTagTypes: [
        'PRODUCT', 
    ],
    endpoints: {
        listProductsApiProductsGet: {
            providesTags: ['PRODUCT'],
        },
        getProductApiProductsIdGet: {
            providesTags: (result, error, arg) => [
                { type: 'PRODUCT', id: arg.id },
                'PRODUCT'
            ],
        },
        createProductApiProductsPost: {
            invalidatesTags: ['PRODUCT'],
        },
        updateProductApiProductsIdPut: {
            invalidatesTags: (result, error, arg) => [
                { type: 'PRODUCT', id: arg.id },
                'PRODUCT'
            ],
        },
        deleteProductApiProductsIdDelete: {
            invalidatesTags: (result, error, arg) => [
                { type: 'PRODUCT', id: arg.id },
                'PRODUCT'
            ],
        },
    }
});

export const {
  useListProductsApiProductsGetQuery,
  useCreateProductApiProductsPostMutation,
  useGetProductApiProductsIdGetQuery,
  useUpdateProductApiProductsIdPutMutation,
  useDeleteProductApiProductsIdDeleteMutation,
} = productsApi;