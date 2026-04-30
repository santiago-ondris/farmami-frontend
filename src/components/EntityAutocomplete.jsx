import React, { useEffect, useRef, useState } from 'react';
import api from '../lib/axios';

const EntityAutocomplete = ({
  value,
  onChange,
  endpoint,
  placeholder,
  searchParam = 'search',
  limit = 10,
  getOptionLabel,
  getOptionDescription,
  getOptionKey = (option) => option.id,
  emptyMessage = 'No se encontraron resultados.',
  error = false,
  renderEmpty
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!value || query) {
      return undefined;
    }

    const controller = new AbortController();

    api.get(`${endpoint}/${value}`, { signal: controller.signal })
      .then(({ data }) => {
        setQuery(getOptionLabel(data));
      })
      .catch(() => null);

    return () => controller.abort();
  }, [endpoint, getOptionLabel, query, value]);

  const search = async (text) => {
    setQuery(text);

    if (!text.trim()) {
      setResults([]);
      onChange('');
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append(searchParam, text);
      params.append('limit', String(limit));

      const { data } = await api.get(`${endpoint}?${params.toString()}`);
      setResults(data.data || []);
      setIsOpen(true);
    } catch (error) {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (option) => {
    setQuery(getOptionLabel(option));
    onChange(option.id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(event) => search(event.target.value)}
        onFocus={() => {
          if (results.length > 0) {
            setIsOpen(true);
          }
        }}
        className={`w-full rounded border px-3 py-2 outline-none focus:border-[var(--color-primary)] ${error ? 'border-red-500' : 'border-gray-300'}`}
      />

      {isOpen && (
        <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded border border-gray-200 bg-white shadow-lg">
          {isLoading ? (
            <div className="p-3 text-sm text-gray-500">Buscando...</div>
          ) : results.length === 0 ? (
            renderEmpty ? renderEmpty({ query }) : <div className="p-3 text-sm text-gray-500">{emptyMessage}</div>
          ) : (
            results.map((option) => (
              <button
                type="button"
                key={getOptionKey(option)}
                onClick={() => handleSelect(option)}
                className="block w-full border-b border-gray-100 px-3 py-2 text-left hover:bg-gray-50 last:border-b-0"
              >
                <div className="text-sm font-semibold text-[var(--color-primary)]">{getOptionLabel(option)}</div>
                {getOptionDescription ? (
                  <div className="text-xs text-gray-500">{getOptionDescription(option)}</div>
                ) : null}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default EntityAutocomplete;
