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
    <div className="books" style={{ position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px 40px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ fontSize: '16px', fontWeight: '500' }}>Cargando...</span>
          </div>
        </div>
      )}
      
      <h1>Catálogo de Libros</h1>
      
      {/* Búsqueda simple */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar libros..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />        <button className="search-button" onClick={handleSearch} disabled={loading}>
          <span className="search-icon">🔍</span> Buscar
        </button><button onClick={() => setShowAdvanced(true)} disabled={loading}>Búsqueda Avanzada</button>        <button onClick={loadAllBooks} disabled={loading}>
          Ver Todos
        </button>
      </div>      {showAdvanced && (
        <div className="advanced-search">
          <h3>Búsqueda Avanzada</h3>
          <div className="advanced-form">
            <input
              type="text"
              placeholder="Título"
              value={advancedFilters.titulo}
              onChange={(e) => setAdvancedFilters({...advancedFilters, titulo: e.target.value})}
            />
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
            />            <button onClick={handleAdvancedSearch} disabled={loading}>
              Confirmar
            </button>
            <button onClick={() => setShowAdvanced(false)} disabled={loading}>
              Cancelar
            </button>
          </div>
        </div>
      )}      {error && <div className="error-message" style={{color: 'red', margin: '10px 0'}}>{error}</div>}

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
          <p>No se encontraron libros.</p>        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Books;