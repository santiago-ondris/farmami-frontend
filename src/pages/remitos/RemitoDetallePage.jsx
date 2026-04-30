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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">Remito {remito.numero}</h1>
          <p className="text-sm text-gray-500">Emitido el {formatDateDisplay(remito.fecha)} a las {remito.hora}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePdf}
            disabled={isGeneratingPdf}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGeneratingPdf ? 'Generando PDF...' : 'Generar PDF'}
          </button>
          <button type="button" onClick={handleDelete} className="rounded border border-red-200 px-4 py-2 text-sm font-semibold text-[var(--color-action)] hover:bg-red-50">
            Eliminar
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2 xl:grid-cols-4">
        <div><span className="block text-xs font-bold uppercase text-gray-500">Cliente</span>{remito.cliente?.nombre}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Contacto</span>{remito.cliente?.contacto || '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">CTA</span>{remito.cliente?.establecimiento || '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">CUIT</span>{remito.cliente?.cuit || '-'}</div>
        <div className="xl:col-span-2"><span className="block text-xs font-bold uppercase text-gray-500">Direccion</span>{remito.cliente?.direccion || '-'} - {remito.cliente?.localidad || '-'}</div>
        <div>
          <span className="mb-1 block text-xs font-bold uppercase text-gray-500">Estado</span>
          <select value={remito.estado} onChange={handleEstadoChange} disabled={updating} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]">
            <option value="Pendiente">Pendiente</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </section>

      <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50 text-sm text-gray-600">
                <th className="border-b p-3">Cantidad</th>
                <th className="border-b p-3">Descripcion</th>
                <th className="border-b p-3">Lote</th>
                <th className="border-b p-3">Vencimiento</th>
                <th className="border-b p-3">Egreso</th>
              </tr>
            </thead>
            <tbody>
              {remito.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 text-sm last:border-b-0">
                  <td className="p-3 font-semibold">{item.cantidad}</td>
                  <td className="p-3">{item.descripcion}</td>
                  <td className="p-3">{item.lote}</td>
                  <td className="p-3">{formatDateDisplay(item.vencimiento)}</td>
                  <td className="p-3">
                    {item.egresos?.[0] ? (
                      <Link to={`/egresos/${item.egresos[0].id}`} className="text-xs font-semibold text-[var(--color-accent)] hover:underline">
                        Ir a egreso
                      </Link>
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
        <Link to="/remitos" className="text-sm text-gray-500 hover:underline">Volver a remitos</Link>
      </div>
    </div>
  );
};

export default RemitoDetallePage;
