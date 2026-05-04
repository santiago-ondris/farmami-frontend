import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { confirmToast } from '../../lib/confirmToast';
import { formatDateDisplay } from '../../lib/date';

const formatMoney = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(Number(value || 0));
};

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Documento de compra</p>
          <h1 className="section-title">Orden de compra {ordenCompra.numero}</h1>
          <p className="section-subtitle mt-2">Creada el {formatDateDisplay(ordenCompra.fecha)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handlePdf} disabled={isGeneratingPdf} className="toolbar-button disabled:opacity-60">
            {isGeneratingPdf ? 'Generando PDF...' : 'Generar PDF'}
          </button>
          <Link to={`/ordenes-compra/${id}/editar`} className="secondary-button">Editar</Link>
          <button type="button" onClick={handleDelete} className="danger-button">Eliminar</button>
        </div>
      </div>

      <section className="panel p-6">
        <div className="mb-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Cabecera</p>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Datos de la orden</h2>
        </div>
        <div className="detail-grid md:grid-cols-2 xl:grid-cols-4">
          <div className="detail-item"><span className="detail-item-label">Numero</span>{ordenCompra.numero}</div>
          <div className="detail-item"><span className="detail-item-label">Fecha</span>{formatDateDisplay(ordenCompra.fecha)}</div>
          <div className="detail-item"><span className="detail-item-label">Proveedor</span>{ordenCompra.proveedor?.nombre}</div>
          <div className="detail-item"><span className="detail-item-label">Condicion de pago</span>{ordenCompra.condicion_pago}</div>
          <div className="detail-item"><span className="detail-item-label">Numero proveedor</span>{ordenCompra.proveedor?.numero || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">Fecha de entrega</span>{ordenCompra.fecha_entrega ? formatDateDisplay(ordenCompra.fecha_entrega) : '-'}</div>
          <div className="detail-item"><span className="detail-item-label">Items</span>{ordenCompra.items_count}</div>
          <div className="detail-item"><span className="detail-item-label">Importe total</span>{formatMoney(ordenCompra.importe_total)}</div>
        </div>
      </section>

      <section className="panel p-6">
        <div className="mb-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Contenido</p>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Items</h2>
        </div>
        <div className="data-table-wrap !shadow-none">
          <table className="data-table min-w-[860px]">
            <thead>
              <tr>
                <th>Item</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Importe</th>
              </tr>
            </thead>
            <tbody>
              {ordenCompra.items.map((item) => (
                <tr key={item.id}>
                  <td className="font-semibold">{item.numero_item}</td>
                  <td>{item.producto}</td>
                  <td>{item.cantidad_pedida}</td>
                  <td>{formatMoney(item.precio_unitario)}</td>
                  <td>{formatMoney(item.importe)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div>
        <Link to="/ordenes-compra" className="ghost-link">Volver a ordenes de compra</Link>
      </div>
    </div>
  );
};

export default OrdenCompraDetallePage;
