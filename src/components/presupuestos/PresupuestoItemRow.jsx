import React from 'react';

const formatMoney = (value) => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS'
}).format(Number(value || 0));

const PresupuestoItemRow = ({ index, item, canRemove, onChange, onRemove }) => {
  const total = Number(item.cantidad || 0) * Number(item.precio_unitario || 0);

  return (
    <div className="grid gap-4 rounded border border-gray-100 p-4 lg:grid-cols-[80px_1.9fr_120px_170px_170px_56px]">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Item</label>
        <input value={index + 1} readOnly className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-center outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Descripcion</label>
        <input
          required
          value={item.descripcion}
          onChange={(event) => onChange(index, 'descripcion', event.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Cantidad</label>
        <input
          required
          min="1"
          type="number"
          value={item.cantidad}
          onChange={(event) => onChange(index, 'cantidad', event.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Precio unitario</label>
        <input
          required
          min="0.01"
          step="0.01"
          type="number"
          value={item.precio_unitario}
          onChange={(event) => onChange(index, 'precio_unitario', event.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Total</label>
        <input value={formatMoney(total)} readOnly className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 outline-none" />
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

export default PresupuestoItemRow;
