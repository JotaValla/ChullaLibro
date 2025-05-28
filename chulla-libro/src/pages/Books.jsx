import { useState } from 'react';
import { Search, Filter, Book, AlertCircle, Loader } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Por favor ingrese un término de búsqueda');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const results = await buscarLibrosPorTitulo(searchTerm);
      setBooks(results);
    } catch (err) {
      setError('Error al buscar libros. Por favor intente nuevamente.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedSearch = async () => {
    const { titulo, autor, categoria } = advancedFilters;
    if (!titulo.trim() && !autor.trim() && !categoria.trim()) {
      setError('Por favor complete al menos un campo');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const results = await buscarLibrosConAND(advancedFilters);
      setBooks(results);
      setShowAdvanced(false);
    } catch (err) {
      setError('Error al buscar libros. Por favor intente nuevamente.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAllBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const results = await buscarTodosLosLibros();
      setBooks(results);
    } catch (err) {
      setError('Error al cargar libros. Por favor intente nuevamente.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
              <Loader className="w-6 h-6 text-blue-600 animate-spin" />
              <span className="text-lg font-medium text-gray-900">Cargando...</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm breadcrumbs mb-4">
            <span className="text-gray-500">Inicio</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-blue-600 font-medium">Catálogo</span>
          </nav>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Catálogo de Libros</h1>
                <p className="text-gray-600">Explora y descubre libros disponibles en ChullaLibro</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          {/* Simple Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar libros por título..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Buscar
              </button>
              <button 
                onClick={() => setShowAdvanced(true)}
                disabled={loading}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Avanzada
              </button>
              <button 
                onClick={loadAllBooks}
                disabled={loading}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Ver Todos
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Search Modal */}
        {showAdvanced && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Filter className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Búsqueda Avanzada</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                    <input
                      type="text"
                      placeholder="Ingresa el título del libro"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      value={advancedFilters.titulo}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, titulo: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
                    <input
                      type="text"
                      placeholder="Nombre del autor"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      value={advancedFilters.autor}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, autor: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                    <input
                      type="text"
                      placeholder="Género o categoría"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      value={advancedFilters.categoria}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, categoria: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={handleAdvancedSearch}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Confirmar
                  </button>
                  <button 
                    onClick={() => setShowAdvanced(false)}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.length > 0 ? (
            books.map((book, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Book className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      book.Disponible 
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
            ))
          ) : (
            !loading && (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron libros</h3>
                <p className="text-gray-600">Intenta ajustar tus criterios de búsqueda o explora el catálogo completo.</p>
                <button 
                  onClick={loadAllBooks}
                  className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Ver Todos los Libros
                </button>
              </div>
            )
          )}
        </div>

        {/* Results Summary */}
        {books.length > 0 && (
          <div className="mt-8 text-center py-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Se encontraron <span className="font-semibold text-gray-900">{books.length}</span> resultado{books.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;