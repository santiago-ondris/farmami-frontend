import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStock } from '../hooks/useStock';
import api from '../lib/axios';
import { formatDateDisplay } from '../lib/date';
import TermopharmaLogo from '../components/TermopharmaLogo';

const buildLoteAlertas = (stockData, field) => stockData
  .flatMap((producto) => (producto[field] || []).map((lote) => ({
    ...lote,
    product_id: producto.id,
    nombre: producto.nombre,
    laboratorio: producto.laboratorio
  })))
  .sort((a, b) => new Date(a.vencimiento) - new Date(b.vencimiento) || a.nombre.localeCompare(b.nombre));

const HomePage = () => {
  const { stockData, loading, error } = useStock();
  const [pendingTotal, setPendingTotal] = useState(0);
  const [pageVencimiento, setPageVencimiento] = useState(1);
  const limitVencimiento = 15;

  useEffect(() => {
    const fetchPendingEgresos = async () => {
      try {
        const { data } = await api.get('/api/egresos?estado_remito=Pendiente&limit=1');
        setPendingTotal(data.total || 0);
      } catch (e) {}
    };

    fetchPendingEgresos();
  }, []);

  const totalProductos = stockData.length;
  const totalUnidades = stockData.reduce((acc, item) => acc + item.stock, 0);
  const stockNegativos = stockData.filter((item) => item.stock_negativo);
  const lotesPorVencer = buildLoteAlertas(stockData, 'lotes_proximos_vencer');
  const lotesVencidos = buildLoteAlertas(stockData, 'lotes_vencidos');
  const paginatedVencimiento = lotesPorVencer.slice(
    (pageVencimiento - 1) * limitVencimiento,
    pageVencimiento * limitVencimiento
  );

  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(lotesPorVencer.length / limitVencimiento));
    if (pageVencimiento > lastPage) {
      setPageVencimiento(lastPage);
    }
  }, [lotesPorVencer.length, pageVencimiento]);

  if (loading) return <div className="p-4 font-['var(--font-body)']">Cargando dashboard...</div>;
  if (error) return <div className="p-4 text-red-500 font-['var(--font-body)']">{error}</div>;

  const formatDiasRestantes = (dias) => {
    if (dias === 0) return 'Vence hoy';
    if (dias === 1) return 'Vence en 1 dia';
    return `Vence en ${dias} dias`;
  };

  const formatDiasVencido = (dias) => {
    const diasVencido = Math.abs(dias);
    if (diasVencido === 1) return 'Vencido hace 1 dia';
    return `Vencido hace ${diasVencido} dias`;
  };

  const metricCards = [
    {
      label: 'Stock activo',
      value: totalProductos,
      tone: 'text-[var(--color-primary)]',
      helper: 'Productos con historial y movimiento.'
    },
    {
      label: 'Inventario total',
      value: totalUnidades,
      tone: 'text-[var(--color-primary)]',
      helper: 'Suma consolidada de unidades disponibles.'
    },
    {
      label: 'Egresos pendientes',
      value: pendingTotal,
      tone: 'text-[var(--color-accent)]',
      helper: 'Remitos aun no entregados o cerrados.'
    },
    {
      label: 'Stock critico',
      value: stockNegativos.length,
      tone: 'text-[var(--color-action)]',
      helper: 'Productos en negativo para revisar.'
    }
  ];

  return (
    <div className="space-y-8 font-['var(--font-body)']">
      <section className="panel overflow-hidden bg-[var(--color-primary)] text-white">
        <div className="grid gap-6 px-6 py-7 lg:grid-cols-[300px_1fr] lg:items-center">
          <div className="max-w-[250px] rounded-[22px] border border-white/15 bg-white/10 p-4">
            <TermopharmaLogo className="w-full" compact />
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Centro de control</p>
              <h1 className="font-['var(--font-heading)'] text-4xl font-bold">Dashboard operativo</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80">
                Vision general del stock, los movimientos sensibles y la documentacion que hoy necesita atencion.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-semibold text-white/80">
              <span className="rounded-full border border-white/15 px-3 py-1">Drogueria Termopharma DGroup</span>
              <span className="rounded-full border border-white/15 px-3 py-1">Provincia de Cordoba</span>
              <span className="rounded-full border border-white/15 px-3 py-1">Operacion interna B2B</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => (
          <article key={metric.label} className="panel panel-muted p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">{metric.label}</p>
            <div className={`mt-3 font-['var(--font-heading)'] text-5xl font-bold ${metric.tone}`}>{metric.value}</div>
            <p className="mt-3 text-sm text-gray-500">{metric.helper}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="panel p-6 text-amber-900">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Seguimiento prioritario</p>
              <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-amber-800">Alertas de vencimiento</h2>
              <p className="mt-2 text-sm text-amber-800/75">Productos con lotes proximos a vencer dentro de los proximos 60 dias.</p>
            </div>
            <div className="status-chip bg-amber-100 text-amber-800">{lotesPorVencer.length} en observacion</div>
          </div>

          {lotesPorVencer.length === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-6 text-sm">
              El inventario esta sano. No hay lotes proximos a vencer en esta ventana.
            </div>
          ) : (
            <div className="space-y-4">
              <ul className="space-y-3">
                {paginatedVencimiento.map((lote) => (
                  <li
                    key={`${lote.product_id}-${lote.lote}-${lote.vencimiento}`}
                    className="flex flex-col gap-3 rounded-2xl border border-amber-100 bg-amber-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="font-semibold text-amber-900">{lote.nombre}</div>
                      <div className="text-sm text-amber-900/70">{lote.laboratorio}</div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-amber-900/80">
                        <span>Lote {lote.lote}</span>
                        <span>Vto. {formatDateDisplay(lote.vencimiento)}</span>
                        <span>Stock {lote.stock}</span>
                        <span>{formatDiasRestantes(lote.dias_restantes)}</span>
                      </div>
                    </div>
                    <Link to={`/productos/${lote.product_id}`} className="toolbar-button border-amber-200 bg-white text-amber-800">
                      Ver lotes
                    </Link>
                  </li>
                ))}
              </ul>

              {lotesPorVencer.length > limitVencimiento && (
                <div className="flex flex-col gap-3 border-t border-amber-200 pt-4 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
                  <div className="font-medium">
                    Mostrando {paginatedVencimiento.length} de {lotesPorVencer.length}
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={pageVencimiento === 1}
                      onClick={() => setPageVencimiento((prev) => prev - 1)}
                      className="toolbar-button disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <button
                      disabled={pageVencimiento * limitVencimiento >= lotesPorVencer.length}
                      onClick={() => setPageVencimiento((prev) => prev + 1)}
                      className="toolbar-button disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="panel p-6 text-red-900">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-red-700">Requiere accion</p>
                <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-red-800">Lotes vencidos</h2>
              </div>
              <div className="status-chip bg-red-100 text-red-800">{lotesVencidos.length}</div>
            </div>

            {lotesVencidos.length === 0 ? (
              <div className="rounded-2xl border border-red-100 bg-red-50/50 px-4 py-5 text-sm text-red-900/75">
                No hay lotes vencidos con stock disponible.
              </div>
            ) : (
              <ul className="space-y-3">
                {lotesVencidos.map((lote) => (
                  <li
                    key={`${lote.product_id}-${lote.lote}-${lote.vencimiento}`}
                    className="rounded-2xl border border-red-100 bg-red-50/60 px-4 py-3"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="font-semibold text-red-900">{lote.nombre}</div>
                        <div className="text-sm text-red-900/70">{lote.laboratorio}</div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-red-900/80">
                          <span>Lote {lote.lote}</span>
                          <span>Vto. {formatDateDisplay(lote.vencimiento)}</span>
                          <span>Stock {lote.stock}</span>
                          <span>{formatDiasVencido(lote.dias_restantes)}</span>
                        </div>
                      </div>
                      <Link to={`/productos/${lote.product_id}`} className="table-link text-red-800">
                        Ver lotes
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Foco del dia</p>
            <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Lectura rapida</h2>
            <div className="mt-5 space-y-3">
              <div className="detail-item">
                <span className="detail-item-label">Despachos pendientes</span>
                <div className="flex items-end justify-between gap-3">
                  <span className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-accent)]">{pendingTotal}</span>
                  <Link to="/egresos" className="table-link">Ir a egresos</Link>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-item-label">Items en negativo</span>
                <div className="flex items-end justify-between gap-3">
                  <span className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-action)]">{stockNegativos.length}</span>
                  <Link to="/productos" className="table-link">Ver stock</Link>
                </div>
              </div>
            </div>
          </section>

          <section className="panel p-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Accesos directos</p>
            <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Atajos utiles</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link to="/ingresos/nuevo" className="secondary-button">Nuevo ingreso</Link>
              <Link to="/egresos/nuevo" className="secondary-button">Nuevo egreso</Link>
              <Link to="/remitos/nuevo" className="secondary-button">Nuevo remito</Link>
              <Link to="/ordenes-compra/nuevo" className="secondary-button">Nueva orden</Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
