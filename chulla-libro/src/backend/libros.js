import { supabase } from './client'

/**
 *  buscarLibrosDisponibles
 *  ------------------------
 *  Devuelve todos los libros cuya columna 'Disponible' sea TRUE.
 *  Se utiliza para mostrar solo los libros activos al usuario.
 *
 *  @returns {Array<Object>} Lista de libros disponibles
 */
export async function buscarLibrosDisponibles() {
    const { data, error } = await supabase.from('Libros').select('*').eq('Disponible', true)
    if (error) throw error
    return data
}

/**
 *  buscarTodosLosLibros
 *  ---------------------
 *  Devuelve todos los libros de la tabla, sin importar si están disponibles o no.
 *  Útil para vista completa o para usuarios con permisos de administración.
 *
 *  @returns {Array<Object>} Lista completa de libros
 */
export async function buscarTodosLosLibros() {
    const { data, error } = await supabase.from('Libros').select('*')
    if (error) throw error
    return data
}

/**
 *  buscarLibrosPorTitulo
 *  ----------------------
 *  Devuelve libros disponibles cuyo título contenga la palabra indicada (búsqueda parcial).
 *
 *  @param {string} titulo - Término que se buscará dentro del campo 'Titulo'
 *  @returns {Array<Object>} Lista de libros coincidentes
 */
export async function buscarLibrosPorTitulo(titulo) {
    const { data, error } = await supabase.from('Libros').select('*').ilike('Titulo', `%${titulo}%`).eq('Disponible', true)
    if (error) throw error
    return data
}

/**
 *  buscarLibrosConAND
 *  -------------------
 *  Devuelve libros disponibles que coincidan con TODOS los filtros proporcionados:
 *  título, autor y categoría (usando lógica AND).
 *
 *  Ejemplo:
 *     buscarLibrosConAND({ titulo: 'Ciencias', autor: 'Juan', categoria: 'Educación' })
 *     solo traerá libros que cumplan con los tres filtros al mismo tiempo.
 *
 *  @param {Object} filtros - { titulo, autor, categoria }
 *  @returns {Array<Object>} Lista de libros coincidentes con todos los filtros
 */
export async function buscarLibrosConAND({ titulo, autor, categoria }) {
    let query = supabase.from('Libros').select('*').eq('Disponible', true)

    if (titulo) query = query.ilike('Titulo', `%${titulo}%`)
    if (autor) query = query.ilike('Autor', `%${autor}%`)
    if (categoria) query = query.ilike('Categoria', `%${categoria}%`)

    const { data, error } = await query
    if (error) throw error
    return data
}

/**
 *  buscarLibrosConOR
 *  ------------------
 *  Devuelve libros disponibles que coincidan con AL MENOS UNO de los filtros proporcionados
 *  (título, autor, categoría), usando lógica OR.
 *
 *  Ejemplo:
 *     buscarLibrosConOR({ titulo: 'Ciencias', autor: 'Juan', categoria: '' })
 *     traerá libros que tengan 'Ciencias' en el título O 'Juan' como autor.
 *
 *  @param {Object} filtros - { titulo, autor, categoria }
 *  @returns {Array<Object>} Lista de libros que cumplen con al menos un filtro
 */
export async function buscarLibrosConOR({ titulo, autor, categoria }) {
    let query = supabase.from('Libros').select('*').eq('Disponible', true)

    const condiciones = []
    if (titulo) condiciones.push(`Titulo.ilike.%${titulo}%`)
    if (autor) condiciones.push(`Autor.ilike.%${autor}%`)
    if (categoria) condiciones.push(`Categoria.ilike.%${categoria}%`)

    if (condiciones.length > 0) {
        query = query.or(condiciones.join(','))
    }

    const { data, error } = await query
    if (error) throw error
    return data
}
