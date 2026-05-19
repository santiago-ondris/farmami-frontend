import React from 'react';

const OPTION_STYLES = {
  NUEVO: 'border-[var(--color-accent)] bg-[rgba(56,178,172,0.08)]',
  EXISTENTE: 'border-[var(--color-primary)] bg-[rgba(45,55,72,0.06)]'
};

const PresupuestoTipoModal = ({ open, onSelect, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl">
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Nuevo presupuesto</p>
          <h2 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">Elegir cliente</h2>
          <p className="mt-2 text-sm text-gray-500">Indica si el presupuesto es para un cliente nuevo o para un cliente ya cargado.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => onSelect('NUEVO')}
            className={`rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 ${OPTION_STYLES.NUEVO}`}
          >
            <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">Cliente nuevo</div>
            <div className="mt-2 font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Cargar datos manualmente</div>
            <p className="mt-2 text-sm leading-6 text-gray-600">No crea un cliente nuevo. Solo completa nombre, direccion, contacto y localidad para este presupuesto.</p>
          </button>

          <button
            type="button"
            onClick={() => onSelect('EXISTENTE')}
            className={`rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 ${OPTION_STYLES.EXISTENTE}`}
          >
            <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">Cliente existente</div>
            <div className="mt-2 font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Buscar cliente cargado</div>
            <p className="mt-2 text-sm leading-6 text-gray-600">Permite elegir un cliente ya registrado para usar sus datos en el presupuesto.</p>
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onCancel} className="secondary-button">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default PresupuestoTipoModal;
