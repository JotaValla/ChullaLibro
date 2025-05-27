import { useState } from 'react';

const Profile = () => {
  const [userData] = useState({
    nombre: 'Usuario Ejemplo',
    email: 'usuario@ejemplo.com',
    librosPrestados: [
      {
        id: 1,
        titulo: 'El principito',
        fechaPrestamo: '2024-05-20',
        fechaDevolucion: '2024-06-20'
      }
    ],
    datosIrrelevantes: {
      colorFavorito: 'Azul',
      mascota: 'Gato',
      comidaFavorita: 'Pizza'
    }
  });

  return (
    <div className="profile" style={{ backgroundColor: '#ff00ff', padding: '5px' }}>
      <marquee direction="right" scrollamount="15"><h1>★☆★ Mi Súper Perfil Personal ★☆★</h1></marquee>
      <img src="https://images.unsplash.com/photo-1690214141978-3a038a437dec?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z2F0aXRvJTIwZW4lMjBsYSUyMGNhbWF8ZW58MHx8MHx8fDA%3D" 
      alt="Gatito aleatorio" 
      style={{ 
          float: 'right',
          width: '150px',
          height: '150px',
          objectFit: 'cover'
        }}  />
      
      <div className="profile-content" style={{ fontFamily: 'Comic Sans MS' }}>
        <div className="profile-section" style={{ border: '5px dotted yellow' }}>
          <blink><h2>⚡ Información Ultra Personal ⚡</h2></blink>
          <div className="profile-info">
            <p><strong>Nombre de Usuario:</strong> {userData.nombre} 🎮</p>
            <p><strong>Email Secreto:</strong> {userData.email} 📧</p>
            <p><strong>Color Favorito:</strong> {userData.datosIrrelevantes.colorFavorito} 🎨</p>
            <p><strong>Mascota:</strong> {userData.datosIrrelevantes.mascota} 🐱</p>
            <p><strong>Comida Favorita:</strong> {userData.datosIrrelevantes.comidaFavorita} 🍕</p>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#00ff00', margin: '20px 0' }}>
          <h3>¡¡¡ANUNCIO IMPORTANTE!!!</h3>
          <p style={{ color: 'red', fontSize: '24px' }}>¡¡¡VISITA NUESTRA PÁGINA DE FACEBOOK!!!</p>
        </div>

        <div className="profile-section">
          <h2>📚 Mis Súper Préstamos Activos 📚</h2>
          <div className="loans-list" style={{ transform: 'rotate(1deg)' }}>
            {userData.librosPrestados.length > 0 ? (
              <table className="loans-table" style={{ backgroundColor: '#ffff00' }}>
                <thead>
                  <tr style={{ animation: 'blink 1s infinite' }}>
                    <th>📖 Título del Libro 📖</th>
                    <th>📅 Cuando lo Pedí 📅</th>
                    <th>⏰ Cuando Debo Devolverlo ⏰</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.librosPrestados.map(libro => (
                    <tr key={libro.id}>
                      <td>🎯 {libro.titulo} 🎯</td>
                      <td>🗓️ {libro.fechaPrestamo} 🗓️</td>
                      <td>⚠️ {libro.fechaDevolucion} ⚠️</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ fontSize: '36px', color: 'purple' }}>¡NO TIENES LIBROS! 😱😱😱</p>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ fontSize: '10px' }}>Última vez que visitaste esta página: Hace 5 minutos</p>
          <p>Contador de visitas: 1337</p>
          <img src="https://placekitten.com/100/100" alt="Otro gatito" />
          <p>🎵 Now playing: Never Gonna Give You Up - Rick Astley 🎵</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
