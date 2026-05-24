import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.enum(["FEED", "STATIONERY", "OTHER"], {
    message: "Please select a category",
  }),
  uom: z.string().min(1, "UOM is required"),
  defaultPrice: z.number().min(0.01, "Price must be at least 0.01"),
  description: z.string().optional().or(z.literal("")),
  isInStock: z.boolean().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
