import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { handleFormInvalid } from '../lib/validation';
import { confirmToast } from '../lib/confirmToast';

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
        fecha_entrega: data.fecha_entrega.split('T')[0],
        cantidad: data.cantidad,
        empresa_solicitante: data.empresa_solicitante,
        vencimiento: data.vencimiento.split('T')[0],
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
        fecha_entrega: new Date(formData.fecha_entrega).toISOString(),
        vencimiento: new Date(formData.vencimiento).toISOString(),
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
    <div className="max-w-3xl mx-auto space-y-6 font-['var(--font-body)']">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-['var(--font-heading)'] text-[var(--color-primary)]">
          {isEditing ? 'Editar Egreso' : 'Detalle de Egreso'}
        </h1>
        <Link to="/egresos" className="text-gray-500 hover:underline">Volver a lista</Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-100 flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-primary)] mb-1">Producto: {egreso.product?.nombre}</h2>
            <p className="text-sm text-gray-500">Laboratorio: {egreso.product?.laboratorio}</p>
          </div>
          <div className="text-right">
            <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Estado Remito</span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${egreso.estado_remito === 'Pendiente' ? 'bg-amber-100 text-amber-800 border-amber-200' : egreso.estado_remito === 'Entregado' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
              {egreso.estado_remito}
            </span>
          </div>
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div><span className="block text-xs text-gray-500 font-bold uppercase">ID Registro</span>{egreso.id}</div>
            <div><span className="block text-xs text-gray-500 font-bold uppercase">Fecha de Entrega</span>{new Date(egreso.fecha_entrega).toLocaleDateString('es-AR')}</div>
            <div><span className="block text-xs text-gray-500 font-bold uppercase">Cantidad</span><span className="font-bold text-[var(--color-action)] text-lg">{egreso.cantidad}</span></div>
            <div><span className="block text-xs text-gray-500 font-bold uppercase">Empresa Solicitante</span>{egreso.empresa_solicitante}</div>
            <div><span className="block text-xs text-gray-500 font-bold uppercase">Lote</span>{egreso.lote}</div>
            <div><span className="block text-xs text-gray-500 font-bold uppercase">Vencimiento Lote</span>{new Date(egreso.vencimiento).toLocaleDateString('es-AR')}</div>
            <div><span className="block text-xs text-gray-500 font-bold uppercase">Serial</span>{egreso.serial || '-'}</div>
            <div><span className="block text-xs text-gray-500 font-bold uppercase">Orden de Compra</span>{egreso.orden_compra || '-'}</div>

            <div className="md:col-span-2 pt-6 flex gap-3 border-t mt-4">
              <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded font-semibold cursor-pointer">Editar Informacion</button>
              <button onClick={handleDelete} className="px-6 py-2 border border-red-200 text-[var(--color-action)] hover:bg-red-50 rounded font-semibold cursor-pointer">Eliminar Egreso</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} onInvalid={handleFormInvalid} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha Entrega</label>
                <input required type="date" name="fecha_entrega" value={formData.fecha_entrega} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Empresa Solicitante</label>
                <input required type="text" name="empresa_solicitante" value={formData.empresa_solicitante} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lote</label>
                <input required type="text" name="lote" value={formData.lote} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vencimiento</label>
                <input required type="date" name="vencimiento" value={formData.vencimiento} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad</label>
                <input required type="number" min="1" name="cantidad" value={formData.cantidad} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado Remito</label>
                <select name="estado_remito" value={formData.estado_remito} onChange={handleChange} className="w-full p-2 border rounded outline-none focus:border-[var(--color-primary)]">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Serial</label>
                <input type="text" name="serial" value={formData.serial} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Orden Compra</label>
                <input type="text" name="orden_compra" value={formData.orden_compra} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
            </div>
            <div className="pt-4 border-t flex gap-2 justify-end">
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border rounded font-semibold cursor-pointer">Cancelar</button>
              <button type="submit" disabled={isSaving} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded font-semibold cursor-pointer disabled:opacity-50">{isSaving ? 'Guardando...' : 'Guardar Cambios'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DetalleEgresoPage;
