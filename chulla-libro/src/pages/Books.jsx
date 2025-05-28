import React, { useState } from 'react';
import { Search, BookOpen, Filter, X, AlertCircle, Book, User, Tag, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { buscarLibrosConAND, buscarLibrosPorTitulo, buscarTodosLosLibros } from '../backend/libros';

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    titulo: '',
    autor: '',
    categoria: ''
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
    const { titulo, autor, categoria } = advancedFilters;
    if (!titulo.trim() && !autor.trim() && !categoria.trim()) {
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
      const results = await buscarLibrosPorTitulo(searchTerm);
      setBooks(results);
    } catch (err) {
      setError('Ha ocurrido un error al buscar los libros. Por favor, inténtalo nuevamente.');
      setBooks([]);
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
      const results = await buscarLibrosConAND(advancedFilters);
      setBooks(results);
      setShowAdvanced(false);
    } catch (err) {
      setError('Ha ocurrido un error en la búsqueda avanzada. Por favor, inténtalo nuevamente.');
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllBooks = async () => {
    setIsLoading(true);
    setError('');
    setSearchPerformed(true);

    try {
      const results = await buscarTodosLosLibros();
      setBooks(results);
    } catch (err) {
      setError('Ha ocurrido un error al cargar los libros. Por favor, inténtalo nuevamente.');
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setBooks([]);
    setError('');
    setSearchPerformed(false);
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({ titulo: '', autor: '', categoria: '' });
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with breadcrumb */}
        <div className="mb-8">

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Catálogo de Libros</h1>
                <p className="text-gray-600">Busca y explora nuestra colección de libros disponibles</p>
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
                  placeholder="Buscar libros por título..."
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
                  title="Búsqueda avanzada"
                >
                  <Filter className="w-5 h-5" />
                  Filtros
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <button
                  onClick={loadAllBooks}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="relative">
                    <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Título del libro"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={advancedFilters.titulo}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, titulo: e.target.value })}
                      onKeyPress={handleAdvancedKeyPress}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Autor"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={advancedFilters.autor}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, autor: e.target.value })}
                      onKeyPress={handleAdvancedKeyPress}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Categoría"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={advancedFilters.categoria}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, categoria: e.target.value })}
                      onKeyPress={handleAdvancedKeyPress}
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
            <p className="text-blue-700">Buscando libros...</p>
          </div>
        )}

        {/* Results Section */}
        {searchPerformed && !isLoading && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Resultados de la búsqueda
                {books.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({books.length} libro{books.length !== 1 ? 's' : ''} encontrado{books.length !== 1 ? 's' : ''})
                  </span>
                )}
              </h2>
            </div>

            <div className="p-6">
              {books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Book className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${book.Disponible
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {book.Disponible ? 'Disponible' : 'No Disponible'}
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                          {book.Titulo}
                        </h3>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="text-gray-600">Autor:</span>
                            <span className="font-medium text-gray-900">{book.Autor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span className="text-gray-600">Categoría:</span>
                            <span className="font-medium text-gray-900">{book.Categoria}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Book className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron libros</h3>
                  <p className="text-gray-600 mb-4">
                    Intenta con términos de búsqueda diferentes o usa la búsqueda avanzada
                  </p>
                  <button
                    onClick={() => setShowAdvanced(true)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Búsqueda Avanzada
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Explora nuestro catálogo</h2>
            <p className="text-gray-600 mb-6">
              Busca libros por título, usa la búsqueda avanzada para filtros específicos, o explora toda nuestra colección
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowAdvanced(true)}
                className="px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Búsqueda Avanzada
              </button>
              <button
                onClick={loadAllBooks}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Todos los Libros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;