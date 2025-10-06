---
title: "Golang Avanzado"
date: "2025-09-29"
description: "Dominando Concurrencia y Optimización de Memoria "
tags: ["Golan"]
name: "golang"
author: "raulanto"
author_avatar: 'https://avatars.githubusercontent.com/u/74162376?v=4'
author_description: "Desarrollador Full Stack "
thumbnail: /go.png
---

# Golang Avanzado: Dominando Concurrencia y Optimización de Memoria

## Introducción a Go

Go (Golang) es un lenguaje de programación de código abierto desarrollado por Google que destaca por su simplicidad, rendimiento y capacidades de concurrencia nativas. A diferencia de otros lenguajes, Go fue diseñado desde cero para aprovechar sistemas multinúcleo modernos.

## Parte 1: Concurrencia en Go

### ¿Qué es la Concurrencia?

La concurrencia es la capacidad de ejecutar múltiples tareas al mismo tiempo. Go hace esto increíblemente fácil con **goroutines** y **channels**.

### Goroutines: Hilos Ligeros

Las goroutines son funciones que se ejecutan concurrentemente con otras funciones. Son extremadamente ligeras (inician con solo ~2KB de memoria) comparadas con los threads del sistema operativo.

#### Ejemplo Básico de Goroutines

```go
package main

import (
    "fmt"
    "time"
)

func sayHello(name string) {
    for i := 0; i < 5; i++ {
        fmt.Printf("Hola %s! (%d)\n", name, i)
        time.Sleep(100 * time.Millisecond)
    }
}

func main() {
    // Ejecución secuencial
    sayHello("Juan")
    sayHello("María")
    
    fmt.Println("\n--- Ahora con goroutines ---\n")
    
    // Ejecución concurrente
    go sayHello("Pedro")
    go sayHello("Ana")
    
    // Esperar para ver los resultados
    time.Sleep(600 * time.Millisecond)
    fmt.Println("Programa finalizado")
}
```

**Resultado:** Las dos goroutines se ejecutan simultáneamente, intercalando sus mensajes.

### Channels: Comunicación entre Goroutines

Los channels son tuberías tipadas que permiten a las goroutines comunicarse de forma segura.

#### Channels Básicos

```go
package main

import (
    "fmt"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        fmt.Printf("Worker %d procesando job %d\n", id, job)
        time.Sleep(time.Second)
        results <- job * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    
    // Iniciar 3 workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
    
    // Enviar 9 trabajos
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)
    
    // Recoger resultados
    for a := 1; a <= 9; a++ {
        result := <-results
        fmt.Printf("Resultado recibido: %d\n", result)
    }
}
```

### Buffered vs Unbuffered Channels

```go
package main

import "fmt"

func main() {
    // Unbuffered channel (bloqueante)
    ch1 := make(chan int)
    
    // Buffered channel (no bloqueante hasta llenar el buffer)
    ch2 := make(chan int, 3)
    
    // Esto funcionaría solo con goroutine
    // ch1 <- 1 // Bloquearía aquí
    
    // Esto funciona sin goroutine
    ch2 <- 1
    ch2 <- 2
    ch2 <- 3
    
    fmt.Println(<-ch2) // 1
    fmt.Println(<-ch2) // 2
    fmt.Println(<-ch2) // 3
}
```

### Select: Multiplexación de Channels

El statement `select` permite esperar en múltiples operaciones de channels.

```go
package main

import (
    "fmt"
    "time"
)

func fibonacci(c, quit chan int) {
    x, y := 0, 1
    for {
        select {
        case c <- x:
            x, y = y, x+y
        case <-quit:
            fmt.Println("Finalizando...")
            return
        }
    }
}

func main() {
    c := make(chan int)
    quit := make(chan int)
    
    go func() {
        for i := 0; i < 10; i++ {
            fmt.Println(<-c)
        }
        quit <- 0
    }()
    
    fibonacci(c, quit)
}
```

### WaitGroup: Sincronización de Goroutines

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done() // Marcar como completado al finalizar
    
    fmt.Printf("Worker %d iniciando\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d finalizado\n", id)
}

func main() {
    var wg sync.WaitGroup
    
    for i := 1; i <= 5; i++ {
        wg.Add(1) // Incrementar contador
        go worker(i, &wg)
    }
    
    wg.Wait() // Esperar a que todos terminen
    fmt.Println("Todos los workers completados")
}
```

### Mutex: Protección de Datos Compartidos

```go
package main

import (
    "fmt"
    "sync"
)

type SafeCounter struct {
    mu    sync.Mutex
    count map[string]int
}

func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.count[key]++
}

func (c *SafeCounter) Value(key string) int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.count[key]
}

func main() {
    counter := SafeCounter{count: make(map[string]int)}
    var wg sync.WaitGroup
    
    // 1000 goroutines incrementando el contador
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            counter.Inc("visitas")
        }()
    }
    
    wg.Wait()
    fmt.Println("Total visitas:", counter.Value("visitas"))
}
```

### Patrón Producer-Consumer

```go
package main

import (
    "fmt"
    "math/rand"
    "sync"
    "time"
)

type Task struct {
    ID   int
    Data string
}

func producer(tasks chan<- Task, wg *sync.WaitGroup) {
    defer wg.Done()
    
    for i := 1; i <= 10; i++ {
        task := Task{
            ID:   i,
            Data: fmt.Sprintf("Tarea-%d", i),
        }
        fmt.Printf("Produciendo: %s\n", task.Data)
        tasks <- task
        time.Sleep(time.Duration(rand.Intn(500)) * time.Millisecond)
    }
}

func consumer(id int, tasks <-chan Task, wg *sync.WaitGroup) {
    defer wg.Done()
    
    for task := range tasks {
        fmt.Printf("Consumer %d procesando: %s\n", id, task.Data)
        time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)
    }
}

func main() {
    tasks := make(chan Task, 5)
    var producerWg sync.WaitGroup
    var consumerWg sync.WaitGroup
    
    // Iniciar producer
    producerWg.Add(1)
    go producer(tasks, &producerWg)
    
    // Iniciar 3 consumers
    for i := 1; i <= 3; i++ {
        consumerWg.Add(1)
        go consumer(i, tasks, &consumerWg)
    }
    
    // Esperar a que el producer termine
    producerWg.Wait()
    close(tasks)
    
    // Esperar a que todos los consumers terminen
    consumerWg.Wait()
    fmt.Println("Procesamiento completado")
}
```

### Context: Control de Cancelación y Timeouts

```go
package main

import (
    "context"
    "fmt"
    "time"
)

func operation(ctx context.Context, duration time.Duration) {
    select {
    case <-time.After(duration):
        fmt.Println("Operación completada")
    case <-ctx.Done():
        fmt.Println("Operación cancelada:", ctx.Err())
    }
}

func main() {
    // Context con timeout
    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
    defer cancel()
    
    fmt.Println("Iniciando operación con timeout de 2s...")
    operation(ctx, 3*time.Second)
    
    // Context con cancelación manual
    ctx2, cancel2 := context.WithCancel(context.Background())
    
    go func() {
        time.Sleep(1 * time.Second)
        cancel2() // Cancelar después de 1 segundo
    }()
    
    fmt.Println("\nIniciando operación con cancelación manual...")
    operation(ctx2, 3*time.Second)
}
```

## Parte 2: Optimización de Memoria

### Entendiendo la Gestión de Memoria en Go

Go utiliza un recolector de basura (Garbage Collector) automático, pero entender cómo funciona la memoria es crucial para escribir código eficiente.

### Stack vs Heap

```go
package main

import "fmt"

// Esto se almacena en el STACK (más rápido)
func stackAllocation() int {
    x := 42
    return x
}

// Esto PUEDE escaparse al HEAP
func heapAllocation() *int {
    x := 42
    return &x // El puntero escapa
}

func main() {
    a := stackAllocation()
    b := heapAllocation()
    
    fmt.Println(a, *b)
}
```

**Análisis de escape:**
```bash
go build -gcflags="-m" main.go
```

### Slices: Uso Eficiente de Memoria

```go
package main

import "fmt"

func inefficientSlice() []int {
    // Ineficiente: múltiples reasignaciones
    var nums []int
    for i := 0; i < 10000; i++ {
        nums = append(nums, i)
    }
    return nums
}

func efficientSlice() []int {
    // Eficiente: pre-asignar capacidad
    nums := make([]int, 0, 10000)
    for i := 0; i < 10000; i++ {
        nums = append(nums, i)
    }
    return nums
}

func main() {
    // Ver diferencia con benchmarks
    s1 := inefficientSlice()
    s2 := efficientSlice()
    
    fmt.Printf("Slice 1 len: %d, cap: %d\n", len(s1), cap(s1))
    fmt.Printf("Slice 2 len: %d, cap: %d\n", len(s2), cap(s2))
}
```

### String vs []byte: Optimización

```go
package main

import (
    "fmt"
    "strings"
)

func inefficientStringConcat(words []string) string {
    result := ""
    for _, word := range words {
        result += word + " " // Crea nueva string cada vez
    }
    return result
}

func efficientStringConcat(words []string) string {
    var builder strings.Builder
    for _, word := range words {
        builder.WriteString(word)
        builder.WriteString(" ")
    }
    return builder.String()
}

func main() {
    words := []string{"Go", "es", "increíble", "para", "concurrencia"}
    
    s1 := inefficientStringConcat(words)
    s2 := efficientStringConcat(words)
    
    fmt.Println(s1)
    fmt.Println(s2)
}
```

### Sync.Pool: Reutilización de Objetos

```go
package main

import (
    "bytes"
    "fmt"
    "sync"
)

var bufferPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func processData(data string) string {
    // Obtener buffer del pool
    buf := bufferPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset()
        bufferPool.Put(buf) // Devolver al pool
    }()
    
    buf.WriteString("Procesado: ")
    buf.WriteString(data)
    return buf.String()
}

func main() {
    var wg sync.WaitGroup
    
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            result := processData(fmt.Sprintf("dato-%d", id))
            fmt.Println(result)
        }(i)
    }
    
    wg.Wait()
}
```

### Estructuras Compactas: Alineación de Memoria

```go
package main

import (
    "fmt"
    "unsafe"
)

// Estructura mal alineada (24 bytes en arquitectura de 64 bits)
type BadStruct struct {
    a bool   // 1 byte + 7 padding
    b int64  // 8 bytes
    c bool   // 1 byte + 7 padding
}

// Estructura bien alineada (16 bytes)
type GoodStruct struct {
    b int64  // 8 bytes
    a bool   // 1 byte
    c bool   // 1 byte + 6 padding
}

func main() {
    fmt.Printf("BadStruct size: %d bytes\n", unsafe.Sizeof(BadStruct{}))
    fmt.Printf("GoodStruct size: %d bytes\n", unsafe.Sizeof(GoodStruct{}))
}
```

### Profiling de Memoria

```go
package main

import (
    "fmt"
    "runtime"
    "time"
)

func allocateMem() {
    data := make([][]int, 1000)
    for i := range data {
        data[i] = make([]int, 1000)
    }
    time.Sleep(2 * time.Second)
}

func printMemStats() {
    var m runtime.MemStats
    runtime.ReadMemStats(&m)
    
    fmt.Printf("Alloc = %v MB", bToMb(m.Alloc))
    fmt.Printf("\tTotalAlloc = %v MB", bToMb(m.TotalAlloc))
    fmt.Printf("\tSys = %v MB", bToMb(m.Sys))
    fmt.Printf("\tNumGC = %v\n", m.NumGC)
}

func bToMb(b uint64) uint64 {
    return b / 1024 / 1024
}

func main() {
    fmt.Println("Antes de allocateMem:")
    printMemStats()
    
    allocateMem()
    
    fmt.Println("\nDespués de allocateMem:")
    printMemStats()
    
    runtime.GC()
    
    fmt.Println("\nDespués de GC:")
    printMemStats()
}
```

## Patrones Avanzados de Concurrencia

### Worker Pool Pattern

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type Job struct {
    ID     int
    Params map[string]interface{}
}

type Result struct {
    JobID  int
    Output interface{}
    Error  error
}

type WorkerPool struct {
    workers    int
    jobs       chan Job
    results    chan Result
    wg         sync.WaitGroup
}

func NewWorkerPool(workers int) *WorkerPool {
    return &WorkerPool{
        workers: workers,
        jobs:    make(chan Job, 100),
        results: make(chan Result, 100),
    }
}

func (wp *WorkerPool) worker(id int) {
    defer wp.wg.Done()
    
    for job := range wp.jobs {
        fmt.Printf("Worker %d procesando job %d\n", id, job.ID)
        
        // Simular trabajo
        time.Sleep(500 * time.Millisecond)
        
        wp.results <- Result{
            JobID:  job.ID,
            Output: fmt.Sprintf("Resultado del job %d", job.ID),
            Error:  nil,
        }
    }
}

func (wp *WorkerPool) Start() {
    for i := 1; i <= wp.workers; i++ {
        wp.wg.Add(1)
        go wp.worker(i)
    }
}

func (wp *WorkerPool) Submit(job Job) {
    wp.jobs <- job
}

func (wp *WorkerPool) Close() {
    close(wp.jobs)
}

func (wp *WorkerPool) Wait() {
    wp.wg.Wait()
    close(wp.results)
}

func main() {
    pool := NewWorkerPool(3)
    pool.Start()
    
    // Enviar jobs
    go func() {
        for i := 1; i <= 10; i++ {
            pool.Submit(Job{
                ID:     i,
                Params: map[string]interface{}{"data": i * 10},
            })
        }
        pool.Close()
    }()
    
    // Recoger resultados
    go func() {
        for result := range pool.results {
            fmt.Printf("Resultado recibido: %v\n", result.Output)
        }
    }()
    
    pool.Wait()
    time.Sleep(100 * time.Millisecond)
    fmt.Println("Todos los jobs procesados")
}
```

### Pipeline Pattern

```go
package main

import "fmt"

func generator(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}

func filter(in <-chan int, predicate func(int) bool) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            if predicate(n) {
                out <- n
            }
        }
        close(out)
    }()
    return out
}

func main() {
    // Pipeline: generator -> square -> filter
    nums := generator(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    squared := square(nums)
    filtered := filter(squared, func(n int) bool {
        return n > 25 // Solo números > 25
    })
    
    for n := range filtered {
        fmt.Println(n)
    }
}
```

### Fan-Out, Fan-In Pattern

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func source() <-chan int {
    out := make(chan int)
    go func() {
        for i := 1; i <= 10; i++ {
            out <- i
            time.Sleep(100 * time.Millisecond)
        }
        close(out)
    }()
    return out
}

func worker(id int, in <-chan int) <-chan string {
    out := make(chan string)
    go func() {
        for num := range in {
            result := fmt.Sprintf("Worker %d procesó %d", id, num)
            time.Sleep(500 * time.Millisecond)
            out <- result
        }
        close(out)
    }()
    return out
}

func merge(channels ...<-chan string) <-chan string {
    var wg sync.WaitGroup
    out := make(chan string)
    
    output := func(c <-chan string) {
        defer wg.Done()
        for msg := range c {
            out <- msg
        }
    }
    
    wg.Add(len(channels))
    for _, c := range channels {
        go output(c)
    }
    
    go func() {
        wg.Wait()
        close(out)
    }()
    
    return out
}

func main() {
    src := source()
    
    // Fan-out: distribuir trabajo a 3 workers
    w1 := worker(1, src)
    w2 := worker(2, src)
    w3 := worker(3, src)
    
    // Fan-in: combinar resultados
    results := merge(w1, w2, w3)
    
    for result := range results {
        fmt.Println(result)
    }
}
```

## Benchmarking y Testing

### Benchmark de Concurrencia

```go
package main

import (
    "sync"
    "testing"
)

func sequentialSum(n int) int {
    sum := 0
    for i := 0; i <= n; i++ {
        sum += i
    }
    return sum
}

func concurrentSum(n int, workers int) int {
    var wg sync.WaitGroup
    var mu sync.Mutex
    sum := 0
    chunkSize := n / workers
    
    for i := 0; i < workers; i++ {
        wg.Add(1)
        start := i * chunkSize
        end := start + chunkSize
        
        go func(s, e int) {
            defer wg.Done()
            localSum := 0
            for j := s; j < e; j++ {
                localSum += j
            }
            mu.Lock()
            sum += localSum
            mu.Unlock()
        }(start, end)
    }
    
    wg.Wait()
    return sum
}

func BenchmarkSequential(b *testing.B) {
    for i := 0; i < b.N; i++ {
        sequentialSum(1000000)
    }
}

func BenchmarkConcurrent(b *testing.B) {
    for i := 0; i < b.N; i++ {
        concurrentSum(1000000, 4)
    }
}
```

**Ejecutar benchmarks:**
```bash
go test -bench=. -benchmem
```

## Mejores Prácticas

### 1. Evitar Goroutine Leaks

```go
// MAL - Goroutine leak
func badFunction() {
    ch := make(chan int)
    go func() {
        ch <- 1 // Se bloquea eternamente si nadie lee
    }()
    // La goroutine nunca termina
}

// BIEN - Usar buffered channel o leer el valor
func goodFunction() {
    ch := make(chan int, 1)
    go func() {
        ch <- 1 // No se bloquea
    }()
}
```

### 2. Usar defer con Mutex

```go
func (c *Counter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock() // Garantiza unlock incluso con panic
    c.count++
}
```

### 3. Limitar el Número de Goroutines

```go
func processItems(items []Item) {
    sem := make(chan struct{}, 10) // Máximo 10 goroutines
    
    for _, item := range items {
        sem <- struct{}{} // Adquirir
        go func(i Item) {
            defer func() { <-sem }() // Liberar
            process(i)
        }(item)
    }
}
```

## Conclusión

Go ofrece herramientas poderosas para concurrencia y optimización de memoria:

**Concurrencia:**
- ✅ Goroutines ligeras y eficientes
- ✅ Channels para comunicación segura
- ✅ Primitivas de sincronización (WaitGroup, Mutex)
- ✅ Patrones avanzados (Worker Pool, Pipeline, Fan-Out/Fan-In)

**Memoria:**
- ✅ Entender Stack vs Heap
- ✅ Pre-asignar capacidad en slices
- ✅ Usar strings.Builder para concatenación
- ✅ sync.Pool para reutilización
- ✅ Optimizar alineación de estructuras

