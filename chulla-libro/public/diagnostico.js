console.log('🔍 === DIAGNÓSTICO SUPABASE CHULLALIBRO ===')

// Función para diagnosticar problemas con Supabase
async function diagnosticarSupabase() {
  // Verificar variables de entorno
  console.log('📡 Variables de entorno:')
  console.log('  VITE_SUPABASE_URL:', window.location.origin, '-> debe apuntar a Supabase')
  
  // Crear cliente temporal para pruebas
  const { createClient } = await import('@supabase/supabase-js')
  
  const supabaseUrl = 'https://cuikbxoflpdijcnnbrja.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aWtieG9mbHBkaWpjbm5icmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NTQ5NzksImV4cCI6MjA2OTAzMDk3OX0.DxL_IKf95Sfc0UP4JMIvuLPlA2cWy4AmjNcv0kxMHZ8'
  
  console.log('  URL:', supabaseUrl)
  console.log('  Key:', supabaseKey ? 'DEFINIDA' : 'NO DEFINIDA')
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Test 1: Conexión básica
    console.log('\n🔗 Test 1: Conexión básica...')
    const { data: healthData, error: healthError } = await supabase
      .from('categorias')
      .select('count')
    
    if (healthError) {
      console.error('❌ Error conexión:', healthError)
      return
    }
    console.log('✅ Conexión exitosa')
    
    // Test 2: Consultar categorías
    console.log('\n📂 Test 2: Consultar categorías...')
    const { data: categoriasData, error: categoriasError } = await supabase
      .from('categorias')
      .select('id, nombre')
      .limit(5)
    
    if (categoriasError) {
      console.error('❌ Error categorías:', categoriasError)
    } else {
      console.log('✅ Categorías encontradas:', categoriasData?.length || 0)
      console.log('📋 Lista:', categoriasData?.map(c => c.nombre).join(', '))
    }
    
    // Test 3: Consultar libros
    console.log('\n📚 Test 3: Consultar libros...')
    const { data: librosData, error: librosError } = await supabase
      .from('libros')
      .select('id, titulo, autor')
      .limit(3)
    
    if (librosError) {
      console.error('❌ Error libros:', {
        code: librosError.code,
        message: librosError.message,
        details: librosError.details
      })
    } else {
      console.log('✅ Libros encontrados:', librosData?.length || 0)
      if (librosData?.length > 0) {
        librosData.forEach((libro, i) => {
          console.log(`  ${i+1}. ${libro.titulo} - ${libro.autor}`)
        })
      }
    }
    
    // Test 4: Consulta con JOIN
    console.log('\n🔗 Test 4: Consulta con JOIN...')
    const { data: joinData, error: joinError } = await supabase
      .from('libros')
      .select(`
        id,
        titulo,
        categorias (
          nombre
        )
      `)
      .limit(2)
    
    if (joinError) {
      console.error('❌ Error JOIN:', {
        code: joinError.code,
        message: joinError.message,
        details: joinError.details
      })
    } else {
      console.log('✅ JOIN exitoso:', joinData?.length || 0)
      if (joinData?.length > 0) {
        joinData.forEach(libro => {
          console.log(`  - ${libro.titulo} (${libro.categorias?.nombre || 'Sin categoría'})`)
        })
      }
    }
    
    console.log('\n🎉 === DIAGNÓSTICO COMPLETADO ===')
    
  } catch (error) {
    console.error('💥 Error general:', error)
  }
}

// Ejecutar automáticamente
diagnosticarSupabase()

// También disponible como función global
window.diagnosticarSupabase = diagnosticarSupabase
