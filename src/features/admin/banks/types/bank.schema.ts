import { z } from "zod";

export const bankSchema = z.object({
  unitId: z.string().uuid("Please select a valid unit"),
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 characters")
    .max(20, "Account number is too long"),
  accountType: z.enum(["SAVINGS", "CURRENT"], {
    message: "Please select an account type",
  }),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  ifsc: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format (e.g., SBIN0001234)"),
  branchName: z.string().min(1, "Branch name is required"),
  micr: z.string().optional().or(z.literal("")),
  contactNumber: z
    .string()
    .regex(/^\d{10}$/, "Contact number must be 10 digits"),
  contactEmail: z.string().email("Invalid email address"),
});

export type BankFormData = z.infer<typeof bankSchema>;
