import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { formatDateDisplay } from '../lib/date';

const ProductLotesModal = ({ open, product, lotes = [], loading, onClose }) => {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" onClick={onClose}>
      <div
        className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Lotes disponibles</p>
              <h3 className="mt-2 font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">
                {product?.nombre || 'Producto'}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{product?.laboratorio || 'Sin laboratorio'}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              aria-label="Cerrar modal de lotes"
            >
              X
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 sm:px-8">
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">Cargando lotes...</div>
          ) : lotes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <p className="font-semibold text-slate-700">No hay lotes con stock disponible.</p>
              <p className="mt-2 text-sm text-slate-500">Este producto no tiene unidades activas por lote para mostrar en esta vista.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lotes.map((lote) => (
                <div
                  key={lote.lote}
                  className="grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto]"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Lote</p>
                    <p className="mt-1 font-['var(--font-heading)'] text-2xl font-bold text-slate-900">{lote.lote}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Vencimiento</p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">{formatDateDisplay(lote.vencimiento)}</p>
                  </div>
                  <div className="flex items-center sm:justify-end">
                    <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Stock</p>
                      <p className="mt-1 font-['var(--font-heading)'] text-3xl font-bold text-emerald-700">{lote.stock}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductLotesModal;
