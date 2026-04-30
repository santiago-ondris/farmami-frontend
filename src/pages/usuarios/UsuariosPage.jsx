import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { handleFormInvalid } from '../../lib/validation';
import { confirmToast } from '../../lib/confirmToast';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/users');
      setUsuarios(data);
    } catch (error) {
      toast.error('Error al obtener usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post('/api/users', formData);
      setShowModal(false);
      setFormData({ email: '', password: '', role: 'user' });
      fetchUsuarios();
      toast.success('Usuario creado');
    } catch (error) {
      const errorData = error.response?.data?.error;
      const errorMsg = Array.isArray(errorData) ? errorData[0].message : errorData;
      toast.error(errorMsg || 'Error al crear usuario');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmToast({
      title: 'Desactivar usuario',
      description: 'No podra acceder mas.',
      confirmLabel: 'Desactivar'
    });

    if (!confirmed) return;

    try {
      await api.delete(`/api/users/${id}`);
      fetchUsuarios();
      toast.success('Usuario desactivado');
    } catch (error) {
      toast.error('Error al desactivar usuario');
    }
  };

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-['var(--font-heading)'] text-[var(--color-primary)]">Gestion de Usuarios</h1>
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
              usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-50 border-b border-gray-100 text-sm last:border-0">
                  <td className="p-3 font-mono text-xs text-gray-500">{usuario.id}</td>
                  <td className="p-3 font-semibold text-[var(--color-primary)]">{usuario.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${usuario.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {usuario.role}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleDelete(usuario.id)} className="text-red-500 hover:text-red-700 font-semibold text-xs border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer">
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
                <label className="block text-sm font-medium mb-1">Contrasena</label>
                <input required type="password" name="password" minLength="6" className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[var(--color-primary)]" value={formData.password} onChange={handleChange} />
                <p className="text-xs text-gray-400 mt-1">Debe ser de al menos 6 caracteres.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select name="role" className="w-full p-2 border border-gray-300 rounded outline-none focus:border-[var(--color-primary)]" value={formData.role} onChange={handleChange}>
                  <option value="user">Operador (Estandar)</option>
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
