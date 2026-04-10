import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import api from '../lib/axios';

const ProductAutocomplete = ({ value, onChange, error }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  
  const [newNombre, setNewNombre] = useState('');
  const [newLab, setNewLab] = useState('');
  const [saving, setSaving] = useState(false);
  
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!value || query) return;
    const controller = new AbortController();
    api.get(`/api/products/${value}`, { signal: controller.signal })
      .then(res => setQuery(`${res.data.nombre} - ${res.data.laboratorio}`))
      .catch((err) => { if (err.name !== 'CanceledError') { /* producto no encontrado */ } });
    return () => controller.abort();
  }, [value, query]);

  const handleSearch = async (val) => {
    setQuery(val);
    if (!val) {
      setResults([]);
      onChange('');
      return;
    }
    try {
      const { data } = await api.get(`/api/products?search=${encodeURIComponent(val)}`);
      setResults(data);
      setShowDropdown(true);
    } catch (e) {
      setResults([]);
    }
  };

  const handleSelect = (prod) => {
    setQuery(`${prod.nombre} - ${prod.laboratorio}`);
    onChange(prod.id);
    setShowDropdown(false);
  };

  const handleCreateNew = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/api/products', { nombre: newNombre, laboratorio: newLab });
      handleSelect(data);
      setShowNewModal(false);
      setNewNombre('');
      setNewLab('');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al crear producto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative font-['var(--font-body)']" ref={wrapperRef}>
      <input
        type="text"
        className={`w-full p-2 border rounded focus:ring-1 focus:ring-[var(--color-primary)] outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder="Buscar producto o laboratorio..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => { if(query) setShowDropdown(true); }}
      />
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.length > 0 ? (
            results.map((r) => (
              <div 
                key={r.id} 
                className="p-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelect(r)}
              >
                <div className="font-semibold text-sm">{r.nombre}</div>
                <div className="text-xs text-gray-500">{r.laboratorio}</div>
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500 text-center">No se encontraron productos.</div>
          )}
          <div 
            className="p-2 bg-[var(--color-bg)] text-[var(--color-primary)] cursor-pointer font-bold text-sm border-t border-gray-100 flex items-center gap-2 hover:bg-gray-100"
            onClick={() => { setShowDropdown(false); setShowNewModal(true); }}
          >
            ＋ Crear nuevo producto
          </div>
        </div>
      )}

      {showNewModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="text-xl font-bold font-['var(--font-heading)'] mb-4 text-[var(--color-primary)]">Nuevo Producto</h3>
            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input required type="text" className="w-full p-2 border border-gray-300 rounded" value={newNombre} onChange={e=>setNewNombre(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Laboratorio</label>
                <input required type="text" className="w-full p-2 border border-gray-300 rounded" value={newLab} onChange={e=>setNewLab(e.target.value)} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowNewModal(false)} className="flex-1 py-2 border rounded font-semibold hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-[var(--color-primary)] text-white rounded font-semibold disabled:opacity-50">
                  {saving ? 'Guardando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProductAutocomplete;
