import React, { useState, useMemo } from 'react'; // useMemo añadido
import { Search, BookOpen, Filter, X, AlertCircle, Book, User, Tag, Eye, ChevronDown, ChevronUp, SlidersHorizontal, ListFilter } from 'lucide-react'; // Iconos añadidos
import { buscarLibrosConAND, buscarLibrosPorTitulo, buscarTodosLosLibros, buscarLibrosConOR } from '../backend/libros'; // buscarLibrosConOR importado

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    titulo: '',
    autor: '',
    categoria: '',
  });
  // NUEVO ESTADO: Operador para la búsqueda avanzada
  const [advancedSearchOperator, setAdvancedSearchOperator] = useState('AND'); // 'AND' o 'OR'

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // NUEVOS ESTADOS: Para filtros post-búsqueda
  const [filterCategory, setFilterCategory] = useState(''); // Filtro por categoría seleccionada
  const [filterAvailability, setFilterAvailability] = useState(''); // 'all', 'available', 'unavailable'

  const validateSearchInput = () => {
    if (!searchTerm.trim()) {
      setError('Por favor ingresa un término de búsqueda');
      return false;
    }
    setError('');
    return true;
  };

  const validateAdvancedSearch = () => {
    const { titulo, autor, categoria } = advancedFilters;
    if (!titulo.trim() && !autor.trim() && !categoria.trim()) {
      setError('Por favor completa al menos un campo de búsqueda avanzada');
      return false;
    }
    setError('');
    return true;
  };

  const handleSearch = async () => {
    if (!validateSearchInput()) return;
    performSearch(async () => buscarLibrosPorTitulo(searchTerm));
  };

  const handleAdvancedSearch = async () => {
    if (!validateAdvancedSearch()) return;
    // Usar el operador seleccionado
    const searchFn = advancedSearchOperator === 'AND'
      ? () => buscarLibrosConAND(advancedFilters)
      : () => buscarLibrosConOR(advancedFilters);
    performSearch(searchFn, () => setShowAdvanced(false));
  };

  const loadAllBooks = async () => {
    performSearch(async () => buscarTodosLosLibros());
  };

  // Función genérica para realizar búsquedas y manejar estados
  const performSearch = async (searchFunction, onSuccessCallback) => {
    setIsLoading(true);
    setError('');
    setSearchPerformed(true);
    setBooks([]); // Limpiar resultados anteriores
    setFilterCategory(''); // Resetear filtros post-búsqueda
    setFilterAvailability(''); // Resetear filtros post-búsqueda

    try {
      const results = await searchFunction();
      setBooks(results);
      if (onSuccessCallback) onSuccessCallback();
    } catch (err) {
      setError('Ha ocurrido un error al obtener los libros. Por favor, inténtalo nuevamente.');
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
    setFilterCategory('');
    setFilterAvailability('');
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({ titulo: '', autor: '', categoria: '' });
    setAdvancedSearchOperator('AND');
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

  // Lógica para filtros post-búsqueda
  const availableCategories = useMemo(() => {
    const categories = new Set(books.map(book => book.categoria));
    return Array.from(categories).sort();
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const categoryMatch = filterCategory ? book.categoria === filterCategory : true;
      const availabilityMatch = filterAvailability
        ? (filterAvailability === 'available' ? book.disponible : !book.disponible)
        : true;
      return categoryMatch && availabilityMatch;
    });
  }, [books, filterCategory, filterAvailability]);


  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-600/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-400/10 to-cyan-600/10 rounded-full blur-3xl transform -translate-x-20 translate-y-20"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover-lift">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-color">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Catálogo de Libros
                </h1>
                <p className="text-lg text-gray-600 font-medium">Busca y explora nuestra colección de libros disponibles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 mb-8 hover-lift">
          <div className="space-y-6">
            {/* Simple Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Buscar por palabra clave en título..."
                  className="w-full pl-12 pr-12 py-4 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-800 font-medium bg-white/50 backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchTerm.trim()}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                >
                  <Search className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  {isLoading && searchTerm ? 'Buscando...' : 'Buscar'}
                </button>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="group px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-blue-300 text-blue-700 rounded-2xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-transparent transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                  title="Búsqueda avanzada"
                >
                  <SlidersHorizontal className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Avanzada
                  {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <button
                  onClick={loadAllBooks}
                  disabled={isLoading}
                  className="group px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-green-300 text-green-700 rounded-2xl hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white hover:border-transparent disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                >
                  <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Ver Todos
                </button>
              </div>
            </div>

            {/* Advanced Search */}
            {showAdvanced && (
              <div className="border-t pt-6 mt-6 space-y-6 bg-white p-6 rounded-lg shadow-md"> {/* Contenedor principal con más estilo */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Filter className="w-6 h-6 text-blue-600" />
                    Búsqueda Avanzada Detallada
                  </h3>
                  <button
                    onClick={() => setShowAdvanced(false)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Cerrar búsqueda avanzada"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Selector de Operador Lógico AND/OR */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mostrar libros que cumplan:
                  </label>
                  {/* NUEVO: Grupo de botones estilizados para el operador */}
                  <div className="flex w-full sm:w-auto rounded-md shadow-sm border border-gray-300" role="group">
                    <button
                      type="button"
                      onClick={() => !isLoading && setAdvancedSearchOperator('AND')}
                      disabled={isLoading}
                      className={`
                        px-4 py-2 text-sm font-medium flex-1 
                        focus:z-10 focus:outline-none transition-colors duration-150 ease-in-out
                        rounded-l-md border-r border-gray-300 
                        ${advancedSearchOperator === 'AND'
                          ? 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-1' // Estilo activo para AND
                          : 'bg-white text-gray-700 hover:bg-gray-100' // Estilo inactivo
                        }
                        ${isLoading ? 'cursor-not-allowed opacity-60' : 'hover:shadow-md'}
                      `}
                    >
                      TODOS los criterios (Y)
                    </button>
                    <button
                      type="button"
                      onClick={() => !isLoading && setAdvancedSearchOperator('OR')}
                      disabled={isLoading}
                      className={`
                        px-4 py-2 text-sm font-medium flex-1 
                        focus:z-10 focus:outline-none transition-colors duration-150 ease-in-out
                        rounded-r-md 
                        ${advancedSearchOperator === 'OR'
                          ? 'bg-purple-600 text-white ring-2 ring-purple-500 ring-offset-1' // Estilo activo para OR
                          : 'bg-white text-gray-700 hover:bg-gray-100' // Estilo inactivo
                        }
                        ${isLoading ? 'cursor-not-allowed opacity-60' : 'hover:shadow-md'}
                      `}
                    >
                      CUALQUIER criterio (O)
                    </button>
                  </div>
                </div>

                {/* Campos de búsqueda estilizados como filas */}
                <div className="space-y-5">
                  {/* Fila Título */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <label htmlFor="adv-titulo" className="w-full sm:w-24 text-sm font-medium text-gray-600 sm:text-right flex-shrink-0">
                      Título:
                    </label>
                    <div className="flex-1 relative w-full">
                      <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                      <input
                        id="adv-titulo"
                        type="text" placeholder="Contiene las palabras..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        value={advancedFilters.titulo}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, titulo: e.target.value })}
                        onKeyPress={handleAdvancedKeyPress} disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Conector Visual (Y/O) */}
                  <div className="flex items-center my-1">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className={`mx-3 text-xs font-semibold px-2.5 py-1 rounded-full
                                      ${advancedSearchOperator === 'AND' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {advancedSearchOperator === 'AND' ? 'Y ADEMÁS' : 'O BIEN'}
                    </span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  {/* Fila Autor */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <label htmlFor="adv-autor" className="w-full sm:w-24 text-sm font-medium text-gray-600 sm:text-right flex-shrink-0">
                      Autor:
                    </label>
                    <div className="flex-1 relative w-full">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                      <input
                        id="adv-autor"
                        type="text" placeholder="Contiene el nombre..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        value={advancedFilters.autor}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, autor: e.target.value })}
                        onKeyPress={handleAdvancedKeyPress} disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Conector Visual (Y/O) */}
                  <div className="flex items-center my-1">
                     <div className="flex-grow border-t border-gray-200"></div>
                    <span className={`mx-3 text-xs font-semibold px-2.5 py-1 rounded-full
                                      ${advancedSearchOperator === 'AND' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {advancedSearchOperator === 'AND' ? 'Y ADEMÁS' : 'O BIEN'}
                    </span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  {/* Fila Categoría */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <label htmlFor="adv-categoria" className="w-full sm:w-24 text-sm font-medium text-gray-600 sm:text-right flex-shrink-0">
                      Categoría:
                    </label>
                    <div className="flex-1 relative w-full">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                      <input
                        id="adv-categoria"
                        type="text" placeholder="Pertenece a..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        value={advancedFilters.categoria}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, categoria: e.target.value })}
                        onKeyPress={handleAdvancedKeyPress} disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row gap-3 pt-5 mt-5 border-t border-gray-200">
                  <button
                    onClick={handleAdvancedSearch}
                    disabled={isLoading || (!advancedFilters.titulo.trim() && !advancedFilters.autor.trim() && !advancedFilters.categoria.trim())}
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Search size={18}/>
                    <span>
                      {isLoading && (advancedFilters.titulo || advancedFilters.autor || advancedFilters.categoria) ? 'Buscando...' : 'Aplicar Búsqueda'}
                    </span>
                  </button>
                  <button 
                    onClick={clearAdvancedFilters} 
                    className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                  >
                    Limpiar Filtros
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
            <p className="text-blue-700">Obteniendo libros...</p>
          </div>
        )}

        {/* Results Section */}
        {searchPerformed && !isLoading && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Resultados de la búsqueda
                  {filteredBooks.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({filteredBooks.length} de {books.length} libro{books.length !== 1 ? 's' : ''} mostrado{books.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </h2>
                {/* NUEVO: Filtros Post-Búsqueda UI */}
                {books.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full sm:w-auto pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm bg-white"
                        title="Filtrar por categoría"
                      >
                        <option value="">Todas las Categorías</option>
                        {availableCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={filterAvailability}
                        onChange={(e) => setFilterAvailability(e.target.value)}
                        className="w-full sm:w-auto pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm bg-white"
                        title="Filtrar por disponibilidad"
                      >
                        <option value="">Toda Disponibilidad</option>
                        <option value="available">Disponible</option>
                        <option value="unavailable">No Disponible</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks.map((book) => ( // Usar filteredBooks aquí
                    <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col">
                      {/* Imagen de portada o placeholder */}
                       <div className="w-full h-48 bg-gray-100 flex items-center justify-center border-b">
                         {book.imagen_portada ? (
                           <img src={book.imagen_portada} alt={`Portada de ${book.titulo}`} className="w-full h-48 object-cover"/>
                         ) : (
                           <img src="/book.png" alt={`Portada de ${book.titulo}`} className="w-full h-48 object-cover"/>
                         )}
                       </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
                            {book.titulo || 'Título no disponible'}
                          </h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${book.disponible
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {book.disponible ? 'Disponible' : 'No Disponible'}
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-500" />
                            <span>{book.autor || 'Autor no disponible'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag size={14} className="text-gray-500" />
                            <span>{book.categoria || book.categorias?.nombre || 'Categoría no disponible'}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow">
                          {book.descripcion || 'Este es un espacio para un breve resumen o descripción del libro. Ayuda al usuario a decidir si el libro es relevante.'}
                        </p>

                        <div className="mt-auto pt-4 border-t border-gray-100">
                           <button className="w-full px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                             Ver Detalles
                           </button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {books.length > 0 ? 'Ningún libro coincide con los filtros actuales.' : 'No se encontraron libros para tu búsqueda.'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {books.length > 0 ? 'Intenta ajustar los filtros o ' : 'Intenta con términos de búsqueda diferentes o '}
                    <button
                      onClick={() => {
                        if (books.length > 0) {
                          setFilterCategory('');
                          setFilterAvailability('');
                        } else {
                          setShowAdvanced(true);
                        }
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      {books.length > 0 ? 'limpiar filtros.' : 'usa la búsqueda avanzada.'}
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help Section (cuando no hay búsqueda activa) */}
        {!searchPerformed && !isLoading && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
            <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Explora nuestro catálogo</h2>
            <p className="text-gray-600 mb-6">
              Busca libros por título o palabra clave, usa la búsqueda avanzada para filtros específicos, o explora toda nuestra colección.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowAdvanced(true)}
                className="px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
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