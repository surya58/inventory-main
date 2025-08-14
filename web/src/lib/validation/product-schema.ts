import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .regex(/^\d{3}-\d{3}-\d{2}$/, "SKU must be in the format 123-456-78"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  stock: z.coerce.number().min(0, "Stock must be at least 0"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
})

export type ProductFormData = z.infer<typeof productSchema>
