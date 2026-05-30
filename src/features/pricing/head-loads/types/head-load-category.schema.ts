import { z } from "zod";

export const headLoadCategorySchema = z.object({
  code: z.string().min(1, "Code is required"),
  description: z.string().min(1, "Description is required"),
  active: z.boolean().default(true),
});

export type HeadLoadCategoryFormData = z.infer<typeof headLoadCategorySchema>;
