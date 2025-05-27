import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const menuItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/books', label: 'Libros', icon: '▲' }, // Falla 2: Triángulo en lugar de icono de libro
    { path: '/loans', label: 'Préstamos', icon: '📋' },
    { path: '/profile', label: 'Perfil', icon: '👤' },
    { path: '/help', label: 'Ayuda', icon: '❓' },
  ];

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">
          <h1>ChullaLibro</h1>
        </div>
        <ul className="menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
