import { supabase, testConnection } from './client.js'
import { buscarTodosLosLibros, obtenerCategorias } from './libros.js'

/**
 * Script de prueba para verificar la conectividad con Supabase
 * Ejecuta este archivo para asegurar que todo funciona correctamente
 */

async function probarConexion() {
    console.log('🔍 Probando conexión a Supabase...')
    
    try {
        // Probar conexión básica
        const conexionExitosa = await testConnection()
        
        if (!conexionExitosa) {
            throw new Error('No se pudo conectar a Supabase')
        }
        
        console.log('✅ Conexión a Supabase exitosa')
        
        // Probar obtener categorías
        console.log('\n📋 Probando obtener categorías...')
        const categorias = await obtenerCategorias()
        console.log(`✅ Se obtuvieron ${categorias.length} categorías:`)
        categorias.slice(0, 3).forEach(cat => {
            console.log(`   - ${cat.nombre} (${cat.color})`)
        })
        
        // Probar obtener libros
        console.log('\n📚 Probando obtener libros...')
        const libros = await buscarTodosLosLibros()
        console.log(`✅ Se obtuvieron ${libros.length} libros:`)
        libros.slice(0, 3).forEach(libro => {
            console.log(`   - ${libro.titulo} por ${libro.autor}`)
        })
        
        // Verificar estructura de datos
        if (libros.length > 0) {
            const primerLibro = libros[0]
            console.log('\n🔬 Estructura del primer libro:')
            console.log('   ID:', primerLibro.id)
            console.log('   Título:', primerLibro.titulo)
            console.log('   Autor:', primerLibro.autor)
            console.log('   Disponible:', primerLibro.disponible)
            console.log('   Categoría:', primerLibro.categoria)
            console.log('   Copias disponibles:', primerLibro.copias_disponibles)
        }
        
        console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!')
        console.log('🚀 Tu aplicación ChullaLibro está lista para usar')
        
        return true
        
    } catch (error) {
        console.error('\n❌ Error en las pruebas:')
        console.error('   Mensaje:', error.message)
        console.error('   Detalles:', error)
        
        console.log('\n🛠️ Pasos para solucionar:')
        console.log('1. Verifica que las credenciales en .env sean correctas')
        console.log('2. Asegúrate de haber ejecutado setup.sql en Supabase')
        console.log('3. Ejecuta sample_data.sql para insertar datos de prueba')
        console.log('4. Verifica que RLS esté configurado correctamente')
        
        return false
    }
}

// Función para probar funciones específicas
async function probarFuncionalidadesEspecificas() {
    console.log('\n🧪 Probando funcionalidades específicas...')
    
    try {
        // Probar búsqueda por título
        const { buscarLibrosPorTitulo } = await import('./libros.js')
        const resultadosBusqueda = await buscarLibrosPorTitulo('años')
        console.log(`✅ Búsqueda por "años": ${resultadosBusqueda.length} resultados`)
        
        // Probar búsqueda avanzada
        const { buscarLibrosConAND } = await import('./libros.js')
        const resultadosAvanzada = await buscarLibrosConAND({
            titulo: 'soledad',
            autor: 'García',
            categoria: ''
        })
        console.log(`✅ Búsqueda avanzada: ${resultadosAvanzada.length} resultados`)
        
        console.log('✅ Todas las funcionalidades funcionan correctamente')
        
    } catch (error) {
        console.error('❌ Error en funcionalidades específicas:', error.message)
    }
}

// Ejecutar pruebas si el archivo se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    probarConexion().then(exitoso => {
        if (exitoso) {
            probarFuncionalidadesEspecificas()
        }
    })
}

export { probarConexion, probarFuncionalidadesEspecificas }
