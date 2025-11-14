---
title: "SQL JOINs"
date: "2025-10-"
description: "Los JOINs son una de las operaciones más poderosas en SQL."
tags: [ "Django", "Python", "Web Development",'ORM' ]
name: "ORM de Django "
author: "raulanto"
author_avatar: 'https://avatars.githubusercontent.com/u/74162376?v=4'
author_description: "Desarrollador Full Stack"
thumbnail: /blog/sqljoins.png
---

# Guía Completa de SQL JOINs: De Básico a Avanzado

Los JOINs son una de las operaciones más poderosas en SQL, permitiéndonos combinar datos de múltiples tablas
relacionadas. Dominar los diferentes tipos de JOIN es esencial para cualquier desarrollador que trabaje con bases de
datos relacionales.


---

## 1. INNER JOIN

### ¿Qué hace?

Retorna **únicamente los registros que tienen coincidencias en ambas tablas**. Es como una intersección en teoría de
conjuntos.

::tip
**¿Cuándo usarlo?**

-  Cuando necesitas solo los datos que existen en ambas tablas
-  Para consultas donde la relación es obligatoria
-  Cuando quieres filtrar automáticamente registros huérfanos
-  Para reportes que solo incluyen datos completos
::
::caution 
**¿Cuándo NO usarlo?**

-  Si necesitas ver registros sin relaciones
-  Cuando los datos faltantes son importantes para el análisis
-  En reportes de auditoría donde necesitas identificar registros incompletos
::
### Preguntas que responde:

- _"¿Qué empleados tienen un departamento asignado?"_
- _"¿Qué productos se han vendido?"_
- _"¿Qué proyectos tienen tareas asignadas?"_

```sql
-- ¿Qué empleados trabajan en qué departamentos?
SELECT 
    e.nombre,
    e.apellido,
    e.puesto,
    d.nombre_departamento,
    d.ubicacion
FROM empleados e
INNER JOIN departamentos d ON e.departamento_id = d.id;
```



**Resultado**

| nombre | apellido | puesto | nombre\_departamento | ubicacion |
| :--- | :--- | :--- | :--- | :--- |
| Juan | Pérez | Director de Tecnología | Tecnología | Edificio A - Piso 3 |
| María | González | Desarrollador Senior | Tecnología | Edificio A - Piso 3 |
| Carlos | Rodríguez | Gerente de Ventas | Ventas | Edificio B - Piso 1 |
| Ana | Martínez | Ejecutivo de Ventas | Ventas | Edificio B - Piso 1 |
| Luis | López | Jefe de Marketing | Marketing | Edificio B - Piso 2 |

::tip
Solo muestra empleados que tienen un `departamento_id` asignado.
::

::warning
Si un empleado no tiene `departamento_id`, no aparece en el resultado.
::

---

### Ejemplo Complejo - Sistema de Gestión de Proyectos:

```sql
SELECT 
    p.nombre_proyecto,
    p.fecha_inicio,
    p.presupuesto,
    c.nombre_cliente,
    c.email AS email_cliente,
    c.segmento,
    e.nombre AS responsable,
    e.email AS email_responsable,
    d.nombre_departamento,
    COUNT(DISTINCT t.id) AS total_tareas,
    SUM(t.horas_estimadas) AS horas_totales,
    AVG(t.progreso) AS progreso_promedio,
    SUM(CASE WHEN t.estado = 'completada' THEN 1 ELSE 0 END) AS tareas_completadas
FROM proyectos p
INNER JOIN clientes c ON p.cliente_id = c.id
INNER JOIN empleados e ON p.responsable_id = e.id
INNER JOIN departamentos d ON e.departamento_id = d.id
INNER JOIN tareas t ON t.proyecto_id = p.id
WHERE p.estado = 'activo'
    AND t.fecha_vencimiento >= DATE('now')
GROUP BY p.id, p.nombre_proyecto, p.fecha_inicio, p.presupuesto,
         c.nombre_cliente, c.email, c.segmento,
         e.nombre, e.email, d.nombre_departamento
HAVING AVG(t.progreso) < 75
ORDER BY progreso_promedio ASC;
```
::tip
**¿Qué responde esta consulta?**

- Proyectos activos con bajo progreso que necesitan atención
- Solo incluye proyectos que tienen cliente, responsable, departamento y tareas asignadas
- Útil para identificar proyectos en riesgo de incumplimiento
::
**Resultado**

| nombre\_proyecto | fecha\_inicio | presupuesto | nombre\_cliente | email\_cliente | segmento | responsable | email\_responsable | nombre\_departamento | total\_tareas | horas\_totales | progreso\_promedio | tareas\_completadas |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Sistema de Gestión Empresarial | 2024-01-15 | 150000.00 | Corporativo ABC | contacto@abc.com | Premium | Juan | juan.perez@empresa.com | Tecnología | 7 | 620 | 61.42857142857143 | 2 |
| Campaña Marketing Digital Q2 | 2024-04-01 | 45000.00 | Comercial XYZ | ventas@xyz.com | Regular | Luis | luis.lopez@empresa.com | Marketing | 6 | 280 | 67.5 | 1 |
| Migración a la Nube | 2024-03-01 | 120000.00 | Tech Solutions | info@techsolutions.com | Premium | Juan | juan.perez@empresa.com | Tecnología | 8 | 470 | 57.5 | 2 |
| Aplicación Móvil E-commerce | 2024-02-15 | 85000.00 | Supermercados Unidos | compras@unidos.com | Premium | María | maria.gonzalez@empresa.com | Tecnología | 7 | 610 | 62.142857142857146 | 1 |
| Rediseño Portal Web | 2024-05-01 | 35000.00 | Empresa MNO | admin@mno.com | Premium | Carmen | carmen.ortiz@empresa.com | Tecnología | 7 | 380 | 50 | 1 |


---

## 2. LEFT JOIN (LEFT OUTER JOIN)

### ¿Qué hace?

Retorna **todos los registros de la tabla izquierda** y los registros coincidentes de la tabla derecha. Si no hay coincidencia, retorna `NULL` en las columnas de la tabla derecha.

::note 
¿Cuándo usarlo?

-  Cuando necesitas todos los registros de la tabla principal, independientemente de si tienen relaciones
-  Para identificar registros sin relaciones (usando `WHERE columna_derecha IS NULL`)
-  En reportes donde los datos faltantes son importantes
-  Para análisis de cobertura o completitud de datos
::
::caution
 ¿Cuándo NO usarlo?

-  Si solo necesitas registros con relaciones completas (usa INNER JOIN)
-  Cuando los datos sin relación no son relevantes para el análisis
::

::tip
Preguntas que responde:

- _"¿Qué clientes no han realizado compras?"_
- _"¿Qué empleados no tienen departamento asignado?"_
- _"¿Qué productos nunca se han vendido?"_
- _"¿Cuál es el estado de TODOS mis clientes, incluso los inactivos?"_
::

### Ejemplo Básico:

```sql
-- Mostrar TODOS los empleados, tengan o no departamento
SELECT 
    e.nombre,
    e.apellido,
    e.puesto,
    d.nombre_departamento,
    CASE 
        WHEN d.id IS NULL THEN 'Sin Departamento'
        ELSE 'Asignado'
    END AS estado_asignacion
FROM empleados e
LEFT JOIN departamentos d ON e.departamento_id = d.id;
```

**Resultado:** 






| nombre | apellido | puesto | nombre\_departamento | estado\_asignacion |
| :--- | :--- | :--- | :--- | :--- |
| Juan | Pérez | Director de Tecnología | Tecnología | Asignado |
| Carlos | Rodríguez | Gerente de Ventas | Ventas | Asignado |
| Luis | López | Jefe de Marketing | Marketing | Asignado |
| Patricia | Sánchez | Directora de RRHH | Recursos Humanos | Asignado |
| Roberto | Fernández | Director Financiero | Finanzas | Asignado |
| María | González | Desarrollador Senior | Tecnología | Asignado |

::note
Muestra todos los empleados, incluso aquellos sin departamento (aparecerán con `NULL` en `nombre_departamento`).
::
### Ejemplo Complejo - Sistema de Análisis de Ventas:

```sql
SELECT 
    c.id,
    c.nombre_cliente,
    c.email,
    c.fecha_registro,
    c.segmento,
    COUNT(DISTINCT v.id) AS total_ventas,
    COALESCE(SUM(v.monto_total), 0) AS ingresos_totales,
    COALESCE(AVG(v.monto_total), 0) AS ticket_promedio,
    MAX(v.fecha_venta) AS ultima_compra,
    CAST((julianday('now') - julianday(MAX(v.fecha_venta))) AS INTEGER) AS dias_sin_comprar,
    CASE 
        WHEN COUNT(v.id) = 0 THEN 'Sin Compras'
        WHEN (julianday('now') - julianday(MAX(v.fecha_venta))) > 90 THEN 'Inactivo'
        WHEN (julianday('now') - julianday(MAX(v.fecha_venta))) > 30 THEN 'En Riesgo'
        ELSE 'Activo'
    END AS estado_cliente
FROM clientes c
LEFT JOIN ventas v ON c.id = v.cliente_id 
    AND v.fecha_venta >= DATE('now', '-1 year')
GROUP BY c.id, c.nombre_cliente, c.email, c.fecha_registro, c.segmento
ORDER BY ingresos_totales DESC;
```
Resultado

| id | nombre\_cliente | email | fecha\_registro | segmento | total\_ventas | ingresos\_totales | ticket\_promedio | ultima\_compra | dias\_sin\_comprar | estado\_cliente |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Corporativo ABC | contacto@abc.com | 2023-01-10 | Premium | 0 | 0 | 0 | null | null | Sin Compras |
| 2 | Comercial XYZ | ventas@xyz.com | 2023-03-15 | Regular | 0 | 0 | 0 | null | null | Sin Compras |
| 3 | Tienda El Ahorro | info@elahorro.com | 2024-01-20 | Nuevo | 0 | 0 | 0 | null | null | Sin Compras |


::tip
**¿Qué responde esta consulta?**

- Estado de TODOS los clientes, incluso los que nunca han comprado
- Identifica clientes inactivos o en riesgo de abandonar
- Perfecto para campañas de reactivación o seguimiento comercial
::

### Identificar registros huérfanos:

```sql
-- ¿Qué empleados NO tienen departamento asignado?
SELECT 
    e.id,
    e.nombre,
    e.apellido,
    e.email,
    e.fecha_contratacion
FROM empleados e
LEFT JOIN departamentos d ON e.departamento_id = d.id
WHERE d.id IS NULL;
```
::tip
**Uso práctico:** Auditoría de datos, identificar registros incompletos que necesitan corrección.
::


---

## 3. RIGHT JOIN (RIGHT OUTER JOIN)

### ¿Qué hace?

Es el **inverso del LEFT JOIN**. Retorna todos los registros de la tabla derecha y los coincidentes de la izquierda.

### ¿Cuándo usarlo?

-  Cuando la tabla principal está en el lado derecho de la consulta
-  Para mantener la legibilidad en consultas con múltiples JOINs
-  Cuando trabajas con código legacy que usa este patrón

### ¿Cuándo NO usarlo?

-  En la mayoría de los casos (puedes usar LEFT JOIN invirtiendo las tablas)
-  SQLite NO soporta RIGHT JOIN nativamente

### Preguntas que responde:

- _"¿Qué departamentos no tienen empleados?"_
- _"¿Qué productos en inventario no tienen movimientos?"_

### Ejemplo Básico:

```sql
-- Mostrar TODOS los departamentos, tengan o no empleados
-- (En SQLite, tendrías que usar LEFT JOIN invirtiendo las tablas)
SELECT 
    e.nombre,
    e.apellido,
    d.nombre_departamento,
    d.ubicacion
FROM empleados e
RIGHT JOIN departamentos d ON e.departamento_id = d.id;
```

**Nota:** Esto es para sql lite:

```sql
SELECT 
    e.nombre,
    e.apellido,
    d.nombre_departamento,
    d.ubicacion
FROM departamentos d
LEFT JOIN empleados e ON e.departamento_id = d.id;
```

### Ejemplo Complejo - Sistema de Inventario:

```sql
SELECT 
    p.codigo_producto,
    p.nombre_producto,
    p.categoria,
    p.stock_minimo,
    COALESCE(i.cantidad_actual, 0) AS stock_actual,
    COALESCE(SUM(m.cantidad), 0) AS movimientos_mes,
    CASE 
        WHEN i.cantidad_actual IS NULL THEN 'Sin Inventario'
        WHEN i.cantidad_actual < p.stock_minimo THEN 'Crítico'
        WHEN i.cantidad_actual < p.stock_minimo * 2 THEN 'Bajo'
        ELSE 'Óptimo'
    END AS estado_inventario
FROM movimientos_inventario m
RIGHT JOIN productos p ON m.producto_id = p.id
    AND m.fecha_movimiento >= DATE('now', '-1 month')
LEFT JOIN inventario_actual i ON p.id = i.producto_id
GROUP BY p.id, p.codigo_producto, p.nombre_producto, p.categoria, p.stock_minimo, i.cantidad_actual
HAVING estado_inventario IN ('Sin Inventario', 'Crítico', 'Bajo')
ORDER BY estado_inventario, p.categoria;
```

**SQLite equivalente:**

```sql
SELECT 
    p.codigo_producto,
    p.nombre_producto,
    p.categoria,
    p.stock_minimo,
    COALESCE(i.cantidad_actual, 0) AS stock_actual,
    COALESCE(SUM(m.cantidad), 0) AS movimientos_mes,
    CASE 
        WHEN i.cantidad_actual IS NULL THEN 'Sin Inventario'
        WHEN i.cantidad_actual < p.stock_minimo THEN 'Crítico'
        WHEN i.cantidad_actual < p.stock_minimo * 2 THEN 'Bajo'
        ELSE 'Óptimo'
    END AS estado_inventario
FROM productos p
LEFT JOIN movimientos_inventario m ON m.producto_id = p.id
    AND m.fecha_movimiento >= DATE('now', '-1 month')
LEFT JOIN inventario_actual i ON p.id = i.producto_id
GROUP BY p.id, p.codigo_producto, p.nombre_producto, p.categoria, p.stock_minimo, i.cantidad_actual
HAVING estado_inventario IN ('Sin Inventario', 'Crítico', 'Bajo')
ORDER BY estado_inventario, p.categoria;
```
::tip
**¿Qué responde esta consulta?**

- TODOS los productos en el catálogo
- Identifica productos sin inventario o con stock crítico
- Útil para órdenes de compra y gestión de almacén
::