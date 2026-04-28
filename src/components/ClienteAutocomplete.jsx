import React from 'react';
import EntityAutocomplete from './EntityAutocomplete';

const ClienteAutocomplete = ({ value, onChange, error }) => {
  return (
    <EntityAutocomplete
      value={value}
      onChange={onChange}
      endpoint="/api/clientes"
      placeholder="Buscar cliente por nombre o establecimiento..."
      getOptionLabel={(option) => option.nombre}
      getOptionDescription={(option) => [option.establecimiento, option.localidad].filter(Boolean).join(' · ')}
      error={error}
    />
  );
};

export default ClienteAutocomplete;
