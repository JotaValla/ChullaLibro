import React, { useState, useMemo, useEffect, useRef } from 'react'; // Agregando useEffect y useRef
import { Search, BookOpen, Filter, X, AlertCircle, Book, User, Tag, Eye, ChevronDown, ChevronUp, SlidersHorizontal, ListFilter, Clock, CheckCircle, Loader2, RefreshCw, Hash, Calendar, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'; // Iconos mejorados
import { buscarLibrosConAND, buscarLibrosPorTitulo, buscarTodosLosLibros, buscarLibrosConOR } from '../backend/libros';

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
  const [filterAuthor, setFilterAuthor] = useState(''); // Filtro por autor
  const [filterYear, setFilterYear] = useState(''); // Filtro por año de publicación
  const [sortBy, setSortBy] = useState('relevancia'); // Ordenamiento: relevancia, titulo, autor, año
  const [sortOrder, setSortOrder] = useState('desc'); // asc o desc

  // NUEVOS ESTADOS PARA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // 12 libros por página por defecto

  // NUEVOS ESTADOS PARA MEJORAR UX
  const [searchHistory, setSearchHistory] = useState([]); // Historial de búsquedas
  const [lastSearchTerm, setLastSearchTerm] = useState(''); // Último término buscado
  const [searchStartTime, setSearchStartTime] = useState(null); // Tiempo de inicio de búsqueda
  const [searchDuration, setSearchDuration] = useState(null); // Duración de la búsqueda
  const [showFilters, setShowFilters] = useState(false); // Mostrar panel de filtros
  const [highlightTerms, setHighlightTerms] = useState([]); // Términos a resaltar
  
  // Refs para accesibilidad
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);

  // NUEVA FUNCIÓN: Para búsqueda inteligente
  const performIntelligentSearch = async (term) => {
    // Buscar en título, autor y descripción
    const searchFunction = async () => {
      // Primero buscar por título exacto
      let results = await buscarLibrosPorTitulo(term);
      
      // Si no hay resultados, buscar con tolerancia a errores
      if (results.length === 0) {
        // Buscar por partes del término
        const palabras = term.split(' ').filter(p => p.length > 2);
        if (palabras.length > 0) {
          for (const palabra of palabras) {
            const partialResults = await buscarLibrosPorTitulo(palabra);
            results = [...results, ...partialResults];
          }
          // Eliminar duplicados
          results = results.filter((libro, index, self) => 
            index === self.findIndex(l => l.id === libro.id)
          );
        }
      }
      
      return results;
    };
    
    return performSearch(searchFunction);
  };

  // NUEVA FUNCIÓN: Resaltar términos en texto
  const highlightText = (text, terms) => {
    if (!text || !terms.length) return text;
    
    let highlightedText = text;
    terms.forEach(term => {
      if (term && term.trim()) {
        // Escapar caracteres especiales de regex
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedTerm})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
      }
    });
    
    return highlightedText;
  };

  // NUEVA FUNCIÓN: Añadir al historial de búsqueda
  const addToSearchHistory = (term, resultsCount) => {
    const newEntry = {
      term,
      resultsCount,
      timestamp: new Date(),
      id: Date.now()
    };
    
    setSearchHistory(prev => {
      const filtered = prev.filter(entry => entry.term !== term);
      return [newEntry, ...filtered].slice(0, 5); // Mantener solo 5 entradas
    });
  };

  const validateSearchInput = () => {
    if (!searchTerm.trim()) {
      setError('Por favor ingresa un término de búsqueda');
      return false;
    }
    if (searchTerm.trim().length < 2) {
      setError('El término de búsqueda debe tener al menos 2 caracteres');
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
    
    // Configurar términos para resaltar
    const terms = searchTerm.trim().split(' ').filter(t => t.length > 1);
    setHighlightTerms(terms);
    setLastSearchTerm(searchTerm);
    
    // Resetear paginación
    setCurrentPage(1);
    
    await performIntelligentSearch(searchTerm);
  };

  const handleAdvancedSearch = async () => {
    if (!validateAdvancedSearch()) return;
    
    // Configurar términos para resaltar
    const { titulo, autor, categoria } = advancedFilters;
    const terms = [titulo, autor, categoria]
      .filter(t => t.trim())
      .join(' ')
      .split(' ')
      .filter(t => t.length > 1);
    setHighlightTerms(terms);
    
    // Resetear paginación
    setCurrentPage(1);
    
    // Usar el operador seleccionado
    const searchFn = advancedSearchOperator === 'AND'
      ? () => buscarLibrosConAND(advancedFilters)
      : () => buscarLibrosConOR(advancedFilters);
    await performSearch(searchFn, () => setShowAdvanced(false));
  };

  const loadAllBooks = async () => {
    setHighlightTerms([]);
    setLastSearchTerm('Todos los libros');
    
    // Resetear paginación
    setCurrentPage(1);
    
    await performSearch(async () => buscarTodosLosLibros());
  };

  // Función genérica MEJORADA para realizar búsquedas y manejar estados
  const performSearch = async (searchFunction, onSuccessCallback) => {
    setIsLoading(true);
    setError('');
    setSearchPerformed(true);
    setBooks([]); // Limpiar resultados anteriores
    setFilterCategory(''); // Resetear filtros post-búsqueda
    setFilterAvailability(''); // Resetear filtros post-búsqueda
    setSearchStartTime(Date.now()); // Iniciar timer
    setShowFilters(false); // Ocultar filtros hasta tener resultados

    try {
      const results = await searchFunction();
      const duration = Date.now() - searchStartTime;
      setSearchDuration(duration);
      setBooks(results);
      
      // Añadir al historial si es una búsqueda por término
      if (lastSearchTerm && lastSearchTerm !== 'Todos los libros') {
        addToSearchHistory(lastSearchTerm, results.length);
      }
      
      // Mostrar filtros si hay resultados
      if (results.length > 0) {
        setTimeout(() => setShowFilters(true), 300);
      }
      
      // Scroll to results
      if (resultsRef.current) {
        setTimeout(() => {
          resultsRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 100);
      }
      
      if (onSuccessCallback) onSuccessCallback();
    } catch (err) {
      setError('Ha ocurrido un error al obtener los libros. Por favor, inténtalo nuevamente.');
      setBooks([]);
      setSearchDuration(null);
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
    setFilterAuthor('');
    setFilterYear('');
    setSortBy('relevancia');
    setSortOrder('desc');
    setCurrentPage(1);
    setHighlightTerms([]);
    setLastSearchTerm('');
    setSearchDuration(null);
    setShowFilters(false);
    
    // Focus en campo de búsqueda
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({ titulo: '', autor: '', categoria: '' });
    setAdvancedSearchOperator('AND');
    setError('');
    setHighlightTerms([]);
  };

  const clearAllFilters = () => {
    setFilterCategory('');
    setFilterAvailability('');
    setFilterAuthor('');
    setFilterYear('');
    setSortBy('relevancia');
    setSortOrder('desc');
    setCurrentPage(1); // Resetear a la primera página
  };

  // NUEVAS FUNCIONES: Manejo de filtros en cascada
  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
    setCurrentPage(1); // Resetear a la primera página
    // Resetear filtros dependientes cuando cambia la categoría
    if (category !== filterCategory) {
      setFilterAuthor(''); // Limpiar autor porque las opciones cambiarán
      setFilterYear(''); // Limpiar año porque las opciones cambiarán
    }
  };

  const handleAuthorFilter = (author) => {
    setFilterAuthor(author);
    setCurrentPage(1); // Resetear a la primera página
    // Resetear filtros dependientes cuando cambia el autor
    if (author !== filterAuthor) {
      setFilterYear(''); // Limpiar año porque las opciones cambiarán
    }
  };

  const handleYearFilter = (year) => {
    setFilterYear(year);
    setCurrentPage(1); // Resetear a la primera página
    // El año es el último filtro, no necesita resetear otros
  };

  const handleAvailabilityFilter = (availability) => {
    setFilterAvailability(availability);
    setCurrentPage(1); // Resetear a la primera página
    // La disponibilidad no afecta otros filtros en cascada
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

  // LÓGICA MEJORADA para filtros post-búsqueda con contadores y FILTROS CASCADA
  const availableCategories = useMemo(() => {
    const categoryCount = {};
    books.forEach(book => {
      const cat = book.categoria || 'Sin categoría';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count); // Ordenar por cantidad descendente
  }, [books]);

  // NUEVO: Autores disponibles basados en filtros activos
  const availableAuthors = useMemo(() => {
    // Filtrar libros primero por categoría si está seleccionada
    let filteredBooks = books;
    
    if (filterCategory) {
      filteredBooks = filteredBooks.filter(book => book.categoria === filterCategory);
    }
    
    const authorCount = {};
    filteredBooks.forEach(book => {
      const author = book.autor || 'Autor desconocido';
      authorCount[author] = (authorCount[author] || 0) + 1;
    });
    
    return Object.entries(authorCount)
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count);
  }, [books, filterCategory]);

  // NUEVO: Años disponibles basados en filtros activos
  const availableYears = useMemo(() => {
    // Filtrar libros por filtros activos
    let filteredBooks = books;
    
    if (filterCategory) {
      filteredBooks = filteredBooks.filter(book => book.categoria === filterCategory);
    }
    
    if (filterAuthor) {
      filteredBooks = filteredBooks.filter(book => book.autor === filterAuthor);
    }
    
    const yearCount = {};
    filteredBooks.forEach(book => {
      const year = book.anio_publicacion || book.año_publicacion || 'Año desconocido';
      yearCount[year] = (yearCount[year] || 0) + 1;
    });
    
    return Object.entries(yearCount)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => {
        if (a.year === 'Año desconocido') return 1;
        if (b.year === 'Año desconocido') return -1;
        return b.year - a.year;
      });
  }, [books, filterCategory, filterAuthor]);

  // NUEVO: Estados de disponibilidad basados en filtros activos
  const availableAvailabilityStats = useMemo(() => {
    // Filtrar libros por filtros activos
    let filteredBooks = books;
    
    if (filterCategory) {
      filteredBooks = filteredBooks.filter(book => book.categoria === filterCategory);
    }
    
    if (filterAuthor) {
      filteredBooks = filteredBooks.filter(book => book.autor === filterAuthor);
    }
    
    if (filterYear) {
      filteredBooks = filteredBooks.filter(book => 
        (book.anio_publicacion || book.año_publicacion) == filterYear
      );
    }
    
    const stats = filteredBooks.reduce((acc, book) => {
      if (book.disponible) {
        acc.available++;
      } else {
        acc.unavailable++;
      }
      return acc;
    }, { available: 0, unavailable: 0 });
    
    return stats;
  }, [books, filterCategory, filterAuthor, filterYear]);

  const availabilityStats = useMemo(() => {
    const stats = books.reduce((acc, book) => {
      if (book.disponible) {
        acc.available++;
      } else {
        acc.unavailable++;
      }
      return acc;
    }, { available: 0, unavailable: 0 });
    
    return stats;
  }, [books]);

  const filteredBooks = useMemo(() => {
    let filtered = books.filter(book => {
      const categoryMatch = filterCategory ? book.categoria === filterCategory : true;
      const availabilityMatch = filterAvailability
        ? (filterAvailability === 'available' ? book.disponible : !book.disponible)
        : true;
      const authorMatch = filterAuthor ? book.autor === filterAuthor : true;
      const yearMatch = filterYear ? (book.anio_publicacion || book.año_publicacion) == filterYear : true;
      
      return categoryMatch && availabilityMatch && authorMatch && yearMatch;
    });

    // Aplicar ordenamiento
    if (sortBy !== 'relevancia') {
      filtered.sort((a, b) => {
        let valueA, valueB;
        
        switch (sortBy) {
          case 'titulo':
            valueA = (a.titulo || '').toLowerCase();
            valueB = (b.titulo || '').toLowerCase();
            break;
          case 'autor':
            valueA = (a.autor || '').toLowerCase();
            valueB = (b.autor || '').toLowerCase();
            break;
          case 'año':
            valueA = a.anio_publicacion || a.año_publicacion || 0;
            valueB = b.anio_publicacion || b.año_publicacion || 0;
            break;
          default:
            return 0;
        }
        
        if (sortOrder === 'asc') {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else {
          return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        }
      });
    }

    return filtered;
  }, [books, filterCategory, filterAvailability, filterAuthor, filterYear, sortBy, sortOrder]);

  // LÓGICA DE PAGINACIÓN
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  // Funciones de paginación
  const goToPage = (page) => {
    setCurrentPage(page);
    // Scroll hacia arriba para ver los nuevos resultados
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const delta = 2; // Páginas a mostrar a cada lado de la página actual
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  // NUEVA FUNCIÓN: Obtener sugerencias de búsqueda
  const getSuggestions = () => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const suggestions = [];
    const term = searchTerm.toLowerCase();
    
    // Sugerencias basadas en historial
    searchHistory.forEach(entry => {
      if (entry.term.toLowerCase().includes(term) && entry.term !== searchTerm) {
        suggestions.push({
          text: entry.term,
          type: 'history',
          count: entry.resultsCount
        });
      }
    });
    
    return suggestions.slice(0, 3);
  };


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

        {/* SECCIÓN DE BÚSQUEDA MEJORADA */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 mb-8 hover-lift">
          <div className="space-y-6">
            {/* Barra de Búsqueda Principal con Autocompletado */}
            <div className="flex flex-col gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-6 h-6 z-10">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Search className="w-6 h-6" />
                  )}
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar por título, autor o descripción... (min. 2 caracteres)"
                  className="w-full pl-12 pr-12 py-4 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-800 font-medium bg-white/50 backdrop-blur-sm text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  autoComplete="off"
                  aria-label="Campo de búsqueda principal"
                  aria-describedby="search-help"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200 z-10"
                    title="Limpiar búsqueda"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
                
                {/* Sugerencias de Autocompletado */}
                {searchTerm.length > 1 && getSuggestions().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                    <div className="p-2">
                      <div className="text-xs text-gray-500 px-3 py-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Búsquedas recientes:
                      </div>
                      {getSuggestions().map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchTerm(suggestion.text);
                            setTimeout(() => handleSearch(), 100);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-purple-50 rounded flex items-center justify-between group"
                        >
                          <span className="text-gray-700">{suggestion.text}</span>
                          <span className="text-xs text-gray-400 group-hover:text-purple-600">
                            {suggestion.count} resultados
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Ayuda contextual */}
              <div id="search-help" className="text-sm text-gray-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Búsqueda inteligente: encuentra libros por título, autor o contenido. 
                  Soporta búsqueda parcial y tolerancia a errores.
                </span>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !searchTerm.trim() || searchTerm.trim().length < 2}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold min-w-[140px]"
                  aria-label="Ejecutar búsqueda"
                >
                  {isLoading && searchTerm ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                      Buscar
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="group px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-blue-300 text-blue-700 rounded-2xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-transparent transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                  title="Búsqueda avanzada con filtros múltiples"
                  aria-label="Abrir búsqueda avanzada"
                >
                  <SlidersHorizontal className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Avanzada
                  {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={loadAllBooks}
                  disabled={isLoading}
                  className="group px-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-green-300 text-green-700 rounded-2xl hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white hover:border-transparent disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                  aria-label="Mostrar todos los libros disponibles"
                >
                  <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Ver Todos
                </button>

                {/* Botón de Actualizar cuando hay resultados */}
                {searchPerformed && (
                  <button
                    onClick={() => {
                      if (lastSearchTerm && lastSearchTerm !== 'Todos los libros') {
                        handleSearch();
                      } else {
                        loadAllBooks();
                      }
                    }}
                    disabled={isLoading}
                    className="group px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-100 hover:border-gray-400 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                    title="Actualizar resultados"
                    aria-label="Actualizar resultados de búsqueda"
                  >
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                    <span className="hidden sm:inline">Actualizar</span>
                  </button>
                )}
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

        {/* MANEJO DE ERRORES MEJORADO */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Error en la búsqueda
                </h3>
                <p className="text-red-700 mb-4">
                  {error}
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-red-600 font-medium">¿Qué puedes hacer?</p>
                  <ul className="text-sm text-red-600 space-y-1 ml-4">
                    <li>• Verifica tu conexión a internet</li>
                    <li>• Intenta con términos de búsqueda diferentes</li>
                    <li>• Actualiza la página si el problema persiste</li>
                  </ul>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setError('');
                      if (lastSearchTerm && lastSearchTerm !== 'Todos los libros') {
                        handleSearch();
                      } else {
                        loadAllBooks();
                      }
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reintentar
                  </button>
                  <button
                    onClick={() => setError('')}
                    className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ESTADO DE CARGA MEJORADO */}
        {isLoading && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-8 text-center mb-6 shadow-lg">
            <div className="space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-purple-100 flex items-center justify-center">
                  <Search className="w-6 h-6 text-purple-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-purple-900">
                  {searchTerm ? `Buscando "${searchTerm}"...` : 'Obteniendo libros...'}
                </p>
                <p className="text-sm text-purple-600">
                  Buscando en título, autor y descripción
                </p>
              </div>
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN DE RESULTADOS MEJORADA */}
        {searchPerformed && !isLoading && (
          <div ref={resultsRef} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            {/* Header de Resultados con Estadísticas */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                    Resultados de Búsqueda
                    {lastSearchTerm && (
                      <span className="text-sm font-normal bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
                        "{lastSearchTerm}"
                      </span>
                    )}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-slate-500" />
                      <span>
                        {filteredBooks.length} de {books.length} libro{books.length !== 1 ? 's' : ''} 
                        {filteredBooks.length !== books.length ? ' (filtrado)' : ''}
                      </span>
                    </div>
                    
                    {searchDuration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>
                          Encontrado en {searchDuration}ms
                        </span>
                      </div>
                    )}
                    
                    {books.length > 0 && (
                      <div className="flex items-center gap-4">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                          📚 {availabilityStats.available} disponibles
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          🔒 {availabilityStats.unavailable} no disponibles
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controles de Filtros */}
                <div className="flex gap-2">
                  {(filterCategory || filterAvailability || filterAuthor || filterYear || sortBy !== 'relevancia') && (
                    <button
                      onClick={clearAllFilters}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
                      title="Limpiar todos los filtros"
                    >
                      <X className="w-4 h-4" />
                      <span className="hidden sm:inline">Limpiar Filtros</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sección de Filtros y Ordenamiento Expandida */}
            {books.length > 0 && showFilters && (
              <div className="bg-slate-50 border-b border-slate-200 p-6 animate-in slide-in-from-top-3 duration-300">
                <div className="space-y-6">
                  
                  {/* Controles de Ordenamiento */}
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      Ordenar Resultados
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="relevancia">Relevancia</option>
                          <option value="titulo">Título</option>
                          <option value="autor">Autor</option>
                          <option value="año">Año de Publicación</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          disabled={sortBy === 'relevancia'}
                        >
                          <option value="asc">Ascendente (A-Z, 0-9)</option>
                          <option value="desc">Descendente (Z-A, 9-0)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Información sobre filtros en cascada */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2 text-blue-800 text-sm">
                      <Filter className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Filtros Inteligentes:</span>
                        <span className="ml-1">
                          Los filtros se actualizan automáticamente según tu selección. 
                          Elige una categoría → se actualizan los autores → se actualizan los años.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grid de Filtros */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Filtros por Categoría */}
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <label className="flex text-sm font-semibold text-slate-700 mb-3 items-center gap-2">
                        <Tag className="w-4 h-4 text-blue-600" />
                        Categoría
                      </label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="category"
                            value=""
                            checked={filterCategory === ''}
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">Todas</span>
                          <span className="ml-auto text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            {books.length}
                          </span>
                        </label>
                        {availableCategories.slice(0, 5).map(({ category, count }) => (
                          <label key={category} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                            <input
                              type="radio"
                              name="category"
                              value={category}
                              checked={filterCategory === category}
                              onChange={(e) => handleCategoryFilter(e.target.value)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm truncate">{category || 'Sin categoría'}</span>
                            <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {count}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Filtros por Autor */}
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <label className="flex text-sm font-semibold text-slate-700 mb-3 items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        Autor
                        {filterCategory && (
                          <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                            en {filterCategory}
                          </span>
                        )}
                      </label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="author"
                            value=""
                            checked={filterAuthor === ''}
                            onChange={(e) => handleAuthorFilter(e.target.value)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm">Todos</span>
                          <span className="ml-auto text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            {availableAuthors.reduce((sum, author) => sum + author.count, 0)}
                          </span>
                        </label>
                        {availableAuthors.slice(0, 5).map(({ author, count }) => (
                          <label key={author} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                            <input
                              type="radio"
                              name="author"
                              value={author}
                              checked={filterAuthor === author}
                              onChange={(e) => handleAuthorFilter(e.target.value)}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-sm truncate">{author}</span>
                            <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                              {count}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Filtros por Año */}
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <label className="flex text-sm font-semibold text-slate-700 mb-3 items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        Año
                        {(filterCategory || filterAuthor) && (
                          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                            {filterCategory && filterAuthor 
                              ? `${filterAuthor} en ${filterCategory}`
                              : filterCategory 
                                ? `en ${filterCategory}`
                                : `de ${filterAuthor}`
                            }
                          </span>
                        )}
                      </label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="year"
                            value=""
                            checked={filterYear === ''}
                            onChange={(e) => handleYearFilter(e.target.value)}
                            className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-sm">Todos</span>
                          <span className="ml-auto text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            {availableYears.reduce((sum, year) => sum + year.count, 0)}
                          </span>
                        </label>
                        {availableYears.slice(0, 5).map(({ year, count }) => (
                          <label key={year} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                            <input
                              type="radio"
                              name="year"
                              value={year}
                              checked={filterYear === year}
                              onChange={(e) => handleYearFilter(e.target.value)}
                              className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-sm">{year}</span>
                            <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                              {count}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Filtros por Disponibilidad */}
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <label className="flex text-sm font-semibold text-slate-700 mb-3 items-center gap-2">
                        <BookOpen className="w-4 h-4 text-violet-600" />
                        Disponibilidad
                        {(filterCategory || filterAuthor || filterYear) && (
                          <span className="text-xs text-violet-600 bg-violet-100 px-2 py-1 rounded-full">
                            filtrado
                          </span>
                        )}
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="availability"
                            value=""
                            checked={filterAvailability === ''}
                            onChange={(e) => handleAvailabilityFilter(e.target.value)}
                            className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                          />
                          <span className="text-sm">Todos</span>
                          <span className="ml-auto text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            {availableAvailabilityStats.available + availableAvailabilityStats.unavailable}
                          </span>
                        </label>
                        <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="availability"
                            value="available"
                            checked={filterAvailability === 'available'}
                            onChange={(e) => handleAvailabilityFilter(e.target.value)}
                            className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                          />
                          <span className="text-sm flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            Disponibles
                          </span>
                          <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                            {availableAvailabilityStats.available}
                          </span>
                        </label>
                        <label className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="availability"
                            value="unavailable"
                            checked={filterAvailability === 'unavailable'}
                            onChange={(e) => handleAvailabilityFilter(e.target.value)}
                            className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                          />
                          <span className="text-sm flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            No Disponibles
                          </span>
                          <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            {availableAvailabilityStats.unavailable}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Resumen de Filtros Activos */}
                  {(filterCategory || filterAvailability || filterAuthor || filterYear || sortBy !== 'relevancia') && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-800 text-sm">
                          <Filter className="w-4 h-4" />
                          <span className="font-medium">Filtros activos:</span>
                          <div className="flex flex-wrap gap-2">
                            {filterCategory && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                Categoría: {filterCategory}
                              </span>
                            )}
                            {filterAuthor && (
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                                Autor: {filterAuthor}
                              </span>
                            )}
                            {filterYear && (
                              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                                Año: {filterYear}
                              </span>
                            )}
                            {filterAvailability && (
                              <span className="bg-violet-100 text-violet-800 px-2 py-1 rounded-full text-xs">
                                {filterAvailability === 'available' ? 'Solo disponibles' : 'Solo no disponibles'}
                              </span>
                            )}
                            {sortBy !== 'relevancia' && (
                              <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-full text-xs">
                                Orden: {sortBy} ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={clearAllFilters}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Limpiar todo
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Contenido de Resultados */}
            <div className="p-6">
              {filteredBooks.length > 0 ? (
                <div className="space-y-4">
                  {/* Información adicional si hay filtros activos */}
                  {(filterCategory || filterAvailability || filterAuthor || filterYear) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-blue-800 text-sm">
                        <Filter className="w-4 h-4" />
                        <span className="font-medium">Filtros activos:</span>
                        <div className="flex flex-wrap gap-2">
                          {filterCategory && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              Categoría: {filterCategory}
                            </span>
                          )}
                          {filterAuthor && (
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                              Autor: {filterAuthor}
                            </span>
                          )}
                          {filterYear && (
                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                              Año: {filterYear}
                            </span>
                          )}
                          {filterAvailability && (
                            <span className="bg-violet-100 text-violet-800 px-2 py-1 rounded-full text-xs">
                              {filterAvailability === 'available' ? 'Solo disponibles' : 'Solo no disponibles'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Grid de Libros Mejorado */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentBooks.map((book, index) => (
                      <div 
                        key={book.id} 
                        className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Imagen de portada mejorada */}
                        <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          {book.imagen_portada ? (
                            <img 
                              src={book.imagen_portada} 
                              alt={`Portada de ${book.titulo}`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                              <img 
                                src="/book.png" 
                                alt={`Portada de ${book.titulo}`} 
                                className="w-24 h-24 opacity-60 group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          )}
                          
                          {/* Badge de disponibilidad flotante */}
                          <div className="absolute top-3 right-3">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                              book.disponible
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                            }`}>
                              {book.disponible ? '✓ Disponible' : '✗ No Disponible'}
                            </div>
                          </div>
                        </div>

                        {/* Contenido del libro */}
                        <div className="p-6 flex flex-col h-full">
                          {/* Título con resaltado */}
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-purple-700 transition-colors">
                            <span 
                              dangerouslySetInnerHTML={{
                                __html: highlightText(book.titulo || 'Título no disponible', highlightTerms)
                              }}
                            />
                          </h3>
                          
                          {/* Metadatos del libro */}
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              <span 
                                className="truncate"
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(book.autor || 'Autor no disponible', highlightTerms)
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-blue-400 flex-shrink-0" />
                              <span className="truncate">
                                {book.categoria || book.categorias?.nombre || 'Sin categoría'}
                              </span>
                            </div>
                          </div>

                          {/* Descripción con resaltado */}
                          <div className="flex-grow">
                            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                              <span 
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(
                                    book.descripcion || 'Descripción no disponible. Este libro está en nuestra colección y puede contener información valiosa.',
                                    highlightTerms
                                  )
                                }}
                              />
                            </p>
                          </div>

                          {/* Acciones del libro */}
                          <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                            <button 
                              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                              disabled={!book.disponible}
                            >
                              <BookOpen className="w-4 h-4" />
                              {book.disponible ? 'Ver Detalles' : 'No Disponible'}
                            </button>
                            
                            {book.disponible && (
                              <button className="w-full px-4 py-2 bg-white border-2 border-purple-200 text-purple-700 text-sm font-medium rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 flex items-center justify-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Reservar Libro
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                      {/* Información de paginación */}
                      <div className="text-sm text-slate-600">
                        Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                        <span className="font-medium">{Math.min(endIndex, filteredBooks.length)}</span> de{' '}
                        <span className="font-medium">{filteredBooks.length}</span> libros
                      </div>

                      {/* Control de elementos por página */}
                      <div className="flex items-center gap-2 text-sm">
                        <label htmlFor="itemsPerPage" className="text-slate-600">
                          Mostrar:
                        </label>
                        <select
                          id="itemsPerPage"
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={6}>6</option>
                          <option value={12}>12</option>
                          <option value={24}>24</option>
                          <option value={48}>48</option>
                        </select>
                        <span className="text-slate-600">por página</span>
                      </div>

                      {/* Controles de paginación */}
                      <div className="flex items-center gap-2">
                        {/* Botón anterior */}
                        <button
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Anterior
                        </button>

                        {/* Números de página */}
                        <div className="flex items-center gap-1">
                          {getPageNumbers().map((pageNumber, index) => (
                            <div key={index}>
                              {pageNumber === '...' ? (
                                <span className="px-3 py-2 text-slate-500">...</span>
                              ) : (
                                <button
                                  onClick={() => goToPage(pageNumber)}
                                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    currentPage === pageNumber
                                      ? 'bg-blue-600 text-white'
                                      : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Botón siguiente */}
                        <button
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Siguiente
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    {books.length > 0 ? (
                      // Sin resultados por filtros
                      <div className="space-y-6">
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                          <Filter className="w-10 h-10 text-yellow-600" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            Ningún libro coincide con los filtros
                          </h3>
                          <p className="text-gray-600">
                            Hay {books.length} libro{books.length !== 1 ? 's' : ''} en los resultados, 
                            pero ninguno coincide con los filtros seleccionados.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <button
                            onClick={clearAllFilters}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <X className="w-5 h-5" />
                            Limpiar Todos los Filtros
                          </button>
                          <div className="text-sm text-gray-500">
                            O ajusta los filtros en el panel superior
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Sin resultados de búsqueda
                      <div className="space-y-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                          <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            No se encontraron libros
                          </h3>
                          <p className="text-gray-600">
                            No pudimos encontrar libros que coincidan con "{lastSearchTerm}".
                            Intenta con diferentes términos o explora nuestras sugerencias.
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="text-left bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Sugerencias para mejorar tu búsqueda:
                            </h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>• Verifica la ortografía de las palabras</li>
                              <li>• Usa términos más generales (ej: "programación" en lugar de "JavaScript")</li>
                              <li>• Prueba con sinónimos o términos relacionados</li>
                              <li>• Usa menos palabras en tu búsqueda</li>
                            </ul>
                          </div>
                          
                          <div className="flex flex-col gap-3">
                            <button
                              onClick={() => setShowAdvanced(true)}
                              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <SlidersHorizontal className="w-5 h-5" />
                              Usar Búsqueda Avanzada
                            </button>
                            
                            <button
                              onClick={loadAllBooks}
                              className="w-full px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <Eye className="w-5 h-5" />
                              Ver Todos los Libros
                            </button>
                          </div>
                          
                          {/* Sugerencias basadas en historial */}
                          {searchHistory.length > 0 && (
                            <div className="text-left bg-purple-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Búsquedas recientes exitosas:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {searchHistory.slice(0, 3).map((entry) => (
                                  <button
                                    key={entry.id}
                                    onClick={() => {
                                      setSearchTerm(entry.term);
                                      setTimeout(() => handleSearch(), 100);
                                    }}
                                    className="text-sm bg-white px-3 py-1 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors"
                                  >
                                    {entry.term} ({entry.resultsCount})
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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