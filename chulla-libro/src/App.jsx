import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [Libros, setLibros] = useState([]);

  useEffect(() => {
    getLibros();
  }, []);

  async function getLibros() {
    const { data } = await supabase.from("Libros").select();
    setLibros(data);
  }

  return (
    <div>
      <h1>Libros</h1>
      <ul>
        {Libros.map((Libro) => (
          <li key={Libro.LibroID}>
            <p>ID: {Libro.LibroID}</p>
            <p>Título: {Libro.Titulo}</p>
            <p>Autor: {Libro.Autor}</p>
            <p>Categoría: {Libro.Categoria}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;