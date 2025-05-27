const Help = () => {
  return (
    <div className="help">
      <h1>Ayuda - ChullaLibro</h1>
      
      <div className="help-content">
        <section className="help-section">
          <h2>¿Cómo buscar libros?</h2>
          <p>
            Utiliza la barra de búsqueda principal para encontrar libros por título. 
            También puedes usar la búsqueda avanzada para filtrar por autor, categoría o título específico. 
            Si deseas ver todos los libros disponibles, haz clic en "Ver Todos".
          </p>
        </section>

        <section className="help-section">
          <h2>Búsqueda Avanzada</h2>
          <p>
            La búsqueda avanzada te permite combinar múltiples criterios para encontrar 
            exactamente lo que buscas. Puedes filtrar por título, autor y categoría 
            simultáneamente para obtener resultados más precisos.
          </p>
        </section>

        <section className="help-section">
          <h2>Catálogo de Libros</h2>
          <p>
            En el catálogo encontrarás información detallada de cada libro incluyendo 
            título, autor, categoría y disponibilidad. Los libros se muestran en 
            formato de tarjetas para una fácil visualización.
          </p>
        </section>

        <section className="help-section">
          <h2>Préstamos</h2>
          <p>
            La sección de préstamos te permite gestionar los libros que has tomado prestados. 
            Aquí puedes ver el estado de tus préstamos actuales y buscar libros disponibles 
            para préstamo utilizando las mismas herramientas de búsqueda.
          </p>
        </section>

        <section className="help-section">
          <h2>Problemas Comunes</h2>
          <p>
            Si encuentras errores durante la búsqueda, verifica que hayas ingresado 
            al menos un criterio de búsqueda. Los campos vacíos pueden generar errores. 
            Si el problema persiste, intenta recargar la página o contacta al soporte técnico.
          </p>
        </section>

        <section className="help-section">
          <h2>Navegación</h2>
          <p>
            Utiliza el menú de navegación para moverte entre las diferentes secciones: 
            Inicio, Catálogo de Libros, Préstamos y esta página de Ayuda. 
            Cada sección está diseñada para facilitar tu experiencia con ChullaLibro.
          </p>
        </section>

        <section className="help-section">
          <h2>Soporte Técnico</h2>
          <p>
            Si necesitas ayuda adicional o encuentras problemas técnicos, 
            no dudes en contactar a nuestro equipo de soporte. Estamos aquí 
            para ayudarte a tener la mejor experiencia posible con ChullaLibro.
          </p>
        </section>

        <div className="help-footer">
          <p><strong>ChullaLibro</strong> - Tu plataforma para compartir y descubrir libros</p>
          <p>Versión 1.0 - Para más información, visita nuestra página principal.</p>
        </div>
      </div>
    </div>
  );
};

export default Help;