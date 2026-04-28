import React from 'react';
import { Link } from 'react-router-dom';

const StockWarningModal = ({
  open,
  title = 'Stock en negativo',
  description,
  warnings = [],
  onConfirm,
  onClose,
  detailLink
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
          !
        </div>
        <h3 className="mb-2 font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">{title}</h3>
        <p className="mb-4 text-sm text-gray-600">{description}</p>

        {warnings.length > 0 ? (
          <div className="mb-5 space-y-2 rounded border border-red-100 bg-red-50 p-3">
            {warnings.map((warning, index) => (
              <div key={`${warning.product_id}-${index}`} className="text-sm text-red-800">
                <div className="font-semibold">{warning.producto}</div>
                <div className="text-xs">
                  Stock actual: {warning.stock_actual} · Cantidad solicitada: {warning.cantidad_solicitada} · Resultante: {warning.stock_resultante}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="space-y-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded bg-[var(--color-action)] px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Continuar de todos modos
          </button>
          {detailLink ? (
            <Link
              to={detailLink}
              className="block w-full rounded border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Ver historial de este artículo
            </Link>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-sm font-semibold text-gray-500 hover:underline"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockWarningModal;
