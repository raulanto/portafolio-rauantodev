---
title: "SQL Avanzado para KPIs Financieros y Análisis de Negocio"
date: "2025-10-12"
description: "Generar indicadores clave de desempeño (KPIs) y métricas financieras críticas para la toma de decisiones"
tags: [ "Arquitectura","SQl","Modelado de Datos" ]
name: "diseno-sistema-base-datos-empresarial"

author: "raulanto"
author_avatar: 'https://avatars.githubusercontent.com/u/74162376?v=4'
author_description: "Desarrollador Full Stack "
thumbnail: "/blog/diseñoBD.png"
---
# SQL Avanzado para KPIs Financieros y Análisis de Negocio



## Introducción

Este artículo profundiza en el uso de SQL avanzado para generar indicadores clave de desempeño (KPIs) y métricas financieras críticas para la toma de decisiones. Cubriremos:

- Window Functions avanzadas
- CTEs recursivos
- Análisis de cohortes
- Métricas financieras (ROI, margen de contribución, payback period)
- KPIs operacionales y comerciales
- Análisis predictivo con SQL

Todos los ejemplos utilizan el modelo de base de datos de seguimiento de contratos diseñado previamente.
::callout{icon="i-lucide-square-play" color="neutral" to="/blog/disenobd"}
Todos los ejemplos utilizan el modelo de base de datos de seguimiento de contratos diseñado previamente.
::


---

## PARTE I: Fundamentos de SQL Avanzado para Análisis

### Window Functions: La Base del Análisis Avanzado

#### Conceptos Clave

Las window functions permiten realizar cálculos a través de conjuntos de filas relacionadas sin colapsar el resultado como GROUP BY.

**Sintaxis básica:**

```sql [vistasql.sql]
función_ventana() OVER (
    PARTITION BY columna_agrupacion
    ORDER BY columna_ordenamiento
    ROWS|RANGE BETWEEN frame_inicio AND frame_fin
)
```

#### Ranking Functions

**Reporte 1: Ranking de Clientes por Contribución al Ingreso**

```sql [vistasql.sql]
-- Ranking de clientes con múltiples métricas de ranking
SELECT 
    dc.nombre AS cliente,
    dc.tipo_cliente,
    SUM(fc.monto_usd) AS ingreso_total,
    COUNT(DISTINCT fc.id_contrato) AS num_contratos,
    
    -- ROW_NUMBER: Asigna número único incluso con empates
    ROW_NUMBER() OVER (ORDER BY SUM(fc.monto_usd) DESC) AS ranking_secuencial,
    
    -- RANK: Deja gaps en caso de empates
    RANK() OVER (ORDER BY SUM(fc.monto_usd) DESC) AS ranking_con_gaps,
    
    -- DENSE_RANK: Sin gaps en empates
    DENSE_RANK() OVER (ORDER BY SUM(fc.monto_usd) DESC) AS ranking_denso,
    
    -- NTILE: Divide en N grupos (cuartiles)
    NTILE(4) OVER (ORDER BY SUM(fc.monto_usd) DESC) AS cuartil,
    
    -- PERCENT_RANK: Posición relativa (0 a 1)
    ROUND(PERCENT_RANK() OVER (ORDER BY SUM(fc.monto_usd) DESC)::NUMERIC, 4) AS percentil_ranking,
    
    -- CUME_DIST: Distribución acumulativa
    ROUND(CUME_DIST() OVER (ORDER BY SUM(fc.monto_usd) DESC)::NUMERIC, 4) AS distribucion_acumulada,
    
    -- Ranking dentro de su tipo de cliente
    RANK() OVER (
        PARTITION BY dc.tipo_cliente 
        ORDER BY SUM(fc.monto_usd) DESC
    ) AS ranking_en_categoria
    
FROM dwh.fact_contrato fc
JOIN dwh.dim_cliente dc ON fc.sk_cliente = dc.sk_cliente AND dc.es_actual
JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
WHERE dt.anio >= EXTRACT(YEAR FROM CURRENT_DATE) - 1
GROUP BY dc.sk_cliente, dc.nombre, dc.tipo_cliente
ORDER BY ingreso_total DESC
LIMIT 50;
```

**Aplicación práctica:**

- **Cuartil 1**: Clientes VIP (Top 25%) - Gestor de cuenta dedicado
- **Cuartil 2**: Clientes Premium (25-50%) - Atención preferencial
- **Cuartil 3-4**: Clientes estándar - Atención regular

#### Aggregate Window Functions

**Reporte 2: Análisis de Acumulados y Promedios Móviles**

::code-collapse
```sql [vistasql.sql]
-- Análisis temporal con ventanas deslizantes
WITH ingresos_diarios AS (
    SELECT 
        dt.fecha,
        dt.anio,
        dt.mes,
        dt.dia_semana,
        dt.nombre_dia,
        dt.es_dia_laboral,
        SUM(fc.monto_usd) AS ingreso_dia,
        COUNT(DISTINCT fc.id_contrato) AS contratos_dia
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    WHERE dt.fecha >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY dt.fecha, dt.anio, dt.mes, dt.dia_semana, dt.nombre_dia, dt.es_dia_laboral
)
SELECT 
    fecha,
    nombre_dia,
    ingreso_dia,
    contratos_dia,
    
    -- Acumulado del mes
    SUM(ingreso_dia) OVER (
        PARTITION BY anio, mes 
        ORDER BY fecha
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS ingreso_acumulado_mes,
    
    -- Promedio móvil 7 días
    AVG(ingreso_dia) OVER (
        ORDER BY fecha
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS promedio_movil_7d,
    
    -- Promedio móvil 30 días
    AVG(ingreso_dia) OVER (
        ORDER BY fecha
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) AS promedio_movil_30d,
    
    -- Comparación con día anterior
    ingreso_dia - LAG(ingreso_dia, 1) OVER (ORDER BY fecha) AS cambio_dia_anterior,
    
    -- Porcentaje de cambio vs día anterior
    ROUND(
        (ingreso_dia - LAG(ingreso_dia, 1) OVER (ORDER BY fecha)) / 
        NULLIF(LAG(ingreso_dia, 1) OVER (ORDER BY fecha), 0) * 100,
        2
    ) AS pct_cambio_dia_anterior,
    
    -- Comparación con mismo día semana anterior
    ingreso_dia - LAG(ingreso_dia, 7) OVER (ORDER BY fecha) AS cambio_semana_anterior,
    
    -- Máximo del mes hasta la fecha
    MAX(ingreso_dia) OVER (
        PARTITION BY anio, mes 
        ORDER BY fecha
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS max_dia_mes,
    
    -- Mínimo del mes hasta la fecha
    MIN(ingreso_dia) OVER (
        PARTITION BY anio, mes 
        ORDER BY fecha
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS min_dia_mes,
    
    -- Desviación estándar móvil 30 días
    STDDEV(ingreso_dia) OVER (
        ORDER BY fecha
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) AS volatilidad_30d,
    
    -- Identificar si es día atípico (fuera de 2 desviaciones estándar)
    CASE 
        WHEN ABS(
            ingreso_dia - AVG(ingreso_dia) OVER (
                ORDER BY fecha
                ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
            )
        ) > 2 * STDDEV(ingreso_dia) OVER (
                ORDER BY fecha
                ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
            )
        THEN 'ATIPICO'
        ELSE 'NORMAL'
    END AS clasificacion_dia
    
FROM ingresos_diarios
ORDER BY fecha DESC;
```
::
**Interpretación:**

- **Promedio móvil 7d**: Suaviza variaciones diarias
- **Promedio móvil 30d**: Tendencia de medio plazo
- **Volatilidad**: Alta volatilidad indica inestabilidad en ventas
- **Días atípicos**: Requieren investigación (promociones, eventos)

#### LAG y LEAD: Análisis Temporal Comparativo

**Reporte 3: Análisis de Crecimiento Período sobre Período**

::code-collapse
```sql [vistasql.sql]
-- Análisis de crecimiento con múltiples períodos de comparación
WITH metricas_mensuales AS (
    SELECT 
        dt.anio,
        dt.mes,
        dt.anio_mes,
        COUNT(DISTINCT fc.id_contrato) AS contratos,
        SUM(fc.monto_usd) AS ingresos,
        AVG(fc.monto_usd) AS ticket_promedio,
        COUNT(DISTINCT fc.sk_cliente) AS clientes_unicos,
        SUM(fc.cantidad_muestras) AS muestras_procesadas,
        ROUND(
            SUM(CASE WHEN fc.completado_a_tiempo THEN 1 ELSE 0 END)::NUMERIC / 
            NULLIF(COUNT(*), 0) * 100,
            2
        ) AS tasa_cumplimiento_sla
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    WHERE dt.fecha >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '2 years'
    GROUP BY dt.anio, dt.mes, dt.anio_mes
)
SELECT 
    anio_mes,
    contratos,
    ingresos,
    ticket_promedio,
    clientes_unicos,
    
    -- Comparación mes anterior (MoM - Month over Month)
    LAG(ingresos, 1) OVER (ORDER BY anio, mes) AS ingresos_mes_anterior,
    ingresos - LAG(ingresos, 1) OVER (ORDER BY anio, mes) AS cambio_absoluto_mom,
    ROUND(
        (ingresos - LAG(ingresos, 1) OVER (ORDER BY anio, mes)) / 
        NULLIF(LAG(ingresos, 1) OVER (ORDER BY anio, mes), 0) * 100,
        2
    ) AS cambio_porcentual_mom,
    
    -- Comparación mismo mes año anterior (YoY - Year over Year)
    LAG(ingresos, 12) OVER (ORDER BY anio, mes) AS ingresos_mismo_mes_anio_anterior,
    ingresos - LAG(ingresos, 12) OVER (ORDER BY anio, mes) AS cambio_absoluto_yoy,
    ROUND(
        (ingresos - LAG(ingresos, 12) OVER (ORDER BY anio, mes)) / 
        NULLIF(LAG(ingresos, 12) OVER (ORDER BY anio, mes), 0) * 100,
        2
    ) AS cambio_porcentual_yoy,
    
    -- Comparación trimestre anterior (QoQ - Quarter over Quarter)
    LAG(ingresos, 3) OVER (ORDER BY anio, mes) AS ingresos_trim_anterior,
    ROUND(
        (ingresos - LAG(ingresos, 3) OVER (ORDER BY anio, mes)) / 
        NULLIF(LAG(ingresos, 3) OVER (ORDER BY anio, mes), 0) * 100,
        2
    ) AS cambio_porcentual_qoq,
    
    -- Proyección mes siguiente (basado en tendencia)
    LEAD(ingresos, 1) OVER (ORDER BY anio, mes) AS ingresos_mes_siguiente_real,
    
    -- CAGR (Compound Annual Growth Rate) - últimos 12 meses
    ROUND(
        (POWER(
            ingresos / NULLIF(LAG(ingresos, 12) OVER (ORDER BY anio, mes), 0),
            1.0/1.0
        ) - 1) * 100,
        2
    ) AS cagr_anual,
    
    -- Índice base 100 (primer mes = 100)
    ROUND(
        ingresos / FIRST_VALUE(ingresos) OVER (ORDER BY anio, mes) * 100,
        2
    ) AS indice_base_100,
    
    -- Participación acumulada año actual
    CASE 
        WHEN anio = EXTRACT(YEAR FROM CURRENT_DATE) THEN
            ROUND(
                SUM(ingresos) OVER (
                    PARTITION BY anio 
                    ORDER BY mes
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                ) / SUM(ingresos) OVER (PARTITION BY anio) * 100,
                2
            )
        ELSE NULL
    END AS pct_acumulado_anio,
    
    -- Tasa de crecimiento compuesta de 3 meses
    ROUND(
        (POWER(
            ingresos / NULLIF(LAG(ingresos, 3) OVER (ORDER BY anio, mes), 0),
            1.0/3.0
        ) - 1) * 100,
        2
    ) AS tasa_crecimiento_3m

FROM metricas_mensuales
ORDER BY anio DESC, mes DESC;
```
::
**KPIs Derivados:**

- **MoM Growth > 10%**: Crecimiento acelerado
- **YoY Growth < 0%**: Contracción, requiere acción inmediata
- **CAGR > 20%**: Crecimiento sostenible excepcional
- **QoQ estable**: Negocio predecible

---

## PARTE II: KPIs Financieros Críticos

### Métricas de Rentabilidad

#### Reporte 4: Análisis de Margen de Contribución por Contrato

::code-collapse
```sql [vistasql.sql]
-- Análisis detallado de rentabilidad por contrato
WITH costos_contrato AS (
    SELECT 
        fc.id_contrato,
        fc.sk_contrato,
        fc.monto_usd AS ingreso_bruto,
        
        -- Costos de personal (sumatoria de salarios proporcionales)
        COALESCE(SUM(
            (p.salario_mensual * (pa.porcentaje_dedicacion / 100.0) * 
            (EXTRACT(DAY FROM COALESCE(pa.fecha_fin, CURRENT_DATE) - pa.fecha_inicio) / 30.0))
        ), 0) AS costo_personal,
        
        -- Costos de equipos (depreciación o alquiler)
        COALESCE(SUM(
            e.costo_adquisicion * 0.01 * -- 1% mensual de depreciación
            (EXTRACT(DAY FROM COALESCE(ea.fecha_devolucion_real, CURRENT_DATE) - ea.fecha_asignacion) / 30.0)
        ), 0) AS costo_equipos,
        
        -- Costos variables de análisis (estimado por muestra)
        COUNT(DISTINCT fm.id_muestra) * 50 AS costo_variable_muestras,
        
        -- Overhead asignado (15% de ingresos)
        fc.monto_usd * 0.15 AS overhead_asignado
        
    FROM dwh.fact_contrato fc
    LEFT JOIN core.personal_asignado pa ON fc.id_contrato = pa.id_contrato
    LEFT JOIN core.personal p ON pa.id_personal = p.id_personal
    LEFT JOIN core.equipo_asignado ea ON fc.id_contrato = ea.id_contrato
    LEFT JOIN core.equipo e ON ea.id_equipo = e.id_equipo
    LEFT JOIN dwh.fact_muestra fm ON fc.sk_contrato = fm.sk_contrato
    GROUP BY fc.id_contrato, fc.sk_contrato, fc.monto_usd
),
rentabilidad AS (
    SELECT 
        c.numero_contrato,
        cl.nombre AS cliente,
        cl.tipo_cliente,
        dt.anio,
        dt.trimestre,
        cc.ingreso_bruto,
        cc.costo_personal,
        cc.costo_equipos,
        cc.costo_variable_muestras,
        cc.overhead_asignado,
        
        -- Costo total
        (cc.costo_personal + cc.costo_equipos + cc.costo_variable_muestras + cc.overhead_asignado) AS costo_total,
        
        -- Margen de contribución
        cc.ingreso_bruto - (cc.costo_personal + cc.costo_equipos + cc.costo_variable_muestras) AS margen_contribucion,
        
        -- Utilidad neta
        cc.ingreso_bruto - (cc.costo_personal + cc.costo_equipos + cc.costo_variable_muestras + cc.overhead_asignado) AS utilidad_neta,
        
        -- Porcentaje de margen de contribución
        ROUND(
            (cc.ingreso_bruto - (cc.costo_personal + cc.costo_equipos + cc.costo_variable_muestras)) / 
            NULLIF(cc.ingreso_bruto, 0) * 100,
            2
        ) AS pct_margen_contribucion,
        
        -- Porcentaje de margen neto
        ROUND(
            (cc.ingreso_bruto - (cc.costo_personal + cc.costo_equipos + cc.costo_variable_muestras + cc.overhead_asignado)) / 
            NULLIF(cc.ingreso_bruto, 0) * 100,
            2
        ) AS pct_margen_neto,
        
        -- ROI del contrato
        ROUND(
            ((cc.ingreso_bruto - (cc.costo_personal + cc.costo_equipos + cc.costo_variable_muestras + cc.overhead_asignado)) / 
            NULLIF((cc.costo_personal + cc.costo_equipos + cc.costo_variable_muestras + cc.overhead_asignado), 0)) * 100,
            2
        ) AS roi_porcentaje,
        
        c.duracion_dias,
        
        -- Ingreso por día
        ROUND(cc.ingreso_bruto / NULLIF(c.duracion_dias, 0), 2) AS ingreso_por_dia,
        
        -- Utilidad por día
        ROUND(
            (cc.ingreso_bruto - (cc.costo_personal + cc.costo_equipos + cc.costo_variable_muestras + cc.overhead_asignado)) / 
            NULLIF(c.duracion_dias, 0),
            2
        ) AS utilidad_por_dia
        
    FROM costos_contrato cc
    JOIN core.contrato c ON cc.id_contrato = c.id_contrato
    JOIN core.cliente cl ON c.id_cliente = cl.id_cliente
    JOIN dwh.fact_contrato fc ON cc.sk_contrato = fc.sk_contrato
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
)
SELECT 
    numero_contrato,
    cliente,
    tipo_cliente,
    anio,
    trimestre,
    TO_CHAR(ingreso_bruto, 'L999,999,999.99') AS ingreso_bruto,
    TO_CHAR(costo_total, 'L999,999,999.99') AS costo_total,
    TO_CHAR(margen_contribucion, 'L999,999,999.99') AS margen_contribucion,
    TO_CHAR(utilidad_neta, 'L999,999,999.99') AS utilidad_neta,
    pct_margen_contribucion || '%' AS margen_contribucion_pct,
    pct_margen_neto || '%' AS margen_neto_pct,
    roi_porcentaje || '%' AS roi,
    duracion_dias || ' días' AS duracion,
    TO_CHAR(ingreso_por_dia, 'L999,999.99') AS ingreso_diario,
    TO_CHAR(utilidad_por_dia, 'L999,999.99') AS utilidad_diaria,
    
    -- Clasificación de rentabilidad
    CASE 
        WHEN pct_margen_neto >= 30 THEN 'EXCELENTE'
        WHEN pct_margen_neto >= 20 THEN 'BUENO'
        WHEN pct_margen_neto >= 10 THEN 'ACEPTABLE'
        WHEN pct_margen_neto >= 0 THEN 'MARGINAL'
        ELSE 'PERDIDA'
    END AS clasificacion_rentabilidad,
    
    -- Ranking de rentabilidad
    RANK() OVER (ORDER BY pct_margen_neto DESC) AS ranking_margen
    
FROM rentabilidad
ORDER BY pct_margen_neto DESC;
```
::
**Interpretación de KPIs:**

- **Margen de Contribución > 50%**: Contrato muy rentable, cubrir costos fijos con facilidad
- **Margen Neto 20-30%**: Benchmark saludable para servicios profesionales
- **ROI > 100%**: Excelente retorno sobre inversión
- **Margen Neto < 10%**: Revisar pricing o eficiencia operacional

#### Reporte 5: Análisis de Punto de Equilibrio (Break-Even)
::code-collapse
```sql [vistasql.sql]
-- Cálculo de punto de equilibrio por tipo de contrato
WITH estructura_costos AS (
    SELECT 
        dc.tipo_cliente,
        -- Costos fijos mensuales promedio
        AVG(
            (SELECT SUM(p.salario_mensual) 
             FROM core.personal p 
             WHERE p.departamento = 'Operaciones' AND p.activo = TRUE) / 
            NULLIF(COUNT(DISTINCT fc.id_contrato), 0)
        ) AS costo_fijo_promedio_contrato,
        
        -- Costos variables promedio por contrato
        AVG(fm.cantidad_analisis * 50) AS costo_variable_promedio,
        
        -- Precio promedio de venta
        AVG(fc.monto_usd) AS precio_venta_promedio,
        
        -- Número de contratos
        COUNT(DISTINCT fc.id_contrato) AS num_contratos,
        
        -- Ingresos totales
        SUM(fc.monto_usd) AS ingresos_totales,
        
        -- Costos totales estimados
        SUM(
            (SELECT SUM(p.salario_mensual) * 0.3 -- 30% del tiempo en operaciones
             FROM core.personal p 
             WHERE p.departamento = 'Operaciones' AND p.activo = TRUE)
        ) + SUM(fm.cantidad_analisis * 50) AS costos_totales_estimados
        
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_cliente dc ON fc.sk_cliente = dc.sk_cliente AND dc.es_actual
    JOIN dwh.fact_muestra fm ON fc.sk_contrato = fm.sk_contrato
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    WHERE dt.anio = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY dc.tipo_cliente
)
SELECT 
    tipo_cliente,
    TO_CHAR(precio_venta_promedio, 'L999,999.99') AS precio_promedio,
    TO_CHAR(costo_variable_promedio, 'L999,999.99') AS costo_variable_unitario,
    TO_CHAR(costo_fijo_promedio_contrato, 'L999,999.99') AS costo_fijo_asignado,
    
    -- Margen de contribución unitario
    precio_venta_promedio - costo_variable_promedio AS margen_contribucion_unitario,
    
    -- Ratio de margen de contribución
    ROUND(
        (precio_venta_promedio - costo_variable_promedio) / 
        NULLIF(precio_venta_promedio, 0) * 100,
        2
    ) AS ratio_margen_contribucion,
    
    -- Punto de equilibrio en unidades
    CEIL(
        costo_fijo_promedio_contrato / 
        NULLIF((precio_venta_promedio - costo_variable_promedio), 0)
    ) AS contratos_break_even,
    
    -- Punto de equilibrio en ingresos
    TO_CHAR(
        CEIL(
            costo_fijo_promedio_contrato / 
            NULLIF((precio_venta_promedio - costo_variable_promedio), 0)
        ) * precio_venta_promedio,
        'L999,999,999.99'
    ) AS ingresos_break_even,
    
    -- Margen de seguridad actual
    num_contratos AS contratos_actuales,
    num_contratos - CEIL(
        costo_fijo_promedio_contrato / 
        NULLIF((precio_venta_promedio - costo_variable_promedio), 0)
    ) AS margen_seguridad_unidades,
    
    -- Porcentaje de margen de seguridad
    ROUND(
        (num_contratos - CEIL(
            costo_fijo_promedio_contrato / 
            NULLIF((precio_venta_promedio - costo_variable_promedio), 0)
        ))::NUMERIC / NULLIF(num_contratos, 0) * 100,
        2
    ) AS pct_margen_seguridad,
    
    -- Apalancamiento operativo
    ROUND(
        (precio_venta_promedio - costo_variable_promedio) / 
        NULLIF((precio_venta_promedio - costo_variable_promedio - costo_fijo_promedio_contrato), 0),
        2
    ) AS apalancamiento_operativo

FROM estructura_costos
ORDER BY tipo_cliente;
```
::
**Métricas Clave:**

- **Punto de Equilibrio**: Número mínimo de contratos para no perder dinero
- **Margen de Seguridad**: Cuánto pueden caer las ventas antes de pérdidas
- **Apalancamiento Operativo**: Sensibilidad de utilidades a cambios en ventas

### Métricas de Liquidez y Ciclo de Conversión de Efectivo

#### Reporte 6: Análisis del Ciclo de Conversión de Efectivo (Cash Conversion Cycle)

::code-collapse
```sql [vistasql.sql]
-- CCC: DIO + DSO - DPO
-- DIO (Days Inventory Outstanding) - adaptado a servicios como WIP
-- DSO (Days Sales Outstanding) - días promedio de cobro
-- DPO (Days Payable Outstanding) - días promedio de pago a proveedores

WITH metricas_por_mes AS (
    SELECT 
        dt.anio,
        dt.mes,
        dt.anio_mes,
        
        -- Ingresos del mes
        SUM(fc.monto_usd) AS ingresos_mes,
        
        -- Work in Progress (contratos en ejecución)
        SUM(CASE 
            WHEN de.nombre_estado IN ('En Ejecución', 'En Proceso') 
            THEN fc.monto_usd * 0.5  -- 50% del valor en WIP
            ELSE 0 
        END) AS wip_promedio,
        
        -- Cuentas por cobrar (contratos finalizados no pagados - simulado)
        SUM(CASE 
            WHEN de.nombre_estado = 'Finalizado' AND de.es_estado_final = TRUE
            THEN fc.monto_usd 
            ELSE 0 
        END) AS cuentas_por_cobrar,
        
        -- Cuentas por pagar (costos operativos - simulado)
        SUM(fc.monto_usd * 0.30) AS cuentas_por_pagar,  -- 30% de costos
        
        -- COGS (Cost of Goods Sold) - en servicios es costo de entrega
        SUM(fc.monto_usd * 0.40) AS costo_servicios_vendidos
        
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    JOIN dwh.dim_estado de ON fc.sk_estado_actual = de.sk_estado
    WHERE dt.fecha >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '1 year'
    GROUP BY dt.anio, dt.mes, dt.anio_mes
),
metricas_calculadas AS (
    SELECT 
        anio_mes,
        ingresos_mes,
        wip_promedio,
        cuentas_por_cobrar,
        cuentas_por_pagar,
        costo_servicios_vendidos,
        
        -- DIO (Days Inventory Outstanding) - en servicios es días de WIP
        ROUND(
            (wip_promedio / NULLIF(costo_servicios_vendidos, 0)) * 30,
            1
        ) AS dio_dias,
        
        -- DSO (Days Sales Outstanding) - días promedio de cobro
        ROUND(
            (cuentas_por_cobrar / NULLIF(ingresos_mes, 0)) * 30,
            1
        ) AS dso_dias,
        
        -- DPO (Days Payable Outstanding) - días promedio de pago
        ROUND(
            (cuentas_por_pagar / NULLIF(costo_servicios_vendidos, 0)) * 30,
            1
        ) AS dpo_dias,
        
        -- Working Capital
        cuentas_por_cobrar + wip_promedio - cuentas_por_pagar AS capital_trabajo,
        
        -- Working Capital Ratio
        ROUND(
            (cuentas_por_cobrar + wip_promedio) / NULLIF(cuentas_por_pagar, 0),
            2
        ) AS ratio_capital_trabajo
        
    FROM metricas_por_mes
)
SELECT 
    anio_mes,
    TO_CHAR(ingresos_mes, 'L999,999,999') AS ingresos,
    dio_dias || ' días' AS dias_wip,
    dso_dias || ' días' AS dias_cobro,
    dpo_dias || ' días' AS dias_pago,
    
    -- Cash Conversion Cycle
    (dio_dias + dso_dias - dpo_dias) AS ccc_dias,
    
    TO_CHAR(capital_trabajo, 'L999,999,999') AS capital_trabajo,
    ratio_capital_trabajo AS ratio_liquidez,
    
    -- Evaluación del CCC
    CASE 
        WHEN (dio_dias + dso_dias - dpo_dias) < 0 THEN 'EXCELENTE - Ciclo negativo'
        WHEN (dio_dias + dso_dias - dpo_dias) <= 30 THEN 'BUENO'
        WHEN (dio_dias + dso_dias - dpo_dias) <= 60 THEN 'ACEPTABLE'
        WHEN (dio_dias + dso_dias - dpo_dias) <= 90 THEN 'MEJORABLE'
        ELSE 'CRITICO - Problemas de liquidez'
    END AS evaluacion_ccc,
    
    -- Tendencia del CCC
    (dio_dias + dso_dias - dpo_dias) - 
    LAG(dio_dias + dso_dias - dpo_dias, 1) OVER (ORDER BY anio_mes) AS cambio_ccc_mes_anterior,
    
    -- Cash generado/consumido
    ROUND(
        ingresos_mes / NULLIF((dio_dias + dso_dias - dpo_dias), 0) * 30,
        2
    ) AS velocidad_cash_mensual
    
FROM metricas_calculadas
ORDER BY anio_mes DESC;
```
::
**Interpretación:**

- **CCC < 30 días**: Excelente gestión de efectivo
- **CCC negativo**: La empresa cobra antes de pagar (ideal)
- **Tendencia creciente del CCC**: Deterioro en gestión de liquidez
- **Ratio Capital Trabajo > 2**: Buena capacidad de pago

---

## PARTE III: KPIs de Adquisición y Retención de Clientes

### Customer Acquisition Cost (CAC) y Customer Lifetime Value (LTV)

#### Reporte 7: Análisis CAC y LTV por Cohorte

::code-collapse
```sql [vistasql.sql]
-- Análisis de economía de clientes por cohorte de adquisición
WITH cohortes AS (
    SELECT 
        dc.id_cliente,
        dc.nombre,
        dc.tipo_cliente,
        TO_CHAR(MIN(dt.fecha), 'YYYY-MM') AS cohorte_adquisicion,
        MIN(dt.fecha) AS fecha_primer_contrato,
        EXTRACT(YEAR FROM MIN(dt.fecha)) AS anio_adquisicion,
        EXTRACT(MONTH FROM MIN(dt.fecha)) AS mes_adquisicion
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_cliente dc ON fc.sk_cliente = dc.sk_cliente AND dc.es_actual
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    GROUP BY dc.id_cliente, dc.nombre, dc.tipo_cliente
),
ingresos_por_cliente AS (
    SELECT 
        c.id_cliente,
        c.cohorte_adquisicion,
        c.tipo_cliente,
        c.fecha_primer_contrato,
        
        -- Lifetime Value total
        SUM(fc.monto_usd) AS ltv_total,
        
        -- Número de contratos (frecuencia)
        COUNT(DISTINCT fc.id_contrato) AS num_contratos,
        
        -- Ticket promedio
        AVG(fc.monto_usd) AS ticket_promedio,
        
        -- Duración de la relación en meses
        ROUND(
            EXTRACT(EPOCH FROM (MAX(dt.fecha) - c.fecha_primer_contrato)) / 
            (30 * 24 * 60 * 60)
        ) AS meses_como_cliente,
        
        -- Ingresos por mes
        SUM(fc.monto_usd) / NULLIF(
            ROUND(
                EXTRACT(EPOCH FROM (MAX(dt.fecha) - c.fecha_primer_contrato)) / 
                (30 * 24 * 60 * 60)
            ),
            0
        ) AS ingreso_mensual_promedio,
        
        -- Último contrato
        MAX(dt.fecha) AS fecha_ultimo_contrato,
        
        -- Estado actual
        CASE 
            WHEN MAX(dt.fecha) < CURRENT_DATE - INTERVAL '6 months' THEN 'INACTIVO'
            WHEN MAX(dt.fecha) < CURRENT_DATE - INTERVAL '3 months' THEN 'EN RIESGO'
            ELSE 'ACTIVO'
        END AS estado_cliente
        
    FROM cohortes c
    JOIN dwh.fact_contrato fc ON c.id_cliente = (
        SELECT dc2.id_cliente 
        FROM dwh.dim_cliente dc2 
        WHERE dc2.sk_cliente = fc.sk_cliente 
        LIMIT 1
    )
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    GROUP BY c.id_cliente, c.cohorte_adquisicion, c.tipo_cliente, c.fecha_primer_contrato
),
cac_por_cohorte AS (
    -- CAC estimado: costos de ventas y marketing / nuevos clientes
    SELECT 
        cohorte_adquisicion,
        tipo_cliente,
        COUNT(*) AS nuevos_clientes,
        -- Estimado: 20% de los ingresos del primer mes como costo de adquisición
        AVG(ltv_total) * 0.20 AS cac_estimado_promedio,
        AVG(ltv_total) AS ltv_promedio,
        AVG(num_contratos) AS contratos_promedio,
        AVG(meses_como_cliente) AS tenure_promedio_meses,
        AVG(ingreso_mensual_promedio) AS arpc  -- Average Revenue Per Customer
    FROM ingresos_por_cliente
    GROUP BY cohorte_adquisicion, tipo_cliente
)
SELECT 
    cohorte_adquisicion,
    tipo_cliente,
    nuevos_clientes,
    TO_CHAR(cac_estimado_promedio, 'L999,999.99') AS cac,
    TO_CHAR(ltv_promedio, 'L999,999,999.99') AS ltv,
    TO_CHAR(arpc, 'L999,999.99') AS arpc_mensual,
    
    -- LTV:CAC Ratio
    ROUND(ltv_promedio / NULLIF(cac_estimado_promedio, 0), 2) AS ltv_cac_ratio,
    
    -- Payback Period (meses para recuperar CAC)
    ROUND(
        cac_estimado_promedio / NULLIF(arpc, 0),
        1
    ) AS payback_period_meses,
    
    -- ROI del cliente
    ROUND(
        ((ltv_promedio - cac_estimado_promedio) / NULLIF(cac_estimado_promedio, 0)) * 100,
        1
    ) AS roi_cliente_porcentaje,
    
    ROUND(contratos_promedio, 1) AS freq_compra_promedio,
    ROUND(tenure_promedio_meses, 1) || ' meses' AS duracion_relacion,
    
    -- Clasificación de salud de cohorte
    CASE 
        WHEN ltv_promedio / NULLIF(cac_estimado_promedio, 0) >= 3 THEN 'EXCELENTE'
        WHEN ltv_promedio / NULLIF(cac_estimado_promedio, 0) >= 2 THEN 'BUENO'
        WHEN ltv_promedio / NULLIF(cac_estimado_promedio, 0) >= 1 THEN 'MARGINAL'
        ELSE 'INSOSTENIBLE'
    END AS salud_cohorte,
    
    -- Valor presente neto de la cohorte (asumiendo 10% tasa de descuento)
    TO_CHAR(
        nuevos_clientes * (ltv_promedio - cac_estimado_promedio) * 
        (1 / POWER(1.10, tenure_promedio_meses / 12.0)),
        'L999,999,999.99'
    ) AS npv_cohorte

FROM cac_por_cohorte
ORDER BY cohorte_adquisicion DESC;
```
::
**Benchmarks Industria:**

- **LTV:CAC Ratio > 3**: Saludable y escalable
- **LTV:CAC Ratio < 1**: Modelo de negocio insostenible
- **Payback Period < 12 meses**: Excelente
- **Payback Period > 24 meses**: Problemas de liquidez

#### Reporte 8: Análisis de Churn Rate y Revenue Churn

::code-collapse
```sql [vistasql.sql]
-- Análisis detallado de churn con impacto en ingresos
WITH actividad_mensual AS (
    SELECT 
        dc.id_cliente,
        dt.anio,
        dt.mes,
        dt.anio_mes,
        SUM(fc.monto_usd) AS ingresos_mes,
        COUNT(DISTINCT fc.id_contrato) AS contratos_mes
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_cliente dc ON fc.sk_cliente = dc.sk_cliente AND dc.es_actual
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    WHERE dt.fecha >= CURRENT_DATE - INTERVAL '24 months'
    GROUP BY dc.id_cliente, dt.anio, dt.mes, dt.anio_mes
),
clientes_por_mes AS (
    SELECT 
        anio_mes,
        anio,
        mes,
        COUNT(DISTINCT id_cliente) AS clientes_activos,
        SUM(ingresos_mes) AS mrr,  -- Monthly Recurring Revenue
        AVG(ingresos_mes) AS arpu   -- Average Revenue Per User
    FROM actividad_mensual
    GROUP BY anio_mes, anio, mes
),
churn_mensual AS (
    SELECT 
        curr.anio_mes,
        curr.clientes_activos,
        curr.mrr,
        curr.arpu,
        
        -- Clientes del mes anterior
        prev.clientes_activos AS clientes_mes_anterior,
        
        -- Clientes que churnearon (estaban el mes anterior pero no este mes)
        prev.clientes_activos - 
        (SELECT COUNT(DISTINCT am.id_cliente)
         FROM actividad_mensual am
         WHERE am.anio_mes = curr.anio_mes
           AND am.id_cliente IN (
               SELECT id_cliente 
               FROM actividad_mensual 
               WHERE anio_mes = prev.anio_mes
           )
        ) AS clientes_churned,
        
        -- Nuevos clientes
        curr.clientes_activos - 
        (SELECT COUNT(DISTINCT am.id_cliente)
         FROM actividad_mensual am
         WHERE am.anio_mes = curr.anio_mes
           AND am.id_cliente IN (
               SELECT id_cliente 
               FROM actividad_mensual 
               WHERE anio_mes = prev.anio_mes
           )
        ) AS nuevos_clientes,
        
        -- Ingresos perdidos por churn
        COALESCE((
            SELECT SUM(am.ingresos_mes)
            FROM actividad_mensual am
            WHERE am.anio_mes = prev.anio_mes
              AND am.id_cliente NOT IN (
                  SELECT id_cliente 
                  FROM actividad_mensual 
                  WHERE anio_mes = curr.anio_mes
              )
        ), 0) AS ingresos_perdidos_churn
        
    FROM clientes_por_mes curr
    LEFT JOIN clientes_por_mes prev ON 
        prev.anio = curr.anio AND 
        prev.mes = curr.mes - 1
        OR (curr.mes = 1 AND prev.anio = curr.anio - 1 AND prev.mes = 12)
)
SELECT 
    anio_mes,
    clientes_activos,
    TO_CHAR(mrr, 'L999,999,999') AS mrr,
    TO_CHAR(arpu, 'L999,999.99') AS arpu,
    clientes_churned,
    nuevos_clientes,
    clientes_activos - COALESCE(clientes_mes_anterior, clientes_activos) AS crecimiento_neto,
    
    -- Customer Churn Rate
    ROUND(
        clientes_churned::NUMERIC / NULLIF(clientes_mes_anterior, 0) * 100,
        2
    ) AS customer_churn_rate,
    
    -- Revenue Churn Rate (más importante que customer churn)
    ROUND(
        ingresos_perdidos_churn / NULLIF(LAG(mrr, 1) OVER (ORDER BY anio_mes), 0) * 100,
        2
    ) AS revenue_churn_rate,
    
    -- Net Revenue Retention (incluye expansion revenue)
    ROUND(
        (mrr - ingresos_perdidos_churn) / NULLIF(LAG(mrr, 1) OVER (ORDER BY anio_mes), 0) * 100,
        2
    ) AS net_revenue_retention,
    
    -- Customer Retention Rate
    ROUND(
        (clientes_activos - nuevos_clientes)::NUMERIC / NULLIF(clientes_mes_anterior, 0) * 100,
        2
    ) AS customer_retention_rate,
    
    -- Quick Ratio (Growth / Churn)
    ROUND(
        (nuevos_clientes + 
         (SELECT COUNT(*) FROM actividad_mensual WHERE anio_mes = clientes_por_mes.anio_mes AND 
          id_cliente IN (SELECT id_cliente FROM actividad_mensual WHERE anio_mes = LAG(clientes_por_mes.anio_mes, 1) OVER (ORDER BY anio_mes))
         )
        )::NUMERIC / NULLIF(clientes_churned, 0),
        2
    ) AS quick_ratio,
    
    TO_CHAR(ingresos_perdidos_churn, 'L999,999,999') AS ingresos_perdidos,
    
    -- Proyección anualizada del impacto del churn
    TO_CHAR(ingresos_perdidos_churn * 12, 'L999,999,999') AS impacto_anual_proyectado,
    
    -- Evaluación del churn
    CASE 
        WHEN clientes_churned::NUMERIC / NULLIF(clientes_mes_anterior, 0) * 100 < 2 THEN 'EXCELENTE'
        WHEN clientes_churned::NUMERIC / NULLIF(clientes_mes_anterior, 0) * 100 < 5 THEN 'BUENO'
        WHEN clientes_churned::NUMERIC / NULLIF(clientes_mes_anterior, 0) * 100 < 10 THEN 'ACEPTABLE'
        ELSE 'CRITICO'
    END AS estado_churn

FROM churn_mensual
ORDER BY anio_mes DESC;
```
::
**Métricas Clave:**

- **Customer Churn < 5%**: Excelente retención
- **Revenue Churn < 2%**: Ideal para SaaS/servicios
- **Net Revenue Retention > 100%**: Crecimiento por expansión
- **Quick Ratio > 4**: Crecimiento saludable

---

## PARTE IV: Análisis Avanzado con CTEs Recursivos

### Reporte 9: Análisis de Jerarquía de Clientes y Árbol de Referidos

::code-collapse
```sql [vistasql.sql]
-- CTE Recursivo para modelar referidos entre clientes
WITH RECURSIVE jerarquia_clientes AS (
    -- Caso base: clientes sin referidor (nivel 0)
    SELECT 
        c.id_cliente,
        c.nombre,
        c.tipo_cliente,
        NULL::INTEGER AS id_cliente_referidor,
        0 AS nivel,
        ARRAY[c.id_cliente] AS path,
        c.nombre::TEXT AS path_nombres
    FROM core.cliente c
    WHERE c.activo = TRUE
      AND NOT EXISTS (
          SELECT 1 FROM core.contrato WHERE 
          observaciones ILIKE '%referido por cliente%' 
          AND id_cliente = c.id_cliente
      )
    
    UNION ALL
    
    -- Caso recursivo: clientes referidos (niveles 1+)
    SELECT 
        c.id_cliente,
        c.nombre,
        c.tipo_cliente,
        hc.id_cliente AS id_cliente_referidor,
        hc.nivel + 1,
        hc.path || c.id_cliente,
        hc.path_nombres || ' -> ' || c.nombre
    FROM core.cliente c
    INNER JOIN jerarquia_clientes hc ON TRUE
    INNER JOIN core.contrato ct ON c.id_cliente = ct.id_cliente
    WHERE c.activo = TRUE
      AND ct.observaciones ILIKE '%referido por cliente ' || hc.id_cliente || '%'
      AND NOT (c.id_cliente = ANY(hc.path))  -- Prevenir ciclos
      AND hc.nivel < 5  -- Limitar profundidad
),
metricas_por_nodo AS (
    SELECT 
        jc.id_cliente,
        jc.nombre,
        jc.nivel,
        jc.id_cliente_referidor,
        jc.path_nombres,
        
        -- Métricas propias del cliente
        COUNT(DISTINCT fc.id_contrato) AS contratos_directos,
        COALESCE(SUM(fc.monto_usd), 0) AS ingresos_directos,
        
        -- Métricas de toda la red debajo
        (SELECT COUNT(DISTINCT jc2.id_cliente)
         FROM jerarquia_clientes jc2
         WHERE jc.id_cliente = ANY(jc2.path)
           AND jc2.id_cliente != jc.id_cliente
        ) AS referidos_totales,
        
        (SELECT COALESCE(SUM(fc2.monto_usd), 0)
         FROM jerarquia_clientes jc2
         JOIN dwh.dim_cliente dc2 ON jc2.id_cliente = dc2.id_cliente
         JOIN dwh.fact_contrato fc2 ON dc2.sk_cliente = fc2.sk_cliente
         WHERE jc.id_cliente = ANY(jc2.path)
           AND jc2.id_cliente != jc.id_cliente
        ) AS ingresos_red
        
    FROM jerarquia_clientes jc
    LEFT JOIN dwh.dim_cliente dc ON jc.id_cliente = dc.id_cliente
    LEFT JOIN dwh.fact_contrato fc ON dc.sk_cliente = fc.sk_cliente
    GROUP BY jc.id_cliente, jc.nombre, jc.nivel, jc.id_cliente_referidor, jc.path_nombres
)
SELECT 
    REPEAT('  ', nivel) || nombre AS cliente_jerarquia,
    nivel,
    contratos_directos,
    TO_CHAR(ingresos_directos, 'L999,999,999') AS ingresos_directos,
    referidos_totales AS clientes_referidos,
    TO_CHAR(ingresos_red, 'L999,999,999') AS ingresos_red_referidos,
    TO_CHAR(ingresos_directos + ingresos_red, 'L999,999,999') AS ingresos_totales,
    
    -- Viral Coefficient (cuántos clientes trae cada cliente)
    ROUND(referidos_totales::NUMERIC / NULLIF(contratos_directos, 0), 2) AS coeficiente_viral,
    
    -- Clasificación de influencia
    CASE 
        WHEN referidos_totales >= 10 THEN 'SUPER PROMOTOR'
        WHEN referidos_totales >= 5 THEN 'PROMOTOR'
        WHEN referidos_totales >= 1 THEN 'REFERIDOR'
        ELSE 'CLIENTE BASE'
    END AS clasificacion_influencia,
    
    path_nombres AS cadena_referidos
    
FROM metricas_por_nodo
ORDER BY nivel, ingresos_directos + ingresos_red DESC;
```
::
**Aplicación:**

- Identificar super promotores para programas de embajadores
- Calcular el viral coefficient del negocio
- Incentivos diferenciados por nivel de influencia

---

## PARTE V: KPIs Operacionales Avanzados

### Reporte 10: Análisis de Eficiencia Multi-dimensional

::code-collapse
```sql [vistasql.sql]
-- Análisis de eficiencia con múltiples dimensiones
WITH base_eficiencia AS (
    SELECT 
        dt.anio,
        dt.mes,
        dt.anio_mes,
        dt.nombre_dia,
        dt.dia_semana,
        dc.tipo_cliente,
        de.nombre_estado,
        
        -- Métricas de volumen
        COUNT(DISTINCT fc.id_contrato) AS num_contratos,
        COUNT(DISTINCT fc.sk_cliente) AS num_clientes,
        SUM(fc.cantidad_muestras) AS total_muestras,
        
        -- Métricas financieras
        SUM(fc.monto_usd) AS ingresos,
        AVG(fc.monto_usd) AS ticket_promedio,
        
        -- Métricas de tiempo
        AVG(fc.duracion_dias) AS duracion_promedio,
        SUM(fc.duracion_dias) AS dias_totales_trabajo,
        
        -- Métricas de recursos
        (SELECT COUNT(DISTINCT pa.id_personal)
         FROM core.personal_asignado pa
         WHERE pa.id_contrato IN (
             SELECT id_contrato FROM core.contrato WHERE id_contrato = fc.id_contrato
         )
        ) AS personal_utilizado,
        
        -- Métricas de calidad
        AVG(CASE WHEN fc.completado_a_tiempo THEN 100 ELSE 0 END) AS tasa_cumplimiento
        
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    JOIN dwh.dim_cliente dc ON fc.sk_cliente = dc.sk_cliente AND dc.es_actual
    JOIN dwh.dim_estado de ON fc.sk_estado_actual = de.sk_estado
    WHERE dt.fecha >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY 
        dt.anio, dt.mes, dt.anio_mes, dt.nombre_dia, dt.dia_semana,
        dc.tipo_cliente, de.nombre_estado
)
SELECT 
    anio_mes,
    tipo_cliente,
    num_contratos,
    TO_CHAR(ingresos, 'L999,999,999') AS ingresos,
    
    -- Eficiencia de Ingresos
    ROUND(ingresos / NULLIF(num_contratos, 0), 2) AS ingreso_por_contrato,
    ROUND(ingresos / NULLIF(dias_totales_trabajo, 0), 2) AS ingreso_por_dia_trabajo,
    ROUND(ingresos / NULLIF(total_muestras, 0), 2) AS ingreso_por_muestra,
    
    -- Eficiencia Operacional
    ROUND(total_muestras::NUMERIC / NULLIF(num_contratos, 0), 2) AS muestras_por_contrato,
    ROUND(dias_totales_trabajo::NUMERIC / NULLIF(num_contratos, 0), 2) AS dias_por_contrato,
    ROUND(duracion_promedio, 1) AS duracion_promedio_dias,
    
    -- Eficiencia de Personal
    ROUND(ingresos / NULLIF(personal_utilizado, 0), 2) AS ingreso_por_empleado,
    ROUND(num_contratos::NUMERIC / NULLIF(personal_utilizado, 0), 2) AS contratos_por_empleado,
    
    -- Índice de Eficiencia Compuesto (IEC)
    -- Normalizado: Ingresos altos + Tiempo bajo + Calidad alta = Mejor
    ROUND(
        (
            (ingresos / NULLIF(num_contratos, 0)) / 150000 * 0.4 +  -- 40% peso en ingresos
            (30 / NULLIF(duracion_promedio, 0)) * 0.3 +  -- 30% peso en velocidad
            (tasa_cumplimiento / 100) * 0.3  -- 30% peso en calidad
        ) * 100,
        2
    ) AS indice_eficiencia_compuesto,
    
    ROUND(tasa_cumplimiento, 1) || '%' AS cumplimiento_sla,
    
    -- Benchmark contra promedio general
    ROUND(
        (ingresos / NULLIF(num_contratos, 0)) / 
        (SELECT AVG(ingresos / NULLIF(num_contratos, 0)) FROM base_eficiencia) * 100,
        2
    ) AS index_vs_promedio,
    
    -- Ranking de eficiencia
    RANK() OVER (
        PARTITION BY anio_mes 
        ORDER BY (
            (ingresos / NULLIF(num_contratos, 0)) / 150000 * 0.4 +
            (30 / NULLIF(duracion_promedio, 0)) * 0.3 +
            (tasa_cumplimiento / 100) * 0.3
        ) DESC
    ) AS ranking_eficiencia_mes,
    
    -- Clasificación
    CASE 
        WHEN (
            (ingresos / NULLIF(num_contratos, 0)) / 150000 * 0.4 +
            (30 / NULLIF(duracion_promedio, 0)) * 0.3 +
            (tasa_cumplimiento / 100) * 0.3
        ) >= 0.8 THEN 'ALTA EFICIENCIA'
        WHEN (
            (ingresos / NULLIF(num_contratos, 0)) / 150000 * 0.4 +
            (30 / NULLIF(duracion_promedio, 0)) * 0.3 +
            (tasa_cumplimiento / 100) * 0.3
        ) >= 0.6 THEN 'EFICIENCIA MEDIA'
        ELSE 'BAJA EFICIENCIA'
    END AS clasificacion_eficiencia

FROM base_eficiencia
ORDER BY anio_mes DESC, indice_eficiencia_compuesto DESC;
```
::
**Uso Estratégico:**

- Identificar períodos/segmentos más eficientes
- Replicar best practices de alta eficiencia
- Asignar recursos a segmentos más rentables

---

## PARTE VI: Análisis Predictivo con SQL

### Reporte 11: Modelo de Regresión Lineal Simple con SQL

::code-collapse
```sql [vistasql.sql]
-- Regresión lineal para predecir ingresos futuros
WITH datos_historicos AS (
    SELECT 
        dt.anio * 12 + dt.mes AS mes_secuencial,  -- Convertir fecha a número secuencial
        dt.anio,
        dt.mes,
        dt.anio_mes,
        SUM(fc.monto_usd) AS ingresos
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    WHERE dt.fecha >= CURRENT_DATE - INTERVAL '24 months'
      AND dt.fecha < DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY dt.anio, dt.mes, dt.anio_mes
),
estadisticas AS (
    SELECT 
        COUNT(*) AS n,
        AVG(mes_secuencial) AS x_mean,
        AVG(ingresos) AS y_mean,
        SUM((mes_secuencial - AVG(mes_secuencial) OVER ()) * 
            (ingresos - AVG(ingresos) OVER ())) AS sum_xy_dev,
        SUM(POWER(mes_secuencial - AVG(mes_secuencial) OVER (), 2)) AS sum_x_dev_sq
    FROM datos_historicos
),
coeficientes AS (
    SELECT 
        sum_xy_dev / NULLIF(sum_x_dev_sq, 0) AS slope,
        y_mean - (sum_xy_dev / NULLIF(sum_x_dev_sq, 0)) * x_mean AS intercept,
        n,
        x_mean,
        y_mean
    FROM estadisticas
),
predicciones AS (
    SELECT 
        dh.mes_secuencial,
        dh.anio_mes,
        dh.ingresos AS ingresos_reales,
        
        -- Valor predicho: y = mx + b
        c.slope * dh.mes_secuencial + c.intercept AS ingresos_predichos,
        
        -- Error de predicción
        dh.ingresos - (c.slope * dh.mes_secuencial + c.intercept) AS error,
        
        -- Error porcentual
        ABS(dh.ingresos - (c.slope * dh.mes_secuencial + c.intercept)) / 
        NULLIF(dh.ingresos, 0) * 100 AS error_porcentual
        
    FROM datos_historicos dh
    CROSS JOIN coeficientes c
),
metricas_modelo AS (
    SELECT 
        -- R-squared (coeficiente de determinación)
        1 - (SUM(POWER(error, 2)) / 
             SUM(POWER(ingresos_reales - (SELECT AVG(ingresos_reales) FROM predicciones), 2))
        ) AS r_squared,
        
        -- RMSE (Root Mean Square Error)
        SQRT(AVG(POWER(error, 2))) AS rmse,
        
        -- MAE (Mean Absolute Error)
        AVG(ABS(error)) AS mae,
        
        -- MAPE (Mean Absolute Percentage Error)
        AVG(error_porcentual) AS mape
        
    FROM predicciones
)
SELECT 
    'ACTUAL' AS tipo,
    p.anio_mes,
    TO_CHAR(p.ingresos_reales, 'L999,999,999') AS ingresos,
    TO_CHAR(p.ingresos_predichos, 'L999,999,999') AS prediccion,
    ROUND(p.error_porcentual, 2) || '%' AS error_pct,
    NULL::TEXT AS confianza
FROM predicciones p
ORDER BY p.mes_secuencial DESC
LIMIT 12

UNION ALL

-- Proyecciones futuras (próximos 6 meses)
SELECT 
    'PROYECCION' AS tipo,
    TO_CHAR(DATE_TRUNC('month', CURRENT_DATE) + (n || ' months')::INTERVAL, 'YYYY-MM') AS anio_mes,
    NULL AS ingresos_reales,
    TO_CHAR(
        c.slope * (EXTRACT(YEAR FROM CURRENT_DATE) * 12 + EXTRACT(MONTH FROM CURRENT_DATE) + n) + c.intercept,
        'L999,999,999'
    ) AS prediccion,
    NULL AS error_pct,
    CASE 
        WHEN n <= 3 THEN 'ALTA'
        WHEN n <= 6 THEN 'MEDIA'
        ELSE 'BAJA'
    END AS confianza
FROM generate_series(1, 6) AS n
CROSS JOIN coeficientes c

UNION ALL

-- Métricas del modelo
SELECT 
    'METRICAS MODELO' AS tipo,
    'R-Squared: ' || ROUND(mm.r_squared::NUMERIC, 4) || 
    ' | RMSE: ' || ROUND(mm.rmse, 0) ||
    ' | MAPE: ' || ROUND(mm.mape, 2) || '%' AS anio_mes,
    NULL, NULL, NULL,
    CASE 
        WHEN mm.r_squared >= 0.9 THEN 'EXCELENTE'
        WHEN mm.r_squared >= 0.7 THEN 'BUENO'
        WHEN mm.r_squared >= 0.5 THEN 'ACEPTABLE'
        ELSE 'POBRE'
    END AS calidad_modelo
FROM metricas_modelo mm;
```
::
**Interpretación:**

- **R-squared > 0.8**: Modelo explica bien la varianza
- **MAPE < 10%**: Predicciones precisas
- **Confianza decae con horizonte**: Proyecciones a 3+ meses menos confiables

---

## PARTE VII: Dashboard Financiero Integrado

### Reporte 12: Dashboard CFO - Vista 360 Grados
::code-collapse
```sql [vistasql.sql]
-- Dashboard financiero completo para CFO
WITH kpis_financieros AS (
    -- Mes actual
    SELECT 
        'MES ACTUAL' AS periodo,
        SUM(fc.monto_usd) AS ingresos,
        SUM(fc.monto_usd * 0.60) AS costo_estimado,
        SUM(fc.monto_usd * 0.40) AS utilidad_bruta,
        COUNT(DISTINCT fc.id_contrato) AS num_contratos,
        COUNT(DISTINCT fc.sk_cliente) AS clientes_activos,
        AVG(fc.monto_usd) AS ticket_promedio
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    WHERE dt.anio = EXTRACT(YEAR FROM CURRENT_DATE)
      AND dt.mes = EXTRACT(MONTH FROM CURRENT_DATE)
),
kpis_ytd AS (
    -- Year to date
    SELECT 
        'YTD' AS periodo,
        SUM(fc.monto_usd) AS ingresos,
        SUM(fc.monto_usd * 0.60) AS costo_estimado,
        SUM(fc.monto_usd * 0.40) AS utilidad_bruta,
        COUNT(DISTINCT fc.id_contrato) AS num_contratos,
        COUNT(DISTINCT fc.sk_cliente) AS clientes_activos,
        AVG(fc.monto_usd) AS ticket_promedio
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    WHERE dt.anio = EXTRACT(YEAR FROM CURRENT_DATE)
),
kpis_comparativos AS (
    SELECT * FROM kpis_financieros
    UNION ALL
    SELECT * FROM kpis_ytd
),
ratios_financieros AS (
    SELECT 
        -- Margen Bruto
        ROUND(AVG(utilidad_bruta / NULLIF(ingresos, 0) * 100), 2) AS margen_bruto_pct,
        
        -- Crecimiento YoY
        ROUND(
            (MAX(CASE WHEN periodo = 'YTD' THEN ingresos END) - 
             (SELECT SUM(fc2.monto_usd)
              FROM dwh.fact_contrato fc2
              JOIN dwh.dim_tiempo dt2 ON fc2.sk_fecha_inicio = dt2.sk_tiempo
              WHERE dt2.anio = EXTRACT(YEAR FROM CURRENT_DATE) - 1
                AND dt2.mes <= EXTRACT(MONTH FROM CURRENT_DATE)
             )
            ) / NULLIF(
                (SELECT SUM(fc2.monto_usd)
                 FROM dwh.fact_contrato fc2
                 JOIN dwh.dim_tiempo dt2 ON fc2.sk_fecha_inicio = dt2.sk_tiempo
                 WHERE dt2.anio = EXTRACT(YEAR FROM CURRENT_DATE) - 1
                   AND dt2.mes <= EXTRACT(MONTH FROM CURRENT_DATE)
                ), 0
            ) * 100,
            2
        ) AS crecimiento_yoy_pct,
        
        -- Run Rate Anual
        MAX(CASE WHEN periodo = 'MES ACTUAL' THEN ingresos END) * 12 AS run_rate_anual
        
    FROM kpis_comparativos
),
proyeccion_anual AS (
    SELECT 
        SUM(fc.monto_usd) AS ytd_real,
        (SUM(fc.monto_usd) / EXTRACT(MONTH FROM CURRENT_DATE)) * 12 AS proyeccion_lineal,
        -- Meta anual (ejemplo: 10M USD)
        10000000 AS meta_anual
    FROM dwh.fact_contrato fc
    JOIN dwh.dim_tiempo dt ON fc.sk_fecha_inicio = dt.sk_tiempo
    WHERE dt.anio = EXTRACT(YEAR FROM CURRENT_DATE)
)
SELECT 
    '=== RESUMEN EJECUTIVO ===' AS seccion,
    NULL AS metrica,
    NULL AS valor_actual,
    NULL AS valor_comparativo,
    NULL AS variacion

UNION ALL

SELECT 
    'INGRESOS',
    periodo,
    TO_CHAR(ingresos, 'L999,999,999'),
    CASE 
        WHEN periodo = 'MES ACTUAL' THEN 
            TO_CHAR(LAG(ingresos) OVER (ORDER BY periodo DESC), 'L999,999,999')
        ELSE NULL
    END,
    CASE 
        WHEN periodo = 'MES ACTUAL' THEN 
            ROUND(
                (ingresos - LAG(ingresos) OVER (ORDER BY periodo DESC)) / 
                NULLIF(LAG(ingresos) OVER (ORDER BY periodo DESC), 0) * 100,
                2
            ) || '%'
        ELSE NULL
    END
FROM kpis_comparativos

UNION ALL

SELECT 
    'UTILIDAD BRUTA',
    periodo,
    TO_CHAR(utilidad_bruta, 'L999,999,999'),
    NULL,
    ROUND(utilidad_bruta / NULLIF(ingresos, 0) * 100, 2) || '%'
FROM kpis_comparativos

UNION ALL

SELECT 
    'CLIENTES ACTIVOS',
    periodo,
    clientes_activos::TEXT,
    NULL,
    NULL
FROM kpis_comparativos

UNION ALL

SELECT 
    '=== RATIOS CLAVE ===',
    NULL, NULL, NULL, NULL

UNION ALL

SELECT 
    'MARGEN BRUTO',
    NULL,
    margen_bruto_pct || '%',
    'Target: 40%',
    CASE 
        WHEN margen_bruto_pct >= 40 THEN 'CUMPLE'
        ELSE 'BAJO TARGET'
    END
FROM ratios_financieros

UNION ALL

SELECT 
    'CRECIMIENTO YoY',
    NULL,
    crecimiento_yoy_pct || '%',
    'Target: 20%',
    CASE 
        WHEN crecimiento_yoy_pct >= 20 THEN 'CUMPLE'
        ELSE 'BAJO TARGET'
    END
FROM ratios_financieros

UNION ALL

SELECT 
    'RUN RATE ANUAL',
    NULL,
    TO_CHAR(run_rate_anual, 'L999,999,999'),
    NULL,
    NULL
FROM ratios_financieros

UNION ALL

SELECT 
    '=== PROYECCION ANUAL ===',
    NULL, NULL, NULL, NULL

UNION ALL

SELECT 
    'YTD REAL',
    NULL,
    TO_CHAR(ytd_real, 'L999,999,999'),
    TO_CHAR(meta_anual, 'L999,999,999'),
    ROUND(ytd_real / meta_anual * 100, 2) || '% de meta'
FROM proyeccion_anual

UNION ALL

SELECT 
    'PROYECCION FIN DE AÑO',
    NULL,
    TO_CHAR(proyeccion_lineal, 'L999,999,999'),
    TO_CHAR(meta_anual, 'L999,999,999'),
    CASE 
        WHEN proyeccion_lineal >= meta_anual THEN 'SUPERA META'
        WHEN proyeccion_lineal >= meta_anual * 0.9 THEN 'CERCA DE META'
        ELSE 'DEBAJO DE META'
    END
FROM proyeccion_anual;
```
::
---

## Conclusión

Este artículo ha cubierto técnicas avanzadas de SQL para análisis financiero y de negocio:

**Técnicas SQL:**

- Window functions (ROW_NUMBER, RANK, LAG, LEAD)
- CTEs recursivos para jerarquías
- Análisis de regresión lineal
- Agregaciones complejas multi-nivel

**KPIs Financieros:**

- Margen de contribución y utilidad neta
- ROI y payback period
- Punto de equilibrio
- Ciclo de conversión de efectivo
- CAC y LTV
- Churn rate y revenue retention

**KPIs Operacionales:**

- Eficiencia multi-dimensional
- Índices compuestos de performance
- Análisis de cohortes
- Viral coefficient

Estos reportes proveen la base para toma de decisiones data-driven en cualquier organización que maneje contratos de servicios, retail, o modelos de negocio recurrente.
