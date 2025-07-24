// Script simple para probar la conexión a Supabase
// Abre la consola del navegador para ver los logs

import { supabase } from './backend/client.js'

console.log('🔍 === DIAGNÓSTICO DE SUPABASE ===')

// 1. Verificar configuración
console.log('📡 Configuración:')
console.log('  URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('  Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NO DEFINIDA')

// 2. Probar conexión simple
async function probarConexion() {
  try {
    console.log('\n🔗 Probando conexión básica...')
    const { data: testData, error: testError } = await supabase
      .from('categorias')
      .select('count')
    
    if (testError) {
      console.error('❌ Error en conexión básica:', testError)
    } else {
      console.log('✅ Conexión básica exitosa')
    }
    
    // 3. Probar tabla libros
    console.log('\n📚 Probando tabla libros...')
    const { data: librosData, error: librosError } = await supabase
      .from('libros')
      .select('id, titulo, autor')
      .limit(3)
    
    if (librosError) {
      console.error('❌ Error al consultar libros:', {
        code: librosError.code,
        message: librosError.message,
        details: librosError.details,
        hint: librosError.hint
      })
    } else {
      console.log('✅ Libros encontrados:', librosData?.length || 0)
      if (librosData && librosData.length > 0) {
        console.log('📖 Primeros libros:')
        librosData.forEach((libro, index) => {
          console.log(`  ${index + 1}. ${libro.titulo} - ${libro.autor}`)
        })
      }
    }
    
    // 4. Probar consulta con JOIN
    console.log('\n🔗 Probando consulta con JOIN (categorias)...')
    const { data: joinData, error: joinError } = await supabase
      .from('libros')
      .select(`
        id,
        titulo,
        autor,
        categorias (
          id,
          nombre,
          color
        )
      `)
      .limit(2)
    
    if (joinError) {
      console.error('❌ Error en JOIN:', {
        code: joinError.code,
        message: joinError.message,
        details: joinError.details,
        hint: joinError.hint
      })
    } else {
      console.log('✅ JOIN exitoso, resultados:', joinData?.length || 0)
      if (joinData && joinData.length > 0) {
        console.log('📊 Datos con categorías:')
        joinData.forEach((libro) => {
          console.log(`  - ${libro.titulo} (Categoría: ${libro.categorias?.nombre || 'Sin categoría'})`)
        })
      }
    }
    
  } catch (error) {
    console.error('💥 Error general:', error)
  }
}

// Ejecutar diagnóstico
probarConexion()

// Exportar función para usar desde la consola
window.probarSupabase = probarConexion
