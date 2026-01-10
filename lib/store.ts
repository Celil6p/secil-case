import { create } from "zustand";
import type {
  Collection,
  Product,
  Filter,
  AdditionalFilter,
  CollectionListMeta,
  ProductListMeta,
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

  // Reordered products (for drag-and-drop)
  reorderedProducts: Product[];

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

  setProducts: (products, meta) =>
    set({ products, productsMeta: meta, reorderedProducts: [...products] }),
  setProductsLoading: (loading) => set({ productsLoading: loading }),
  setProductsError: (error) => set({ productsError: error }),

  setReorderedProducts: (products) => set({ reorderedProducts: products }),
  resetReorderedProducts: () =>
    set((state) => ({ reorderedProducts: [...state.products] })),

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

  reset: () => set(initialState),
}));
