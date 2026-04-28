import React from 'react';
import EntityAutocomplete from './EntityAutocomplete';

const ProveedorAutocomplete = ({ value, onChange, error }) => {
  return (
    <EntityAutocomplete
      value={value}
      onChange={onChange}
      endpoint="/api/proveedores"
      placeholder="Buscar proveedor por nombre o número..."
      getOptionLabel={(option) => option.nombre}
      getOptionDescription={(option) => [option.numero, option.tipo].filter(Boolean).join(' · ')}
      error={error}
    />
  );
};

export default ProveedorAutocomplete;
