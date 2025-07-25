import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://cuikbxoflpdijcnnbrja.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aWtieG9mbHBkaWpjbm5icmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzQwOTMsImV4cCI6MjA2ODk1MDA5M30.DxL_IKf95Sfc0UP4JMIvuLPlA2cWy4AmjNcv0kxMHZ8"

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