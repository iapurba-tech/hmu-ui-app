import { z } from "zod";
import { UserRole } from "../../../auth/constants/roles";

export const addressSchema = z.object({
  addressLine1: z.string().min(1, { message: "Address Line 1 is required" }),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(1, { message: "City is required" }),
  district: z.string().min(1, { message: "District is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postalCode: z.string().min(1, { message: "Postal Code is required" }),
});

export const userSchema = z.object({
  firstname: z.string().min(1, { message: "Firstname is required" }),
  lastname: z.string().min(1, { message: "Lastname is required" }),
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters" })
    .max(50, { message: "Username must be at most 50 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .optional()
    .or(z.literal("")),
  email: z.string().email({ message: "Invalid email format" }),
  role: z.enum([
    UserRole.SYSTEM_ADMIN,
    UserRole.UNIT_ADMIN,
    UserRole.UNIT_MANAGER,
  ]),
  unitIds: z.array(z.string()).optional(),
  mpcsId: z.string().optional().nullable(),
  address: addressSchema,
});

export type UserFormData = z.infer<typeof userSchema>;
