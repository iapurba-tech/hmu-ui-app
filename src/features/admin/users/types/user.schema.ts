import { z } from "zod";
import { UserRole } from "../../../auth/constants/roles";

export const addressSchema = z.object({
  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
});

export const userSchema = z
  .object({
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
    role: z
      .enum([UserRole.SYSTEM_ADMIN, UserRole.UNIT_ADMIN, UserRole.UNIT_MANAGER])
      .refine((val) => !!val, { message: "Role is required" }),
    unitIds: z.array(z.string()).optional(),
    mpcsId: z.string().optional().nullable(),
    skipAddress: z.boolean(),
    address: addressSchema.optional().nullable(),
  })
  .superRefine((data, ctx) => {
    // Add validation for role being one of the enum values (not empty)
    // Though z.enum already handles this if we don't provide .or(z.literal(""))

    if (data.skipAddress) {
      return;
    }

    const address = data.address;

    if (!address?.addressLine1?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Address Line 1 is required",
        path: ["address", "addressLine1"],
      });
    }
    if (!address?.city?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "City is required",
        path: ["address", "city"],
      });
    }
    if (!address?.district?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "District is required",
        path: ["address", "district"],
      });
    }
    if (!address?.state?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "State is required",
        path: ["address", "state"],
      });
    }
    if (!address?.postalCode?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Postal Code is required",
        path: ["address", "postalCode"],
      });
    }
  });

export type UserFormData = z.infer<typeof userSchema>;
