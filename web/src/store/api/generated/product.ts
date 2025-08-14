/* eslint-disable -- Auto Generated File */
import { emptySplitApi as api } from "../empty-api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    listProductsApiProductsGet: build.query<
      ListProductsApiProductsGetApiResponse,
      ListProductsApiProductsGetApiArg
    >({
      query: () => ({ url: `/api/products` }),
    }),
    createProductApiProductsPost: build.mutation<
      CreateProductApiProductsPostApiResponse,
      CreateProductApiProductsPostApiArg
    >({
      query: (queryArg) => ({
        url: `/api/products`,
        method: "POST",
        body: queryArg.productCreate,
      }),
    }),
    getProductApiProductsIdGet: build.query<
      GetProductApiProductsIdGetApiResponse,
      GetProductApiProductsIdGetApiArg
    >({
      query: (queryArg) => ({ url: `/api/products/${queryArg.id}` }),
    }),
    updateProductApiProductsIdPut: build.mutation<
      UpdateProductApiProductsIdPutApiResponse,
      UpdateProductApiProductsIdPutApiArg
    >({
      query: (queryArg) => ({
        url: `/api/products/${queryArg.id}`,
        method: "PUT",
        body: queryArg.productUpdate,
      }),
    }),
    deleteProductApiProductsIdDelete: build.mutation<
      DeleteProductApiProductsIdDeleteApiResponse,
      DeleteProductApiProductsIdDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/products/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as moviesApi };
export type ListProductsApiProductsGetApiResponse =
  /** status 200 Successful Response */ Product[];
export type ListProductsApiProductsGetApiArg = void;
export type CreateProductApiProductsPostApiResponse =
  /** status 200 Successful Response */ number;
export type CreateProductApiProductsPostApiArg = {
  productCreate: ProductCreate;
};
export type GetProductApiProductsIdGetApiResponse =
  /** status 200 Successful Response */ Product;
export type GetProductApiProductsIdGetApiArg = {
  id: number;
};
export type UpdateProductApiProductsIdPutApiResponse =
  /** status 200 Successful Response */ Product;
export type UpdateProductApiProductsIdPutApiArg = {
  id: number;
  productUpdate: ProductUpdate;
};
export type DeleteProductApiProductsIdDeleteApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteProductApiProductsIdDeleteApiArg = {
  id: number;
};
export type Product = {
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  id: number;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type ProductCreate = {
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
};
export type ProductUpdate = {
  name?: string | null;
  sku?: string | null;
  price?: number | null;
  stock?: number | null;
  category?: string | null;
};
export const {
  useListProductsApiProductsGetQuery,
  useCreateProductApiProductsPostMutation,
  useGetProductApiProductsIdGetQuery,
  useUpdateProductApiProductsIdPutMutation,
  useDeleteProductApiProductsIdDeleteMutation,
} = injectedRtkApi;
