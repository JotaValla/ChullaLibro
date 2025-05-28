import { Book, Users, Share2, Search, ArrowRight, Star, BookOpen, Heart } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Book className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-6">
              Bienvenido a <span className="text-yellow-300">ChullaLibro</span>
            </h1>
            <p className="text-lg lg:text-xl mb-8 opacity-90">
              Tu plataforma para compartir y descubrir libros. Únete a una comunidad apasionada por la lectura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 justify-center">
                <Search className="w-5 h-5" />
                Explorar Libros
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 flex items-center gap-2 justify-center">
                <Users className="w-5 h-5" />
                Unirse a la Comunidad
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir ChullaLibro?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre todas las funcionalidades que hacen de ChullaLibro la mejor plataforma para los amantes de los libros.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden group">
            <div className="p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors duration-200">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                📚 Explora Libros
              </h3>
              <p className="text-gray-600 mb-6">
                Descubre nuevos títulos y autores en nuestra extensa biblioteca. Encuentra tu próxima lectura favorita con nuestro sistema de búsqueda avanzada.
              </p>
              <div className="flex items-center text-blue-600 font-medium hover:text-blue-700 cursor-pointer">
                <span>Explorar ahora</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden group">
            <div className="p-8">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors duration-200">
                <Share2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🤝 Comparte
              </h3>
              <p className="text-gray-600 mb-6">
                Comparte tus libros favoritos con la comunidad. Ayuda a otros lectores a descubrir grandes historias y construye tu reputación como curador de contenido.
              </p>
              <div className="flex items-center text-green-600 font-medium hover:text-green-700 cursor-pointer">
                <span>Compartir libros</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden group">
            <div className="p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors duration-200">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                👥 Comunidad
              </h3>
              <p className="text-gray-600 mb-6">
                Conecta con otros amantes de la lectura. Participa en discusiones, comparte reseñas y descubre recomendaciones personalizadas de la comunidad.
              </p>
              <div className="flex items-center text-purple-600 font-medium hover:text-purple-700 cursor-pointer">
                <span>Unirse ahora</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t border-gray-200">
        <div className="px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ChullaLibro en números
            </h2>
            <p className="text-lg text-gray-600">
              Una comunidad creciente de lectores apasionados
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1,500+</div>
              <div className="text-sm text-gray-600">Libros Disponibles</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-sm text-gray-600">Usuarios Activos</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">2,300+</div>
              <div className="text-sm text-gray-600">Libros Compartidos</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4.8</div>
              <div className="text-sm text-gray-600">Calificación Promedio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;