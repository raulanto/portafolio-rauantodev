---
title: "Reportes SQL Reales: De Operaciones Diarias a Inteligencia de Negocios"
date: "2025-10-12"
description: "En este artículo te mostraré más de 50 reportes SQL reales"
tags: [ "Arquitectura","SQl","Modelado de Datos" ]
name: "diseno-sistema-base-datos-empresarial"

author: "raulanto"
author_avatar: 'https://avatars.githubusercontent.com/u/74162376?v=4'
author_description: "Desarrollador Full Stack "
thumbnail: "/blog/diseñoBD.png"
---



# Reportes SQL Reales: De Operaciones Diarias a Inteligencia de Negocios


##  Introducción
En el artículo anterior diseñamos un sistema completo de seguimiento de contratos. Ahora es tiempo de **extraer valor** de esos datos. En este artículo te mostraré más de 50 reportes SQL reales, divididos en dos categorías:

::note
**Reportes OLTP**: Operacionales, para el día a día
::

::note
**Reportes OLAP**: Analíticos, para toma de decisiones
::


Cada reporte incluye:

- El problema de negocio que resuelve
- La query SQL completa
- Explicación de la lógica
- Optimizaciones aplicadas
- Caso de uso real

---

##  Parte I: Reportes Operacionales (OLTP)

Los reportes OLTP responden a preguntas del día a día: 

::tip
_"¿Qué necesito hacer HOY?"_
::

::tip
_"¿Dónde está X?"_,
::

::tip
_"¿Quién es responsable de Y?"_
::

---

### Categoría: Gestión de Contratos

#### Reporte 1: Contratos Pendientes de Firma

**Problema de negocio**: El equipo legal necesita saber qué contratos aprobados aún no han sido firmados para hacer seguimiento.

```sql
-- Contratos aprobados pero sin firmar
SELECT 
    c.numero_contrato,
    cl.nombre AS cliente,
    cl.email,
    cl.telefono,
    c.fecha_inicio,
    c.monto_total,
    c.moneda,
    CURRENT_DATE - c.fecha_inicio AS dias_vencidos,
    ec.fecha_cambio AS fecha_aprobacion,
    COALESCE(pa.responsable, 'Sin asignar') AS responsable_seguimiento
FROM core.contrato c
JOIN core.cliente cl ON c.id_cliente = cl.id_cliente
JOIN core.estado_contrato ec ON c.id_contrato = ec.id_contrato
JOIN catalog.estado e ON ec.id_estado = e.id_estado
LEFT JOIN (
    SELECT 
        pa.id_contrato,
        p.nombre || ' ' || p.apellido_paterno AS responsable
    FROM core.personal_asignado pa
    JOIN core.personal p ON pa.id_personal = p.id_personal
    WHERE pa.es_responsable_principal = TRUE
) pa ON c.id_contrato = pa.id_contrato
WHERE e.nombre_estado = 'Aprobado'
  AND c.firmado = FALSE
  AND ec.es_estado_actual = TRUE
  AND c.activo = TRUE
ORDER BY dias_vencidos DESC;
```

**Por qué funciona**:

- Filtra por estado actual usando `es_estado_actual = TRUE`
- Muestra información de contacto para seguimiento inmediato
- Calcula días de retraso automáticamente
- Prioriza por antigüedad (los más vencidos primero)

**Caso de uso**: El gerente de operaciones revisa este reporte cada mañana y asigna llamadas de seguimiento a su equipo.

---

#### Reporte 2: Dashboard de Estado de Contratos en Tiempo Real

**Problema de negocio**: El director ejecutivo quiere ver de un vistazo cuántos contratos hay en cada estado.


::tabs

:::tabs-item{label="Code" icon="i-lucide-code"}

```sql
-- Dashboard de estados actual
WITH contratos_actuales AS (
    SELECT 
        e.nombre_estado,
        e.color_hex,
        COUNT(*) AS cantidad_contratos,
        SUM(c.monto_total) AS valor_total,
        AVG(c.monto_total) AS valor_promedio,
        MIN(ec.fecha_cambio) AS contrato_mas_antiguo,
        MAX(ec.fecha_cambio) AS contrato_mas_reciente
    FROM core.contrato c
    JOIN core.estado_contrato ec ON c.id_contrato = ec.id_contrato
    JOIN catalog.estado e ON ec.id_estado = e.id_estado
    WHERE ec.es_estado_actual = TRUE
      AND c.activo = TRUE
    GROUP BY e.nombre_estado, e.color_hex, e.orden_secuencia
    ORDER BY e.orden_secuencia
)
SELECT 
    nombre_estado,
    color_hex,
    cantidad_contratos,
    TO_CHAR(valor_total, 'L999,999,999.99') AS valor_total_formateado,
    TO_CHAR(valor_promedio, 'L999,999.99') AS ticket_promedio,
    EXTRACT(DAY FROM CURRENT_DATE - contrato_mas_antiguo) AS dias_en_estado_max,
    ROUND(
        cantidad_contratos::NUMERIC / SUM(cantidad_contratos) OVER () * 100, 
        1
    ) AS porcentaje_total
FROM contratos_actuales;
```


:::

:::tabs-item{label="Resultado" icon="i-lucide-eye"}

::callout

nombre_estado | cantidad | valor_total  | ticket_promedio | dias_max | %
--------------|----------|--------------|-----------------|----------|----
Nuevo         |       15 | $2,250,000   | $150,000        |       3  | 18%
En Revisión   |       23 | $3,450,000   | $150,000        |      12  | 28%
Aprobado      |        8 | $1,200,000   | $150,000        |       5  | 10%
Firmado       |       12 | $1,800,000   | $150,000        |       2  | 15%
En Ejecución  |       24 | $3,600,000   | $150,000        |      45  | 29%

::

:::

::


::alert{type="info" title="Optimización aplicada" description="Uso de CTE (Common Table Expression) para evitar repetir la misma lógica."}
::


---

#### Reporte 3: Contratos por Vencer en los Próximos 30 Días

**Problema de negocio**: El equipo de ventas necesita contactar clientes antes de que expire su contrato para renovación.

```sql
-- Contratos próximos a vencer
SELECT 
    c.numero_contrato,
    cl.nombre AS cliente,
    cl.tipo_cliente,
    cl.contacto_principal,
    cl.email,
    cl.telefono,
    c.fecha_inicio,
    c.fecha_fin,
    c.fecha_fin - CURRENT_DATE AS dias_restantes,
    c.monto_total,
    e.nombre_estado AS estado_actual,
    -- Calcular renovación sugerida (10% incremento)
    ROUND(c.monto_total * 1.10, 2) AS monto_renovacion_sugerido,
    -- Información del responsable
    pa.responsable_principal,
    pa.email_responsable
FROM core.contrato c
JOIN core.cliente cl ON c.id_cliente = cl.id_cliente
JOIN core.estado_contrato ec ON c.id_contrato = ec.id_contrato
JOIN catalog.estado e ON ec.id_estado = e.id_estado
LEFT JOIN (
    SELECT 
        pa.id_contrato,
        p.nombre_completo AS responsable_principal,
        p.email AS email_responsable
    FROM core.personal_asignado pa
    JOIN core.personal p ON pa.id_personal = p.id_personal
    WHERE pa.es_responsable_principal = TRUE
      AND (pa.fecha_fin IS NULL OR pa.fecha_fin >= CURRENT_DATE)
) pa ON c.id_contrato = pa.id_contrato
WHERE c.fecha_fin BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
  AND e.nombre_estado IN ('Firmado', 'En Ejecución')
  AND ec.es_estado_actual = TRUE
  AND c.activo = TRUE
ORDER BY c.fecha_fin ASC;
```

**Automatización**: Esta query se puede ejecutar diariamente y enviar por email al equipo de ventas.

---

###  Categoría: Gestión de Recursos

#### Reporte 4: Disponibilidad de Equipos

**Problema de negocio**: Antes de asignar equipos a un nuevo contrato, necesito saber qué está disponible.

```sql
-- Estado de equipos en tiempo real
SELECT 
    e.id_equipo,
    e.nombre AS equipo,
    e.marca,
    e.modelo,
    e.numero_serie,
    e.categoria,
    e.ubicacion,
    e.estado_equipo,
    -- Si está en uso, mostrar en qué contrato
    CASE 
        WHEN e.estado_equipo = 'En Uso' THEN c.numero_contrato
        ELSE NULL
    END AS contrato_asignado,
    CASE 
        WHEN e.estado_equipo = 'En Uso' THEN cl.nombre
        ELSE NULL
    END AS cliente_actual,
    CASE 
        WHEN e.estado_equipo = 'En Uso' THEN ea.fecha_devolucion_estimada
        ELSE NULL
    END AS disponible_desde,
    -- Calibración
    CASE 
        WHEN e.requiere_calibracion THEN
            CASE 
                WHEN e.fecha_proxima_calibracion < CURRENT_DATE 
                THEN ' VENCIDA'
                WHEN e.fecha_proxima_calibracion < CURRENT_DATE + INTERVAL '15 days'
                THEN ' PRÓXIMA'
                ELSE ' VIGENTE'
            END
        ELSE 'N/A'
    END AS estado_calibracion,
    e.fecha_proxima_calibracion
FROM core.equipo e
LEFT JOIN core.equipo_asignado ea ON e.id_equipo = ea.id_equipo 
    AND ea.estado_asignacion = 'Activo'
LEFT JOIN core.contrato c ON ea.id_contrato = c.id_contrato
LEFT JOIN core.cliente cl ON c.id_cliente = cl.id_cliente
WHERE e.activo = TRUE
ORDER BY 
    CASE e.estado_equipo
        WHEN 'Disponible' THEN 1
        WHEN 'En Uso' THEN 2
        WHEN 'Mantenimiento' THEN 3
        WHEN 'Baja' THEN 4
    END,
    e.categoria,
    e.nombre;
```

**Funcionalidades avanzadas**:

- Prioriza equipos disponibles primero
- Muestra fechas de disponibilidad futura
- Alerta sobre calibraciones vencidas

---

#### Reporte 5: Carga de Trabajo del Personal

**Problema de negocio**: El gerente de RRHH necesita saber si alguien está sobrecargado o subutilizado.

```sql
-- Carga laboral actual por empleado
WITH carga_actual AS (
    SELECT 
        p.id_personal,
        p.numero_empleado,
        p.nombre_completo,
        p.puesto,
        p.departamento,
        COUNT(DISTINCT pa.id_contrato) AS cantidad_proyectos,
        SUM(pa.porcentaje_dedicacion) AS porcentaje_total,
        STRING_AGG(
            c.numero_contrato || ' (' || pa.rol_proyecto || ')', 
            ', ' 
            ORDER BY pa.fecha_inicio DESC
        ) AS proyectos_activos,
        MAX(pa.fecha_inicio) AS ultimo_proyecto_asignado
    FROM core.personal p
    LEFT JOIN core.personal_asignado pa ON p.id_personal = pa.id_personal
    LEFT JOIN core.contrato c ON pa.id_contrato = c.id_contrato
    WHERE p.activo = TRUE
      AND (pa.fecha_fin IS NULL OR pa.fecha_fin >= CURRENT_DATE)
      AND (c.activo = TRUE OR c.id_contrato IS NULL)
    GROUP BY p.id_personal, p.numero_empleado, p.nombre_completo, p.puesto, p.departamento
)
SELECT 
    numero_empleado,
    nombre_completo,
    puesto,
    departamento,
    cantidad_proyectos,
    porcentaje_total AS capacidad_utilizada,
    100 - porcentaje_total AS capacidad_disponible,
    -- Clasificación de carga
    CASE 
        WHEN porcentaje_total = 0 THEN 'DISPONIBLE'
        WHEN porcentaje_total <= 50 THEN ' BAJA'
        WHEN porcentaje_total <= 80 THEN ' MEDIA'
        WHEN porcentaje_total <= 100 THEN ' ALTA'
        ELSE ' SOBRECARGADO'
    END AS nivel_carga,
    proyectos_activos,
    ultimo_proyecto_asignado
FROM carga_actual
ORDER BY porcentaje_total DESC, departamento, nombre_completo;
```

**Caso práctico**: El gerente usa este reporte para:

1. Identificar quién puede tomar un nuevo proyecto
2. Detectar empleados sobrecargados (>100%)
3. Balancear la carga entre equipos

---

###  Categoría: Procesamiento de Muestras

#### Reporte 6: Muestras Pendientes de Procesar

**Problema de negocio**: El supervisor de laboratorio necesita priorizar el trabajo del día.

```sql
-- Cola de trabajo del laboratorio
SELECT 
    m.codigo_muestra,
    m.prioridad,
    c.numero_contrato,
    cl.nombre AS cliente,
    tm.nombre AS tipo_muestra,
    m.fecha_entrada,
    CURRENT_TIMESTAMP - m.fecha_entrada AS tiempo_espera,
    tm.tiempo_procesamiento_dias AS sla_dias,
    -- Calcular fecha límite SLA
    DATE(m.fecha_entrada) + tm.tiempo_procesamiento_dias AS fecha_limite_sla,
    -- Días hasta vencimiento SLA
    (DATE(m.fecha_entrada) + tm.tiempo_procesamiento_dias) - CURRENT_DATE AS dias_hasta_vencimiento,
    -- Estado de cumplimiento
    CASE 
        WHEN (DATE(m.fecha_entrada) + tm.tiempo_procesamiento_dias) < CURRENT_DATE 
        THEN ' VENCIDO'
        WHEN (DATE(m.fecha_entrada) + tm.tiempo_procesamiento_dias) <= CURRENT_DATE + 1
        THEN ' URGENTE'
        WHEN (DATE(m.fecha_entrada) + tm.tiempo_procesamiento_dias) <= CURRENT_DATE + 2
        THEN ' PRÓXIMO'
        ELSE ' OK'
    END AS estado_sla,
    m.ubicacion_almacen,
    m.cantidad,
    m.unidad_medida,
    CASE WHEN tm.requiere_refrigeracion THEN ' Refrigerado' ELSE 'Ambiente' END AS almacenamiento
FROM core.muestra m
JOIN core.contrato c ON m.id_contrato = c.id_contrato
JOIN core.cliente cl ON c.id_cliente = cl.id_cliente
JOIN catalog.tipo_muestra tm ON m.id_tipo_muestra = tm.id_tipo_muestra
WHERE m.estado_muestra = 'Recibida'
ORDER BY 
    -- Priorizar por: vencidos > urgentes > prioridad > fecha entrada
    CASE 
        WHEN (DATE(m.fecha_entrada) + tm.tiempo_procesamiento_dias) < CURRENT_DATE THEN 1
        WHEN (DATE(m.fecha_entrada) + tm.tiempo_procesamiento_dias) <= CURRENT_DATE + 1 THEN 2
        ELSE 3
    END,
    CASE m.prioridad
        WHEN 'Urgente' THEN 1
        WHEN 'Alta' THEN 2
        WHEN 'Normal' THEN 3
        WHEN 'Baja' THEN 4
    END,
    m.fecha_entrada ASC;
```

**Beneficio**: El técnico ve inmediatamente qué muestras procesar primero, evitando incumplimientos de SLA.

---

#### Reporte 7: Análisis con Resultados No Conformes

**Problema de negocio**: El gerente de calidad necesita revisar todos los análisis que no cumplieron especificaciones.

```sql
-- Reporte de no conformidades
SELECT 
    a.id_analisis,
    m.codigo_muestra,
    c.numero_contrato,
    cl.nombre AS cliente,
    tm.nombre AS tipo_muestra,
    a.tipo_analisis,
    a.metodo_utilizado,
    a.norma_referencia,
    a.fecha_analisis,
    a.valor_numerico,
    a.valor_esperado_min,
    a.valor_esperado_max,
    a.unidad_resultado,
    -- Calcular desviación
    CASE 
        WHEN a.valor_numerico < a.valor_esperado_min 
        THEN ROUND(((a.valor_esperado_min - a.valor_numerico) / a.valor_esperado_min * 100)::NUMERIC, 2)
        WHEN a.valor_numerico > a.valor_esperado_max
        THEN ROUND(((a.valor_numerico - a.valor_esperado_max) / a.valor_esperado_max * 100)::NUMERIC, 2)
        ELSE 0
    END AS desviacion_porcentual,
    -- Tipo de no conformidad
    CASE 
        WHEN a.valor_numerico < a.valor_esperado_min THEN 'Por debajo del límite'
        WHEN a.valor_numerico > a.valor_esperado_max THEN 'Por encima del límite'
    END AS tipo_no_conformidad,
    p.nombre_completo AS analista,
    e.nombre AS equipo_utilizado,
    a.observaciones
FROM core.analisis a
JOIN core.muestra m ON a.id_muestra = m.id_muestra
JOIN core.contrato c ON m.id_contrato = c.id_contrato
JOIN core.cliente cl ON c.id_cliente = cl.id_cliente
JOIN catalog.tipo_muestra tm ON m.id_tipo_muestra = tm.id_tipo_muestra
LEFT JOIN core.personal p ON a.id_personal_analista = p.id_personal
LEFT JOIN core.equipo e ON a.equipo_utilizado = e.id_equipo
WHERE a.cumple_especificacion = FALSE
  AND a.fecha_analisis >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY a.fecha_analisis DESC;
```

**Acción**: Este reporte genera una reunión de revisión de calidad donde se decide si hay que:

- Re-analizar la muestra
- Revisar el proceso
- Calibrar equipos
- Capacitar al personal

---

###  Categoría: Auditoría y Trazabilidad

#### Reporte 8: Historia Completa de un Contrato

**Problema de negocio**: Auditoría interna necesita rastrear todo el ciclo de vida de un contrato específico.

```sql
-- Timeline completo de un contrato (ejemplo: CTR-2024-001)
WITH timeline AS (
    -- Creación del contrato
    SELECT 
        'Creación' AS evento,
        c.fecha_creacion AS fecha_evento,
        'Contrato creado' AS descripcion,
        c.creado_por AS usuario,
        1 AS orden
    FROM core.contrato c
    WHERE c.numero_contrato = 'CTR-2024-001'
    
    UNION ALL
    
    -- Cambios de estado
    SELECT 
        'Cambio Estado' AS evento,
        ec.fecha_cambio AS fecha_evento,
        'Estado: ' || e.nombre_estado AS descripcion,
        ec.usuario_responsable AS usuario,
        2 AS orden
    FROM core.estado_contrato ec
    JOIN catalog.estado e ON ec.id_estado = e.id_estado
    JOIN core.contrato c ON ec.id_contrato = c.id_contrato
    WHERE c.numero_contrato = 'CTR-2024-001'
    
    UNION ALL
    
    -- Asignación de personal
    SELECT 
        'Personal Asignado' AS evento,
        pa.fecha_inicio AS fecha_evento,
        'Asignado: ' || p.nombre_completo || ' (' || pa.rol_proyecto || ')' AS descripcion,
        'Sistema' AS usuario,
        3 AS orden
    FROM core.personal_asignado pa
    JOIN core.personal p ON pa.id_personal = p.id_personal
    JOIN core.contrato c ON pa.id_contrato = c.id_contrato
    WHERE c.numero_contrato = 'CTR-2024-001'
    
    UNION ALL
    
    -- Asignación de equipos
    SELECT 
        'Equipo Asignado' AS evento,
        ea.fecha_asignacion AS fecha_evento,
        'Equipo: ' || e.nombre || ' (' || e.numero_serie || ')' AS descripcion,
        'Sistema' AS usuario,
        4 AS orden
    FROM core.equipo_asignado ea
    JOIN core.equipo e ON ea.id_equipo = e.id_equipo
    JOIN core.contrato c ON ea.id_contrato = c.id_contrato
    WHERE c.numero_contrato = 'CTR-2024-001'
    
    UNION ALL
    
    -- Entrada de muestras
    SELECT 
        'Muestra Recibida' AS evento,
        m.fecha_entrada AS fecha_evento,
        'Muestra: ' || m.codigo_muestra || ' - ' || tm.nombre AS descripcion,
        'Sistema' AS usuario,
        5 AS orden
    FROM core.muestra m
    JOIN catalog.tipo_muestra tm ON m.id_tipo_muestra = tm.id_tipo_muestra
    JOIN core.contrato c ON m.id_contrato = c.id_contrato
    WHERE c.numero_contrato = 'CTR-2024-001'
    
    UNION ALL
    
    -- Análisis completados
    SELECT 
        'Análisis Completado' AS evento,
        a.fecha_resultados AS fecha_evento,
        'Análisis: ' || a.tipo_analisis || ' - ' || 
        CASE WHEN a.cumple_especificacion THEN ' Conforme' ELSE ' No conforme' END AS descripcion,
        p.nombre_completo AS usuario,
        6 AS orden
    FROM core.analisis a
    JOIN core.muestra m ON a.id_muestra = m.id_muestra
    JOIN core.contrato c ON m.id_contrato = c.id_contrato
    LEFT JOIN core.personal p ON a.id_personal_analista = p.id_personal
    WHERE c.numero_contrato = 'CTR-2024-001'
      AND a.fecha_resultados IS NOT NULL
)
SELECT 
    ROW_NUMBER() OVER (ORDER BY fecha_evento) AS num,
    evento,
    fecha_evento,
    TO_CHAR(fecha_evento, 'DD/MM/YYYY HH24:MI') AS fecha_formateada,
    descripcion,
    usuario
FROM timeline
ORDER BY fecha_evento ASC;
```

**Uso**: Este reporte genera un timeline visual completo de todo lo que ha sucedido con un contrato.

---

#### Reporte 9: Cambios Recientes en el Sistema (Auditoría)

**Problema de negocio**: El administrador del sistema necesita monitorear actividad sospechosa o errores.

```sql
-- Log de actividad de las últimas 24 horas
SELECT 
    cl.tabla,
    cl.operacion,
    cl.id_registro,
    cl.usuario,
    cl.fecha_cambio,
    cl.ip_origen,
    -- Mostrar cambios específicos en campos importantes
    CASE 
        WHEN cl.tabla = 'contrato' THEN
            jsonb_pretty(
                jsonb_build_object(
                    'monto_anterior', cl.datos_anteriores->'monto_total',
                    'monto_nuevo', cl.datos_nuevos->'monto_total',
                    'estado_anterior', cl.datos_anteriores->'firmado',
                    'estado_nuevo', cl.datos_nuevos->'firmado'
                )
            )
        ELSE NULL
    END AS cambios_criticos
FROM audit.cambios_log cl
WHERE cl.fecha_cambio >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
ORDER BY cl.fecha_cambio DESC
LIMIT 100;
```

---

##  Parte II: Reportes Analíticos (OLAP)

Los reportes OLAP responden preguntas estratégicas:

::tip
_"¿Cómo vamos?"_
::

::tip
_"¿Qué tendencias vemos?"_
::

::tip
_"¿Dónde podemos mejorar?"_
::


---

###  Categoría: Análisis de Ingresos

#### Reporte 10: Dashboard Ejecutivo Mensual

**Problema de negocio**: El CEO quiere ver KPIs clave del mes actual vs mes anterior.

```sql
-- Dashboard ejecutivo con comparativa MoM
WITH mes_actual AS (
    SELECT 
        COUNT(DISTINCT fc.id_contrato) AS contratos,
        SUM(fc.monto_usd) AS ingresos,
        AVG(fc.monto_usd) AS ticket_promedio,
        COUNT(DISTINCT fc.sk_cliente) AS clientes,
        SUM(fc.cantidad_muestras) AS muestras,
        SUM(CASE WHEN fc.completado_a_tiempo THEN 1 ELSE 0 END)::FLOAT / 
            NULLIF(COUNT(*), 0) * 100 AS tasa_cumplimiento
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    WHERE dt.anio = EXTRACT(YEAR FROM CURRENT_DATE)
      AND dt.mes = EXTRACT(MONTH FROM CURRENT_DATE)
),
mes_anterior AS (
    SELECT 
        COUNT(DISTINCT fc.id_contrato) AS contratos,
        SUM(fc.monto_usd) AS ingresos,
        AVG(fc.monto_usd) AS ticket_promedio,
        COUNT(DISTINCT fc.sk_cliente) AS clientes,
        SUM(fc.cantidad_muestras) AS muestras,
        SUM(CASE WHEN fc.completado_a_tiempo THEN 1 ELSE 0 END)::FLOAT / 
            NULLIF(COUNT(*), 0) * 100 AS tasa_cumplimiento
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    WHERE dt.anio = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')
      AND dt.mes = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
)
SELECT 
    'Contratos' AS metrica,
    ma.contratos AS mes_actual,
    man.contratos AS mes_anterior,
    ROUND(((ma.contratos - man.contratos)::NUMERIC / NULLIF(man.contratos, 0) * 100), 1) AS cambio_porcentual,
    CASE 
        WHEN ma.contratos > man.contratos THEN ' Crecimiento'
        WHEN ma.contratos < man.contratos THEN ' Decrecimiento'
        ELSE ' Sin cambio'
    END AS tendencia
FROM mes_actual ma, mes_anterior man

UNION ALL

SELECT 
    'Ingresos USD',
    ma.ingresos,
    man.ingresos,
    ROUND(((ma.ingresos - man.ingresos) / NULLIF(man.ingresos, 0) * 100), 1),
    CASE 
        WHEN ma.ingresos > man.ingresos THEN ' Crecimiento'
        WHEN ma.ingresos < man.ingresos THEN ' Decrecimiento'
        ELSE ' Sin cambio'
    END
FROM mes_actual ma, mes_anterior man

UNION ALL

SELECT 
    'Ticket Promedio',
    ma.ticket_promedio,
    man.ticket_promedio,
    ROUND(((ma.ticket_promedio - man.ticket_promedio) / NULLIF(man.ticket_promedio, 0) * 100), 1),
    CASE 
        WHEN ma.ticket_promedio > man.ticket_promedio THEN ' Crecimiento'
        WHEN ma.ticket_promedio < man.ticket_promedio THEN ' Decrecimiento'
        ELSE ' Sin cambio'
    END
FROM mes_actual ma, mes_anterior man

UNION ALL

SELECT 
    'Clientes Activos',
    ma.clientes,
    man.clientes,
    ROUND(((ma.clientes - man.clientes)::NUMERIC / NULLIF(man.clientes, 0) * 100), 1),
    CASE 
        WHEN ma.clientes > man.clientes THEN ' Crecimiento'
        WHEN ma.clientes < man.clientes THEN ' Decrecimiento'
        ELSE 'Sin cambio'
    END
FROM mes_actual ma, mes_anterior man

UNION ALL

SELECT 
    'Muestras Procesadas',
    ma.muestras,
    man.muestras,
    ROUND(((ma.muestras - man.muestras)::NUMERIC / NULLIF(man.muestras, 0) * 100), 1),
    CASE 
        WHEN ma.muestras > man.muestras THEN ' Crecimiento'
        WHEN ma.muestras < man.muestras THEN ' Decrecimiento'
        ELSE ' Sin cambio'
    END
FROM mes_actual ma, mes_anterior man

UNION ALL

SELECT 
    'Cumplimiento SLA %',
    ma.tasa_cumplimiento,
    man.tasa_cumplimiento,
    ROUND((ma.tasa_cumplimiento - man.tasa_cumplimiento), 1),
    CASE 
        WHEN ma.tasa_cumplimiento > man.tasa_cumplimiento THEN ' Mejora'
        WHEN ma.tasa_cumplimiento < man.tasa_cumplimiento THEN ' Deterioro'
        ELSE ' Sin cambio'
    END
FROM mes_actual ma, mes_anterior man;
```

**Visualización**: Este reporte se puede conectar a Power BI, Tableau o Metabase para crear tarjetas (cards) con flechas de tendencia.

---

#### Reporte 11: Ingresos por Trimestre y Tipo de Cliente

**Problema de negocio**: El CFO necesita entender la composición de ingresos para proyecciones financieras.

```sql
-- Análisis de ingresos por trimestre
SELECT 
    dt.anio,
    dt.trimestre,
    dt.anio_trimestre,
    dc.tipo_cliente,
    COUNT(DISTINCT fc.id_contrato) AS cantidad_contratos,
    SUM(fc.monto_usd) AS ingresos_totales,
    ROUND(AVG(fc.monto_usd), 2) AS ticket_promedio,
    ROUND(SUM(fc.monto_usd) / SUM(SUM(fc.monto_usd)) OVER (PARTITION BY dt.anio, dt.trimestre) * 100, 1) AS porcentaje_mix,
    -- Métricas operacionales
    SUM(fc.cantidad_muestras) AS total_muestras,
    ROUND(AVG(fc.duracion_dias), 1) AS duracion_promedio_dias,
    -- Cumplimiento
    ROUND(
        SUM(CASE WHEN fc.completado_a_tiempo THEN 1 ELSE 0 END)::NUMERIC / 
        NULLIF(COUNT(*), 0) * 100, 
        1
    ) AS porcentaje_on_time
FROM dwh.fact_contrato fc
JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
JOIN dwh.dim_cliente dc ON fc.sk_cliente = dc.sk_cliente AND dc.es_actual
WHERE dt.anio >= EXTRACT(YEAR FROM CURRENT_DATE) - 2  -- Últimos 2 años
GROUP BY dt.anio, dt.trimestre, dt.anio_trimestre, dc.tipo_cliente
ORDER BY dt.anio DESC, dt.trimestre DESC, ingresos_totales DESC;
```

**Insight**: Puedes ver si los contratos gubernamentales tienen mejor margen pero menor volumen que corporativos.

---

#### Reporte 12: Top 20 Clientes por Valor Total

**Problema de negocio**: Ventas quiere identificar clientes VIP para atención preferencial.

```sql
-- Análisis de clientes más valiosos
WITH cliente_metricas AS (
    SELECT 
        dc.id_cliente,
        dc.nombre,
        dc.tipo_cliente,
        dc.ciudad,
        dc.estado,
        COUNT(DISTINCT fc.id_contrato) AS total_contratos,
        SUM(fc.monto_usd) AS valor_total_lifetime,
        AVG(fc.monto_usd) AS ticket_promedio,
        MAX(dt.fecha) AS ultimo_contrato,
        MIN(dt.fecha) AS primer_contrato,
        -- Calcular antigüedad del cliente
        EXTRACT(YEAR FROM AGE(MAX(dt.fecha), MIN(dt.fecha))) AS antiguedad_anios,
        -- Frecuencia de contratación (contratos por año)
        ROUND(
            COUNT(DISTINCT fc.id_contrato)::NUMERIC / 
            NULLIF(EXTRACT(YEAR FROM AGE(MAX(dt.fecha), MIN(dt.fecha))), 0),
            2
        ) AS contratos_por_anio,
        -- Cumplimiento
        ROUND(
            SUM(CASE WHEN fc.completado_a_tiempo THEN 1 ELSE 0 END)::NUMERIC / 
            NULLIF(COUNT(*), 0) * 100,
            1
        ) AS tasa_cumplimiento
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_cliente dc ON fc.sk_cliente = dc.sk_cliente AND dc.es_actual
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    GROUP BY dc.id_cliente, dc.nombre, dc.tipo_cliente, dc.ciudad, dc.estado
)
SELECT 
    ROW_NUMBER() OVER (ORDER BY valor_total_lifetime DESC) AS ranking,
    nombre AS cliente,
    tipo_cliente,
    ciudad,
    TO_CHAR(valor_total_lifetime, 'L999,999,999') AS valor_lifetime,
    total_contratos,
    TO_CHAR(ticket_promedio, 'L999,999') AS ticket_promedio,
    antiguedad_anios || ' años' AS cliente_desde,
    contratos_por_anio AS frecuencia,
    tasa_cumplimiento || '%' AS cumplimiento,
    -- Clasificación
    CASE 
        WHEN valor_total_lifetime >= 1000000 THEN 'Diamante'
        WHEN valor_total_lifetime >= 500000 THEN ' Platino'
        WHEN valor_total_lifetime >= 200000 THEN ' Oro'
        WHEN valor_total_lifetime >= 50000 THEN ' Plata'
        ELSE 'Bronce'
    END AS categoria,
    ultimo_contrato
FROM cliente_metricas
ORDER BY valor_total_lifetime DESC
LIMIT 20;
```

**Acción comercial**: Los clientes Diamante y Platino reciben gestor de cuenta dedicado.

---

###  Categoría: Análisis de Eficiencia Operacional

#### Reporte 13: Tiempo Promedio por Estado del Contrato

**Problema de negocio**: El gerente de operaciones quiere optimizar el flujo de trabajo identificando cuellos de botella.

```sql
-- Análisis de tiempo en cada estado
WITH transiciones AS (
    SELECT 
        fc.id_contrato,
        fec.sk_estado_nuevo,
        fec.sk_estado_anterior,
        de_nuevo.nombre_estado AS estado,
        de_anterior.nombre_estado AS estado_anterior,
        AVG(fec.dias_en_estado_anterior) AS dias_promedio
    FROM dwh.fact_estado_contrato fec
    JOIN dwh.fact_contrato fc ON fec.sk_contrato = fc.sk_contrato
    JOIN dwh.dim_estado de_nuevo ON fec.sk_estado_nuevo = de_nuevo.sk_estado
    LEFT JOIN dwh.dim_estado de_anterior ON fec.sk_estado_anterior = de_anterior.sk_estado
    GROUP BY fc.id_contrato, fec.sk_estado_nuevo, fec.sk_estado_anterior, 
             de_nuevo.nombre_estado, de_anterior.nombre_estado
)
SELECT 
    estado_anterior || ' → ' || estado AS transicion,
    COUNT(*) AS cantidad_contratos,
    ROUND(AVG(dias_promedio), 1) AS dias_promedio,
    ROUND(MIN(dias_promedio), 1) AS dias_minimo,
    ROUND(MAX(dias_promedio), 1) AS dias_maximo,
    ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY dias_promedio), 1) AS mediana,
    ROUND(STDDEV(dias_promedio), 1) AS desviacion_estandar,
    -- Identificar outliers (más de 2 desviaciones estándar)
    COUNT(CASE 
        WHEN dias_promedio > (AVG(dias_promedio) + 2 * STDDEV(dias_promedio)) 
        THEN 1 
    END) AS casos_anormales
FROM transiciones
WHERE estado_anterior IS NOT NULL
GROUP BY estado_anterior, estado
HAVING COUNT(*) >= 5  -- Solo transiciones con suficiente data
ORDER BY dias_promedio DESC;
```

**Insight**: Si "En Revisión → Aprobado" toma 15 días en promedio pero algunos casos toman 45 días, hay un problema de proceso.

---

#### Reporte 14: Performance de Procesamiento de Muestras

**Problema de negocio**: El director de laboratorio quiere comparar eficiencia entre tipos de muestra.

```sql
-- Análisis de eficiencia por tipo de muestra
SELECT 
    dtm.categoria,
    dtm.nombre AS tipo_muestra,
    COUNT(DISTINCT fm.id_muestra) AS total_muestras,
    -- Tiempos de procesamiento
    ROUND(AVG(fm.tiempo_entrada_proceso_dias), 1) AS dias_promedio_inicio,
    ROUND(AVG(fm.tiempo_proceso_finalizacion_dias), 1) AS dias_promedio_analisis,
    ROUND(AVG(fm.tiempo_total_dias), 1) AS dias_promedio_total,
    -- Comparar con SLA
    ROUND(AVG(fm.tiempo_total_dias - dtm.tiempo_promedio_dias), 1) AS desviacion_vs_sla,
    -- Cumplimiento
    ROUND(
        SUM(CASE WHEN fm.finalizado_a_tiempo THEN 1 ELSE 0 END)::NUMERIC / 
        NULLIF(COUNT(*), 0) * 100,
        1
    ) AS porcentaje_on_time,
    -- Calidad
    ROUND(AVG(fm.cantidad_analisis), 1) AS analisis_promedio_por_muestra,
    ROUND(
        SUM(fm.analisis_conformes)::NUMERIC / 
        NULLIF(SUM(fm.cantidad_analisis), 0) * 100,
        1
    ) AS porcentaje_conformidad,
    -- Tendencia últimos 3 meses
    ROUND(
        (SELECT AVG(tiempo_total_dias) 
         FROM dwh.fact_muestra fm2
         JOIN dwh.dim_tiempo dt ON fm2.sk_fecha_entrada = dt.sk_tiempo
         WHERE fm2.sk_tipo_muestra = fm.sk_tipo_muestra
           AND dt.fecha >= CURRENT_DATE - INTERVAL '3 months'
        ) - AVG(fm.tiempo_total_dias),
        1
    ) AS cambio_ultimos_3m
FROM dwh.fact_muestra fm
JOIN dwh.dim_tipo_muestra dtm ON fm.sk_tipo_muestra = dtm.sk_tipo_muestra
GROUP BY dtm.categoria, dtm.nombre, fm.sk_tipo_muestra, dtm.tiempo_promedio_dias
HAVING COUNT(*) >= 10
ORDER BY total_muestras DESC;
```

**Decisión**: Si "Agua Potable" tiene 95% cumplimiento pero "Alimentos" solo 70%, necesitas más recursos o revisar el proceso.

---

#### Reporte 15: Productividad del Personal (Analistas)

**Problema de negocio**: RRHH quiere evaluar performance individual para bonos.
::code-collapse
```sql
-- Ranking de productividad de analistas
WITH analista_stats AS (
    SELECT 
        dp.nombre_completo AS analista,
        dp.puesto,
        dp.nivel_experiencia,
        COUNT(DISTINCT fa.id_analisis) AS total_analisis,
        -- Calidad
        ROUND(
            SUM(CASE WHEN fa.cumple_especificacion THEN 1 ELSE 0 END)::NUMERIC / 
            NULLIF(COUNT(*), 0) * 100,
            1
        ) AS tasa_conformidad,
        -- Precisión (desviación promedio)
        ROUND(AVG(ABS(fa.desviacion_especificacion)), 2) AS desviacion_promedio,
        -- Volumen por día trabajado
        ROUND(
            COUNT(*)::NUMERIC / 
            NULLIF(
                (SELECT COUNT(DISTINCT dt.fecha) 
                 FROM dwh.dim_tiempo dt
                 JOIN dwh.fact_analisis fa2 ON fa2.sk_fecha_analisis = dt.sk_tiempo
                 WHERE fa2.sk_personal_analista = fa.sk_personal_analista
                   AND dt.es_dia_laboral = TRUE
                ), 
                0
            ),
            2
        ) AS analisis_por_dia,
        -- Diversidad de análisis
        COUNT(DISTINCT fa.tipo_analisis) AS tipos_analisis_realizados
    FROM dwh.fact_analisis fa
    JOIN dwh.dim_personal dp ON fa.sk_personal_analista = dp.sk_personal AND dp.es_actual
    JOIN dwh.dim_tiempo dt ON fa.sk_fecha_analisis = dt.sk_tiempo
    WHERE dt.anio = EXTRACT(YEAR FROM CURRENT_DATE)
      AND dt.mes = EXTRACT(MONTH FROM CURRENT_DATE)
    GROUP BY dp.nombre_completo, dp.puesto, dp.nivel_experiencia, fa.sk_personal_analista
    HAVING COUNT(*) >= 10  -- Mínimo 10 análisis para ser evaluado
)
SELECT 
    ROW_NUMBER() OVER (ORDER BY 
        (tasa_conformidad * 0.4 + 
         (100 - desviacion_promedio * 10) * 0.3 + 
         (analisis_por_dia * 10) * 0.3
        ) DESC
    ) AS ranking,
    analista,
    puesto,
    nivel_experiencia,
    total_analisis,
    tasa_conformidad || '%' AS calidad,
    desviacion_promedio || '%' AS precision,
    analisis_por_dia AS productividad,
    tipos_analisis_realizados AS versatilidad,
    -- Score compuesto (40% calidad, 30% precisión, 30% productividad)
    ROUND(
        tasa_conformidad * 0.4 + 
        (100 - desviacion_promedio * 10) * 0.3 + 
        (analisis_por_dia * 10) * 0.3,
        1
    ) AS score_performance
FROM analista_stats
ORDER BY ranking;
```
::
**Uso**: Este score se usa para:

- Asignación de bonos trimestrales
- Identificar necesidades de capacitación
- Reconocimiento del empleado del mes

---

###  Categoría: Análisis Geográfico

#### Reporte 16: Mapa de Calor de Ingresos por Estado

**Problema de negocio**: El director comercial quiere expandir a nuevos territorios.

```sql
-- Análisis geográfico de negocio
SELECT 
    du.estado,
    du.region,
    COUNT(DISTINCT fc.sk_cliente) AS clientes_unicos,
    COUNT(DISTINCT fc.id_contrato) AS total_contratos,
    SUM(fc.monto_usd) AS ingresos_totales,
    ROUND(AVG(fc.monto_usd), 2) AS ticket_promedio,
    -- Participación
    ROUND(
        SUM(fc.monto_usd) / SUM(SUM(fc.monto_usd)) OVER () * 100,
        1
    ) AS porcentaje_ingresos_nacional,
    -- Crecimiento YoY
    SUM(CASE WHEN dt.anio = EXTRACT(YEAR FROM CURRENT_DATE) THEN fc.monto_usd ELSE 0 END) AS ingresos_2024,
    SUM(CASE WHEN dt.anio = EXTRACT(YEAR FROM CURRENT_DATE) - 1 THEN fc.monto_usd ELSE 0 END) AS ingresos_2023,
    ROUND(
        (SUM(CASE WHEN dt.anio = EXTRACT(YEAR FROM CURRENT_DATE) THEN fc.monto_usd ELSE 0 END) - 
         SUM(CASE WHEN dt.anio = EXTRACT(YEAR FROM CURRENT_DATE) - 1 THEN fc.monto_usd ELSE 0 END)) / 
        NULLIF(SUM(CASE WHEN dt.anio = EXTRACT(YEAR FROM CURRENT_DATE) - 1 THEN fc.monto_usd ELSE 0 END), 0) * 100,
        1
    ) AS crecimiento_yoy,
    -- Potencial (ingresos / clientes)
    ROUND(SUM(fc.monto_usd) / NULLIF(COUNT(DISTINCT fc.sk_cliente), 0), 2) AS valor_por_cliente
FROM dwh.fact_contrato fc
JOIN dwh.dim_cliente dc ON fc.sk_cliente = dc.sk_cliente AND dc.es_actual
JOIN dwh.dim_ubicacion du ON fc.sk_ubicacion = du.sk_ubicacion
JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
WHERE dt.anio >= EXTRACT(YEAR FROM CURRENT_DATE) - 1
GROUP BY du.estado, du.region
ORDER BY ingresos_totales DESC;
```

**Insight**: Si CDMX genera 40% de ingresos pero solo tienes 2 vendedores ahí, necesitas expandir el equipo.

---

### Categoría: Análisis Predictivo

#### Reporte 17: Proyección de Ingresos Próximo Trimestre

**Problema de negocio**: Finanzas necesita proyectar ingresos para el forecast del trimestre.

```sql
-- Proyección basada en tendencias históricas
WITH historico_trimestral AS (
    SELECT 
        dt.anio,
        dt.trimestre,
        dt.anio_trimestre,
        SUM(fc.monto_usd) AS ingresos,
        COUNT(DISTINCT fc.id_contrato) AS contratos,
        ROUND(AVG(fc.monto_usd), 2) AS ticket_promedio
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    WHERE dt.anio >= EXTRACT(YEAR FROM CURRENT_DATE) - 2
    GROUP BY dt.anio, dt.trimestre, dt.anio_trimestre
),
crecimiento AS (
    SELECT 
        AVG(
            (ingresos - LAG(ingresos) OVER (ORDER BY anio, trimestre)) / 
            NULLIF(LAG(ingresos) OVER (ORDER BY anio, trimestre), 0) * 100
        ) AS tasa_crecimiento_promedio
    FROM historico_trimestral
)
SELECT 
    'Histórico' AS tipo,
    anio_trimestre,
    TO_CHAR(ingresos, 'L999,999,999') AS ingresos,
    contratos,
    ticket_promedio
FROM historico_trimestral
ORDER BY anio DESC, trimestre DESC
LIMIT 8

UNION ALL

SELECT 
    'Proyección' AS tipo,
    TO_CHAR(CURRENT_DATE + INTERVAL '3 months', 'YYYY-Q') || 
        EXTRACT(QUARTER FROM CURRENT_DATE + INTERVAL '3 months')::TEXT AS anio_trimestre,
    TO_CHAR(
        (SELECT ingresos FROM historico_trimestral ORDER BY anio DESC, trimestre DESC LIMIT 1) * 
        (1 + (SELECT tasa_crecimiento_promedio FROM crecimiento) / 100),
        'L999,999,999'
    ) AS ingresos_proyectados,
    (SELECT contratos FROM historico_trimestral ORDER BY anio DESC, trimestre DESC LIMIT 1) + 
        ROUND((SELECT contratos FROM historico_trimestral ORDER BY anio DESC, trimestre DESC LIMIT 1) * 
              (SELECT tasa_crecimiento_promedio FROM crecimiento) / 100) AS contratos_estimados,
    (SELECT ticket_promedio FROM historico_trimestral ORDER BY anio DESC, trimestre DESC LIMIT 1) AS ticket_estimado;
```

**Método**: Usa regresión simple basada en crecimiento promedio histórico. Para proyecciones más sofisticadas, usa Python con scikit-learn.

---

###  Categoría: Análisis de Retención y Churn

#### Reporte 18: Análisis de Retención de Clientes

**Problema de negocio**: ¿Cuántos clientes regresan después de su primer contrato?

```sql
-- Análisis de retención por cohorte
WITH primer_contrato AS (
    SELECT 
        fc.sk_cliente,
        MIN(dt.fecha) AS fecha_primer_contrato,
        TO_CHAR(MIN(dt.fecha), 'YYYY-MM') AS cohorte
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    GROUP BY fc.sk_cliente
),
actividad_mensual AS (
    SELECT 
        pc.cohorte,
        TO_CHAR(dt.fecha, 'YYYY-MM') AS mes_actividad,
        COUNT(DISTINCT fc.sk_cliente) AS clientes_activos,
        EXTRACT(MONTH FROM AGE(dt.fecha, pc.fecha_primer_contrato)) AS meses_desde_inicio
    FROM primer_contrato pc
    JOIN dwh.fact_contrato fc ON pc.sk_cliente = fc.sk_cliente
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    GROUP BY pc.cohorte, TO_CHAR(dt.fecha, 'YYYY-MM'), 
             EXTRACT(MONTH FROM AGE(dt.fecha, pc.fecha_primer_contrato))
)
SELECT 
    cohorte,
    (SELECT COUNT(DISTINCT sk_cliente) FROM primer_contrato WHERE cohorte = am.cohorte) AS clientes_nuevos,
    meses_desde_inicio || ' meses' AS periodo,
    clientes_activos,
    ROUND(
        clientes_activos::NUMERIC / 
        (SELECT COUNT(DISTINCT sk_cliente) FROM primer_contrato WHERE cohorte = am.cohorte) * 100,
        1
    ) AS tasa_retencion
FROM actividad_mensual am
WHERE meses_desde_inicio IN (0, 3, 6, 12, 24)  -- Hitos importantes
ORDER BY cohorte DESC, meses_desde_inicio;
```

**Interpretación**: Si la cohorte 2023-01 empezó con 50 clientes y después de 12 meses solo 30 están activos, tienes 60% retención.

---

#### Reporte 19: Clientes en Riesgo de Churn

**Problema de negocio**: Identificar clientes que no han contratado recientemente para recuperarlos.

```sql
-- Identificar clientes inactivos
WITH ultimo_contrato AS (
    SELECT 
        dc.id_cliente,
        dc.nombre,
        dc.tipo_cliente,
        dc.email,
        MAX(dt.fecha) AS fecha_ultimo_contrato,
        CURRENT_DATE - MAX(dt.fecha) AS dias_inactivo,
        COUNT(DISTINCT fc.id_contrato) AS contratos_historicos,
        SUM(fc.monto_usd) AS valor_lifetime,
        AVG(fc.monto_usd) AS ticket_promedio_historico
    FROM dwh.dim_cliente dc
    JOIN dwh.fact_contrato fc ON dc.sk_cliente = fc.sk_cliente
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    WHERE dc.es_actual = TRUE
    GROUP BY dc.id_cliente, dc.nombre, dc.tipo_cliente, dc.email
)
SELECT 
    nombre AS cliente,
    tipo_cliente,
    email,
    fecha_ultimo_contrato,
    dias_inactivo,
    CASE 
        WHEN dias_inactivo > 365 THEN ' CRÍTICO'
        WHEN dias_inactivo > 180 THEN ' ALTO'
        WHEN dias_inactivo > 90 THEN ' MEDIO'
        ELSE ' BAJO'
    END AS riesgo_churn,
    contratos_historicos,
    TO_CHAR(valor_lifetime, 'L999,999,999') AS valor_perdido_potencial,
    TO_CHAR(ticket_promedio_historico, 'L999,999') AS ticket_historico,
    -- Acción sugerida
    CASE 
        WHEN dias_inactivo > 365 THEN 'Llamada ejecutiva inmediata'
        WHEN dias_inactivo > 180 THEN 'Campaña de reactivación + descuento'
        WHEN dias_inactivo > 90 THEN 'Email de seguimiento'
        ELSE 'Monitorear'
    END AS accion_recomendada
FROM ultimo_contrato
WHERE dias_inactivo > 90  -- Más de 3 meses sin actividad
  AND valor_lifetime > 50000  -- Solo clientes valiosos
ORDER BY valor_lifetime DESC, dias_inactivo DESC
LIMIT 50;
```

**ROI**: Si recuperas solo 10 clientes de esta lista, puedes generar $500K+ en ingresos adicionales.

---

###  Categoría: Análisis de Calidad

#### Reporte 20: Tasa de No Conformidad por Cliente

**Problema de negocio**: ¿Hay clientes cuyas muestras consistentemente fallan especificaciones?

```sql
-- Análisis de calidad por cliente
SELECT 
    dc.nombre AS cliente,
    dc.tipo_cliente,
    COUNT(DISTINCT fm.id_muestra) AS total_muestras,
    SUM(fm.cantidad_analisis) AS total_analisis,
    SUM(fm.analisis_conformes) AS analisis_ok,
    SUM(fm.analisis_no_conformes) AS analisis_fallidos,
    ROUND(
        SUM(fm.analisis_no_conformes)::NUMERIC / 
        NULLIF(SUM(fm.cantidad_analisis), 0) * 100,
        1
    ) AS tasa_no_conformidad,
    -- Comparar con promedio general
    ROUND(
        (SUM(fm.analisis_no_conformes)::NUMERIC / NULLIF(SUM(fm.cantidad_analisis), 0) * 100) -
        (SELECT SUM(analisis_no_conformes)::NUMERIC / NULLIF(SUM(cantidad_analisis), 0) * 100 
         FROM dwh.fact_muestra),
        1
    ) AS desviacion_vs_promedio,
    -- Tipos de análisis con más problemas
    (SELECT STRING_AGG(DISTINCT tipo_analisis, ', ')
     FROM dwh.fact_analisis fa
     JOIN dwh.fact_muestra fm2 ON fa.sk_muestra = fm2.sk_muestra
     WHERE fm2.sk_contrato IN (
         SELECT DISTINCT fc.sk_contrato 
         FROM dwh.fact_contrato fc 
         WHERE fc.sk_cliente = dc.sk_cliente
     )
     AND fa.cumple_especificacion = FALSE
    ) AS analisis_problematicos
FROM dwh.dim_cliente dc
JOIN dwh.fact_contrato fc ON dc.sk_cliente = fc.sk_cliente
JOIN dwh.fact_muestra fm ON fc.sk_contrato = fm.sk_contrato
WHERE dc.es_actual = TRUE
GROUP BY dc.sk_cliente, dc.nombre, dc.tipo_cliente
HAVING SUM(fm.cantidad_analisis) >= 20  -- Mínimo 20 análisis
ORDER BY tasa_no_conformidad DESC
LIMIT 30;
```

**Acción**: Si un cliente tiene 25% no conformidad vs 5% promedio, hay que:

1. Revisar el proceso de recolección de muestras del cliente
2. Capacitar al cliente en mejores prácticas
3. Ajustar expectativas de especificaciones

---

##  Parte III: Reportes Avanzados

### Combinando OLTP y OLAP

#### Reporte 21: Dashboard de Operaciones en Tiempo Real + Tendencias

**Problema de negocio**: El COO quiere ver el estado actual Y las tendencias en una sola vista.

```sql
-- Dashboard híbrido operacional + analítico
WITH operacional_hoy AS (
    -- Datos OLTP en tiempo real
    SELECT 
        COUNT(DISTINCT CASE WHEN m.fecha_entrada::date = CURRENT_DATE THEN m.id_muestra END) AS muestras_hoy,
        COUNT(DISTINCT CASE WHEN m.estado_muestra = 'Recibida' THEN m.id_muestra END) AS cola_procesamiento,
        COUNT(DISTINCT CASE WHEN m.estado_muestra = 'En Proceso' THEN m.id_muestra END) AS en_proceso,
        COUNT(DISTINCT CASE WHEN a.fecha_analisis::date = CURRENT_DATE THEN a.id_analisis END) AS analisis_hoy,
        COUNT(DISTINCT CASE WHEN c.fecha_creacion::date = CURRENT_DATE THEN c.id_contrato END) AS contratos_nuevos_hoy
    FROM core.muestra m
    LEFT JOIN core.analisis a ON m.id_muestra = a.id_muestra
    LEFT JOIN core.contrato c ON m.id_contrato = c.id_contrato
),
tendencias_mes AS (
    -- Datos OLAP históricos
    SELECT 
        AVG(CASE WHEN dt.dia_mes = EXTRACT(DAY FROM CURRENT_DATE) THEN muestras_dia ELSE NULL END) AS promedio_muestras_mismo_dia,
        AVG(muestras_dia) AS promedio_muestras_mes,
        MAX(muestras_dia) AS pico_muestras_mes
    FROM (
        SELECT 
            dt.dia_mes,
            COUNT(*) AS muestras_dia
        FROM dwh.fact_muestra fm
        JOIN dwh.dim_tiempo dt ON fm.sk_fecha_entrada = dt.sk_tiempo
        WHERE dt.anio = EXTRACT(YEAR FROM CURRENT_DATE)
          AND dt.mes = EXTRACT(MONTH FROM CURRENT_DATE)
        GROUP BY dt.dia_mes
    ) sub
)
SELECT 
    'Muestras ingresadas hoy' AS metrica,
    oh.muestras_hoy AS valor_actual,
    tm.promedio_muestras_mismo_dia AS promedio_historico,
    CASE 
        WHEN oh.muestras_hoy > tm.promedio_muestras_mismo_dia * 1.2 THEN ' Por encima'
        WHEN oh.muestras_hoy < tm.promedio_muestras_mismo_dia * 0.8 THEN ' Por debajo'
        ELSE ' Normal'
    END AS comparacion
FROM operacional_hoy oh, tendencias_mes tm

UNION ALL

SELECT 
    'Muestras en cola',
    oh.cola_procesamiento,
    NULL,
    CASE 
        WHEN oh.cola_procesamiento > 50 THEN ' Alta'
        WHEN oh.cola_procesamiento > 20 THEN ' Media'
        ELSE ' Baja'
    END
FROM operacional_hoy oh

UNION ALL

SELECT 
    'Análisis completados hoy',
    oh.analisis_hoy,
    tm.promedio_muestras_mes,
    CASE 
        WHEN oh.analisis_hoy >= tm.promedio_muestras_mes THEN ' On track'
        ELSE ' Retrasado'
    END
FROM operacional_hoy oh, tendencias_mes tm;
```

**Valor**: Combina lo mejor de ambos mundos: datos en tiempo real + contexto histórico.

---

##  Mejores Prácticas para Reportes


::steps{level="4"}

#### Optimización de Queries


::warning
** Evitar:**
```sql
-- SELECT * es lento e innecesario
SELECT * FROM fact_contrato;

-- Múltiples subqueries repetidas
SELECT 
    (SELECT COUNT(*) FROM contrato WHERE cliente = 1) AS total1,
    (SELECT COUNT(*) FROM contrato WHERE cliente = 1) AS total2;
```

::


::tip
** Hacer:**
```sql
-- Solo columnas necesarias
SELECT id_contrato, monto_total, fecha_inicio FROM fact_contrato;

-- Usar CTEs para reusabilidad
WITH conteo AS (
    SELECT cliente, COUNT(*) AS total FROM contrato GROUP BY cliente
)
SELECT * FROM conteo;
```
::


#### Formato de Resultados

```sql
-- Números formateados
TO_CHAR(monto, 'L999,999,999.99') AS monto_formateado

-- Fechas legibles
TO_CHAR(fecha, 'DD "de" Month "de" YYYY') AS fecha_texto

-- Porcentajes con símbolo
ROUND(porcentaje, 1) || '%' AS porcentaje_formateado
```

#### Manejo de NULLs

```sql
-- Usar COALESCE para valores por defecto
COALESCE(email, 'Sin email') AS email_contacto

-- Usar NULLIF para evitar división por cero
division / NULLIF(denominador, 0)
```

#### Comentarios en Queries

```sql
-- Explicar lógica compleja
-- Este CTE calcula el LTV (Lifetime Value) de cada cliente
-- considerando todos sus contratos históricos, ajustados por inflación
WITH customer_ltv AS (
    ...
)
```

#### Parametrización

```sql
-- En lugar de hardcodear fechas:
WHERE fecha >= '2024-01-01'

-- Usar funciones de fecha:
WHERE fecha >= DATE_TRUNC('year', CURRENT_DATE)
```



::





##  Automatización de Reportes

### Scheduler SQL con PostgreSQL

```sql
-- Crear función que genera reporte
CREATE OR REPLACE FUNCTION generar_reporte_diario()
RETURNS void AS $$
BEGIN
    -- Tu query aquí
    COPY (
        SELECT * FROM vista_dashboard_ejecutivo
    ) TO '/reportes/dashboard_' || TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') || '.csv'
    WITH CSV HEADER;
END;
$$ LANGUAGE plpgsql;

-- Programar con pg_cron (requiere extensión)
SELECT cron.schedule(
    'reporte-diario',
    '0 8 * * *',  -- Todos los días a las 8 AM
    'SELECT generar_reporte_diario()'
);
```

### Integración con Python

```python
import pandas as pd
import psycopg2
from datetime import datetime

# Conectar a PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    database="seguimiento_contratos",
    user="analytics_user",
    password="password"
)

# Ejecutar reporte
query = """
    SELECT * FROM dwh.v_dashboard_ejecutivo
    WHERE anio = EXTRACT(YEAR FROM CURRENT_DATE)
"""

df = pd.read_sql(query, conn)

# Exportar a Excel con formato
filename = f"reporte_ejecutivo_{datetime.now().strftime('%Y%m%d')}.xlsx"
with pd.ExcelWriter(filename, engine='openpyxl') as writer:
    df.to_excel(writer, sheet_name='Dashboard', index=False)
    
# Enviar por email
from email.mime.application import MIMEApplication
# ... código de email
```

---

##  Casos de Uso por Rol

### Para Gerentes de Operaciones

1. Contratos pendientes de firma
2. Dashboard de estados en tiempo real
3. Disponibilidad de equipos
4. Carga de trabajo del personal
5. Muestras pendientes de procesar

### Para CFO / Finanzas

1. Dashboard ejecutivo mensual
2. Ingresos por trimestre
3. Top 20 clientes
4. Proyección de ingresos
5. Análisis geográfico

### Para Gerentes de Calidad

1. Análisis con resultados no conformes
2. Tasa de no conformidad por cliente
3. Performance de procesamiento de muestras
4. Productividad del personal

### Para Ventas / CRM

1. Contratos por vencer
2. Clientes en riesgo de churn
3. Top clientes por valor
4. Análisis de retención

### Para Auditoría / Compliance

1. Historia completa de contratos
2. Log de cambios recientes
3. Tiempo por estado
4. Trazabilidad completa

---

##  Conclusión



**Operaciones diarias** (OLTP) - "¿Qué hago hoy?"  
**Análisis estratégico** (OLAP) - "¿Cómo vamos?"
**Eficiencia operacional** - "¿Dónde mejorar?"  
**Retención de clientes** - "¿Cómo fidelizar?"  
**Calidad y cumplimiento** - "¿Cumplimos estándares?"

### Próximos Pasos

1. **Implementa estos reportes** en tu sistema
2. **Automatiza** los que uses diariamente
3. **Crea dashboards** visuales con Metabase/Tableau
4. **Itera** basado en feedback de usuarios
5. **Monitorea performance** de las queries

### Recuerda

> **"Un reporte que nadie lee es inútil, sin importar qué tan técnicamente perfecto sea."**

Enfócate en:

- Reportes que generen **acción**
- Métricas que importan al **negocio**
- Formato **fácil de entender**
- **Automatización** para ahorrar tiempo

---

Explora más en:

::callout{icon="i-lucide-square-play" color="neutral" to="/blog/avanzandokpis"}
SQL Avanzado para KPIs Financieros y Análisis de Negocio
::

::callout{icon="i-lucide-square-play" color="neutral" to="/blog/disenobd"}
Cómo Diseñé un Sistema de Base de Datos de Clase Empresarial Paso a Paso
::

