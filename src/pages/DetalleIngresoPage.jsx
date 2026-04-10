import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';

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
        lote: data.lote,
        proveedor: data.proveedor,
        fecha_ingreso: data.fecha_ingreso.split('T')[0],
        vencimiento: data.vencimiento.split('T')[0],
        cadena_frio: data.cadena_frio,
        cantidad: data.cantidad,
        observaciones: data.observaciones || ''
      });
    } catch (e) {
      if (e.response?.status === 404) navigate('/ingresos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        cantidad: parseInt(formData.cantidad, 10)
      };
      await api.patch(`/api/ingresos/${id}`, payload);
      setIsEditing(false);
      fetchIngreso();
    } catch (e) {
      alert(e.response?.data?.error || "Error al actualizar");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Está seguro que desea eliminar este ingreso? Esta acción no se puede deshacer.")) return;
    try {
      await api.delete(`/api/ingresos/${id}`);
      navigate('/ingresos');
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!ingreso) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-['var(--font-body)']">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-['var(--font-heading)'] text-[var(--color-primary)]">
          {isEditing ? 'Editar Ingreso' : 'Detalle de Ingreso'}
        </h1>
        <Link to="/ingresos" className="text-gray-500 hover:underline">Volver a lista</Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-100">
          <h2 className="text-lg font-bold text-[var(--color-primary)] mb-1">Producto: {ingreso.product?.nombre}</h2>
          <p className="text-sm text-gray-500">Laboratorio: {ingreso.product?.laboratorio}</p>
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            <div><span className="block text-xs text-gray-500 font-bold uppercase">ID Registro</span>{ingreso.id}</div>
            <div><span className="block text-xs text-gray-500 font-bold uppercase">Fecha de Ingreso</span>{new Date(ingreso.fecha_ingreso).toLocaleDateString('es-AR')}</div>
            <div><span className="block text-xs text-gray-500 font-bold uppercase">Lote</span>{ingreso.lote}</div>
            <div><span className="block text-xs text-gray-500 font-bold uppercase">Vencimiento</span>{new Date(ingreso.vencimiento).toLocaleDateString('es-AR')}</div>
            <div><span className="block text-xs text-gray-500 font-bold uppercase">Proveedor</span>{ingreso.proveedor}</div>
            <div><span className="block text-xs text-gray-500 font-bold uppercase">Cantidad</span><span className="font-bold text-[var(--color-primary)] text-lg">{ingreso.cantidad}</span></div>
            <div><span className="block text-xs text-gray-500 font-bold uppercase">Cadena Frío</span>{ingreso.cadena_frio ? 'Sí ❄️' : 'No'}</div>
            
            {ingreso.observaciones && (
              <div className="md:col-span-2"><span className="block text-xs text-gray-500 font-bold uppercase">Observaciones</span><p className="whitespace-pre-wrap mt-1">{ingreso.observaciones}</p></div>
            )}
            
            <div className="md:col-span-2 pt-6 flex gap-3 border-t mt-4">
              <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded font-semibold cursor-pointer">Editar Información</button>
              <button onClick={handleDelete} className="px-6 py-2 border border-red-200 text-[var(--color-action)] hover:bg-red-50 rounded font-semibold cursor-pointer">Eliminar Ingreso</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Lote</label>
                <input required type="text" name="lote" value={formData.lote} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Proveedor</label>
                <input required type="text" name="proveedor" value={formData.proveedor} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha Ingreso</label>
                <input required type="date" name="fecha_ingreso" value={formData.fecha_ingreso} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vencimiento</label>
                <input required type="date" name="vencimiento" value={formData.vencimiento} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad</label>
                <input required type="number" min="1" name="cantidad" value={formData.cantidad} onChange={handleChange} className="w-full p-2 border rounded" />
              </div>
              <div className="flex items-center pt-6">
                <input type="checkbox" id="cadena_frio_edit" name="cadena_frio" checked={formData.cadena_frio} onChange={handleChange} className="w-4 h-4 cursor-pointer" />
                <label htmlFor="cadena_frio_edit" className="ml-2 text-sm font-medium cursor-pointer">Requiere Cadena Frío</label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Observaciones</label>
                <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} className="w-full p-2 border rounded outline-none focus:border-[var(--color-primary)]" rows="3"></textarea>
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

export default DetalleIngresoPage;
