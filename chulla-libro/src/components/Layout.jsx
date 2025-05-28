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
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/books', label: 'Libros', icon: Search }, 
    { path: '/loans', label: 'Préstamos', icon: ClipboardList },
    { path: '/profile', label: 'Perfil', icon: User },
    { path: '/help', label: 'Ayuda', icon: HelpCircle },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-30">
        {/* Logo Section */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ChullaLibro</h1>
            <p className="text-xs text-gray-500">Biblioteca Digital</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const active = location.pathname === item.path; 
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg group text-left
                      ${active 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <IconComponent 
                      size={20} 
                      className={`
                        transition-colors duration-200
                        ${active 
                          ? 'text-blue-600' 
                          : 'text-gray-500 group-hover:text-gray-700'
                        }
                      `} 
                    />
                    <span className={`font-medium ${active ? 'text-blue-700' : ''}`}>
                      {item.label}
                    </span>
                    {active && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Versión 1.0.0</p>
            <p className="text-xs text-gray-400">© 2025 ChullaLibro</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64"> {/* Ensure this ml-64 matches the sidebar width */}
        <main className="min-h-screen p-6"> {/* Added some padding to main for content visibility */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;