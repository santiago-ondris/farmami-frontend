import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import DateField from '../../components/DateField';
import { handleFormInvalid } from '../../lib/validation';
import { confirmToast } from '../../lib/confirmToast';
import { formatDateDisplay, formatDateInputValue } from '../../lib/date';

const DetalleEgresoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [egreso, setEgreso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchEgreso();
  }, [id]);

  const fetchEgreso = async () => {
    try {
      const { data } = await api.get(`/api/egresos/${id}`);
      setEgreso(data);
      setFormData({
        lote: data.lote,
        fecha_entrega: formatDateInputValue(data.fecha_entrega),
        cantidad: data.cantidad,
        empresa_solicitante: data.empresa_solicitante,
        vencimiento: formatDateInputValue(data.vencimiento),
        serial: data.serial || '',
        orden_compra: data.orden_compra || '',
        estado_remito: data.estado_remito
      });
    } catch (error) {
      if (error.response?.status === 404) navigate('/egresos');
      else toast.error('No se pudo cargar el egreso');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        fecha_entrega: formData.fecha_entrega,
        vencimiento: formData.vencimiento,
        cantidad: parseInt(formData.cantidad, 10)
      };
      await api.patch(`/api/egresos/${id}`, payload);
      toast.success('Egreso actualizado');
      setIsEditing(false);
      fetchEgreso();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al actualizar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirmToast({
      title: 'Eliminar egreso',
      description: 'Esta accion no se puede deshacer.',
      confirmLabel: 'Eliminar'
    });

    if (!confirmed) return;

    try {
      await api.delete(`/api/egresos/${id}`);
      toast.success('Egreso eliminado');
      navigate('/egresos');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!egreso) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Movimiento de stock</p>
          <h1 className="section-title">{isEditing ? 'Editar egreso' : 'Detalle de egreso'}</h1>
        </div>
        <Link to="/egresos" className="ghost-link">Volver a lista</Link>
      </div>

      <section className="panel p-6">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Producto</p>
            <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">{egreso.product?.nombre}</h2>
            <p className="mt-1 text-sm text-gray-500">Laboratorio: {egreso.product?.laboratorio}</p>
          </div>
          <div>
            <span className="detail-item-label">Estado remito</span>
            <span className={`status-chip ${egreso.estado_remito === 'Pendiente' ? 'bg-amber-100 text-amber-800' : egreso.estado_remito === 'Entregado' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
              {egreso.estado_remito}
            </span>
          </div>
        </div>

        {!isEditing ? (
          <div>
            <div className="detail-grid md:grid-cols-2">
              <div className="detail-item"><span className="detail-item-label">ID registro</span>{egreso.id}</div>
              <div className="detail-item"><span className="detail-item-label">Fecha de entrega</span>{formatDateDisplay(egreso.fecha_entrega)}</div>
              <div className="detail-item"><span className="detail-item-label">Cantidad</span><span className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-action)]">{egreso.cantidad}</span></div>
              <div className="detail-item"><span className="detail-item-label">Empresa solicitante</span>{egreso.empresa_solicitante}</div>
              <div className="detail-item"><span className="detail-item-label">Lote</span>{egreso.lote}</div>
              <div className="detail-item"><span className="detail-item-label">Vencimiento lote</span>{formatDateDisplay(egreso.vencimiento)}</div>
              <div className="detail-item"><span className="detail-item-label">Serial</span>{egreso.serial || '-'}</div>
              <div className="detail-item"><span className="detail-item-label">Orden de compra</span>{egreso.orden_compra || '-'}</div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
              <button onClick={() => setIsEditing(true)} className="primary-button cursor-pointer">Editar informacion</button>
              <button onClick={handleDelete} className="danger-button cursor-pointer">Eliminar egreso</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} onInvalid={handleFormInvalid} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="field-label">Fecha entrega</label>
                <DateField value={formData.fecha_entrega} onChange={(value) => setFormData((prev) => ({ ...prev, fecha_entrega: value }))} />
              </div>
              <div>
                <label className="field-label">Empresa solicitante</label>
                <input required type="text" name="empresa_solicitante" value={formData.empresa_solicitante} onChange={handleChange} className="field-input" />
              </div>
              <div>
                <label className="field-label">Lote</label>
                <input required type="text" name="lote" value={formData.lote} onChange={handleChange} className="field-input" />
              </div>
              <div>
                <label className="field-label">Vencimiento</label>
                <DateField value={formData.vencimiento} onChange={(value) => setFormData((prev) => ({ ...prev, vencimiento: value }))} />
              </div>
              <div>
                <label className="field-label">Cantidad</label>
                <input required type="number" min="1" name="cantidad" value={formData.cantidad} onChange={handleChange} className="field-input" />
              </div>
              <div>
                <label className="field-label">Estado remito</label>
                <select name="estado_remito" value={formData.estado_remito} onChange={handleChange} className="field-input">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="field-label">Serial</label>
                <input type="text" name="serial" value={formData.serial} onChange={handleChange} className="field-input" />
              </div>
              <div>
                <label className="field-label">Orden compra</label>
                <input type="text" name="orden_compra" value={formData.orden_compra} onChange={handleChange} className="field-input" />
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

export default DetalleEgresoPage;
