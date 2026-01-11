"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Product, OrderChange } from "@/lib/types";
import { useCollectionStore } from "@/lib/store";
import { toast } from "@/components/Toast";

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
  const { orderChanges, clearOrderChanges } = useCollectionStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

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

  const allOrderChanges = Object.values(orderChanges);

  const productsWithChanges = allOrderChanges.map((change) => ({
    productCode: change.productCode,
    colorCode: change.colorCode,
    position: change.newOrder,
  }));

  productsWithChanges.sort((a, b) => a.position - b.position);

  const requestPayload = {
    collectionId,
    products: productsWithChanges,
  };

  const totalChanges = allOrderChanges.length;

  const payloadString = JSON.stringify(requestPayload, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(payloadString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!session?.accessToken) {
      toast.error("Hata", "Oturum bulunamadi. Lutfen tekrar giris yapin.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/collections/${collectionId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      const result = await response.json();

      if (response.ok && result.status === 200) {
        toast.success("Başarılı", `${totalChanges} urun siralamasi kaydedildi.`);
        // Clear order changes after successful save
        clearOrderChanges();
        // Redirect to collections page after successful save
        router.push("/collections");
      } else {
        toast.error("Hata", result.message || "Kaydetme islemi basarisiz.");
      }
    } catch (error) {
      console.error("[SaveModal] Save error:", error);
      toast.error("Hata", "Bir hata olustu. Lutfen tekrar deneyin.");
    } finally {
      setIsSaving(false);
    }
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
                  Kaydet - Sira Siralamasi
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Koleksiyon ID: {collectionId} • {totalChanges} degisiklik
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
            <div className="bg-[var(--info)]/10 border border-[var(--info)]/30 rounded-xl p-4 mb-5 flex items-start gap-3">
              <svg className="w-5 h-5 text-[var(--info)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-[var(--info)]">Bilgi - Case Notu ile Ilgili Kesif</p>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  Case dokumaninda "Kaydetme islemi yapilmayacaktir" deniyor ancak <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-xs">/api/collections/&#123;id&#125;/save</code> endpoint'i gercekten var ve 200 donuyor. Endpoint basarili yanit donuyor ama koleksiyon siralamasi gercekten degismiyor.
                </p>
              </div>
            </div>

            {/* JSON Payload */}
            <div className="relative">
              <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
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
                <p className="text-sm text-[var(--text-secondary)] mb-1">Degisen Urun</p>
                <p className="text-2xl font-bold text-[var(--accent-primary)]">{totalChanges}</p>
              </div>
              <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-color)]">
                <p className="text-sm text-[var(--text-secondary)] mb-1">Koleksiyon ID</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{collectionId}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex justify-end gap-3">
            <button
              onClick={onClose}
              className="btn-secondary"
              disabled={isSaving}
            >
              Iptal
            </button>
            <button
              onClick={handleSave}
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v8m0 0l4-4m4 4l4-4m4 4V4" />
                  </svg>
                  Kaydediliyor...
                </>
              ) : (
                "Kaydet"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
