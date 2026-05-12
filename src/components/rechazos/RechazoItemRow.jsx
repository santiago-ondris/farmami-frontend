import React from 'react';
import ProductAutocomplete from '../ProductAutocomplete';

const RechazoItemRow = ({ index, item, canRemove, onChange, onRemove }) => {
  return (
    <div className="grid gap-4 rounded border border-gray-100 p-4 lg:grid-cols-[1fr_150px_120px_2fr_56px]">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Producto *</label>
        <ProductAutocomplete 
          value={item.product_id} 
          onChange={(productId) => onChange(index, 'product_id', productId)} 
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Lote *</label>
        <input
          required
          name={`lote_${index}`}
          value={item.lote}
          onChange={(event) => onChange(index, 'lote', event.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Cantidad *</label>
        <input
          required
          min="1"
          type="number"
          name={`cantidad_${index}`}
          value={item.cantidad}
          onChange={(event) => onChange(index, 'cantidad', event.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Motivo de rechazo *</label>
        <input
          required
          name={`motivo_rechazo_${index}`}
          value={item.motivo_rechazo}
          onChange={(event) => onChange(index, 'motivo_rechazo', event.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
        />
      </div>
      <div className="flex items-end">
        <button
          type="button"
          disabled={!canRemove}
          onClick={() => onRemove(index)}
          className="w-full rounded border border-red-200 px-3 py-2 text-sm font-semibold text-[var(--color-action)] hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default RechazoItemRow;
