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
    <div className="mx-auto max-w-5xl space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Control de calidad</p>
          <h1 className="section-title">Detalle de rechazo</h1>
          <p className="section-subtitle mt-2">{rechazo.product?.nombre} · Lote {rechazo.lote}</p>
        </div>
        <Link to="/rechazos" className="ghost-link">Volver</Link>
      </div>

      <section className="panel p-6">
        <div className="mb-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Registro</p>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Datos del rechazo</h2>
        </div>

        <div className="detail-grid md:grid-cols-2">
          <div className="detail-item"><span className="detail-item-label">Fecha</span>{formatDateDisplay(rechazo.fecha)}</div>
          <div className="detail-item"><span className="detail-item-label">Cantidad</span>{rechazo.cantidad}</div>
          <div className="detail-item"><span className="detail-item-label">Producto</span>{rechazo.product?.nombre || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">Proveedor</span>{rechazo.proveedor?.nombre || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">Lote</span>{rechazo.lote}</div>
          <div className="detail-item"><span className="detail-item-label">Remito</span>{rechazo.remito || '-'}</div>
          <div className="detail-item md:col-span-2"><span className="detail-item-label">Motivo</span>{rechazo.motivo_rechazo}</div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
          <Link to={`/rechazos/${id}/editar`} className="primary-button">Editar</Link>
          <button type="button" onClick={handleDelete} className="danger-button">Eliminar</button>
        </div>
      </section>
    </div>
  );
};

export default RechazoDetallePage;
