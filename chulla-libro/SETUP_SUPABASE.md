# 🚀 CONFIGURACIÓN COMPLETA DE SUPABASE PARA CHULLALIBRO

## 📋 PASOS PARA CONFIGURAR LA BASE DE DATOS

### 1. Acceder a tu proyecto Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto ChullaLibro (usando la URL: `https://cuikbxoflpdijcnnbrja.supabase.co`)

### 2. Ejecutar el script de configuración principal
1. En el dashboard de Supabase, ve a **SQL Editor** (icono de base de datos en el menú lateral)
2. Haz clic en **"New query"**
3. Copia y pega todo el contenido del archivo `database/setup.sql`
4. Haz clic en **"Run"** para ejecutar el script
5. Verifica que no haya errores en la consola

### 3. Insertar datos de prueba
1. En el mismo SQL Editor, crea una nueva consulta
2. Copia y pega todo el contenido del archivo `database/sample_data.sql`
3. Haz clic en **"Run"** para ejecutar el script
4. Deberías ver un mensaje de confirmación con las estadísticas de datos insertados

### 4. Configurar autenticación y CORS
1. Ve a **Authentication** > **Settings** en el menú lateral
2. En **General Settings**:
   - Asegúrate de que **Enable email confirmations** esté activado
   - Configura **Site URL** como `http://localhost:5173` (para desarrollo)
3. En **URL Configuration**:
   - **Site URL**: `http://localhost:5173`
   - **Redirect URLs**: Agrega `http://localhost:5173/**` 
4. En **Email Templates**, puedes personalizar los emails de confirmación

### 4.1. 🚨 IMPORTANTE: Configurar CORS
1. Ve a **Settings** > **API** en el menú lateral
2. En la sección **CORS origins**, asegúrate de que esté configurado:
   - `http://localhost:5173` (para desarrollo)
   - `http://127.0.0.1:5173` (alternativa de localhost)
3. Si no están configurados, agrégalos y guarda los cambios

### 5. Verificar políticas de seguridad (RLS)
1. Ve a **Authentication** > **Policies**
2. Verifica que las siguientes tablas tienen RLS habilitado:
   - ✅ `categorias`
   - ✅ `usuarios`
   - ✅ `libros`
   - ✅ `prestamos`
   - ✅ `reseñas`
   - ✅ `reservas`

### 6. Verificar que las tablas se crearon correctamente
1. Ve a **Table Editor** en el menú lateral
2. Deberías ver las siguientes tablas:
   - 📚 `categorias` (15 registros)
   - 👥 `usuarios` (6 registros)
   - 📖 `libros` (21 registros)
   - 📋 `prestamos` (9 registros)
   - ⭐ `reseñas` (10 registros)
   - 📅 `reservas` (3 registros)

### 7. Probar la conexión desde tu aplicación
1. Asegúrate de que tu archivo `.env` tenga las credenciales correctas:
   ```
   VITE_SUPABASE_URL=https://cuikbxoflpdijcnnbrja.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aWtieG9mbHBkaWpjbm5icmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzQwOTMsImV4cCI6MjA2ODk1MDA5M30.DxL_IKf95Sfc0UP4JMIvuLPlA2cWy4AmjNcv0kxMHZ8
   ```

2. Instala las dependencias de Supabase si no las tienes:
   ```bash
   npm install @supabase/supabase-js
   ```

3. Inicia tu aplicación:
   ```bash
   npm run dev
   ```

4. Abre tu aplicación y ve a la página de **Libros**
5. Haz clic en **"Ver Todos"** para cargar todos los libros
6. Si ves los libros de prueba, ¡la configuración fue exitosa! 🎉

## 🔧 FUNCIONALIDADES DISPONIBLES

### ✅ Ya implementadas y funcionando:
- **Búsqueda de libros por título**
- **Búsqueda avanzada (AND/OR)**
- **Ver todos los libros**
- **Filtrado por categorías**
- **Información detallada de libros**
- **Sistema de reseñas**
- **Gestión de usuarios**
- **Préstamos y devoluciones**

### 📊 Datos de prueba incluidos:
- **21 libros** de diferentes categorías
- **15 categorías** con colores personalizados
- **6 usuarios** de prueba (estudiantes, profesores, admin)
- **9 préstamos** en diferentes estados
- **10 reseñas** con calificaciones
- **3 reservas** activas

## 🎨 CATEGORÍAS DISPONIBLES:
1. 📚 Literatura Clásica (#8B5CF6)
2. 🚀 Ciencia Ficción (#06B6D4)  
3. 🤔 Filosofía (#F59E0B)
4. 📜 Historia (#EF4444)
5. 👤 Biografías (#10B981)
6. 💻 Tecnología (#6366F1)
7. 🧠 Psicología (#EC4899)
8. 🎓 Educación (#84CC16)
9. 📖 Novela Contemporánea (#F97316)
10. ✍️ Ensayo (#8B5A2B)
11. 🎭 Poesía (#DC2626)
12. 🔬 Ciencias Naturales (#059669)
13. 🔢 Matemáticas (#7C3AED)
14. 🎨 Arte (#DB2777)
15. 💰 Economía (#2563EB)

## 🚨 SOLUCIÓN DE PROBLEMAS

### Error de conexión:
1. Verifica que la URL y API Key estén correctas en `.env`
2. Asegúrate de que el proyecto esté activo en Supabase
3. Revisa la consola del navegador para errores específicos

### No se muestran los libros:
1. Ve a SQL Editor y ejecuta: `SELECT * FROM libros LIMIT 5;`
2. Si no hay resultados, ejecuta nuevamente `sample_data.sql`
3. Verifica que RLS esté configurado correctamente

### Errores de permisos:
1. Ve a Authentication > Policies
2. Revisa que las políticas estén habilitadas
3. Si persiste, desactiva temporalmente RLS para debugging

## 🎯 PRÓXIMOS PASOS

1. **Configura autenticación real** registrando usuarios desde la aplicación
2. **Personaliza las categorías** según tus necesidades
3. **Agrega más libros** usando el formulario de administración
4. **Configura notificaciones** para préstamos vencidos
5. **Implementa sistema de reservas** avanzado

## 🆘 SOPORTE

Si encuentras algún problema:
1. Revisa los logs en la consola del navegador
2. Verifica los logs de Supabase en el dashboard
3. Comprueba que todas las políticas de RLS estén configuradas
4. Asegúrate de que los scripts SQL se ejecutaron completamente

¡Tu biblioteca digital ChullaLibro está lista para usar! 📚✨
