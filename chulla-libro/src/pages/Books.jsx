const Books = () => {
  return (
    <div className="books">
      <h1>Catálogo de Libros</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar libros..."
          className="search-input"
        />
        <button className="search-button">Buscar</button>
      </div>
      <div className="books-grid">
        {/* Aquí se mostrarán los libros */}
        <p>Lista de libros en construcción...</p>
      </div>
    </div>
  );
};

export default Books;