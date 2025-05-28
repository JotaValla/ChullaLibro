import React, { useState } from 'react';
import { Search, BookOpen, Filter, X, AlertCircle, Book, User, Calendar, Clock, ChevronDown, ChevronUp, CheckCircle, XCircle, RotateCcw, Eye } from 'lucide-react';

// Mock data - replace with actual API calls
const mockLoans = [
  {
    id: 1,
    usuario: 'María García',
    libro: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    fechaPrestamo: '2025-05-15',
    fechaVencimiento: '2025-06-15',
    estado: 'activo',
    diasRestantes: 18
  },
  {
    id: 2,
    usuario: 'Carlos López',
    libro: 'Don Quijote de La Mancha',
    autor: 'Miguel de Cervantes',
    fechaPrestamo: '2025-05-10',
    fechaVencimiento: '2025-06-10',
    estado: 'vencido',
    diasRestantes: -3
  },
  {
    id: 3,
    usuario: 'Ana Rodríguez',
    libro: '1984',
    autor: 'George Orwell',
    fechaPrestamo: '2025-04-20',
    fechaVencimiento: '2025-05-20',
    estado: 'devuelto',
    fechaDevolucion: '2025-05-18'
  },
  {
    id: 4,
    usuario: 'Pedro Martínez',
    libro: 'El Alquimista',
    autor: 'Paulo Coelho',
    fechaPrestamo: '2025-05-20',
    fechaVencimiento: '2025-06-20',
    estado: 'activo',
    diasRestantes: 23
  }
];

const Loans = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loans, setLoans] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    usuario: '',
    libro: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const validateSearchInput = () => {
    if (!searchTerm.trim()) {
      setError('Por favor ingresa un término de búsqueda');
      return false;
    }
    return true;
  };

  const validateAdvancedSearch = () => {
    const { usuario, libro, estado, fechaDesde, fechaHasta } = advancedFilters;
    if (!usuario.trim() && !libro.trim() && !estado && !fechaDesde && !fechaHasta) {
      setError('Por favor completa al menos un campo de búsqueda');
      return false;
    }
    return true;
  };

  const handleSearch = async () => {
    if (!validateSearchInput()) return;
    
    setIsLoading(true);
    setError('');
    setSearchPerformed(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const results = mockLoans.filter(loan => 
        loan.libro.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setLoans(results);
    } catch (err) {
      setError('Ha ocurrido un error al buscar los préstamos. Por favor, inténtalo nuevamente.');
      setLoans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvancedSearch = async () => {
    if (!validateAdvancedSearch()) return;
    
    setIsLoading(true);
    setError('');
    setSearchPerformed(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      let results = mockLoans;
      
      if (advancedFilters.libro) {
        results = results.filter(loan => 
          loan.libro.toLowerCase().includes(advancedFilters.libro.toLowerCase())
        );
      }
      if (advancedFilters.estado) {
        results = results.filter(loan => loan.estado === advancedFilters.estado);
      }
      
      setLoans(results);
      setShowAdvanced(false);
    } catch (err) {
      setError('Ha ocurrido un error en la búsqueda avanzada. Por favor, inténtalo nuevamente.');
      setLoans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllLoans = async () => {
    setIsLoading(true);
    setError('');
    setSearchPerformed(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoans(mockLoans);
    } catch (err) {
      setError('Ha ocurrido un error al cargar los préstamos. Por favor, inténtalo nuevamente.');
      setLoans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setLoans([]);
    setError('');
    setSearchPerformed(false);
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({ usuario: '', libro: '', estado: '', fechaDesde: '', fechaHasta: '' });
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAdvancedKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdvancedSearch();
    }
  };

  const getStatusBadge = (estado, diasRestantes) => {
    switch (estado) {
      case 'activo':
        const isNearDue = diasRestantes <= 7;
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            isNearDue 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {isNearDue ? 'Por vencer' : 'Activo'}
          </span>
        );
      case 'vencido':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            Vencido
          </span>
        );
      case 'devuelto':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            Devuelto
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <nav className="text-sm breadcrumbs mb-4">
            <span className="text-gray-500">Inicio</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-blue-600 font-medium">Mis Préstamos</span>
          </nav>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mis Préstamos</h1>
                <p className="text-gray-600">Consulta y gestiona todos tus préstamos de libros</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="space-y-4">
            {/* Simple Search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar en mis préstamos..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchTerm.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
                
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  title="Filtros avanzados"
                >
                  <Filter className="w-5 h-5" />
                  Filtros
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={loadAllLoans}
                  disabled={isLoading}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Ver Todos
                </button>
              </div>
            </div>

            {/* Advanced Search */}
            {showAdvanced && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Búsqueda Avanzada
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Libro"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={advancedFilters.libro}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, libro: e.target.value})}
                      onKeyPress={handleAdvancedKeyPress}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                      value={advancedFilters.estado}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, estado: e.target.value})}
                      disabled={isLoading}
                    >
                      <option value="">Todos los estados</option>
                      <option value="activo">Activo</option>
                      <option value="vencido">Vencido</option>
                      <option value="devuelto">Devuelto</option>
                    </select>
                  </div>
                  
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      placeholder="Fecha desde"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={advancedFilters.fechaDesde}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, fechaDesde: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      placeholder="Fecha hasta"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={advancedFilters.fechaHasta}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, fechaHasta: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleAdvancedSearch}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Buscando...' : 'Buscar'}
                  </button>
                  
                  <button
                    onClick={clearAdvancedFilters}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Limpiar Filtros
                  </button>
                  
                  <button
                    onClick={() => setShowAdvanced(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-700">Cargando préstamos...</p>
          </div>
        )}

        {/* Results Section */}
        {searchPerformed && !isLoading && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Resultados de la búsqueda
                {loans.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({loans.length} préstamo{loans.length !== 1 ? 's' : ''} encontrado{loans.length !== 1 ? 's' : ''})
                  </span>
                )}
              </h2>
            </div>
            
            <div className="p-6">
              {loans.length > 0 ? (
                <div className="space-y-4">
                  {loans.map((loan) => (
                    <div key={loan.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{loan.libro}</h3>
                          <p className="text-gray-600">por {loan.autor}</p>
                        </div>
                        {getStatusBadge(loan.estado, loan.diasRestantes)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-500">Préstamo:</span>
                            <p className="font-medium">{formatDate(loan.fechaPrestamo)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <span className="text-gray-500">Vencimiento:</span>
                            <p className="font-medium">{formatDate(loan.fechaVencimiento)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {loan.estado === 'devuelto' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : loan.estado === 'vencido' ? (
                            <XCircle className="w-4 h-4 text-red-400" />
                          ) : (
                            <RotateCcw className="w-4 h-4 text-blue-400" />
                          )}
                          <div>
                            <span className="text-gray-500">Estado:</span>
                            <p className="font-medium">
                              {loan.estado === 'devuelto' 
                                ? `Devuelto ${formatDate(loan.fechaDevolucion)}`
                                : loan.estado === 'vencido'
                                ? `${Math.abs(loan.diasRestantes)} días vencido`
                                : `${loan.diasRestantes} días restantes`
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {loan.estado === 'activo' && (
                        <div className="mt-4 flex gap-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Solicitar Renovación
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron préstamos</h3>
                  <p className="text-gray-600 mb-4">
                    Intenta con términos de búsqueda diferentes o usa los filtros avanzados
                  </p>
                  <button
                    onClick={() => setShowAdvanced(true)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Filtros Avanzados
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help Section */}
        {!searchPerformed && !isLoading && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
            <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Consulta tus préstamos</h2>
            <p className="text-gray-600 mb-6">
              Busca en tus préstamos por título del libro, usa filtros para búsquedas específicas, o consulta todo tu historial
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowAdvanced(true)}
                className="px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Filtros Avanzados
              </button>
              <button
                onClick={loadAllLoans}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Todos mis Préstamos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loans;