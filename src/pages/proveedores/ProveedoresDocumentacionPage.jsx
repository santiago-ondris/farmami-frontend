import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import ProveedorAutocomplete from '../../components/ProveedorAutocomplete';
import { PROVEEDOR_DOCUMENTACION_FIELDS } from '../../lib/proveedoresDocumentacion';

const EMPTY_DOCUMENTACION = PROVEEDOR_DOCUMENTACION_FIELDS.reduce((acc, field) => {
  acc[field.key] = false;
  return acc;
}, {});

const ProveedoresDocumentacionPage = () => {
  const [proveedorId, setProveedorId] = useState('');
  const [proveedor, setProveedor] = useState(null);
  const [documentacion, setDocumentacion] = useState(EMPTY_DOCUMENTACION);
  const [loadingProveedor, setLoadingProveedor] = useState(false);
  const [saving, setSaving] = useState(false);

  const documentosPresentados = useMemo(
    () => PROVEEDOR_DOCUMENTACION_FIELDS.filter((field) => documentacion[field.key]).length,
    [documentacion]
  );

  const handleSelectProveedor = async (id) => {
    setProveedorId(id);

    if (!id) {
      setProveedor(null);
      setDocumentacion(EMPTY_DOCUMENTACION);
      return;
    }

    setLoadingProveedor(true);
    try {
      const { data } = await api.get(`/api/proveedores/${id}`);
      setProveedor(data);
      setDocumentacion({
        habilitacion_jurisdiccion_provincial: Boolean(data.habilitacion_jurisdiccion_provincial),
        ultima_resolucion_djf: Boolean(data.ultima_resolucion_djf),
        certificado_habilitacion_anmat: Boolean(data.certificado_habilitacion_anmat),
        disposicion_habilitacion_anmat: Boolean(data.disposicion_habilitacion_anmat),
        constancia_afip: Boolean(data.constancia_afip),
        habilitacion_municipal: Boolean(data.habilitacion_municipal)
      });
    } catch (error) {
      toast.error('No se pudo cargar el proveedor');
      setProveedor(null);
      setDocumentacion(EMPTY_DOCUMENTACION);
    } finally {
      setLoadingProveedor(false);
    }
  };

  const handleToggle = (key) => {
    setDocumentacion((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    if (!proveedorId) return;

    setSaving(true);
    try {
      const payload = {
        ...documentacion,
        documentacion_completa: PROVEEDOR_DOCUMENTACION_FIELDS.every((field) => documentacion[field.key])
      };
      const { data } = await api.patch(`/api/proveedores/${proveedorId}`, payload);
      setProveedor((prev) => (prev ? { ...prev, ...data } : prev));
      toast.success('Documentacion actualizada');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar documentacion');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Proveedores / Documentacion</p>
          <h1 className="section-title">Control documental</h1>
          <p className="section-subtitle mt-2">Busca un proveedor, marca la documentacion disponible y guarda el estado operativo.</p>
        </div>
      </div>

      <section className="panel overflow-hidden">
        <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#f8fafc_0%,#eef6ff_100%)] px-5 py-5 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Busqueda</p>
          <div className="mt-3 max-w-2xl">
            <ProveedorAutocomplete value={proveedorId} onChange={handleSelectProveedor} />
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {loadingProveedor ? (
            <div className="py-10 text-center text-sm text-gray-500">Cargando proveedor...</div>
          ) : !proveedor ? (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <p className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Selecciona un proveedor</p>
              <p className="mt-2 text-sm text-slate-500">Al elegirlo se habilita la tabla para marcar la documentacion disponible.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Proveedor seleccionado</p>
                  <h2 className="mt-2 font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">{proveedor.nombre}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {[proveedor.numero, proveedor.tipo].filter(Boolean).join(' - ') || 'Sin datos complementarios'}
                  </p>
                </div>
                <div className="rounded-3xl bg-emerald-50 px-5 py-4 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Documentos</p>
                  <div className="mt-1 font-['var(--font-heading)'] text-4xl font-bold text-emerald-700">
                    {documentosPresentados}/{PROVEEDOR_DOCUMENTACION_FIELDS.length}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-slate-200">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-left text-sm text-slate-600">
                      <th className="px-5 py-4 font-semibold">Documento</th>
                      <th className="px-5 py-4 text-center font-semibold">Disponible</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROVEEDOR_DOCUMENTACION_FIELDS.map((field) => (
                      <tr key={field.key} className="border-t border-slate-100">
                        <td className="px-5 py-4 font-medium text-slate-800">{field.label}</td>
                        <td className="px-5 py-4">
                          <label className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={documentacion[field.key]}
                              onChange={() => handleToggle(field.key)}
                              className="h-5 w-5 cursor-pointer rounded border-slate-300 accent-[var(--color-primary)]"
                            />
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="primary-button disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar documentacion'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProveedoresDocumentacionPage;
