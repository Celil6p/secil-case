"use client";

import { useEffect, useState, useRef, memo } from "react";
import Image from "next/image";
import { apiGetProducts } from "@/lib/api";
import type { Collection, Product, ApiResponse, ProductListData } from "@/lib/types";

interface CollectionCardProps {
  collection: Collection;
  onEditClick: (id: number) => void;
  accessToken: string;
}

function CollectionCard({ collection, onEditClick, accessToken }: CollectionCardProps) {
  const [previewImages, setPreviewImages] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch once per collection
    if (hasFetchedRef.current || !accessToken) return;

    const fetchPreviewImages = async () => {
      try {
        const response: ApiResponse<ProductListData> = await apiGetProducts(
          accessToken,
          collection.id,
          [],
          1,
          4
        );

        if (response.status === 200 && response.data?.data) {
          setPreviewImages(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch preview images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewImages();
    hasFetchedRef.current = true;
  }, [accessToken, collection.id]);

  return (
    <div className="card overflow-hidden card-hover">
      {/* Collection Preview Images */}
      <div className="relative h-52 bg-[var(--bg-tertiary)] overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--border-color)] border-t-[var(--accent-primary)] rounded-full animate-spin"></div>
          </div>
        ) : previewImages.length > 0 ? (
          <div className="grid grid-cols-2 h-full">
            {previewImages.map((product, idx) => (
              <div
                key={`${product.productCode}-${product.colorCode}`}
                className="relative overflow-hidden group"
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name || "Product"}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  sizes="200px"
                />
              </div>
            ))}
            {/* Fill empty slots if less than 4 images */}
            {previewImages.length < 4 &&
              Array.from({ length: 4 - previewImages.length }).map((_, idx) => (
                <div key={`empty-${idx}`} className="bg-[var(--bg-tertiary)]" />
              ))
            }
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-[var(--text-tertiary)]">Urun bulunamadi</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Collection Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 line-clamp-1">
          {collection.info.name}
        </h3>
        <div
          className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 min-h-[40px]"
          dangerouslySetInnerHTML={{
            __html: collection.info.description || "<p>Aciklama yok</p>",
          }}
        />

        {/* Filters Preview */}
        {collection.filters.filters && collection.filters.filters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {collection.filters.filters.slice(0, 2).map((filter, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
              >
                {filter.valueName}
              </span>
            ))}
            {collection.filters.filters.length > 2 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]">
                +{collection.filters.filters.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onEditClick(collection.id)}
          className="btn-primary w-full flex items-center justify-center gap-2 group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Sabitleri Duzenle
        </button>
      </div>
    </div>
  );
}

// Memoize to prevent re-renders on theme change, resize, etc.
export default memo(CollectionCard, (prevProps, nextProps) => {
  return (
    prevProps.collection.id === nextProps.collection.id &&
    prevProps.onEditClick === nextProps.onEditClick &&
    prevProps.accessToken === nextProps.accessToken
  );
});
