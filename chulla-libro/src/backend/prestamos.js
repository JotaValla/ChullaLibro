import { supabase, handleSupabaseError } from './client'

/**
 *  obtenerPrestamosPorUsuario
 *  ---------------------------
 *  Obtiene todos los préstamos de un usuario específico
 *
 *  @param {string} usuarioId - UUID del usuario
 *  @returns {Array<Object>} Lista de préstamos del usuario
 */
export async function obtenerPrestamosPorUsuario(usuarioId) {
    try {
        const { data, error } = await supabase
            .from('prestamos')
            .select(`
                *,
                libros (
                    id,
                    titulo,
                    autor,
                    imagen_portada,
                    categoria,
                    categorias (
                        nombre,
                        color
                    )
                )
            `)
            .eq('usuario_id', usuarioId)
            .order('fecha_prestamo', { ascending: false })
        
        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error en obtenerPrestamosPorUsuario:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  obtenerTodosLosPrestamos
 *  -------------------------
 *  Obtiene todos los préstamos (para administradores)
 *
 *  @returns {Array<Object>} Lista completa de préstamos
 */
export async function obtenerTodosLosPrestamos() {
    try {
        const { data, error } = await supabase
            .from('prestamos')
            .select(`
                *,
                usuarios (
                    id,
                    nombre,
                    email,
                    tipo_usuario
                ),
                libros (
                    id,
                    titulo,
                    autor,
                    imagen_portada,
                    categoria
                )
            `)
            .order('fecha_prestamo', { ascending: false })
        
        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error en obtenerTodosLosPrestamos:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  buscarPrestamosPorLibro
 *  ------------------------
 *  Busca préstamos por título de libro
 *
 *  @param {string} titulo - Título del libro a buscar
 *  @returns {Array<Object>} Lista de préstamos coincidentes
 */
export async function buscarPrestamosPorLibro(titulo) {
    try {
        if (!titulo || titulo.trim() === '') {
            return []
        }

        const { data, error } = await supabase
            .from('prestamos')
            .select(`
                *,
                usuarios (
                    id,
                    nombre,
                    email
                ),
                libros!inner (
                    id,
                    titulo,
                    autor,
                    imagen_portada
                )
            `)
            .ilike('libros.titulo', `%${titulo.trim()}%`)
            .order('fecha_prestamo', { ascending: false })
        
        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error en buscarPrestamosPorLibro:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  buscarPrestamosPorUsuario
 *  --------------------------
 *  Busca préstamos por nombre de usuario
 *
 *  @param {string} nombre - Nombre del usuario a buscar
 *  @returns {Array<Object>} Lista de préstamos coincidentes
 */
export async function buscarPrestamosPorUsuario(nombre) {
    try {
        if (!nombre || nombre.trim() === '') {
            return []
        }

        const { data, error } = await supabase
            .from('prestamos')
            .select(`
                *,
                usuarios!inner (
                    id,
                    nombre,
                    email
                ),
                libros (
                    id,
                    titulo,
                    autor,
                    imagen_portada
                )
            `)
            .ilike('usuarios.nombre', `%${nombre.trim()}%`)
            .order('fecha_prestamo', { ascending: false })
        
        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error en buscarPrestamosPorUsuario:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  filtrarPrestamosPorEstado
 *  --------------------------
 *  Filtra préstamos por estado
 *
 *  @param {string} estado - Estado del préstamo ('activo', 'devuelto', 'vencido', etc.)
 *  @returns {Array<Object>} Lista de préstamos filtrados
 */
export async function filtrarPrestamosPorEstado(estado) {
    try {
        const { data, error } = await supabase
            .from('prestamos')
            .select(`
                *,
                usuarios (
                    id,
                    nombre,
                    email
                ),
                libros (
                    id,
                    titulo,
                    autor,
                    imagen_portada
                )
            `)
            .eq('estado', estado)
            .order('fecha_prestamo', { ascending: false })
        
        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error en filtrarPrestamosPorEstado:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  crearPrestamo
 *  --------------
 *  Crea un nuevo préstamo
 *
 *  @param {Object} prestamo - Datos del préstamo
 *  @returns {Object} Préstamo creado
 */
export async function crearPrestamo({ usuarioId, libroId, fechaVencimiento, notas = '' }) {
    try {
        // Verificar disponibilidad del libro
        const { data: libro, error: libroError } = await supabase
            .from('libros')
            .select('copias_disponibles, disponible')
            .eq('id', libroId)
            .single()

        if (libroError) throw libroError
        if (!libro.disponible || libro.copias_disponibles <= 0) {
            throw new Error('El libro no está disponible para préstamo')
        }

        // Crear el préstamo
        const { data, error } = await supabase
            .from('prestamos')
            .insert({
                usuario_id: usuarioId,
                libro_id: libroId,
                fecha_vencimiento: fechaVencimiento,
                notas: notas,
                estado: 'activo'
            })
            .select(`
                *,
                usuarios (
                    nombre,
                    email
                ),
                libros (
                    titulo,
                    autor
                )
            `)
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en crearPrestamo:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  devolverLibro
 *  --------------
 *  Marca un préstamo como devuelto
 *
 *  @param {number} prestamoId - ID del préstamo
 *  @returns {Object} Préstamo actualizado
 */
export async function devolverLibro(prestamoId) {
    try {
        const { data, error } = await supabase
            .from('prestamos')
            .update({
                estado: 'devuelto',
                fecha_devolucion: new Date().toISOString()
            })
            .eq('id', prestamoId)
            .eq('estado', 'activo') // Solo se pueden devolver préstamos activos
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en devolverLibro:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  renovarPrestamo
 *  ----------------
 *  Renueva un préstamo extendiendo su fecha de vencimiento
 *
 *  @param {number} prestamoId - ID del préstamo
 *  @param {string} nuevaFechaVencimiento - Nueva fecha de vencimiento
 *  @returns {Object} Préstamo renovado
 */
export async function renovarPrestamo(prestamoId, nuevaFechaVencimiento) {
    try {
        const { data, error } = await supabase
            .from('prestamos')
            .update({
                fecha_vencimiento: nuevaFechaVencimiento,
                renovaciones: supabase.raw('renovaciones + 1')
            })
            .eq('id', prestamoId)
            .eq('estado', 'activo')
            .lt('renovaciones', supabase.raw('max_renovaciones'))
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en renovarPrestamo:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  obtenerEstadisticasPrestamos
 *  -----------------------------
 *  Obtiene estadísticas generales de préstamos
 *
 *  @returns {Object} Objeto con estadísticas
 */
export async function obtenerEstadisticasPrestamos() {
    try {
        const { data: activos, error: activosError } = await supabase
            .from('prestamos')
            .select('id', { count: 'exact' })
            .eq('estado', 'activo')

        const { data: vencidos, error: vencidosError } = await supabase
            .from('prestamos')
            .select('id', { count: 'exact' })
            .eq('estado', 'vencido')

        const { data: devueltos, error: devueltosError } = await supabase
            .from('prestamos')
            .select('id', { count: 'exact' })
            .eq('estado', 'devuelto')

        if (activosError || vencidosError || devueltosError) {
            throw activosError || vencidosError || devueltosError
        }

        return {
            activos: activos.length,
            vencidos: vencidos.length,
            devueltos: devueltos.length,
            total: activos.length + vencidos.length + devueltos.length
        }
    } catch (error) {
        console.error('Error en obtenerEstadisticasPrestamos:', error)
        throw new Error(handleSupabaseError(error))
    }
}
