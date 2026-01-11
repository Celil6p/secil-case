import { create } from "zustand";
import type {
  Collection,
  Product,
  Filter,
  AdditionalFilter,
  CollectionListMeta,
  ProductListMeta,
  OrderChange,
} from "./types";

interface CollectionStore {
  // Collections state
  collections: Collection[];
  collectionsMeta: CollectionListMeta | null;
  collectionsLoading: boolean;
  collectionsError: string | null;

  // Current collection being edited
  currentCollectionId: number | null;

  // Products state
  products: Product[];
  productsMeta: ProductListMeta | null;
  productsLoading: boolean;
  productsError: string | null;

  // Reordered products (for drag-and-drop on current page)
  reorderedProducts: Product[];

  // Order change tracking across pages
  // Using Record instead of Map for better Zustand reactivity
  orderChanges: Record<string, OrderChange>;
  currentPage: number;
  pageSize: number;

  // Original order map - stores unfiltered positions for all products
  // Key: "productCode-colorCode", Value: original position (1-based)
  originalOrderMap: Record<string, number>;
  originalOrderLoading: boolean;
  totalProducts: number; // Total unfiltered product count

  // Filters state
  filters: Filter[];
  filtersLoading: boolean;
  filtersError: string | null;

  // Active filters
  activeFilters: AdditionalFilter[];

  // Actions
  setCollections: (collections: Collection[], meta: CollectionListMeta) => void;
  setCollectionsLoading: (loading: boolean) => void;
  setCollectionsError: (error: string | null) => void;

  setCurrentCollectionId: (id: number | null) => void;

  setProducts: (products: Product[], meta: ProductListMeta) => void;
  setProductsLoading: (loading: boolean) => void;
  setProductsError: (error: string | null) => void;

  setReorderedProducts: (products: Product[]) => void;
  resetReorderedProducts: () => void;

  // Order change tracking actions
  updateOrderChanges: (changes: OrderChange[]) => void;
  removeOrderChanges: (keys: string[]) => void;
  clearOrderChanges: () => void;
  getProductDisplayOrder: (productCode: string, colorCode: string, defaultOrder: number) => number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  getAllOrderChanges: () => OrderChange[];
  hasOrderChanges: () => boolean;

  // Original order map actions
  setOriginalOrderMap: (map: Record<string, number>, totalProducts: number) => void;
  setOriginalOrderLoading: (loading: boolean) => void;
  getOriginalOrder: (productCode: string, colorCode: string) => number | undefined;
  clearOriginalOrderMap: () => void;

  setFilters: (filters: Filter[]) => void;
  setFiltersLoading: (loading: boolean) => void;
  setFiltersError: (error: string | null) => void;

  addActiveFilter: (filter: AdditionalFilter) => void;
  removeActiveFilter: (filterId: string, value: string) => void;
  clearActiveFilters: () => void;

  // Reset all state
  reset: () => void;
}

const initialState = {
  collections: [],
  collectionsMeta: null,
  collectionsLoading: false,
  collectionsError: null,

  currentCollectionId: null,

  products: [],
  productsMeta: null,
  productsLoading: false,
  productsError: null,

  reorderedProducts: [],

  // Order tracking
  orderChanges: {} as Record<string, OrderChange>,
  currentPage: 1,
  pageSize: 36,

  // Original order (unfiltered)
  originalOrderMap: {} as Record<string, number>,
  originalOrderLoading: false,
  totalProducts: 0,

  filters: [],
  filtersLoading: false,
  filtersError: null,

  activeFilters: [],
};

export const useCollectionStore = create<CollectionStore>((set) => ({
  ...initialState,

  setCollections: (collections, meta) =>
    set({ collections, collectionsMeta: meta }),
  setCollectionsLoading: (loading) => set({ collectionsLoading: loading }),
  setCollectionsError: (error) => set({ collectionsError: error }),

  setCurrentCollectionId: (id) => set({ currentCollectionId: id }),

  setProducts: (products, meta) => {
    return set({ products, productsMeta: meta, reorderedProducts: [...products] });
  },
  setProductsLoading: (loading) => set({ productsLoading: loading }),
  setProductsError: (error) => set({ productsError: error }),

  setReorderedProducts: (products) => set({ reorderedProducts: products }),
  resetReorderedProducts: () =>
    set((state) => ({ reorderedProducts: [...state.products] })),

  updateOrderChanges: (changes) =>
    set((state) => {
      const newOrderChanges = { ...state.orderChanges };
      changes.forEach((change) => {
        const key = `${change.productCode}-${change.colorCode}`;
        newOrderChanges[key] = change;
      });
      return { orderChanges: newOrderChanges };
    }),

  removeOrderChanges: (keys) =>
    set((state) => {
      const newOrderChanges = { ...state.orderChanges };
      keys.forEach((key) => {
        delete newOrderChanges[key];
      });
      return { orderChanges: newOrderChanges };
    }),

  clearOrderChanges: () => set({ orderChanges: {} }),

  getProductDisplayOrder: (productCode: string, colorCode: string, defaultOrder: number): number => {
    const key = `${productCode}-${colorCode}`;
    const change = useCollectionStore.getState().orderChanges[key];
    return change ? change.newOrder : defaultOrder;
  },

  setCurrentPage: (page: number) => set({ currentPage: page }),
  setPageSize: (size: number) => set({ pageSize: size }),

  getAllOrderChanges: (): OrderChange[] => {
    return Object.values(useCollectionStore.getState().orderChanges);
  },

  hasOrderChanges: (): boolean => {
    return Object.keys(useCollectionStore.getState().orderChanges).length > 0;
  },

  // Original order map implementations
  setOriginalOrderMap: (map: Record<string, number>, totalProducts: number) =>
    set({ originalOrderMap: map, totalProducts }),

  setOriginalOrderLoading: (loading: boolean) =>
    set({ originalOrderLoading: loading }),

  getOriginalOrder: (productCode: string, colorCode: string): number | undefined => {
    const key = `${productCode}-${colorCode}`;
    return useCollectionStore.getState().originalOrderMap[key];
  },

  clearOriginalOrderMap: () =>
    set({ originalOrderMap: {}, totalProducts: 0 }),

  setFilters: (filters) => set({ filters }),
  setFiltersLoading: (loading) => set({ filtersLoading: loading }),
  setFiltersError: (error) => set({ filtersError: error }),

  addActiveFilter: (filter) =>
    set((state) => {
      // Check if filter already exists
      const exists = state.activeFilters.some(
        (f) => f.id === filter.id && f.value === filter.value
      );
      if (exists) return state;
      return { activeFilters: [...state.activeFilters, filter] };
    }),

  removeActiveFilter: (filterId, value) =>
    set((state) => ({
      activeFilters: state.activeFilters.filter(
        (f) => !(f.id === filterId && f.value === value)
      ),
    })),

  clearActiveFilters: () => set({ activeFilters: [] }),

  reset: () => set({
    ...initialState,
    orderChanges: {},
    originalOrderMap: {},
  }),
}));
