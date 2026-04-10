import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';

export const useStock = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStock = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/stock');
      setStockData(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el stock global');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  return { stockData, loading, error, refetch: fetchStock };
};
