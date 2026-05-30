export interface HeadLoadPrice {
  id: string;
  effectiveFrom: string;
  headLoadCategoryId: number;
  quantityFrom: number;
  rate: number;
  status: "ACTIVE" | "INACTIVE";
  effectiveTo: string | null;
}

export interface CreateHeadLoadPriceRequest {
  ruleType: "HEAD_LOAD";
  headLoadCategoryId: number;
  quantityFrom: number;
  rate: number;
  effectiveFrom: string;
}
