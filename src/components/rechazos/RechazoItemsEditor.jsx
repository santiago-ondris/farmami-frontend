import React from 'react';
import RechazoItemRow from './RechazoItemRow';

const RechazoItemsEditor = ({ items, onAddItem, onChangeItem, onRemoveItem }) => {
  return (
    <section className="space-y-4 border-t border-gray-100 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Productos Rechazados</h2>
          <p className="text-sm text-gray-500">Agrega los productos, lotes y motivos de este rechazo.</p>
        </div>
        <button type="button" onClick={onAddItem} className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50">
          Agregar producto
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <RechazoItemRow
            key={`item-${index}`}
            index={index}
            item={item}
            canRemove={items.length > 1}
            onChange={onChangeItem}
            onRemove={onRemoveItem}
          />
        ))}
      </div>
    </section>
  );
};

export default RechazoItemsEditor;
