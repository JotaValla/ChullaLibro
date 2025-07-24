-- ============================================
-- DATOS DE PRUEBA PARA CHULLALIBRO
-- ============================================
-- Ejecuta este archivo DESPUÉS de setup.sql
-- Este archivo llena la base de datos con datos realistas para pruebas

-- ============================================
-- 1. INSERTAR CATEGORÍAS
-- ============================================

INSERT INTO public.categorias (nombre, descripcion, color) VALUES
('Literatura Clásica', 'Obras maestras de la literatura universal', '#8B5CF6'),
('Ciencia Ficción', 'Historias futuristas y especulativas', '#06B6D4'),
('Filosofía', 'Pensamiento y reflexión filosófica', '#F59E0B'),
('Historia', 'Relatos y análisis históricos', '#EF4444'),
('Biografías', 'Vidas de personajes importantes', '#10B981'),
('Tecnología', 'Libros sobre desarrollo tecnológico', '#6366F1'),
('Psicología', 'Estudios del comportamiento humano', '#EC4899'),
('Educación', 'Metodologías y pedagogía', '#84CC16'),
('Novela Contemporánea', 'Literatura moderna y actual', '#F97316'),
('Ensayo', 'Reflexiones y análisis críticos', '#8B5A2B'),
('Poesía', 'Expresión lírica y versos', '#DC2626'),
('Ciencias Naturales', 'Biología, química, física', '#059669'),
('Matemáticas', 'Álgebra, cálculo, geometría', '#7C3AED'),
('Arte', 'Historia y teoría artística', '#DB2777'),
('Economía', 'Teorías y análisis económicos', '#2563EB')
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- 2. INSERTAR LIBROS CON DATOS REALISTAS
-- ============================================

INSERT INTO public.libros (
    titulo, autor, isbn, categoria_id, categoria, editorial, año_publicacion, 
    numero_paginas, descripcion, imagen_portada, ubicacion_fisica, 
    numero_copias, copias_disponibles, palabras_clave
) VALUES
-- Literatura Clásica
('Cien años de soledad', 'Gabriel García Márquez', '978-84-376-0494-7', 1, 'Literatura Clásica', 'Editorial Sudamericana', 1967, 471, 
'Una obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de varias generaciones en el pueblo ficticio de Macondo.', 
'https://images-na.ssl-images-amazon.com/images/I/51+OvEEYlZL._SX331_BO1,204,203,200_.jpg', 'Estante A-1', 3, 2, 
ARRAY['realismo mágico', 'colombia', 'familia', 'generaciones', 'macondo']),

('Don Quijote de La Mancha', 'Miguel de Cervantes', '978-84-376-0495-4', 1, 'Literatura Clásica', 'Editorial Planeta', 1605, 863, 
'La historia del ingenioso hidalgo que decide convertirse en caballero andante para revivir la caballería y hacer justicia en el mundo.', 
'https://images-na.ssl-images-amazon.com/images/I/51ZQZW7Q3DL._SX346_BO1,204,203,200_.jpg', 'Estante A-2', 4, 4, 
ARRAY['caballería', 'aventura', 'españa', 'clásico', 'literatura española']),

('Orgullo y prejuicio', 'Jane Austen', '978-84-376-0496-1', 1, 'Literatura Clásica', 'Editorial Alba', 1813, 279, 
'Una novela romántica que critica la sociedad inglesa del siglo XIX a través de la historia de Elizabeth Bennet y Mr. Darcy.', 
'https://images-na.ssl-images-amazon.com/images/I/51JJYQQ1XOL._SX324_BO1,204,203,200_.jpg', 'Estante A-3', 2, 1, 
ARRAY['romance', 'inglaterra', 'sociedad', 'matrimonio', 'clase social']),

-- Ciencia Ficción
('1984', 'George Orwell', '978-84-376-0497-8', 2, 'Ciencia Ficción', 'Editorial Destino', 1949, 326, 
'Una novela distópica que presenta un futuro totalitario donde el Gran Hermano controla todos los aspectos de la vida.', 
'https://images-na.ssl-images-amazon.com/images/I/41E1L7WPPML._SX324_BO1,204,203,200_.jpg', 'Estante B-1', 5, 3, 
ARRAY['distopía', 'totalitarismo', 'vigilancia', 'control', 'futuro']),

('Dune', 'Frank Herbert', '978-84-376-0498-5', 2, 'Ciencia Ficción', 'Editorial Nova', 1965, 688, 
'Una épica espacial que narra la lucha por el control del planeta desértico Arrakis y su valiosa especia.', 
'https://images-na.ssl-images-amazon.com/images/I/41P02L5eOlL._SX324_BO1,204,203,200_.jpg', 'Estante B-2', 2, 2, 
ARRAY['espacio', 'desierto', 'política', 'religión', 'ecología']),

('Fahrenheit 451', 'Ray Bradbury', '978-84-376-0499-2', 2, 'Ciencia Ficción', 'Editorial Minotauro', 1953, 249, 
'Una sociedad futura donde los libros están prohibidos y los bomberos se dedican a quemarlos en lugar de apagar incendios.', 
'https://images-na.ssl-images-amazon.com/images/I/41Q7GRCPXQL._SX324_BO1,204,203,200_.jpg', 'Estante B-3', 3, 3, 
ARRAY['censura', 'libros', 'futuro', 'bomberos', 'conocimiento']),

-- Filosofía
('El mundo de Sofía', 'Jostein Gaarder', '978-84-376-0500-5', 3, 'Filosofía', 'Editorial Siruela', 1991, 638, 
'Una novela que introduce la historia de la filosofía occidental a través de las aventuras de una joven llamada Sofía.', 
'https://images-na.ssl-images-amazon.com/images/I/41WQPJ6VQSL._SX324_BO1,204,203,200_.jpg', 'Estante C-1', 2, 2, 
ARRAY['filosofía', 'historia', 'pensamiento', 'educación', 'occidente']),

('Meditaciones', 'Marco Aurelio', '978-84-376-0501-2', 3, 'Filosofía', 'Editorial Gredos', 180, 187, 
'Reflexiones personales del emperador romano sobre la vida, la muerte, y los principios del estoicismo.', 
'https://images-na.ssl-images-amazon.com/images/I/41N1HZWVG6L._SX324_BO1,204,203,200_.jpg', 'Estante C-2', 3, 1, 
ARRAY['estoicismo', 'roma', 'reflexiones', 'emperador', 'virtud']),

-- Historia
('Sapiens: De animales a dioses', 'Yuval Noah Harari', '978-84-376-0502-9', 4, 'Historia', 'Editorial Debate', 2014, 496, 
'Una visión revolucionaria de la historia de la humanidad desde los primeros homínidos hasta la era moderna.', 
'https://images-na.ssl-images-amazon.com/images/I/41JIhnN1QnL._SX324_BO1,204,203,200_.jpg', 'Estante D-1', 4, 2, 
ARRAY['humanidad', 'evolución', 'civilización', 'antropología', 'historia']),

('Una breve historia del tiempo', 'Stephen Hawking', '978-84-376-0503-6', 12, 'Ciencias Naturales', 'Editorial Crítica', 1988, 256, 
'Una exploración accesible de conceptos fundamentales del universo como el tiempo, el espacio y los agujeros negros.', 
'https://images-na.ssl-images-amazon.com/images/I/41QCE+K1MhL._SX324_BO1,204,203,200_.jpg', 'Estante E-1', 3, 3, 
ARRAY['cosmología', 'física', 'universo', 'tiempo', 'agujeros negros']),

-- Biografías
('Steve Jobs', 'Walter Isaacson', '978-84-376-0504-3', 5, 'Biografías', 'Editorial Debate', 2011, 656, 
'La biografía autorizada del cofundador de Apple, basada en más de cuarenta entrevistas exclusivas con Jobs.', 
'https://images-na.ssl-images-amazon.com/images/I/41+2yVRk5uL._SX324_BO1,204,203,200_.jpg', 'Estante F-1', 2, 1, 
ARRAY['apple', 'tecnología', 'innovación', 'emprendimiento', 'liderazgo']),

-- Tecnología
('Código limpio', 'Robert C. Martin', '978-84-376-0505-0', 6, 'Tecnología', 'Editorial Anaya', 2008, 464, 
'Manual de estilo para el desarrollo ágil de software. Principios, patrones y prácticas para escribir código limpio.', 
'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg', 'Estante G-1', 5, 4, 
ARRAY['programación', 'software', 'desarrollo', 'código', 'buenas prácticas']),

('El programador pragmático', 'David Thomas, Andrew Hunt', '978-84-376-0506-7', 6, 'Tecnología', 'Editorial Addison-Wesley', 1999, 352, 
'De aprendiz a maestro. Guía esencial para desarrolladores que quieren mejorar sus habilidades y carrera.', 
'https://images-na.ssl-images-amazon.com/images/I/41vN+l8CjdL._SX327_BO1,204,203,200_.jpg', 'Estante G-2', 3, 2, 
ARRAY['desarrollo', 'carrera', 'habilidades', 'metodología', 'pragmatismo']),

-- Psicología
('Pensar rápido, pensar despacio', 'Daniel Kahneman', '978-84-376-0507-4', 7, 'Psicología', 'Editorial Debate', 2011, 688, 
'Exploración fascinante de los dos sistemas que rigen cómo pensamos: el rápido e intuitivo, y el lento y reflexivo.', 
'https://images-na.ssl-images-amazon.com/images/I/41pODr6SMEL._SX324_BO1,204,203,200_.jpg', 'Estante H-1', 3, 2, 
ARRAY['cognición', 'decisiones', 'psicología', 'pensamiento', 'comportamiento']),

-- Novela Contemporánea
('Tokio Blues', 'Haruki Murakami', '978-84-376-0508-1', 9, 'Novela Contemporánea', 'Editorial Tusquets', 1987, 389, 
'Historia de amor, pérdida y crecimiento personal en el Japón de los años 60, narrada con el estilo único de Murakami.', 
'https://images-na.ssl-images-amazon.com/images/I/41ZQPJ8P5TL._SX324_BO1,204,203,200_.jpg', 'Estante I-1', 2, 2, 
ARRAY['japón', 'amor', 'juventud', 'pérdida', 'realismo mágico']),

('El alquimista', 'Paulo Coelho', '978-84-376-0509-8', 9, 'Novela Contemporánea', 'Editorial Planeta', 1988, 163, 
'La historia de Santiago, un joven pastor andaluz que emprende un viaje desde España hasta las pirámides de Egipto.', 
'https://images-na.ssl-images-amazon.com/images/I/41Qh8y8hKKL._SX324_BO1,204,203,200_.jpg', 'Estante I-2', 4, 3, 
ARRAY['aventura', 'sueños', 'destino', 'viaje', 'autoconocimiento']),

-- Educación
('Pedagogía del oprimido', 'Paulo Freire', '978-84-376-0510-4', 8, 'Educación', 'Editorial Siglo XXI', 1970, 245, 
'Obra fundamental sobre educación crítica y liberadora que propone una pedagogía humanista y transformadora.', 
'https://images-na.ssl-images-amazon.com/images/I/41WQR2HQVGL._SX324_BO1,204,203,200_.jpg', 'Estante J-1', 2, 2, 
ARRAY['pedagogía', 'educación', 'crítica', 'liberación', 'humanismo']),

-- Matemáticas
('El hombre que calculaba', 'Malba Tahan', '978-84-376-0511-1', 13, 'Matemáticas', 'Editorial Saraiva', 1938, 224, 
'Relatos matemáticos llenos de ingenio protagonizados por Beremiz Samir, un calculista persa con habilidades extraordinarias.', 
'https://images-na.ssl-images-amazon.com/images/I/41TCQR8ZJTL._SX324_BO1,204,203,200_.jpg', 'Estante K-1', 3, 3, 
ARRAY['matemáticas', 'cálculo', 'problemas', 'ingenio', 'oriente']),

-- Arte
('Historia del arte', 'Ernst Gombrich', '978-84-376-0512-8', 14, 'Arte', 'Editorial Phaidon', 1950, 688, 
'Una introducción completa y accesible a la historia del arte occidental desde las pinturas rupestres hasta el arte moderno.', 
'https://images-na.ssl-images-amazon.com/images/I/41QR8H9VQTL._SX324_BO1,204,203,200_.jpg', 'Estante L-1', 2, 1, 
ARRAY['arte', 'historia', 'pintura', 'escultura', 'cultura']),

-- Economía
('El capital en el siglo XXI', 'Thomas Piketty', '978-84-376-0513-5', 15, 'Economía', 'Editorial Fondo de Cultura Económica', 2013, 696, 
'Análisis exhaustivo sobre la desigualdad de riqueza y renta en el mundo desarrollado durante los últimos 250 años.', 
'https://images-na.ssl-images-amazon.com/images/I/41QC8QQ8TUL._SX324_BO1,204,203,200_.jpg', 'Estante M-1', 2, 2, 
ARRAY['economía', 'desigualdad', 'capital', 'riqueza', 'análisis']),

-- Poesía
('Veinte poemas de amor y una canción desesperada', 'Pablo Neruda', '978-84-376-0514-2', 11, 'Poesía', 'Editorial Losada', 1924, 112, 
'Colección de poemas que explora el amor en todas sus facetas: pasión, deseo, pérdida y melancolía.', 
'https://images-na.ssl-images-amazon.com/images/I/41QHF4QK1SL._SX324_BO1,204,203,200_.jpg', 'Estante N-1', 3, 2, 
ARRAY['poesía', 'amor', 'chile', 'romanticismo', 'literatura latinoamericana'])

ON CONFLICT (isbn) DO NOTHING;

-- ============================================
-- 3. INSERTAR USUARIOS DE PRUEBA
-- ============================================
-- NOTA IMPORTANTE: Para usuarios de prueba, primero necesitas crear usuarios reales 
-- en Supabase Authentication o modificar la tabla usuarios para que sea independiente

-- Opción 1: Crear usuarios sin referencia a auth.users (TEMPORAL para pruebas)
-- Primero, removemos temporalmente la restricción de foreign key
ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS usuarios_id_fkey;

-- Ahora podemos insertar usuarios de prueba
INSERT INTO public.usuarios (
    id, nombre, email, telefono, direccion, fecha_nacimiento, tipo_usuario, estado
) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'María García López', 'maria.garcia@test.com', '+593 99 123 4567', 
 'Av. 10 de Agosto 1234, Quito', '1995-03-15', 'Estudiante', 'activo'),
 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Carlos Eduardo Martínez', 'carlos.martinez@test.com', '+593 98 765 4321', 
 'Calle Amazonas 567, Quito', '1988-07-22', 'Profesor', 'activo'),
 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Ana Patricia Rodríguez', 'ana.rodriguez@test.com', '+593 99 876 5432', 
 'Av. 6 de Diciembre 890, Quito', '1992-11-08', 'Estudiante', 'activo'),
 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Pedro Antonio López', 'pedro.lopez@test.com', '+593 97 654 3210', 
 'Calle García Moreno 345, Quito', '1985-01-30', 'Profesor', 'activo'),
 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Laura Isabella Santos', 'laura.santos@test.com', '+593 96 543 2109', 
 'Av. Eloy Alfaro 678, Quito', '1997-09-12', 'Estudiante', 'activo'),

('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'Roberto Administrador', 'admin@chullalibro.com', '+593 99 000 0000', 
 'Biblioteca Central EPN', '1980-05-01', 'Administrador', 'activo')

ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 4. INSERTAR PRÉSTAMOS DE PRUEBA
-- ============================================

-- Primero, obtenemos algunos IDs de libros reales que se insertaron
-- Usaremos una subconsulta para obtener los IDs por título
INSERT INTO public.prestamos (
    usuario_id, libro_id, fecha_prestamo, fecha_vencimiento, estado, notas
) VALUES
-- Préstamos activos (usando subconsultas para obtener IDs reales)
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM public.libros WHERE titulo = 'Cien años de soledad' LIMIT 1), NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', 'activo', 'Primer préstamo de María'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', (SELECT id FROM public.libros WHERE titulo = '1984' LIMIT 1), NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', 'activo', 'Para investigación'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', (SELECT id FROM public.libros WHERE titulo = 'Sapiens: De animales a dioses' LIMIT 1), NOW() - INTERVAL '3 days', NOW() + INTERVAL '27 days', 'activo', 'Lectura personal'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', (SELECT id FROM public.libros WHERE titulo = 'Tokio Blues' LIMIT 1), NOW() - INTERVAL '7 days', NOW() + INTERVAL '23 days', 'activo', 'Para clase de literatura'),

-- Préstamos vencidos
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', (SELECT id FROM public.libros WHERE titulo = 'Don Quijote de La Mancha' LIMIT 1), NOW() - INTERVAL '45 days', NOW() - INTERVAL '15 days', 'vencido', 'Préstamo vencido'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', (SELECT id FROM public.libros WHERE titulo = 'Pedagogía del oprimido' LIMIT 1), NOW() - INTERVAL '50 days', NOW() - INTERVAL '20 days', 'vencido', 'Necesita renovación'),

-- Préstamos devueltos
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM public.libros WHERE titulo = 'El mundo de Sofía' LIMIT 1), NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days', 'devuelto', 'Devuelto a tiempo'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', (SELECT id FROM public.libros WHERE titulo = 'Steve Jobs' LIMIT 1), NOW() - INTERVAL '40 days', NOW() - INTERVAL '10 days', 'devuelto', 'Excelente estado'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', (SELECT id FROM public.libros WHERE titulo = 'Código limpio' LIMIT 1), NOW() - INTERVAL '35 days', NOW() - INTERVAL '5 days', 'devuelto', 'Sin observaciones')

ON CONFLICT DO NOTHING;

-- Actualizar fechas de devolución para préstamos devueltos
UPDATE public.prestamos 
SET fecha_devolucion = fecha_vencimiento - INTERVAL '2 days'
WHERE estado = 'devuelto' AND fecha_devolucion IS NULL;

-- ============================================
-- 5. INSERTAR RESEÑAS DE PRUEBA
-- ============================================

INSERT INTO public.reseñas (usuario_id, libro_id, calificacion, comentario, es_publica) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM public.libros WHERE titulo = 'Cien años de soledad' LIMIT 1), 5, 'Una obra maestra absoluta. García Márquez crea un mundo mágico que no puedes dejar de leer. Cada página es un descubrimiento.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', (SELECT id FROM public.libros WHERE titulo = 'Cien años de soledad' LIMIT 1), 4, 'Excelente narrativa, aunque algunas partes se sienten un poco lentas. Definitivamente un clásico que vale la pena leer.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', (SELECT id FROM public.libros WHERE titulo = '1984' LIMIT 1), 5, 'Orwell fue un visionario. La relevancia de esta obra en nuestra era digital es escalofriante. Lectura obligatoria.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', (SELECT id FROM public.libros WHERE titulo = '1984' LIMIT 1), 5, 'Impresionante cómo predijo muchos aspectos de nuestra sociedad actual. Un libro que te hace reflexionar profundamente.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', (SELECT id FROM public.libros WHERE titulo = 'Sapiens: De animales a dioses' LIMIT 1), 4, 'Harari tiene una forma fascinante de explicar conceptos complejos. Cambió mi perspectiva sobre la humanidad.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM public.libros WHERE titulo = 'Código limpio' LIMIT 1), 5, 'Un libro esencial para cualquier desarrollador. Las técnicas aquí presentadas mejoraron significativamente mi código.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', (SELECT id FROM public.libros WHERE titulo = 'Pensar rápido, pensar despacio' LIMIT 1), 4, 'Kahneman explica de manera brillante cómo funciona nuestra mente. Fascinante y útil para la vida diaria.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', (SELECT id FROM public.libros WHERE titulo = 'El alquimista' LIMIT 1), 5, 'El Alquimista es más que un libro, es una experiencia transformadora. Paulo Coelho logra inspirar y motivar.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', (SELECT id FROM public.libros WHERE titulo = 'Don Quijote de La Mancha' LIMIT 1), 4, 'Un clásico que nunca pasa de moda. La aventura de Don Quijote sigue siendo relevante y entretenida.', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', (SELECT id FROM public.libros WHERE titulo = 'Veinte poemas de amor y una canción desesperada' LIMIT 1), 5, 'Neruda captura la esencia del amor en cada verso. Poesía que llega directo al corazón.', true)

ON CONFLICT (usuario_id, libro_id) DO NOTHING;

-- ============================================
-- 6. INSERTAR RESERVAS DE PRUEBA
-- ============================================

INSERT INTO public.reservas (usuario_id, libro_id, fecha_reserva, fecha_expiracion, estado, posicion_cola) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', (SELECT id FROM public.libros WHERE titulo = 'Cien años de soledad' LIMIT 1), NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', 'activa', 1),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', (SELECT id FROM public.libros WHERE titulo = 'Cien años de soledad' LIMIT 1), NOW() - INTERVAL '1 day', NOW() + INTERVAL '6 days', 'activa', 2),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', (SELECT id FROM public.libros WHERE titulo = 'Steve Jobs' LIMIT 1), NOW() - INTERVAL '3 days', NOW() + INTERVAL '4 days', 'activa', 1)

ON CONFLICT DO NOTHING;

-- ============================================
-- 7. ACTUALIZAR CONTADORES Y ESTADÍSTICAS
-- ============================================

-- Actualizar número de libros prestados por usuario
UPDATE public.usuarios 
SET libros_prestados = (
    SELECT COUNT(*) 
    FROM public.prestamos 
    WHERE usuario_id = usuarios.id AND estado = 'activo'
);

-- Actualizar última actividad
UPDATE public.usuarios 
SET ultima_actividad = NOW() - (RANDOM() * INTERVAL '7 days');

-- ============================================
-- 8. VERIFICACIÓN DE DATOS
-- ============================================

-- Mostrar resumen de datos insertados
DO $$
DECLARE
    total_categorias INTEGER;
    total_libros INTEGER;
    total_usuarios INTEGER;
    total_prestamos INTEGER;
    total_reseñas INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_categorias FROM public.categorias;
    SELECT COUNT(*) INTO total_libros FROM public.libros;
    SELECT COUNT(*) INTO total_usuarios FROM public.usuarios;
    SELECT COUNT(*) INTO total_prestamos FROM public.prestamos;
    SELECT COUNT(*) INTO total_reseñas FROM public.reseñas;
    
    RAISE NOTICE '=== DATOS DE PRUEBA INSERTADOS EXITOSAMENTE ===';
    RAISE NOTICE 'Categorías: %', total_categorias;
    RAISE NOTICE 'Libros: %', total_libros;
    RAISE NOTICE 'Usuarios: %', total_usuarios;
    RAISE NOTICE 'Préstamos: %', total_prestamos;
    RAISE NOTICE 'Reseñas: %', total_reseñas;
    RAISE NOTICE '===============================================';
    RAISE NOTICE 'Tu base de datos ChullaLibro está lista para usar!';
    RAISE NOTICE 'IMPORTANTE: Los usuarios son de prueba únicamente.';
    RAISE NOTICE 'En producción, restaura la restricción con:';
    RAISE NOTICE 'ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;';
END $$;

-- ============================================
-- 9. NOTAS IMPORTANTES PARA PRODUCCIÓN
-- ============================================

-- PARA PRODUCCIÓN: Una vez que tengas usuarios reales registrados a través de Supabase Auth,
-- puedes restaurar la restricción de foreign key con:
-- ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- PASOS PARA USUARIOS REALES:
-- 1. Elimina los usuarios de prueba: DELETE FROM public.usuarios;
-- 2. Registra usuarios reales usando Supabase Auth
-- 3. Restaura la restricción de foreign key (comando de arriba)
-- 4. Los usuarios se crearán automáticamente en public.usuarios mediante triggers o tu aplicación
