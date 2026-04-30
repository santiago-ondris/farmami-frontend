import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { confirmToast } from '../../lib/confirmToast';
import { formatDateDisplay } from '../../lib/date';

const RechazoDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rechazo, setRechazo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRechazo = async () => {
      try {
        const { data } = await api.get(`/api/rechazos/${id}`);
        setRechazo(data);
      } catch (error) {
        toast.error('No se pudo cargar el rechazo');
        navigate('/rechazos');
      } finally {
        setLoading(false);
      }
    };

    fetchRechazo();
  }, [id, navigate]);

  const handleDelete = async () => {
    const confirmed = await confirmToast({
      title: 'Eliminar rechazo',
      confirmLabel: 'Eliminar'
    });

    if (!confirmed) return;

    try {
      await api.delete(`/api/rechazos/${id}`);
      toast.success('Rechazo eliminado');
      navigate('/rechazos');
    } catch (error) {
      toast.error('Error al eliminar rechazo');
    }
  };

  if (loading) return <div className="font-['var(--font-body)']">Cargando...</div>;
  if (!rechazo) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 font-['var(--font-body)']">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">Detalle de rechazo</h1>
          <p className="text-sm text-gray-500">{rechazo.product?.nombre} · Lote {rechazo.lote}</p>
        </div>
        <Link to="/rechazos" className="text-sm text-gray-500 hover:underline">Volver</Link>
      </div>

      <div className="space-y-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div><span className="block text-xs font-bold uppercase text-gray-500">Fecha</span>{formatDateDisplay(rechazo.fecha)}</div>
          <div><span className="block text-xs font-bold uppercase text-gray-500">Cantidad</span>{rechazo.cantidad}</div>
          <div><span className="block text-xs font-bold uppercase text-gray-500">Producto</span>{rechazo.product?.nombre || '-'}</div>
          <div><span className="block text-xs font-bold uppercase text-gray-500">Proveedor</span>{rechazo.proveedor?.nombre || '-'}</div>
          <div><span className="block text-xs font-bold uppercase text-gray-500">Lote</span>{rechazo.lote}</div>
          <div><span className="block text-xs font-bold uppercase text-gray-500">Remito</span>{rechazo.remito || '-'}</div>
          <div className="md:col-span-2"><span className="block text-xs font-bold uppercase text-gray-500">Motivo</span>{rechazo.motivo_rechazo}</div>
        </div>

        <div className="flex gap-2 border-t border-gray-100 pt-4">
          <Link to={`/rechazos/${id}/editar`} className="rounded bg-[var(--color-primary)] px-6 py-2 font-semibold text-white hover:opacity-90">Editar</Link>
          <button type="button" onClick={handleDelete} className="rounded border border-red-200 px-6 py-2 font-semibold text-[var(--color-action)] hover:bg-red-50">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RechazoDetallePage;
