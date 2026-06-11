import { z } from "zod";
import {
  mpcsSchema,
  mpcsCreateSchema,
  mpcsDetailsSchema,
  mpcsConfigurationSchema,
  mpcsFormSchema,
  addressSchema,
} from "./mpcs.schema";

export type Address = z.infer<typeof addressSchema>;
export type Mpcs = z.infer<typeof mpcsSchema>;
export type MpcsCreateRequest = z.infer<typeof mpcsCreateSchema>;
export type MpcsDetailsRequest = z.infer<typeof mpcsDetailsSchema>;
export type MpcsConfigurationRequest = z.infer<typeof mpcsConfigurationSchema>;
export type MpcsFormValues = z.infer<typeof mpcsFormSchema>;

export interface MpcsFilters {
  unitId?: string;
  active?: boolean;
  search?: string;
}
