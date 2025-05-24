import { useEffect, useState } from 'react'
import {
  buscarLibrosDisponibles,
  buscarLibrosPorTitulo,
  buscarLibrosConAND,
  buscarLibrosConOR,
  buscarTodosLosLibros
} from './backend/libros'

function App() {
  const [disponibles, setDisponibles] = useState([])
  const [porTitulo, setPorTitulo] = useState([])
  const [filtradosAND, setFiltradosAND] = useState([])
  const [filtradosOR, setFiltradosOR] = useState([])
  const [todos, setTodos] = useState([])

  useEffect(() => {
    async function cargar() {
      setDisponibles(await buscarLibrosDisponibles())
      setPorTitulo(await buscarLibrosPorTitulo("aprendiendo"))
      setFiltradosAND(await buscarLibrosConAND({
        titulo: 'Buscando a dorothy',
        autor: 'Juan',
        categoria: 'Terror'
      }))
      setFiltradosOR(await buscarLibrosConOR({
        titulo: 'supabase',
        autor: 'juan',
        categoria: 'programación'
      }))
      setTodos(await buscarTodosLosLibros())
    }

    cargar()
  }, [])

  function renderLista(titulo, libros) {
    return (
      <div>
        <h2>{titulo}</h2>
        {libros.length === 0 ? (
          <p>No hay resultados.</p>
        ) : (
          <ul>
            {libros.map((libro) => (
              <li key={libro.LibroID}>
                <p><strong>{libro.Titulo}</strong> — {libro.Autor} ({libro.Categoria})</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div>
      <h1>Catálogo de Libros</h1>
      {renderLista("Libros Disponibles", disponibles)}
      {renderLista("Búsqueda por Título: 'aprendiendo'", porTitulo)}
      {renderLista("Filtro AND: Título + Autor + Categoría", filtradosAND)}
      {renderLista("Filtro OR: Título o Autor o Categoría", filtradosOR)}
      {renderLista("Todos los libros (incluye no disponibles)", todos)}
    </div>
  )
}

export default App
