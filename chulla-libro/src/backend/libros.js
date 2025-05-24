import { supabase } from './client'

export async function buscarLibrosDisponibles() {
    const { data, error } = await supabase.from('Libros').select('*').eq('Disponible', true)
    if (error) throw error
    return data
}

export async function buscarTodosLosLibros() {
    const { data, error } = await supabase.from('Libros').select('*')
    if (error) throw error
    return data
}

export async function buscarLibrosPorTitulo(titulo) {
    const { data, error } = await supabase.from('Libros').select('*').ilike('Titulo', `%${titulo}%`).eq('Disponible', true)
    if (error) throw error
    return data
}

/**
 *  Buscar libros usando lógica AND:
 *  Devuelve solo libros que coincidan con TODOS los filtros indicados.
 *  Ejemplo: título = "supabase", autor = "juan" ⇒ buscará libros que contengan ambas cosas.
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
 *  Buscar libros usando lógica OR:
 *  Devuelve libros que coincidan con AL MENOS UNO de los filtros indicados.
 *  Ejemplo: título = "supabase", autor = "juan" ⇒ devuelve libros que tengan título "supabase" o autor "juan".
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