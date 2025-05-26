import { useState } from 'react';
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

  // Falla 1: Sin indicadores de carga ni confirmación de éxito
  // Falla 5: Permite búsquedas vacías que generan error
  // Falla 8: Errores 500 sin detalles
  const handleSearch = async () => {
    try {
      let results;
      // Permite búsquedas vacías intencionalmente
      if (!searchTerm.trim()) {
        throw new Error('Internal Server Error');
      }
      results = await buscarLibrosPorTitulo(searchTerm);
      setBooks(results);
      setError('');
    } catch (err) {
      // Muestra error 500 genérico sin detalles
      setError('Error 500: Internal Server Error');
      setBooks([]);
    }
  };

  // Falla 4: Botón dice "Ejecutar" en lugar de "Confirmar"
  // Falla 5: Permite búsquedas vacías en formulario avanzado
  const handleAdvancedSearch = async () => {
    try {
      const { titulo, autor, categoria } = advancedFilters;
      // Permite búsquedas completamente vacías
      if (!titulo.trim() && !autor.trim() && !categoria.trim()) {
        throw new Error('Internal Server Error');
      }
      const results = await buscarLibrosConAND(advancedFilters);
      setBooks(results);
      setError('');
      setShowAdvanced(false);
    } catch (err) {
      // Error 500 genérico
      setError('Error 500: Internal Server Error');
      setBooks([]);
    }
  };

  const loadAllBooks = async () => {
    try {
      const results = await buscarTodosLosLibros();
      setBooks(results);
      setError('');
    } catch (err) {
      setError('Error 500: Internal Server Error');
      setBooks([]);
    }
  };

  return (
    <div className="books">
      <h1>Catálogo de Libros</h1>
      
      {/* Búsqueda simple */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar libros..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Falla 2: Icono triangular en lugar de lupa */}
        <button className="search-button" onClick={handleSearch}>
          <span className="triangle-icon">▲</span> Buscar
        </button>
        <button onClick={() => setShowAdvanced(true)}>Búsqueda Avanzada</button>
        <button onClick={loadAllBooks}>Ver Todos</button>
      </div>

      {/* Falla 3: Formulario sin botón Cancelar */}
      {/* Falla 6: Filtros no visibles (campos ocultos) */}
      {/* Falla 7: Sin atajos para usuarios avanzados */}
      {showAdvanced && (
        <div className="advanced-search">
          <h3>Búsqueda Avanzada</h3>
          <div className="advanced-form">
            <input
              type="text"
              placeholder="Título"
              value={advancedFilters.titulo}
              onChange={(e) => setAdvancedFilters({...advancedFilters, titulo: e.target.value})}
            />
            {/* Filtros ocultos por defecto - Falla 6 */}
            <div style={{display: 'none'}}>
              <input
                type="text"
                placeholder="Autor"
                value={advancedFilters.autor}
                onChange={(e) => setAdvancedFilters({...advancedFilters, autor: e.target.value})}
              />
              <input
                type="text"
                placeholder="Categoría"
                value={advancedFilters.categoria}
                onChange={(e) => setAdvancedFilters({...advancedFilters, categoria: e.target.value})}
              />
            </div>
            {/* Falla 4: Botón dice "Ejecutar" */}
            <button onClick={handleAdvancedSearch}>Ejecutar</button>
            {/* Falla 3: Sin botón Cancelar */}
          </div>
        </div>
      )}

      {/* Mostrar errores */}
      {error && <div className="error-message" style={{color: 'red', margin: '10px 0'}}>{error}</div>}

      {/* Lista de libros */}
      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book, index) => (
            <div key={index} className="book-card">
              <h3>{book.Titulo}</h3>
              <p>Autor: {book.Autor}</p>
              <p>Categoría: {book.Categoria}</p>
              <p>Disponible: {book.Disponible ? 'Sí' : 'No'}</p>
            </div>
          ))
        ) : (
          <p>No se encontraron libros.</p>
        )}
      </div>
    </div>
  );
};

export default Books;