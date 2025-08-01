import React, { useState } from 'react';
import { Search, Book, BookOpen, HelpCircle, ArrowUp, ChevronDown, ChevronRight, Info, Phone, Mail, Sparkles, Zap, Heart, Star } from 'lucide-react';

const Help = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Tooltip = ({ children, content }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    return (
      <div 
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
        {isVisible && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg whitespace-nowrap z-10 animate-pulse">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>
    );
  };

  const helpSections = [
    {
      id: 'search',
      title: '¿Cómo buscar libros?',
      icon: <Search className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>Para encontrar libros de manera efectiva:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Búsqueda básica:</strong> Escribe el título en la barra principal</li>
            <li><strong>Búsqueda avanzada:</strong> Combina título, autor y categoría</li>
            <li><strong>Ver todo:</strong> Explora el catálogo completo con un clic</li>
          </ul>
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              <strong>Consejo:</strong> Usa palabras clave específicas para obtener mejores resultados
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'advanced',
      title: 'Búsqueda Avanzada',
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>La búsqueda avanzada te ofrece mayor precisión:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-semibold text-gray-800">Por Título</h4>
              <p className="text-sm text-gray-600">Encuentra libros específicos</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-semibold text-gray-800">Por Autor</h4>
              <p className="text-sm text-gray-600">Explora obras de escritores favoritos</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-semibold text-gray-800">Por Categoría</h4>
              <p className="text-sm text-gray-600">Navega por géneros literarios</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'catalog',
      title: 'Catálogo de Libros',
      icon: <Book className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>Información disponible para cada libro:</p>
          <div className="bg-green-50 p-4 rounded-lg">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Título completo y subtítulo</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Información del autor</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Categoría y género</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Estado de disponibilidad en tiempo real</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'loans',
      title: 'Gestión de Préstamos',
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>Administra tus préstamos de manera eficiente:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold">Ver préstamos activos</h4>
                <p className="text-sm text-gray-600">Revisa los libros que tienes prestados actualmente</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold">Fechas de devolución</h4>
                <p className="text-sm text-gray-600">Mantente al día con las fechas límite</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold">Buscar nuevos préstamos</h4>
                <p className="text-sm text-gray-600">Encuentra y reserva libros disponibles</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Solución de Problemas',
      icon: <Info className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <h4 className="font-semibold text-red-800">Problemas Comunes y Soluciones</h4>
            <div className="mt-3 space-y-3">
              <div>
                <p className="font-medium text-red-700">Error: "Campo de búsqueda vacío"</p>
                <p className="text-sm text-red-600">✓ Ingresa al menos un criterio de búsqueda</p>
              </div>
              <div>
                <p className="font-medium text-red-700">No se muestran resultados</p>
                <p className="text-sm text-red-600">✓ Verifica la ortografía y prueba términos más generales</p>
              </div>
              <div>
                <p className="font-medium text-red-700">Página no responde</p>
                <p className="text-sm text-red-600">✓ Recarga la página (Ctrl+F5) o limpia el caché</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-amber-600/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-orange-400/10 to-red-600/10 rounded-full blur-3xl transform -translate-x-20 translate-y-20"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con breadcrumb */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover-lift">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-color">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Centro de Ayuda
                </h1>
                <p className="text-lg text-gray-600 font-medium">Encuentra respuestas rápidas a tus preguntas sobre ChullaLibro</p>
                
                {/* Status indicator */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-600">Soporte en línea disponible</span>
                </div>
              </div>
            </div>
            
            {/* Estadísticas de ayuda */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="group text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover-lift">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Book className="w-4 h-4 text-white" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">5</div>
                <div className="text-sm font-medium text-gray-600">Secciones</div>
              </div>
              <div className="group text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 hover:shadow-lg transition-all duration-300 hover-lift">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">24/7</div>
                <div className="text-sm font-medium text-gray-600">Disponible</div>
              </div>
              <div className="group text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50 hover:shadow-lg transition-all duration-300 hover-lift">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">100%</div>
                <div className="text-sm font-medium text-gray-600">Útil</div>
              </div>
              <div className="group text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200/50 hover:shadow-lg transition-all duration-300 hover-lift">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">&lt;5min</div>
                <div className="text-sm font-medium text-gray-600">Respuesta</div>
              </div>
            </div>
          </div>
        </div>

        {/* Secciones de ayuda expandibles */}
        <div className="space-y-4">
          {helpSections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                aria-expanded={expandedSections[section.id]}
                aria-controls={`section-${section.id}`}
              >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {section.icon}
                    </div>
                  <h2 className="text-xl font-semibold text-gray-900 text-left">{section.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {expandedSections[section.id] ? 'Contraer' : 'Expandir'}
                  </span>
                  {expandedSections[section.id] ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              {expandedSections[section.id] && (
                <div id={`section-${section.id}`} className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sección de contacto */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg text-white">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">¿Necesitas más ayuda?</h2>
            <p className="mb-6 opacity-90">
              Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta adicional.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Tooltip content="Envía un correo al equipo de soporte">
                <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                  <Mail className="w-6 h-6" />
                  <div>
                    <div className="font-medium">Correo Electrónico</div>
                    <div className="text-sm opacity-80">soporte@chullalibro.com</div>
                  </div>
                </div>
              </Tooltip>
              
              <Tooltip content="Llama al soporte técnico">
                <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                  <Phone className="w-6 h-6" />
                  <div>
                    <div className="font-medium">Teléfono</div>
                    <div className="text-sm opacity-80">+593 2 123-4567</div>
                  </div>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Botón scroll to top */}
        {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50"
              aria-label="Volver arriba"
            >
              <ArrowUp className="w-6 h-6 mx-auto" />
            </button>
        )}
      </div>
    </div>
  );
};

export default Help;