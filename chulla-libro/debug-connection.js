// Script para verificar la conexión a Supabase
// Ejecuta este archivo con: node debug-connection.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Verificando configuración de Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NO DEFINIDA')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Faltan las variables de entorno de Supabase')
  process.exit(1)
}

// Crear cliente
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verificarConexion() {
  try {
    console.log('\n🔄 Probando conexión...')
    
    // Probar consulta simple
    const { data, error } = await supabase
      .from('categorias')
      .select('count', { count: 'exact' })
    
    if (error) {
      console.error('❌ Error en la consulta:', error.message)
      console.error('Detalles:', error)
    } else {
      console.log('✅ Conexión exitosa!')
      console.log('📊 Número de categorías:', data)
    }

    // Probar consulta de libros
    console.log('\n📚 Probando consulta de libros...')
    const { data: libros, error: errorLibros } = await supabase
      .from('libros')
      .select('id, titulo, autor')
      .limit(3)
    
    if (errorLibros) {
      console.error('❌ Error al consultar libros:', errorLibros.message)
    } else {
      console.log('✅ Libros obtenidos:')
      libros.forEach(libro => {
        console.log(`  - ${libro.titulo} por ${libro.autor}`)
      })
    }

  } catch (error) {
    console.error('💥 Error general:', error.message)
  }
}

verificarConexion()
