import { supabase, handleSupabaseError } from './client'

/**
 *  obtenerPerfilUsuario
 *  ---------------------
 *  Obtiene el perfil del usuario autenticado
 *
 *  @returns {Object|null} Datos del perfil del usuario
 */
export async function obtenerPerfilUsuario() {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError) throw authError
        if (!user) return null

        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', user.id)
            .single()
        
        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en obtenerPerfilUsuario:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  actualizarPerfilUsuario
 *  ------------------------
 *  Actualiza el perfil del usuario autenticado
 *
 *  @param {Object} datosActualizados - Datos a actualizar
 *  @returns {Object} Perfil actualizado
 */
export async function actualizarPerfilUsuario(datosActualizados) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError) throw authError
        if (!user) throw new Error('Usuario no autenticado')

        const { data, error } = await supabase
            .from('usuarios')
            .update(datosActualizados)
            .eq('id', user.id)
            .select()
            .single()
        
        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en actualizarPerfilUsuario:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  crearPerfilUsuario
 *  -------------------
 *  Crea un perfil para un usuario recién registrado
 *
 *  @param {Object} datosUsuario - Datos del usuario
 *  @returns {Object} Perfil creado
 */
export async function crearPerfilUsuario(datosUsuario) {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .insert(datosUsuario)
            .select()
            .single()
        
        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en crearPerfilUsuario:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  registrarUsuario
 *  -----------------
 *  Registra un nuevo usuario en el sistema
 *
 *  @param {Object} datosRegistro - { email, password, nombre, telefono, direccion, fechaNacimiento, tipoUsuario }
 *  @returns {Object} Usuario registrado con perfil
 */
export async function registrarUsuario(datosRegistro) {
    try {
        const { email, password, nombre, telefono, direccion, fechaNacimiento, tipoUsuario = 'Estudiante' } = datosRegistro

        // Registrar usuario en Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nombre: nombre
                }
            }
        })

        if (authError) throw authError
        if (!authData.user) throw new Error('Error al crear usuario')

        // Crear perfil en la tabla usuarios
        const perfilData = {
            id: authData.user.id,
            nombre,
            email,
            telefono,
            direccion,
            fecha_nacimiento: fechaNacimiento,
            tipo_usuario: tipoUsuario
        }

        const perfil = await crearPerfilUsuario(perfilData)

        return {
            usuario: authData.user,
            perfil: perfil
        }
    } catch (error) {
        console.error('Error en registrarUsuario:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  iniciarSesion
 *  --------------
 *  Inicia sesión de usuario
 *
 *  @param {string} email - Email del usuario
 *  @param {string} password - Contraseña del usuario
 *  @returns {Object} Datos de sesión
 */
export async function iniciarSesion(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en iniciarSesion:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  cerrarSesion
 *  -------------
 *  Cierra la sesión del usuario
 *
 *  @returns {Object} Resultado del cierre de sesión
 */
export async function cerrarSesion() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return { success: true }
    } catch (error) {
        console.error('Error en cerrarSesion:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  obtenerUsuarioActual
 *  ---------------------
 *  Obtiene el usuario actualmente autenticado
 *
 *  @returns {Object|null} Usuario autenticado o null
 */
export async function obtenerUsuarioActual() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) throw error
        return user
    } catch (error) {
        console.error('Error en obtenerUsuarioActual:', error)
        return null
    }
}

/**
 *  escucharCambiosAutenticacion
 *  -----------------------------
 *  Configura un listener para cambios en la autenticación
 *
 *  @param {Function} callback - Función a ejecutar cuando cambie el estado de auth
 *  @returns {Object} Subscription object para cancelar el listener
 */
export function escucharCambiosAutenticacion(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session)
    })
}

/**
 *  obtenerEstadisticasUsuario
 *  ---------------------------
 *  Obtiene estadísticas del usuario actual
 *
 *  @returns {Object} Estadísticas del usuario
 */
export async function obtenerEstadisticasUsuario() {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError) throw authError
        if (!user) throw new Error('Usuario no autenticado')

        // Contar préstamos activos
        const { data: prestamosActivos, error: activosError } = await supabase
            .from('prestamos')
            .select('id', { count: 'exact' })
            .eq('usuario_id', user.id)
            .eq('estado', 'activo')

        // Contar préstamos devueltos
        const { data: prestamosDevueltos, error: devueltosError } = await supabase
            .from('prestamos')
            .select('id', { count: 'exact' })
            .eq('usuario_id', user.id)
            .eq('estado', 'devuelto')

        // Contar reseñas escritas
        const { data: reseñas, error: reseñasError } = await supabase
            .from('reseñas')
            .select('id', { count: 'exact' })
            .eq('usuario_id', user.id)

        if (activosError || devueltosError || reseñasError) {
            throw activosError || devueltosError || reseñasError
        }

        return {
            prestamosActivos: prestamosActivos.length,
            prestamosDevueltos: prestamosDevueltos.length,
            totalPrestamos: prestamosActivos.length + prestamosDevueltos.length,
            reseñasEscritas: reseñas.length
        }
    } catch (error) {
        console.error('Error en obtenerEstadisticasUsuario:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  cambiarPassword
 *  ----------------
 *  Cambia la contraseña del usuario
 *
 *  @param {string} nuevaPassword - Nueva contraseña
 *  @returns {Object} Resultado del cambio
 */
export async function cambiarPassword(nuevaPassword) {
    try {
        const { data, error } = await supabase.auth.updateUser({
            password: nuevaPassword
        })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en cambiarPassword:', error)
        throw new Error(handleSupabaseError(error))
    }
}

/**
 *  enviarRecuperacionPassword
 *  ---------------------------
 *  Envía email de recuperación de contraseña
 *
 *  @param {string} email - Email del usuario
 *  @returns {Object} Resultado del envío
 */
export async function enviarRecuperacionPassword(email) {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en enviarRecuperacionPassword:', error)
        throw new Error(handleSupabaseError(error))
    }
}
