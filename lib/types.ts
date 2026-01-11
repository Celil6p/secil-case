// API Response Types
export interface ApiResponse<T> {
  status: number;
  message: string | null;
  data: T;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  refreshToken: string;
  tokenType: string;
}

export interface CollectionFilter {
  id: string;
  title: string;
  value: string;
  valueName: string;
  currency: string | null;
  comparisonType: number;
}

export interface CollectionFilters {
  useOrLogic: boolean;
  filters: CollectionFilter[] | null;
}

export interface CollectionInfo {
  id: number;
  name: string;
  description: string;
  url: string;
  langCode: string;
}

export interface CollectionProduct {
  productCode: string;
  colorCode: string | null;
  name: string | null;
  imageUrl: string;
}

export interface Collection {
  id: number;
  filters: CollectionFilters;
  type: number;
  info: CollectionInfo;
  salesChannelId: number;
  products: CollectionProduct[] | null;
}

export interface CollectionListMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CollectionListResponse {
  meta: CollectionListMeta;
  data: Collection[];
}

export interface Product {
  productCode: string;
  colorCode: string;
  name: string | null;
  outOfStock: boolean;
  isSaleB2B: boolean;
  imageUrl: string;
  createdOn?: string;
}

export interface ProductListMeta {
  page: number;
  pageSize: number;
  totalProduct: number;
}

export interface ProductListData {
  meta: ProductListMeta;
  data: Product[];
}

export interface FilterValue {
  value: string;
  valueName: string | null;
}

export interface Filter {
  id: string;
  title: string;
  values: FilterValue[];
  currency: string | null;
  comparisonType: number;
}

export interface AdditionalFilter {
  id: string;
  value: string;
  comparisonType: number;
}

export interface GetProductsRequest {
  additionalFilters: AdditionalFilter[];
  page: number;
  pageSize: number;
}

// Order change tracking for pagination support
export interface OrderChange {
  productCode: string;
  colorCode: string;
  originalOrder: number;
  newOrder: number;
}

export interface ProductWithOrder extends Product {
  globalOrder: number;  // The global position across all pages
  displayOrder: number; // The order to display (may differ if reordered)
}
