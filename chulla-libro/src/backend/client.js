import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Verifica tu archivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-my-custom-header': 'chullalibro-app',
      'x-client-info': 'chullalibro@1.0.0'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Función helper para manejar errores de Supabase
export const handleSupabaseError = (error) => {
  console.error('Error de Supabase:', error)
  
  if (error.code === 'PGRST116') {
    return 'No se encontraron resultados'
  }
  
  if (error.code === 'PGRST301') {
    return 'Error de permisos. Verifica la configuración RLS'
  }
  
  return error.message || 'Error desconocido en la base de datos'
}

// Función para verificar la conexión
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('libros').select('count').limit(1)
    if (error) throw error
    console.log('✅ Conexión a Supabase exitosa')
    return true
  } catch (error) {
    console.error('❌ Error de conexión a Supabase:', error)
    return false
  }
}