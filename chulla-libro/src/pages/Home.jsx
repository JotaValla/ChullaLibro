import { Book, Users, Share2, Search, ArrowRight, Star, BookOpen, Heart, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Fondo decorativo animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-blue-600/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-purple-600/20 rounded-full blur-3xl transform translate-x-32 -translate-y-32 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl transform -translate-x-20 translate-y-20 animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="relative px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse-color">
              <Book className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Bienvenido a{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                ChullaLibro
              </span>
              <div className="inline-block ml-2 animate-bounce">
                <Sparkles className="w-8 h-8 lg:w-12 lg:h-12 text-yellow-400" />
              </div>
            </h1>
            <p className="text-xl lg:text-2xl mb-10 text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Tu plataforma para{' '}
              <span className="font-semibold text-purple-600">compartir</span> y{' '}
              <span className="font-semibold text-pink-600">descubrir</span> libros. 
              Únete a una comunidad apasionada por la lectura.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/books"
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-3 justify-center shadow-lg hover:shadow-2xl transform hover:scale-105 hover-lift"
              >
                <Search className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                Explorar Libros
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <button className="group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-purple-300 text-purple-700 font-bold rounded-2xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-all duration-300 flex items-center gap-3 justify-center shadow-lg hover:shadow-2xl transform hover:scale-105">
                <Users className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                Unirse a la Comunidad
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 lg:px-8 py-16 lg:py-24 relative">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-yellow-500 animate-bounce" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
              ¿Por qué elegir ChullaLibro?
            </h2>
            <Zap className="w-8 h-8 text-yellow-500 animate-bounce" style={{animationDelay: '0.5s'}} />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre todas las funcionalidades que hacen de ChullaLibro la mejor plataforma para los amantes de los libros.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Feature 1 */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 overflow-hidden hover-lift">
            <div className="p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  📚 Explora Libros
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Descubre nuevos títulos y autores en nuestra extensa biblioteca. Encuentra tu próxima lectura favorita con nuestro sistema de búsqueda avanzada.
                </p>
                <div className="flex items-center text-blue-600 font-bold hover:text-blue-700 cursor-pointer group-hover:gap-3 transition-all duration-300">
                  <span>Explorar ahora</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 overflow-hidden hover-lift">
            <div className="p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                  🤝 Comparte
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Comparte tus libros favoritos con la comunidad. Ayuda a otros lectores a descubrir grandes historias y construye tu reputación como curador de contenido.
                </p>
                <div className="flex items-center text-green-600 font-bold hover:text-green-700 cursor-pointer group-hover:gap-3 transition-all duration-300">
                  <span>Compartir libros</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-500 overflow-hidden hover-lift">
            <div className="p-8 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  👥 Comunidad
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Conecta con otros amantes de la lectura. Participa en discusiones, comparte reseñas y descubre recomendaciones personalizadas de la comunidad.
                </p>
                <div className="flex items-center text-purple-600 font-bold hover:text-purple-700 cursor-pointer group-hover:gap-3 transition-all duration-300">
                  <span>Unirse ahora</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-16 lg:py-24 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50 to-pink-50"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-br from-pink-400/30 to-red-500/30 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-8 h-8 text-green-500 animate-bounce" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent">
                ChullaLibro en números
              </h2>
              <TrendingUp className="w-8 h-8 text-green-500 animate-bounce" style={{animationDelay: '0.5s'}} />
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              Una comunidad creciente de lectores apasionados
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="group text-center bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Book className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">1,500+</div>
              <div className="text-sm font-semibold text-gray-600">Libros Disponibles</div>
            </div>

            <div className="group text-center bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-sm font-semibold text-gray-600">Usuarios Activos</div>
            </div>

            <div className="group text-center bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">2,300+</div>
              <div className="text-sm font-semibold text-gray-600">Libros Compartidos</div>
            </div>

            <div className="group text-center bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Star className="w-10 h-10 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">4.8</div>
              <div className="text-sm font-semibold text-gray-600">Calificación Promedio</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl transform -translate-x-20 translate-y-20"></div>
        
        <div className="relative px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              ¿Listo para comenzar tu aventura literaria?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Únete a miles de lectores que ya han encontrado su próximo libro favorito
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/books"
                className="group px-10 py-5 bg-white text-purple-700 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 flex items-center gap-3 justify-center shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <BookOpen className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                Comenzar Ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <button className="group px-10 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-3 justify-center shadow-xl">
                <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                Saber Más
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;