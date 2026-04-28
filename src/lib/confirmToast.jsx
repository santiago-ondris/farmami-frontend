import toast from 'react-hot-toast';

export function confirmToast({
  title = 'Confirmar acción',
  description = '',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'danger'
}) {
  return new Promise((resolve) => {
    toast((toastInstance) => (
      <div className="flex max-w-sm flex-col gap-3 p-1">
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          {description ? <p className="mt-1 text-xs text-gray-500">{description}</p> : null}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              toast.dismiss(toastInstance.id);
              resolve(false);
            }}
            className="rounded border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              toast.dismiss(toastInstance.id);
              resolve(true);
            }}
            className={`rounded px-3 py-1 text-xs font-bold text-white ${tone === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-[var(--color-primary)] hover:opacity-90'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center'
    });
  });
}
