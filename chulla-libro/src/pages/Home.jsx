const Home = () => {
  return (
    <div className="home">
      <h1>Bienvenido a ChullaLibro</h1>
      <p>Tu plataforma para compartir y descubrir libros.</p>
      <div className="features">
        <div className="feature-card">
          <h3>📚 Explora Libros</h3>
          <p>Descubre nuevos títulos y autores en nuestra extensa biblioteca.</p>
        </div>
        <div className="feature-card">
          <h3>🤝 Comparte</h3>
          <p>Comparte tus libros favoritos con la comunidad.</p>
        </div>
        <div className="feature-card">
          <h3>👥 Comunidad</h3>
          <p>Conecta con otros amantes de la lectura.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;