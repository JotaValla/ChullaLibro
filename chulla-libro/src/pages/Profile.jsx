const Profile = () => {
  return (
    <div className="profile">
      <h1>Mi Perfil</h1>
      <div className="profile-content">
        <div className="profile-section">
          <h2>Información Personal</h2>
          <div className="profile-info">
            <p><strong>Nombre:</strong> Usuario</p>
            <p><strong>Email:</strong> usuario@ejemplo.com</p>
          </div>
        </div>
        <div className="profile-section">
          <h2>Mis Libros</h2>
          <div className="my-books">
            <p>No hay libros registrados aún.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
