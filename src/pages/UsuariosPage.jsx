import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { handleFormInvalid } from '../lib/validation';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });
  const [saving, setSaving] = useState(false);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/users');
      setUsuarios(data);
    } catch (e) {
      toast.error("Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/users', formData);
      setShowModal(false);
      setFormData({ email: '', password: '', role: 'user' });
      fetchUsuarios();
    } catch (err) {
      const errorData = err.response?.data?.error;
      const errorMsg = Array.isArray(errorData) ? errorData[0].message : errorData;
      toast.error(errorMsg || "Error al crear usuario");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro que desea desactivar este usuario? No podrá acceder más.")) return;
    try {
      await api.delete(`/api/users/${id}`);
      fetchUsuarios();
    } catch (err) {
      toast.error("Error al desactivar usuario");
    }
  };

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-['var(--font-heading)'] text-[var(--color-primary)]">Gestión de Usuarios</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded font-semibold text-sm hover:opacity-90 cursor-pointer">
          + Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-3 border-b">ID</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Rol</th>
              <th className="p-3 border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-4 text-center">Cargando...</td></tr>
            ) : usuarios.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">No hay usuarios activos registrados</td></tr>
            ) : (
              usuarios.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 border-b border-gray-100 text-sm last:border-0">
                  <td className="p-3 font-mono text-xs text-gray-500">{u.id}</td>
                  <td className="p-3 font-semibold text-[var(--color-primary)]">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 font-semibold text-xs border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer">
                      Desactivar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold font-['var(--font-heading)'] mb-4 text-[var(--color-primary)]">Nuevo Usuario</h3>
            <form onSubmit={handleCreate} onInvalid={handleFormInvalid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input required type="email" name="email" className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[var(--color-primary)]" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contraseña</label>
                <input required type="password" name="password" minLength="6" className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[var(--color-primary)]" value={formData.password} onChange={handleChange} />
                <p className="text-xs text-gray-400 mt-1">Debe ser de al menos 6 caracteres.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select name="role" className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[var(--color-primary)]" value={formData.role} onChange={handleChange}>
                  <option value="user">Operador (Estándar)</option>
                  <option value="admin">Administrador (Acceso Total)</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded font-semibold hover:bg-gray-50 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-[var(--color-primary)] text-white rounded font-semibold disabled:opacity-50 cursor-pointer">
                  {saving ? 'Guardando...' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsuariosPage;
