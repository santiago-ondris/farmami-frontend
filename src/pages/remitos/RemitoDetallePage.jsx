import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { confirmToast } from '../../lib/confirmToast';
import { formatDateDisplay } from '../../lib/date';

const RemitoDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [remito, setRemito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchRemito = async () => {
      try {
        const { data } = await api.get(`/api/remitos/${id}`);
        setRemito(data);
      } catch (error) {
        toast.error('No se pudo cargar el remito');
        navigate('/remitos');
      } finally {
        setLoading(false);
      }
    };

    fetchRemito();
  }, [id, navigate]);

  const handlePdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const response = await api.get(`/api/remitos/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.error('No se pudo generar el PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleEstadoChange = async (event) => {
    const estado = event.target.value;
    setUpdating(true);
    try {
      const { data } = await api.patch(`/api/remitos/${id}`, { estado });
      setRemito(data);
      toast.success('Estado actualizado');
    } catch (error) {
      toast.error('No se pudo actualizar el estado');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirmToast({
      title: 'Eliminar remito',
      description: 'Tambien se revertiran sus egresos asociados.',
      confirmLabel: 'Eliminar'
    });

    if (!confirmed) return;

    try {
      await api.delete(`/api/remitos/${id}`);
      toast.success('Remito eliminado');
      navigate('/remitos');
    } catch (error) {
      toast.error('No se pudo eliminar el remito');
    }
  };

  if (loading) return <div className="font-['var(--font-body)']">Cargando...</div>;
  if (!remito) return null;

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Documento comercial</p>
          <h1 className="section-title">Remito {remito.numero}</h1>
          <p className="section-subtitle mt-2">Emitido el {formatDateDisplay(remito.fecha)} a las {remito.hora}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handlePdf} disabled={isGeneratingPdf} className="toolbar-button disabled:opacity-60">
            {isGeneratingPdf ? 'Generando PDF...' : 'Generar PDF'}
          </button>
          <button type="button" onClick={handleDelete} className="danger-button">Eliminar</button>
        </div>
      </div>

      <section className="panel p-6">
        <div className="mb-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Destinatario</p>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Datos del cliente</h2>
        </div>
        <div className="detail-grid md:grid-cols-2 xl:grid-cols-4">
          <div className="detail-item"><span className="detail-item-label">Cliente</span>{remito.cliente?.nombre}</div>
          <div className="detail-item"><span className="detail-item-label">Contacto</span>{remito.cliente?.contacto || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">CTA</span>{remito.cliente?.establecimiento || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">CUIT</span>{remito.cliente?.cuit || '-'}</div>
          <div className="detail-item xl:col-span-2"><span className="detail-item-label">Direccion</span>{remito.cliente?.direccion || '-'} - {remito.cliente?.localidad || '-'}</div>
          <div className="detail-item xl:col-span-2">
            <span className="detail-item-label">Estado</span>
            <select value={remito.estado} onChange={handleEstadoChange} disabled={updating} className="field-input">
              <option value="Pendiente">Pendiente</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </section>

      <section className="panel p-6">
        <div className="mb-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Contenido</p>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Items</h2>
        </div>
        <div className="data-table-wrap !shadow-none">
          <table className="data-table min-w-[760px]">
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Descripcion</th>
                <th>Lote</th>
                <th>Vencimiento</th>
                <th>Egreso</th>
              </tr>
            </thead>
            <tbody>
              {remito.items.map((item) => (
                <tr key={item.id}>
                  <td className="font-semibold">{item.cantidad}</td>
                  <td>{item.descripcion}</td>
                  <td>{item.lote}</td>
                  <td>{formatDateDisplay(item.vencimiento)}</td>
                  <td>
                    {item.egresos?.[0] ? (
                      <Link to={`/egresos/${item.egresos[0].id}`} className="table-link">Ir a egreso</Link>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div>
        <Link to="/remitos" className="ghost-link">Volver a remitos</Link>
      </div>
    </div>
  );
};

export default RemitoDetallePage;
