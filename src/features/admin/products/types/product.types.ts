export type ProductCategory = "FEED" | "STATIONERY" | "OTHER";

export interface Product {
  id: string;
  name: string;
  code: string;
  category: ProductCategory;
  uom: string;
  defaultPrice: number;
  isActive: boolean;
  isInStock: boolean;
  description?: string;
}

export interface CreateProductRequest {
  name: string;
  category: ProductCategory;
  uom: string;
  defaultPrice: number;
  description?: string;
}

export type UpdateProductRequest = Partial<CreateProductRequest> & {
  id: string;
  isInStock?: boolean;
};
