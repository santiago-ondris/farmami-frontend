import toast from 'react-hot-toast';

export function confirmToast({
  title = 'Confirmar accion',
  description = '',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'danger'
}) {
  return new Promise((resolve) => {
    toast(
      (toastInstance) => (
        <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${tone === 'danger' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-[var(--color-primary)]'}`}>
              {tone === 'danger' ? '!' : '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              {description ? <p className="mt-1 text-sm leading-5 text-gray-500">{description}</p> : null}
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                toast.dismiss(toastInstance.id);
                resolve(false);
              }}
              className="secondary-button !px-4 !py-2 !text-xs"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(toastInstance.id);
                resolve(true);
              }}
              className={`${tone === 'danger' ? 'danger-button' : 'primary-button'} !px-4 !py-2 !text-xs`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center'
      }
    );
  });
}
