export type Shift = "MORNING" | "EVENING";

export interface MilkCollection {
  id: string;
  unitId: string;
  mpcsId: string;
  collectionDate: string;
  shift: Shift;
  quantity: number;
  fatPercentage: number;
  snfPercentage: number;
  clr: number;
  fatKg: number;
  snfKg: number;
  billed: boolean;
}

export interface MilkCollectionCreateRequest {
  mpcsId: string;
  collectionDate: string;
  shift: Shift;
  quantity: number;
  fatPercentage: number;
  clr: number;
}

export type MilkCollectionUpdateRequest = MilkCollectionCreateRequest;

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
