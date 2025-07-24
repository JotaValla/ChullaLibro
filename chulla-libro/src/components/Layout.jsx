import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  ClipboardList,
  User,
  HelpCircle,
  BookOpen
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation(); // Get current location from react-router-dom
  
  const menuItems = [
    { path: '/', label: 'Inicio', icon: Home, gradient: 'from-pink-500 to-rose-500', shadowColor: 'shadow-pink' },
    { path: '/books', label: 'Libros', icon: Search, gradient: 'from-blue-500 to-cyan-500', shadowColor: 'shadow-cyan' }, 
    { path: '/loans', label: 'Préstamos', icon: ClipboardList, gradient: 'from-purple-500 to-indigo-500', shadowColor: 'shadow-purple' },
    { path: '/profile', label: 'Perfil', icon: User, gradient: 'from-green-500 to-emerald-500', shadowColor: 'shadow-colorful' },
    { path: '/help', label: 'Ayuda', icon: HelpCircle, gradient: 'from-orange-500 to-amber-500', shadowColor: 'shadow-colorful' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl z-30 overflow-hidden">
        {/* Fondo decorativo animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-blue-600/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-purple-600/20 rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-cyan-600/20 rounded-full blur-xl transform -translate-x-4 translate-y-4"></div>
        
        <div className="relative z-10">
          {/* Logo Section */}
          <div className="flex items-center gap-3 p-6 border-b border-white/20">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-color">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                ChullaLibro
              </h1>
              <p className="text-xs text-gray-500 font-medium">Biblioteca Digital</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4">
            <ul className="space-y-3">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const active = location.pathname === item.path; 
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl group text-left transition-all duration-300 hover-lift
                        ${active 
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg ${item.shadowColor}` 
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md'
                        }
                      `}
                    >
                      <div className={`
                        p-2 rounded-lg transition-all duration-300
                        ${active 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'bg-gray-100 group-hover:bg-white group-hover:shadow-sm'
                        }
                      `}>
                        <IconComponent 
                          size={18} 
                          className={`
                            transition-all duration-300
                            ${active 
                              ? 'text-white' 
                              : 'text-gray-600 group-hover:text-gray-800'
                            }
                          `} 
                        />
                      </div>
                      <span className={`font-semibold transition-colors duration-300 ${active ? 'text-white' : 'group-hover:text-gray-900'}`}>
                        {item.label}
                      </span>
                      {active && (
                        <div className="ml-auto flex space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <div className="w-1 h-1 bg-white/70 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Decorative section */}
          <div className="mx-4 mt-8 p-4 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-xl border border-white/30 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-float">
                <span className="text-white font-bold text-lg">⭐</span>
              </div>
              <p className="text-xs font-semibold text-gray-700 mb-1">¡Descubre más!</p>
              <p className="text-xs text-gray-600">Explora nuestra colección</p>
            </div>
          </div>

          {/* Footer Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-gradient-to-r from-purple-50/50 to-pink-50/50 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1 font-medium">Versión 1.0.0</p>
              <p className="text-xs text-gray-500">© 2025 ChullaLibro</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64"> {/* Ensure this ml-64 matches the sidebar width */}
        <main className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50"> 
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;