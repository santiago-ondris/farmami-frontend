import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import DateField from '../../components/DateField';
import { handleFormInvalid } from '../../lib/validation';
import ProveedorAutocomplete from '../../components/ProveedorAutocomplete';
import { confirmToast } from '../../lib/confirmToast';
import { formatDateDisplay, formatDateInputValue } from '../../lib/date';

const DetalleIngresoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ingreso, setIngreso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchIngreso();
  }, [id]);

  const fetchIngreso = async () => {
    try {
      const { data } = await api.get(`/api/ingresos/${id}`);
      setIngreso(data);
      setFormData({
        nro_remito: data.nro_remito || '',
        lote: data.lote,
        proveedor_id: data.proveedor_id,
        fecha_ingreso: formatDateInputValue(data.fecha_ingreso),
        vencimiento: formatDateInputValue(data.vencimiento),
        cadena_frio: data.cadena_frio,
        cantidad: data.cantidad,
        observaciones: data.observaciones || ''
      });
    } catch (error) {
      if (error.response?.status === 404) navigate('/ingresos');
      else toast.error('No se pudo cargar el ingreso');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        fecha_ingreso: formData.fecha_ingreso,
        vencimiento: formData.vencimiento,
        cantidad: parseInt(formData.cantidad, 10)
      };
      await api.patch(`/api/ingresos/${id}`, payload);
      toast.success('Ingreso actualizado');
      setIsEditing(false);
      fetchIngreso();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al actualizar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirmToast({
      title: 'Eliminar ingreso',
      description: 'Esta accion no se puede deshacer.',
      confirmLabel: 'Eliminar'
    });

    if (!confirmed) return;

    try {
      await api.delete(`/api/ingresos/${id}`);
      toast.success('Ingreso eliminado');
      navigate('/ingresos');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!ingreso) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Movimiento de stock</p>
          <h1 className="section-title">{isEditing ? 'Editar ingreso' : 'Detalle de ingreso'}</h1>
        </div>
        <Link to="/ingresos" className="ghost-link">Volver a lista</Link>
      </div>

      <section className="panel p-6">
        <div className="mb-6 rounded-2xl border border-gray-100 bg-slate-50 px-5 py-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Producto</p>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">{ingreso.product?.nombre}</h2>
          <p className="mt-1 text-sm text-gray-500">Laboratorio: {ingreso.product?.laboratorio}</p>
        </div>

        {!isEditing ? (
          <div>
            <div className="detail-grid md:grid-cols-2">
              <div className="detail-item"><span className="detail-item-label">ID registro</span>{ingreso.id}</div>
              <div className="detail-item"><span className="detail-item-label">Fecha de ingreso</span>{formatDateDisplay(ingreso.fecha_ingreso)}</div>
              <div className="detail-item"><span className="detail-item-label">Nro de remito</span>{ingreso.nro_remito || '-'}</div>
              <div className="detail-item"><span className="detail-item-label">Lote</span>{ingreso.lote}</div>
              <div className="detail-item"><span className="detail-item-label">Vencimiento</span>{formatDateDisplay(ingreso.vencimiento)}</div>
              <div className="detail-item"><span className="detail-item-label">Proveedor</span>{ingreso.proveedor_rel?.nombre || ingreso.proveedor}</div>
              <div className="detail-item"><span className="detail-item-label">Cantidad</span><span className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">{ingreso.cantidad}</span></div>
              <div className="detail-item"><span className="detail-item-label">Cadena frio</span>{ingreso.cadena_frio ? 'Si' : 'No'}</div>
              {ingreso.observaciones && (
                <div className="detail-item md:col-span-2"><span className="detail-item-label">Observaciones</span><p className="whitespace-pre-wrap">{ingreso.observaciones}</p></div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
              <button onClick={() => setIsEditing(true)} className="primary-button cursor-pointer">Editar informacion</button>
              <button onClick={handleDelete} className="danger-button cursor-pointer">Eliminar ingreso</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} onInvalid={handleFormInvalid} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="field-label">Nro de remito</label>
                <input type="text" name="nro_remito" value={formData.nro_remito} onChange={handleChange} className="field-input" />
              </div>
              <div>
                <label className="field-label">Lote</label>
                <input required type="text" name="lote" value={formData.lote} onChange={handleChange} className="field-input" />
              </div>
              <div>
                <label className="field-label">Proveedor</label>
                <ProveedorAutocomplete value={formData.proveedor_id} onChange={(proveedorId) => setFormData((prev) => ({ ...prev, proveedor_id: proveedorId }))} />
              </div>
              <div>
                <label className="field-label">Fecha ingreso</label>
                <DateField value={formData.fecha_ingreso} onChange={(value) => setFormData((prev) => ({ ...prev, fecha_ingreso: value }))} />
              </div>
              <div>
                <label className="field-label">Vencimiento</label>
                <DateField value={formData.vencimiento} onChange={(value) => setFormData((prev) => ({ ...prev, vencimiento: value }))} />
              </div>
              <div>
                <label className="field-label">Cantidad</label>
                <input required type="number" min="1" name="cantidad" value={formData.cantidad} onChange={handleChange} className="field-input" />
              </div>
              <label className="checkbox-card flex items-center gap-3 text-sm">
                <input type="checkbox" id="cadena_frio_edit" name="cadena_frio" checked={formData.cadena_frio} onChange={handleChange} className="h-4 w-4 cursor-pointer" />
                <span>Requiere cadena frio</span>
              </label>
              <div className="md:col-span-2">
                <label className="field-label">Observaciones</label>
                <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} className="field-input" rows="3"></textarea>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setIsEditing(false)} className="secondary-button cursor-pointer">Cancelar</button>
              <button type="submit" disabled={isSaving} className="primary-button cursor-pointer disabled:opacity-50">{isSaving ? 'Guardando...' : 'Guardar cambios'}</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

export default DetalleIngresoPage;
