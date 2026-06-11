import { z } from "zod";

export const addressSchema = z.object({
  addressLine1: z.string().min(1, "Address Line 1 is required").nullable(),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(1, "City is required").nullable(),
  district: z.string().min(1, "District is required").nullable(),
  state: z.string().min(1, "State is required").nullable(),
  postalCode: z.string().regex(/^\d{6}$/, "Postal code must be 6 digits").nullable(),
});

export const mpcsCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactPerson: z.string().min(1, "Contact Person is required"),
  contactNumber: z.string().regex(/^\d{10}$/, "Contact Number must be 10 digits"),
  bankAccountNumber: z.string().regex(/^\d{10,20}$/, "Bank Account Number must be between 10 and 20 digits"),
  unitId: z.string().uuid("Invalid Unit ID"),
  payoutBankId: z.string().uuid("Invalid Payout Bank ID"),
  headLoadCategoryId: z.number().int().positive("Invalid Head Load Category"),
  registrationDate: z.string().min(1, "Registration Date is required"),
});

export const mpcsDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactPerson: z.string().min(1, "Contact Person is required"),
  contactNumber: z.string().regex(/^\d{10}$/, "Contact Number must be 10 digits"),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")).nullable(),
  bankAccountNumber: z.string().regex(/^\d{10,20}$/, "Bank Account Number must be between 10 and 20 digits"),
  bankIfsc: z.string().optional().or(z.literal("")).nullable(),
  bankName: z.string().optional().or(z.literal("")).nullable(),
  address: addressSchema.nullable(),
  payoutBankId: z.string().uuid("Invalid Payout Bank ID"),
  headLoadCategoryId: z.number().int().positive("Invalid Head Load Category"),
  registrationDate: z.string().min(1, "Registration Date is required"),
  closureDate: z.string().optional().nullable(),
});

export const mpcsConfigurationSchema = z.object({
  active: z.boolean(),
  paymentPaused: z.boolean(),
  subsidyAllowed: z.boolean(),
  headLoadAllowed: z.boolean(),
  incentiveAllowed: z.boolean(),
  commissionAllowed: z.boolean(),
});

export const mpcsFormSchema = mpcsDetailsSchema.merge(mpcsConfigurationSchema).extend({
  unitId: z.string().uuid("Invalid Unit ID"),
  skipAddress: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (!data.skipAddress && data.address) {
    if (!data.address.addressLine1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address Line 1 is required",
        path: ["address", "addressLine1"],
      });
    }
    if (!data.address.city) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "City is required",
        path: ["address", "city"],
      });
    }
    if (!data.address.district) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "District is required",
        path: ["address", "district"],
      });
    }
    if (!data.address.state) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "State is required",
        path: ["address", "state"],
      });
    }
    if (!data.address.postalCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Postal code must be 6 digits",
        path: ["address", "postalCode"],
      });
    }
  }
});

export const mpcsSchema = mpcsFormSchema.extend({
  id: z.string().uuid(),
});
