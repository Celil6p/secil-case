"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { CollectionCard } from "@/components/CollectionCard";
import { CollectionListItem } from "@/components/CollectionListItem";
import { useCollectionStore } from "@/lib/store";
import { apiGetCollections } from "@/lib/api";
import type { CollectionListResponse } from "@/lib/types";

export default function CollectionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    collections,
    collectionsMeta,
    collectionsLoading,
    collectionsError,
    setCollections,
    setCollectionsLoading,
    setCollectionsError,
  } = useCollectionStore();

  useEffect(() => {
    const fetchCollections = async () => {
      if (!session?.accessToken) return;

      setCollectionsLoading(true);
      setCollectionsError(null);

      try {
        const response: CollectionListResponse = await apiGetCollections(
          session.accessToken,
          currentPage
        );
        setCollections(response.data, response.meta);
      } catch (error) {
        setCollectionsError(
          error instanceof Error ? error.message : "Koleksiyonlar yuklenemedi"
        );
      } finally {
        setCollectionsLoading(false);
      }
    };

    fetchCollections();
  }, [session?.accessToken, currentPage, setCollections, setCollectionsLoading, setCollectionsError]);

  const handleEditClick = (collectionId: number) => {
    router.push(`/collections/${collectionId}/edit`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Header title="Koleksiyonlar" subtitle="Koleksiyon listesi ve yonetimi" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Koleksiyonlar</h2>
            <p className="mt-1 text-[var(--text-secondary)]">
              {collectionsMeta?.totalCount || 0} koleksiyon bulundu
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="view-toggle">
              <button
                onClick={() => setViewMode("grid")}
                className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {collectionsLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-3 border-[var(--border-color)] rounded-full animate-spin border-t-[var(--accent-primary)]"></div>
            <p className="mt-4 text-[var(--text-secondary)]">Koleksiyonlar yukleniyor...</p>
          </div>
        )}

        {collectionsError && (
          <div className="card p-6 border-[var(--error)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[var(--error)] font-medium">Bir hata olustu</h3>
                <p className="text-[var(--text-secondary)] text-sm">{collectionsError}</p>
              </div>
            </div>
          </div>
        )}

        {!collectionsLoading && !collectionsError && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection, index) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onEditClick={handleEditClick}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="table-container">
                <table className="w-full">
                  <thead>
                    <tr className="table-header">
                      <th className="px-6 py-4 text-left text-sm font-medium text-[var(--text-secondary)]">
                        Koleksiyon
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[var(--text-secondary)] hidden md:table-cell">
                        Tip
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[var(--text-secondary)] hidden lg:table-cell">
                        Filtreler
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-[var(--text-secondary)]">
                        Islem
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map((collection) => (
                      <CollectionListItem
                        key={collection.id}
                        collection={collection}
                        onEditClick={handleEditClick}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {collectionsMeta && collectionsMeta.totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-[var(--text-secondary)]">
                  Toplam {collectionsMeta.totalCount} koleksiyondan {((currentPage - 1) * collectionsMeta.pageSize) + 1} - {Math.min(currentPage * collectionsMeta.pageSize, collectionsMeta.totalCount)} arasi gosteriliyor
                </p>
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!collectionsMeta.hasPreviousPage}
                    className="pagination-btn disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {Array.from({ length: collectionsMeta.totalPages }, (_, i) => i + 1).map((page) => (
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
                    disabled={!collectionsMeta.hasNextPage}
                    className="pagination-btn disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}

            {collections.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">Koleksiyon bulunamadi</h3>
                <p className="text-[var(--text-secondary)]">Henuz hic koleksiyon eklenmemis.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
