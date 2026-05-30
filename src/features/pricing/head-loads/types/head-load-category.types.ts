export interface HeadLoadCategory {
  id: number;
  code: string;
  description: string;
  active: boolean;
}

export interface CreateHeadLoadCategoryRequest {
  code: string;
  description: string;
  active: boolean;
}

export type UpdateHeadLoadCategoryRequest = CreateHeadLoadCategoryRequest & {
  id: number;
};
