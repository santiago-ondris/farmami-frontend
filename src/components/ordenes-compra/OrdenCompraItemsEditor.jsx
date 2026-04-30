import React from 'react';
import OrdenCompraItemRow from './OrdenCompraItemRow';

const OrdenCompraItemsEditor = ({ items, onAddItem, onChangeItem, onRemoveItem, importeTotal }) => {
  return (
    <section className="space-y-4 border-t border-gray-100 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Items</h2>
          <p className="text-sm text-gray-500">Cada item calcula su importe automaticamente.</p>
        </div>
        <button type="button" onClick={onAddItem} className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50">
          Agregar item
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <OrdenCompraItemRow
            key={`item-${index}`}
            index={index}
            item={item}
            canRemove={items.length > 1}
            onChange={onChangeItem}
            onRemove={onRemoveItem}
          />
        ))}
      </div>

      <div className="flex justify-end border-t border-gray-100 pt-4">
        <div className="rounded-lg bg-gray-50 px-5 py-4 text-right">
          <div className="text-xs font-bold uppercase text-gray-500">Importe total</div>
          <div className="text-2xl font-bold text-[var(--color-primary)]">{importeTotal.toFixed(2)}</div>
        </div>
      </div>
    </section>
  );
};

export default OrdenCompraItemsEditor;
