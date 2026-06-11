export interface ProductSale {
  id: string;
  unitId: string;
  mpcsId: string;
  productId: string;
  saleDate: string;
  quantity: number;
  price: number;
  totalAmount: number;
  remarks: string;
  billed: boolean;
}

export interface ProductSaleCreateRequest {
  mpcsId: string;
  productId: string;
  saleDate: string;
  quantity: number;
  price: number;
  remarks?: string;
}

export type ProductSaleUpdateRequest = ProductSaleCreateRequest;

export interface ProductSalePaginatedResponse {
  content: ProductSale[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ProductSaleFilters {
  mpcsId?: string;
  startDate?: string;
  endDate?: string;
}
