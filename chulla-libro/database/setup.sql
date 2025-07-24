-- ============================================
-- CHULLALIBRO - CONFIGURACIÓN DE BASE DE DATOS
-- ============================================
-- Este archivo contiene toda la configuración necesaria para Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- ============================================
-- 1. CREACIÓN DE TABLAS
-- ============================================

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS public.categorias (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Color hex para la UI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Usuarios (extendiendo auth.users)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_nacimiento DATE,
    tipo_usuario VARCHAR(50) DEFAULT 'Estudiante' CHECK (tipo_usuario IN ('Estudiante', 'Profesor', 'Administrador')),
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
    avatar_url TEXT,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultima_actividad TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    libros_prestados INTEGER DEFAULT 0,
    multas_pendientes DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Libros
CREATE TABLE IF NOT EXISTS public.libros (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    isbn VARCHAR(17) UNIQUE, -- ISBN-13 format
    categoria_id BIGINT REFERENCES public.categorias(id),
    categoria VARCHAR(100), -- Campo legacy para compatibilidad
    editorial VARCHAR(255),
    año_publicacion INTEGER,
    numero_paginas INTEGER,
    idioma VARCHAR(50) DEFAULT 'Español',
    descripcion TEXT,
    imagen_portada TEXT, -- URL de la imagen
    ubicacion_fisica VARCHAR(100), -- Estante, sección, etc.
    disponible BOOLEAN DEFAULT TRUE,
    estado_fisico VARCHAR(50) DEFAULT 'Bueno' CHECK (estado_fisico IN ('Excelente', 'Bueno', 'Regular', 'Malo')),
    numero_copias INTEGER DEFAULT 1,
    copias_disponibles INTEGER DEFAULT 1,
    veces_prestado INTEGER DEFAULT 0,
    calificacion_promedio DECIMAL(3,2) DEFAULT 0.00,
    numero_reseñas INTEGER DEFAULT 0,
    palabras_clave TEXT[], -- Array de palabras clave para búsqueda
    fecha_adquisicion DATE DEFAULT CURRENT_DATE,
    precio_compra DECIMAL(10,2),
    donado_por VARCHAR(255), -- Si fue donación
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_copias_disponibles CHECK (copias_disponibles <= numero_copias),
    CONSTRAINT chk_calificacion CHECK (calificacion_promedio >= 0 AND calificacion_promedio <= 5)
);

-- Tabla de Préstamos
CREATE TABLE IF NOT EXISTS public.prestamos (
    id BIGSERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    libro_id BIGINT NOT NULL REFERENCES public.libros(id) ON DELETE CASCADE,
    fecha_prestamo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_vencimiento TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_devolucion TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'devuelto', 'vencido', 'perdido', 'cancelado')),
    dias_restantes INTEGER DEFAULT 0, -- Se calculará mediante trigger
    multa DECIMAL(10,2) DEFAULT 0.00,
    notas TEXT,
    renovaciones INTEGER DEFAULT 0,
    max_renovaciones INTEGER DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chk_fechas CHECK (fecha_vencimiento > fecha_prestamo),
    CONSTRAINT chk_devolucion CHECK (fecha_devolucion IS NULL OR fecha_devolucion >= fecha_prestamo),
    CONSTRAINT chk_renovaciones CHECK (renovaciones <= max_renovaciones)
);

-- Tabla de Reseñas
CREATE TABLE IF NOT EXISTS public.reseñas (
    id BIGSERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    libro_id BIGINT NOT NULL REFERENCES public.libros(id) ON DELETE CASCADE,
    calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    es_publica BOOLEAN DEFAULT TRUE,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Un usuario solo puede reseñar un libro una vez
    UNIQUE(usuario_id, libro_id)
);

-- Tabla de Reservas
CREATE TABLE IF NOT EXISTS public.reservas (
    id BIGSERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    libro_id BIGINT NOT NULL REFERENCES public.libros(id) ON DELETE CASCADE,
    fecha_reserva TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_expiracion TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'cumplida', 'expirada', 'cancelada')),
    posicion_cola INTEGER,
    notificado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

-- Índices para búsquedas de libros
CREATE INDEX IF NOT EXISTS idx_libros_titulo ON public.libros USING gin(to_tsvector('spanish', titulo));
CREATE INDEX IF NOT EXISTS idx_libros_autor ON public.libros USING gin(to_tsvector('spanish', autor));
CREATE INDEX IF NOT EXISTS idx_libros_categoria ON public.libros(categoria_id);
CREATE INDEX IF NOT EXISTS idx_libros_disponible ON public.libros(disponible);
CREATE INDEX IF NOT EXISTS idx_libros_isbn ON public.libros(isbn);

-- Índices para préstamos
CREATE INDEX IF NOT EXISTS idx_prestamos_usuario ON public.prestamos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_prestamos_libro ON public.prestamos(libro_id);
CREATE INDEX IF NOT EXISTS idx_prestamos_estado ON public.prestamos(estado);
CREATE INDEX IF NOT EXISTS idx_prestamos_fecha_vencimiento ON public.prestamos(fecha_vencimiento);

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON public.usuarios(tipo_usuario);

-- ============================================
-- 3. FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para calcular días restantes en préstamos
CREATE OR REPLACE FUNCTION calcular_dias_restantes()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular días restantes basado en el estado y fechas
    NEW.dias_restantes = CASE 
        WHEN NEW.estado = 'devuelto' THEN 0
        WHEN NEW.estado = 'activo' THEN GREATEST(0, EXTRACT(DAYS FROM (NEW.fecha_vencimiento - NOW()))::INTEGER)
        ELSE 0
    END;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON public.categorias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_libros_updated_at BEFORE UPDATE ON public.libros FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prestamos_updated_at BEFORE UPDATE ON public.prestamos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reseñas_updated_at BEFORE UPDATE ON public.reseñas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservas_updated_at BEFORE UPDATE ON public.reservas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para calcular días restantes en préstamos
CREATE TRIGGER trigger_calcular_dias_restantes 
    BEFORE INSERT OR UPDATE ON public.prestamos 
    FOR EACH ROW EXECUTE FUNCTION calcular_dias_restantes();

-- Función para actualizar disponibilidad de libros
CREATE OR REPLACE FUNCTION actualizar_disponibilidad_libro()
RETURNS TRIGGER AS $$
BEGIN
    -- Si es un nuevo préstamo activo
    IF TG_OP = 'INSERT' AND NEW.estado = 'activo' THEN
        UPDATE public.libros 
        SET copias_disponibles = copias_disponibles - 1,
            veces_prestado = veces_prestado + 1
        WHERE id = NEW.libro_id;
    END IF;
    
    -- Si se devuelve un libro
    IF TG_OP = 'UPDATE' AND OLD.estado = 'activo' AND NEW.estado = 'devuelto' THEN
        UPDATE public.libros 
        SET copias_disponibles = copias_disponibles + 1
        WHERE id = NEW.libro_id;
    END IF;
    
    -- Actualizar disponibilidad general
    UPDATE public.libros 
    SET disponible = (copias_disponibles > 0)
    WHERE id = COALESCE(NEW.libro_id, OLD.libro_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger para disponibilidad
CREATE TRIGGER trigger_actualizar_disponibilidad 
    AFTER INSERT OR UPDATE ON public.prestamos 
    FOR EACH ROW EXECUTE FUNCTION actualizar_disponibilidad_libro();

-- Función para actualizar calificación promedio
CREATE OR REPLACE FUNCTION actualizar_calificacion_libro()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.libros 
    SET 
        calificacion_promedio = (
            SELECT COALESCE(AVG(calificacion::DECIMAL), 0) 
            FROM public.reseñas 
            WHERE libro_id = COALESCE(NEW.libro_id, OLD.libro_id)
        ),
        numero_reseñas = (
            SELECT COUNT(*) 
            FROM public.reseñas 
            WHERE libro_id = COALESCE(NEW.libro_id, OLD.libro_id)
        )
    WHERE id = COALESCE(NEW.libro_id, OLD.libro_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger para calificaciones
CREATE TRIGGER trigger_actualizar_calificacion 
    AFTER INSERT OR UPDATE OR DELETE ON public.reseñas 
    FOR EACH ROW EXECUTE FUNCTION actualizar_calificacion_libro();

-- ============================================
-- 4. POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.libros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestamos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseñas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- Políticas para categorías (lectura pública)
CREATE POLICY "Categorias son públicas" ON public.categorias FOR SELECT USING (true);

-- Políticas para libros (lectura pública, escritura para admins)
CREATE POLICY "Libros son públicos" ON public.libros FOR SELECT USING (true);

-- Políticas para usuarios (solo pueden ver su propio perfil)
CREATE POLICY "Usuarios pueden ver su perfil" ON public.usuarios FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuarios pueden actualizar su perfil" ON public.usuarios FOR UPDATE USING (auth.uid() = id);

-- Políticas para préstamos (solo sus propios préstamos)
CREATE POLICY "Usuarios ven sus préstamos" ON public.prestamos FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Usuarios pueden crear préstamos" ON public.prestamos FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Políticas para reseñas (pueden ver todas, solo editar las suyas)
CREATE POLICY "Reseñas públicas son visibles" ON public.reseñas FOR SELECT USING (es_publica = true);
CREATE POLICY "Usuarios ven sus reseñas privadas" ON public.reseñas FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Usuarios pueden crear reseñas" ON public.reseñas FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Usuarios pueden editar sus reseñas" ON public.reseñas FOR UPDATE USING (auth.uid() = usuario_id);

-- ============================================
-- 5. CONFIGURACIÓN COMPLETADA
-- ============================================

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos ChullaLibro configurada exitosamente!';
    RAISE NOTICE 'Próximo paso: ejecutar el script de datos de prueba (sample_data.sql)';
END $$;
