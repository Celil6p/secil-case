"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Header } from "@/components/Header";
import { FilterPanel } from "@/components/FilterPanel";
import { SortableProduct } from "@/components/SortableProduct";
import { SaveModal } from "@/components/SaveModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "@/components/Toast";
import { useCollectionStore } from "@/lib/store";
import { apiGetProducts, apiGetFilters } from "@/lib/api";
import type { ApiResponse, ProductListData, Filter, AdditionalFilter } from "@/lib/types";

export default function CollectionEditPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const collectionId = Number(params.id);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const {
    products,
    productsMeta,
    productsLoading,
    productsError,
    reorderedProducts,
    filters,
    filtersLoading,
    activeFilters,
    setProducts,
    setProductsLoading,
    setProductsError,
    setReorderedProducts,
    resetReorderedProducts,
    setFilters,
    setFiltersLoading,
    addActiveFilter,
    removeActiveFilter,
    clearActiveFilters,
  } = useCollectionStore();

  // 8px distance prevents accidental drags when clicking
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchProducts = useCallback(async () => {
    if (!session?.accessToken) return;

    setProductsLoading(true);
    setProductsError(null);

    try {
      const response: ApiResponse<ProductListData> = await apiGetProducts(
        session.accessToken,
        collectionId,
        activeFilters,
        currentPage,
        36
      );

      if (response.status === 200 && response.data) {
        setProducts(response.data.data, response.data.meta);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Urunler yuklenemedi";
      setProductsError(errorMessage);
      toast.error("Hata", errorMessage);
    } finally {
      setProductsLoading(false);
    }
  }, [session?.accessToken, collectionId, activeFilters, currentPage, setProducts, setProductsLoading, setProductsError]);

  const fetchFilters = useCallback(async () => {
    if (!session?.accessToken) return;

    setFiltersLoading(true);

    try {
      const response: ApiResponse<Filter[]> = await apiGetFilters(
        session.accessToken,
        collectionId
      );

      if (response.status === 200 && response.data) {
        setFilters(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    } finally {
      setFiltersLoading(false);
    }
  }, [session?.accessToken, collectionId, setFilters, setFiltersLoading]);

  // Force logout when refresh token fails
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      toast.error("Oturum Suresi Doldu", "Lutfen tekrar giris yapin.");
      signOut({ callbackUrl: "/login" });
    }
  }, [session?.error]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = reorderedProducts.findIndex(
        (p) => `${p.productCode}-${p.colorCode}` === active.id
      );
      const newIndex = reorderedProducts.findIndex(
        (p) => `${p.productCode}-${p.colorCode}` === over.id
      );

      setReorderedProducts(arrayMove(reorderedProducts, oldIndex, newIndex));
    }
  };

  const handleFilterChange = (filter: AdditionalFilter) => {
    addActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleFilterRemove = (filterId: string, value: string) => {
    removeActiveFilter(filterId, value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    clearActiveFilters();
    setCurrentPage(1);
  };

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelDialog(true);
    } else {
      router.push("/collections");
    }
  };

  const handleConfirmCancel = () => {
    resetReorderedProducts();
    clearActiveFilters();
    toast.info("Iptal Edildi", "Degisiklikler kaydedilmedi.");
    router.push("/collections");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const hasChanges =
    JSON.stringify(products) !== JSON.stringify(reorderedProducts);

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Header title="Koleksiyon Duzenle" subtitle={`Koleksiyon #${collectionId}`} />

      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/collections" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Koleksiyonlar
              </Link>
              <svg className="w-4 h-4 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-[var(--text-primary)] font-medium">Sabitleri Duzenle</span>
              {hasChanges && (
                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  Degisiklikler var
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--border-color)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtreler
                {activeFilters.length > 0 && (
                  <span className="w-5 h-5 bg-[var(--accent-primary)] text-[var(--bg-primary)] text-xs rounded-full flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>

              <button onClick={handleCancel} className="btn-secondary">
                Vazgec
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <FilterPanel
                filters={filters}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onFilterRemove={handleFilterRemove}
                onClearFilters={handleClearFilters}
                loading={filtersLoading}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="card p-5 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">Koleksiyon Urunleri</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {productsMeta?.totalProduct ?? 0} urun bulundu
                    {activeFilters.length > 0 && (
                      <span className="ml-1">({activeFilters.length} filtre aktif)</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg">
                  <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-[var(--text-secondary)]">Urunleri surukleyerek siralayin</span>
                </div>
              </div>
            </div>

            {productsLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-3 border-[var(--border-color)] rounded-full animate-spin border-t-[var(--accent-primary)]"></div>
                <p className="mt-4 text-[var(--text-secondary)]">Urunler yukleniyor...</p>
              </div>
            )}

            {productsError && (
              <div className="card p-6 border-[var(--error)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[var(--error)] font-medium">Urunler yuklenemedi</h3>
                    <p className="text-[var(--text-secondary)] text-sm">{productsError}</p>
                  </div>
                </div>
              </div>
            )}

            {!productsLoading && !productsError && (
              <>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={reorderedProducts.map((p) => `${p.productCode}-${p.colorCode}`)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                      {reorderedProducts.map((product, index) => (
                        <SortableProduct
                          key={`${product.productCode}-${product.colorCode}`}
                          product={product}
                          index={index}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                {productsMeta && Math.ceil(productsMeta.totalProduct / productsMeta.pageSize) > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 card p-4">
                    <p className="text-sm text-[var(--text-secondary)]">
                      Sayfa {currentPage} / {Math.ceil(productsMeta.totalProduct / productsMeta.pageSize)}
                    </p>
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {Array.from(
                        { length: Math.min(5, Math.ceil(productsMeta.totalProduct / productsMeta.pageSize)) },
                        (_, i) => {
                          const totalPages = Math.ceil(productsMeta.totalProduct / productsMeta.pageSize);
                          let page: number;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          return page;
                        }
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`pagination-btn ${page === currentPage ? "active" : ""}`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= Math.ceil(productsMeta.totalProduct / productsMeta.pageSize)}
                        className="pagination-btn"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                )}

                {reorderedProducts.length === 0 && (
                  <div className="card p-12 text-center">
                    <div className="w-20 h-20 mx-auto bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Urun bulunamadi</h3>
                    <p className="text-[var(--text-secondary)] mb-4">Secili filtrelere uygun urun bulunmamaktadir.</p>
                    {activeFilters.length > 0 && (
                      <button
                        onClick={handleClearFilters}
                        className="text-sm font-medium text-[var(--accent-primary)] hover:underline"
                      >
                        Filtreleri Temizle
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[var(--bg-primary)] shadow-xl animate-slideIn">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Filtreler</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto h-full pb-32">
              <FilterPanel
                filters={filters}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onFilterRemove={handleFilterRemove}
                onClearFilters={handleClearFilters}
                loading={filtersLoading}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
              <button onClick={() => setShowMobileFilters(false)} className="btn-primary w-full">
                Uygula ({productsMeta?.totalProduct ?? 0} urun)
              </button>
            </div>
          </div>
        </div>
      )}

      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        collectionId={collectionId}
        products={reorderedProducts}
      />

      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleConfirmCancel}
        title="Kaydedilmemis Degisiklikler"
        message="Yaptiginiz degisiklikler kaydedilmedi. Cikmak istediginizden emin misiniz?"
        confirmText="Evet, Cik"
        cancelText="Devam Et"
        variant="warning"
      />
    </div>
  );
}
