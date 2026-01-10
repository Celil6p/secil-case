"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/types";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: number;
  products: Product[];
}

export function SaveModal({
  isOpen,
  onClose,
  collectionId,
  products,
}: SaveModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const requestPayload = {
    collectionId,
    products: products.map((p, index) => ({
      productCode: p.productCode,
      colorCode: p.colorCode,
      position: index + 1,
    })),
  };

  const payloadString = JSON.stringify(requestPayload, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className="relative bg-[var(--bg-primary)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-fadeIn border border-[var(--border-color)]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[var(--border-color)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--success)]/15 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Kaydet - Request Payload
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Koleksiyon ID: {collectionId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 overflow-y-auto max-h-[55vh]">
            {/* Info Banner */}
            <div className="bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-xl p-4 mb-5 flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-[var(--warning)]">Demo Modu</p>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  Bu demo uygulamada kaydetme islemi yapilmayacaktir. Asagidaki JSON payload&apos;i API&apos;ye gonderilecek veriyi gostermektedir.
                </p>
              </div>
            </div>

            {/* JSON Payload */}
            <div className="relative">
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] text-xs font-medium rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Kopyalandi
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Kopyala
                    </>
                  )}
                </button>
              </div>
              <div className="bg-[#0d1117] rounded-xl p-5 overflow-x-auto border border-[var(--border-color)]">
                <pre className="text-sm text-[#c9d1d9] font-mono whitespace-pre-wrap">
                  {payloadString}
                </pre>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-color)]">
                <p className="text-sm text-[var(--text-secondary)] mb-1">Toplam Urun</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{products.length}</p>
              </div>
              <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-color)]">
                <p className="text-sm text-[var(--text-secondary)] mb-1">Koleksiyon ID</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{collectionId}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex justify-end">
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
