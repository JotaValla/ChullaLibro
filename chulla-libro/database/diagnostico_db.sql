-- Script para diagnosticar y arreglar las relaciones en la base de datos
-- Ejecuta esto en el SQL Editor de Supabase

-- ============================================
-- 1. VERIFICAR QUE EXISTEN LAS TABLAS
-- ============================================
SELECT 'Verificando tablas existentes...' as info;

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================
-- 2. VERIFICAR ESTRUCTURA DE LA TABLA LIBROS
-- ============================================
SELECT 'Estructura de la tabla libros:' as info;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'libros'
ORDER BY ordinal_position;

-- ============================================
-- 3. VERIFICAR FOREIGN KEYS EXISTENTES
-- ============================================
SELECT 'Foreign keys en la tabla libros:' as info;

SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'libros'
    AND tc.table_schema = 'public';

-- ============================================
-- 4. VERIFICAR DATOS EN LAS TABLAS
-- ============================================
SELECT 'Cantidad de registros en categorias:' as info;
SELECT COUNT(*) as total_categorias FROM public.categorias;

SELECT 'Cantidad de registros en libros:' as info;
SELECT COUNT(*) as total_libros FROM public.libros;

SELECT 'Primeras 3 categorías:' as info;
SELECT id, nombre FROM public.categorias LIMIT 3;

SELECT 'Primeros 3 libros:' as info;
SELECT id, titulo, categoria_id, categoria FROM public.libros LIMIT 3;

-- ============================================
-- 5. CREAR LA FOREIGN KEY SI NO EXISTE
-- ============================================
SELECT 'Intentando crear foreign key si no existe...' as info;

-- Primero verificar si la foreign key ya existe
DO $$
BEGIN
    -- Intentar agregar la foreign key
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'libros_categoria_id_fkey' 
        AND table_name = 'libros'
    ) THEN
        ALTER TABLE public.libros 
        ADD CONSTRAINT libros_categoria_id_fkey 
        FOREIGN KEY (categoria_id) REFERENCES public.categorias(id);
        
        RAISE NOTICE 'Foreign key creada exitosamente';
    ELSE
        RAISE NOTICE 'Foreign key ya existe';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error al crear foreign key: %', SQLERRM;
END $$;

-- ============================================
-- 6. VERIFICAR LA RELACIÓN DESPUÉS DEL ARREGLO
-- ============================================
SELECT 'Verificando relación después del arreglo:' as info;

SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'libros'
    AND tc.table_schema = 'public';

-- ============================================
-- 7. MENSAJE FINAL
-- ============================================
SELECT '¡Diagnóstico completado! Revisa los resultados arriba.' as resultado;
