"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { apiGetProducts } from "@/lib/api";
import type { Collection, Product, ApiResponse, ProductListData } from "@/lib/types";

interface CollectionListItemProps {
  collection: Collection;
  onEditClick: (id: number) => void;
}

export function CollectionListItem({ collection, onEditClick }: CollectionListItemProps) {
  const { data: session } = useSession();
  const [previewImage, setPreviewImage] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreviewImage = async () => {
      if (!session?.accessToken) return;

      try {
        const response: ApiResponse<ProductListData> = await apiGetProducts(
          session.accessToken,
          collection.id,
          [],
          1,
          1
        );

        if (response.status === 200 && response.data?.data?.[0]) {
          setPreviewImage(response.data.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch preview image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewImage();
  }, [session?.accessToken, collection.id]);

  return (
    <tr className="hover:bg-[var(--bg-secondary)] transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[var(--bg-tertiary)] flex-shrink-0 overflow-hidden relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-[var(--border-color)] border-t-[var(--accent-primary)] rounded-full animate-spin"></div>
              </div>
            ) : previewImage ? (
              <Image
                src={previewImage.imageUrl}
                alt={collection.info.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--bg-tertiary)]">
                <svg className="w-6 h-6 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-[var(--text-primary)]">{collection.info.name}</p>
            <p className="text-sm text-[var(--text-secondary)]">ID: {collection.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 hidden md:table-cell">
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
          collection.type === 0
            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
            : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
        }`}>
          {collection.type === 0 ? "Manuel" : "Dinamik"}
        </span>
      </td>
      <td className="px-6 py-4 hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
          {collection.filters.filters?.slice(0, 3).map((filter, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs text-[var(--text-secondary)]">
              {filter.valueName}
            </span>
          ))}
          {collection.filters.filters && collection.filters.filters.length > 3 && (
            <span className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs text-[var(--text-tertiary)]">
              +{collection.filters.filters.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onEditClick(collection.id)}
          className="btn-primary inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="hidden sm:inline">Duzenle</span>
        </button>
      </td>
    </tr>
  );
}
