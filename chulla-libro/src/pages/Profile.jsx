import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, AlertCircle, Check, Eye, EyeOff, Star, Shield, Award } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Mock user data - in real app this would come from an API
  const [userData, setUserData] = useState({
    nombre: 'Juan Carlos Pérez',
    email: 'juan.perez@email.com',
    telefono: '+593 99 123 4567',
    direccion: 'Av. 10 de Agosto 1234, Quito',
    fechaNacimiento: '1990-05-15',
    fechaRegistro: '2023-01-20',
    tipoUsuario: 'Estudiante'
  });

  const [editForm, setEditForm] = useState({ ...userData });

  useEffect(() => {
    // Clear messages after 3 seconds
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...userData });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ ...userData });
    setError('');
  };

  const validateForm = () => {
    if (!editForm.nombre.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!editForm.email.trim()) {
      setError('El email es obligatorio');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      setError('Por favor ingresa un email válido');
      return false;
    }
    if (!editForm.telefono.trim()) {
      setError('El teléfono es obligatorio');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData({ ...editForm });
      setIsEditing(false);
      setSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setError('Error al actualizar el perfil. Por favor, inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
    setError(''); // Clear error when user starts typing
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-600/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-400/10 to-cyan-600/10 rounded-full blur-3xl transform -translate-x-20 translate-y-20"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover-lift">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-color">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    Mi Perfil
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">Información personal y configuración de cuenta</p>
                  
                  {/* Stats badges */}
                  <div className="flex gap-2 mt-3">
                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full text-xs font-semibold text-orange-700">
                      <Star className="w-3 h-3" />
                      Usuario Activo
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-xs font-semibold text-green-700">
                      <Shield className="w-3 h-3" />
                      Verificado
                    </div>
                  </div>
                </div>
              </div>
              
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                >
                  <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-6 mb-6 rounded-2xl shadow-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-6 mb-6 rounded-2xl shadow-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 animate-pulse">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden hover-lift">
          <div className="p-8 border-b border-gradient-to-r from-purple-200/50 to-pink-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Información Personal</h2>
                <p className="text-gray-600 font-medium">
                  {isEditing ? 'Modifica la información de tu perfil' : 'Detalles de tu cuenta'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nombre Completo */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Nombre Completo *
                </label>
                {isEditing ? (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-6 h-6" />
                    <input
                      type="text"
                      value={editForm.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-800 font-medium bg-white/70 backdrop-blur-sm"
                      placeholder="Ingresa tu nombre completo"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-900 font-semibold">{userData.nombre}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Correo Electrónico *
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-6 h-6" />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-800 font-medium bg-white/70 backdrop-blur-sm"
                      placeholder="correo@ejemplo.com"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{userData.email}</span>
                  </div>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={editForm.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+593 99 123 4567"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{userData.telefono}</span>
                  </div>
                )}
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                {isEditing ? (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={editForm.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Tu dirección"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{userData.direccion}</span>
                  </div>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={editForm.fechaNacimiento}
                      onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{formatDate(userData.fechaNacimiento)}</span>
                  </div>
                )}
              </div>

              {/* Tipo de Usuario (No editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Usuario
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{userData.tipoUsuario}</span>
                  <span className="ml-auto px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Verificado
                  </span>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Cuenta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Registro
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{formatDate(userData.fechaRegistro)}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado de Cuenta
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-900">Activa</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;