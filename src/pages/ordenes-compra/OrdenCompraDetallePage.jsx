import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { confirmToast } from '../../lib/confirmToast';
import { formatDateDisplay } from '../../lib/date';

const formatMoney = (value) => Number(value || 0).toFixed(2);

const OrdenCompraDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ordenCompra, setOrdenCompra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchOrdenCompra = async () => {
      try {
        const { data } = await api.get(`/api/ordenes-compra/${id}`);
        setOrdenCompra(data);
      } catch (error) {
        toast.error('No se pudo cargar la orden de compra');
        navigate('/ordenes-compra');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenCompra();
  }, [id, navigate]);

  const handlePdf = async () => {
    if (isGeneratingPdf) return;

    setIsGeneratingPdf(true);
    try {
      const response = await api.get(`/api/ordenes-compra/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.error('No se pudo generar el PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirmToast({
      title: 'Eliminar orden de compra',
      description: 'El registro quedara desactivado logicamente.',
      confirmLabel: 'Eliminar'
    });

    if (!confirmed) return;

    try {
      await api.delete(`/api/ordenes-compra/${id}`);
      toast.success('Orden de compra eliminada');
      navigate('/ordenes-compra');
    } catch (error) {
      toast.error('No se pudo eliminar la orden de compra');
    }
  };

  if (loading) return <div className="font-['var(--font-body)']">Cargando...</div>;
  if (!ordenCompra) return null;

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">Orden de compra {ordenCompra.numero}</h1>
          <p className="text-sm text-gray-500">Creada el {formatDateDisplay(ordenCompra.fecha)}</p>
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
          <Link to={`/ordenes-compra/${id}/editar`} className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50">
            Editar
          </Link>
          <button type="button" onClick={handleDelete} className="rounded border border-red-200 px-4 py-2 text-sm font-semibold text-[var(--color-action)] hover:bg-red-50">
            Eliminar
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2 xl:grid-cols-4">
        <div><span className="block text-xs font-bold uppercase text-gray-500">Numero</span>{ordenCompra.numero}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Fecha</span>{formatDateDisplay(ordenCompra.fecha)}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Proveedor</span>{ordenCompra.proveedor?.nombre}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Condicion de pago</span>{ordenCompra.condicion_pago}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Numero proveedor</span>{ordenCompra.proveedor?.numero || '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Fecha de entrega</span>{ordenCompra.fecha_entrega ? formatDateDisplay(ordenCompra.fecha_entrega) : '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Items</span>{ordenCompra.items_count}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Importe total</span>{formatMoney(ordenCompra.importe_total)}</div>
      </section>

      <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50 text-sm text-gray-600">
                <th className="border-b p-3">Item</th>
                <th className="border-b p-3">Producto</th>
                <th className="border-b p-3">Cantidad</th>
                <th className="border-b p-3">Precio unitario</th>
                <th className="border-b p-3">Importe</th>
              </tr>
            </thead>
            <tbody>
              {ordenCompra.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 text-sm last:border-b-0">
                  <td className="p-3 font-semibold">{item.numero_item}</td>
                  <td className="p-3">{item.producto}</td>
                  <td className="p-3">{item.cantidad_pedida}</td>
                  <td className="p-3">{formatMoney(item.precio_unitario)}</td>
                  <td className="p-3">{formatMoney(item.importe)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div>
        <Link to="/ordenes-compra" className="text-sm text-gray-500 hover:underline">Volver a ordenes de compra</Link>
      </div>
    </div>
  );
};

export default OrdenCompraDetallePage;
