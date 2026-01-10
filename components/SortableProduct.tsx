"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Product } from "@/lib/types";
import Image from "next/image";

interface SortableProductProps {
  product: Product;
  index: number;
}

export function SortableProduct({ product, index }: SortableProductProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${product.productCode}-${product.colorCode}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group card overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging
          ? "shadow-2xl ring-2 ring-[var(--accent-primary)] border-[var(--accent-primary)]"
          : "hover:shadow-lg hover:border-[var(--border-color)]"
      }`}
    >
      
      <div className="relative aspect-[3/4] bg-[var(--bg-tertiary)] overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name || product.productCode}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        
        <div className="absolute top-3 left-3">
          <div className="w-8 h-8 rounded-full bg-[var(--bg-primary)]/95 backdrop-blur-sm shadow-sm flex items-center justify-center">
            <span className="text-sm font-bold text-[var(--text-primary)]">#{index + 1}</span>
          </div>
        </div>

        
        {product.outOfStock && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-[var(--error)] text-white text-xs font-medium rounded-full shadow-sm">
              Tukendi
            </span>
          </div>
        )}

        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <div className="px-3 py-1.5 bg-[var(--bg-primary)]/90 backdrop-blur-sm rounded-full shadow-sm flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span className="text-xs font-medium text-[var(--text-primary)]">Surukle</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="p-4">
        <p className="text-xs text-[var(--text-tertiary)] font-mono mb-1">{product.productCode}</p>
        {product.name && (
          <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-2 mb-2">
            {product.name}
          </p>
        )}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 bg-[var(--bg-tertiary)] rounded-md text-xs text-[var(--text-secondary)]">
            Renk: {product.colorCode}
          </span>
          {product.isSaleB2B && (
            <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-md text-xs text-green-700 dark:text-green-400">
              B2B
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
