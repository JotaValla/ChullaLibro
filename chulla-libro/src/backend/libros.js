import { supabase, handleSupabaseError } from './client'

/**
 *  buscarLibrosDisponibles
 *  ------------------------
 *  Devuelve todos los libros cuya columna 'disponible' sea TRUE.
 *  Se utiliza para mostrar solo los libros activos al usuario.
 *
 *  @returns {Array<Object>} Lista de libros disponibles
 */
export async function buscarLibrosDisponibles() {
    try {
        const { data, error } = await supabase
            .from('libros')
            .select('*')
            .eq('disponible', true)
            .order('titulo')
        
        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error en buscarLibrosDisponibles:', error)
        throw new Error(handleSupabaseError(error))
    }
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
    console.log('🔍 Iniciando buscarTodosLosLibros...')
    
    try {
        console.log('📡 Configuración Supabase:')
        console.log('  - URL:', supabase.supabaseUrl)
        console.log('  - Key:', supabase.supabaseKey ? `${supabase.supabaseKey.substring(0, 20)}...` : 'NO DEFINIDA')
        
        console.log('🔗 Ejecutando consulta a la tabla libros...')
        const { data, error } = await supabase
            .from('libros')
            .select('*')
            .order('titulo')
        
        console.log('📊 Resultado de la consulta:')
        console.log('  - Error:', error)
        console.log('  - Data length:', data ? data.length : 'null')
        console.log('  - Data sample:', data ? JSON.stringify(data.slice(0, 1), null, 2) : 'null')
        
        if (error) {
            console.error('❌ Error detallado:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            })
            throw error
        }
        
        console.log('✅ Consulta exitosa, retornando', data?.length || 0, 'libros')
        return data || []
    } catch (error) {
        console.error('💥 Error en buscarTodosLosLibros:', error)
        console.error('💥 Stack trace:', error.stack)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  buscarLibrosPorTitulo
 *  ----------------------
 *  Devuelve libros cuyo título contenga la palabra indicada (búsqueda parcial).
 *
 *  @param {string} titulo - Término que se buscará dentro del campo 'titulo'
 *  @returns {Array<Object>} Lista de libros coincidentes
 */
export async function buscarLibrosPorTitulo(titulo) {
    try {
        if (!titulo || titulo.trim() === '') {
            return []
        }

        console.log('🔍 Buscando libros por título:', titulo)
        
        const { data, error } = await supabase
            .from('libros')
            .select('*')
            .ilike('titulo', `%${titulo.trim()}%`)
            .order('titulo')
        
        console.log('📚 Resultados búsqueda por título:', data?.length || 0, 'libros encontrados')
        
        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error en buscarLibrosPorTitulo:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  buscarLibrosConAND
 *  -------------------
 *  Devuelve libros que coincidan con TODOS los filtros proporcionados:
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
    try {
        console.log('🔍 Búsqueda avanzada con filtros:', { titulo, autor, categoria })
        
        let query = supabase
            .from('libros')
            .select('*')

        // Aplicar filtros solo si tienen valor
        if (titulo && titulo.trim()) {
            query = query.ilike('titulo', `%${titulo.trim()}%`)
        }
        if (autor && autor.trim()) {
            query = query.ilike('autor', `%${autor.trim()}%`)
        }
        if (categoria && categoria.trim()) {
            // Solo buscar por el campo categoria directo por ahora
            query = query.ilike('categoria', `%${categoria.trim()}%`)
        }

        query = query.order('titulo')

        const { data, error } = await query
        
        console.log('📚 Resultados búsqueda avanzada:', data?.length || 0, 'libros encontrados')
        
        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error en buscarLibrosConAND:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  buscarLibrosConOR
 *  ------------------
 *  Devuelve libros que coincidan con AL MENOS UNO de los filtros proporcionados
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
    try {
        const condiciones = []
        
        if (titulo && titulo.trim()) {
            condiciones.push(`titulo.ilike.%${titulo.trim()}%`)
        }
        if (autor && autor.trim()) {
            condiciones.push(`autor.ilike.%${autor.trim()}%`)
        }
        if (categoria && categoria.trim()) {
            condiciones.push(`categoria.ilike.%${categoria.trim()}%`)
        }

        if (condiciones.length === 0) {
            return []
        }

        console.log('🔍 Búsqueda OR con condiciones:', condiciones)

        const { data, error } = await supabase
            .from('libros')
            .select('*')
            .or(condiciones.join(','))
            .order('titulo')

        console.log('📚 Resultados búsqueda OR:', data?.length || 0, 'libros encontrados')

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error en buscarLibrosConOR:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  obtenerCategorias
 *  ------------------
 *  Devuelve todas las categorías disponibles para filtros
 *
 *  @returns {Array<Object>} Lista de categorías
 */
export async function obtenerCategorias() {
    try {
        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .order('nombre')
        
        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error en obtenerCategorias:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  obtenerLibroPorId
 *  ------------------
 *  Obtiene un libro específico por su ID
 *
 *  @param {number} id - ID del libro
 *  @returns {Object|null} Datos del libro o null si no existe
 */
export async function obtenerLibroPorId(id) {
    try {
        console.log('🔍 Obteniendo libro por ID:', id)
        
        const { data, error } = await supabase
            .from('libros')
            .select('*')
            .eq('id', id)
            .single()
        
        console.log('📚 Libro encontrado:', data ? 'Sí' : 'No')
        
        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en obtenerLibroPorId:', error)
        throw new Error(handleSupabaseError(error))
    }
}
