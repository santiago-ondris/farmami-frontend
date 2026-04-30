import React from 'react';
import { Link } from 'react-router-dom';
import EntityAutocomplete from '../EntityAutocomplete';

const OrdenCompraProveedorAutocomplete = ({ value, onChange, error = false }) => {
  return (
    <EntityAutocomplete
      value={value}
      onChange={onChange}
      endpoint="/api/proveedores"
      placeholder="Buscar proveedor por nombre o numero..."
      getOptionLabel={(option) => option.nombre}
      getOptionDescription={(option) => [option.numero, option.tipo].filter(Boolean).join(' · ')}
      error={error}
      renderEmpty={({ query }) => (
        <div className="space-y-2 p-3 text-sm text-gray-500">
          <p>No encontramos proveedores para "{query}".</p>
          <Link to="/proveedores/nuevo" className="font-semibold text-[var(--color-accent)] hover:underline">
            Cargar proveedor nuevo
          </Link>
        </div>
      )}
    />
  );
};

export default OrdenCompraProveedorAutocomplete;
