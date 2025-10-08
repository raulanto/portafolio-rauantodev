<template>
    <client-only>
        <div ref="containerRef" class="plasma-container "></div>
    </client-only>

</template>

<script setup>
import { ref, shallowRef, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
    color: {
        type: String,
        default: '#00ffff'
    },
    speed: {
        type: Number,
        default: 1
    },
    direction: {
        type: String,
        default: 'forward',
        validator: (value) => ['forward', 'reverse', 'pingpong'].includes(value)
    },
    scale: {
        type: Number,
        default: 1
    },
    opacity: {
        type: Number,
        default: 1
    },
    mouseInteractive: {
        type: Boolean,
        default: false
    },
    pauseWhenHidden: {
        type: Boolean,
        default: true
    }
})

const containerRef = ref(null)
const plasma = shallowRef(null)

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return [1, 0.5, 0.2]
    return [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ]
}

const vertexShaderSource = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShaderSource = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);

  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y));
    p.z -= 4.;
    S = p;
    d = p.y-T;

    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T));
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4;
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }

  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}
`

class PlasmaEffect {
    constructor(container, options) {
        this.container = container
        this.options = options
        this.mousePos = { x: 0, y: 0 }
        this.isVisible = true
        this.resizeTimeout = null
        this.lastFrameTime = 0
        this.targetFPS = 60
        this.frameInterval = 1000 / this.targetFPS
        this.init()
    }

    createShader(gl, type, source) {
        const shader = gl.createShader(type)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Error compilando shader:', gl.getShaderInfoLog(shader))
            gl.deleteShader(shader)
            return null
        }

        return shader
    }

    init() {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl2', {
            alpha: true,
            antialias: false,
            powerPreference: 'high-performance',
            desynchronized: true
        })

        if (!gl) {
            console.error('WebGL2 no disponible')
            return
        }

        this.gl = gl
        this.canvas = canvas
        canvas.style.display = 'block'
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        this.container.appendChild(canvas)

        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

        this.program = gl.createProgram()
        gl.attachShader(this.program, vertexShader)
        gl.attachShader(this.program, fragmentShader)
        gl.linkProgram(this.program)

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Error enlazando programa:', gl.getProgramInfoLog(this.program))
            return
        }

        gl.useProgram(this.program)

        // Geometría optimizada
        const positions = new Float32Array([
            -1, -1,
            -1, 4,
            4, -1
        ])

        const uvs = new Float32Array([
            0, 0,
            0, 2,
            2, 0
        ])

        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

        const positionLoc = gl.getAttribLocation(this.program, 'position')
        gl.enableVertexAttribArray(positionLoc)
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

        const uvBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW)

        const uvLoc = gl.getAttribLocation(this.program, 'uv')
        gl.enableVertexAttribArray(uvLoc)
        gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0)

        // Cachear las ubicaciones de uniforms
        this.uniforms = {
            iTime: gl.getUniformLocation(this.program, 'iTime'),
            iResolution: gl.getUniformLocation(this.program, 'iResolution'),
            uCustomColor: gl.getUniformLocation(this.program, 'uCustomColor'),
            uUseCustomColor: gl.getUniformLocation(this.program, 'uUseCustomColor'),
            uSpeed: gl.getUniformLocation(this.program, 'uSpeed'),
            uDirection: gl.getUniformLocation(this.program, 'uDirection'),
            uScale: gl.getUniformLocation(this.program, 'uScale'),
            uOpacity: gl.getUniformLocation(this.program, 'uOpacity'),
            uMouse: gl.getUniformLocation(this.program, 'uMouse'),
            uMouseInteractive: gl.getUniformLocation(this.program, 'uMouseInteractive')
        }

        this.updateUniforms()

        // Mouse event con throttle
        if (this.options.mouseInteractive) {
            let mouseFrame = null
            this.handleMouseMove = (e) => {
                if (mouseFrame) return
                mouseFrame = requestAnimationFrame(() => {
                    const rect = this.container.getBoundingClientRect()
                    this.mousePos.x = e.clientX - rect.left
                    this.mousePos.y = e.clientY - rect.top
                    gl.uniform2f(this.uniforms.uMouse, this.mousePos.x, this.mousePos.y)
                    mouseFrame = null
                })
            }
            this.container.addEventListener('mousemove', this.handleMouseMove, { passive: true })
        }

        this.setSize()

        // ResizeObserver con debounce
        this.resizeObserver = new ResizeObserver(() => {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout)
            }
            this.resizeTimeout = setTimeout(() => this.setSize(), 100)
        })
        this.resizeObserver.observe(this.container)

        // IntersectionObserver para pausar cuando no es visible
        if (this.options.pauseWhenHidden) {
            this.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    this.isVisible = entries[0].isIntersecting
                },
                { threshold: 0 }
            )
            this.intersectionObserver.observe(this.container)
        }

        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

        this.t0 = performance.now()
        this.animate()
    }

    updateUniforms() {
        const gl = this.gl
        const useCustomColor = this.options.color ? 1.0 : 0.0
        const customColorRgb = this.options.color ? hexToRgb(this.options.color) : [1, 1, 1]
        const directionMultiplier = this.options.direction === 'reverse' ? -1.0 : 1.0

        gl.uniform3f(this.uniforms.uCustomColor, ...customColorRgb)
        gl.uniform1f(this.uniforms.uUseCustomColor, useCustomColor)
        gl.uniform1f(this.uniforms.uSpeed, this.options.speed * 0.4)
        gl.uniform1f(this.uniforms.uDirection, directionMultiplier)
        gl.uniform1f(this.uniforms.uScale, this.options.scale)
        gl.uniform1f(this.uniforms.uOpacity, this.options.opacity)
        gl.uniform2f(this.uniforms.uMouse, 0, 0)
        gl.uniform1f(this.uniforms.uMouseInteractive, this.options.mouseInteractive ? 1.0 : 0.0)

        this.directionMultiplier = directionMultiplier
    }

    setSize() {
        const rect = this.container.getBoundingClientRect()
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const width = Math.max(1, Math.floor(rect.width * dpr))
        const height = Math.max(1, Math.floor(rect.height * dpr))

        this.canvas.width = width
        this.canvas.height = height

        this.gl.viewport(0, 0, width, height)
        this.gl.uniform2f(this.uniforms.iResolution, width, height)
    }

    animate(currentTime) {
        // Pausar si no es visible
        if (!this.isVisible) {
            this.raf = requestAnimationFrame((t) => this.animate(t))
            return
        }

        // Limitar FPS para mejor performance
        const elapsed = currentTime - this.lastFrameTime

        if (elapsed > this.frameInterval) {
            this.lastFrameTime = currentTime - (elapsed % this.frameInterval)

            const timeValue = (currentTime - this.t0) * 0.001

            if (this.options.direction === 'pingpong') {
                const cycle = Math.sin(timeValue * 0.3)
                this.gl.uniform1f(this.uniforms.uDirection, cycle)
            }

            this.gl.uniform1f(this.uniforms.iTime, timeValue)

            this.gl.clearColor(0, 0, 0, 0)
            this.gl.clear(this.gl.COLOR_BUFFER_BIT)
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 3)
        }

        this.raf = requestAnimationFrame((t) => this.animate(t))
    }

    dispose() {
        cancelAnimationFrame(this.raf)
        this.resizeObserver?.disconnect()
        this.intersectionObserver?.disconnect()

        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout)
        }

        if (this.options.mouseInteractive && this.handleMouseMove) {
            this.container.removeEventListener('mousemove', this.handleMouseMove)
        }

        if (this.canvas && this.canvas.parentElement === this.container) {
            this.container.removeChild(this.canvas)
        }

        // Limpiar recursos WebGL
        if (this.gl && this.program) {
            this.gl.deleteProgram(this.program)
        }
    }
}

onMounted(() => {
    nextTick(() => {
        if (containerRef.value) {
            plasma.value = new PlasmaEffect(containerRef.value, {
                color: props.color,
                speed: props.speed,
                direction: props.direction,
                scale: props.scale,
                opacity: props.opacity,
                mouseInteractive: props.mouseInteractive,
                pauseWhenHidden: props.pauseWhenHidden
            })
        }
    })
})

onUnmounted(() => {
    if (plasma.value) {
        plasma.value.dispose()
        plasma.value = null
    }
})

// Watch optimizado - solo observa las props que cambian
watch(() => props.color, (newColor) => {
    if (plasma.value) {
        plasma.value.options.color = newColor
        plasma.value.updateUniforms()
    }
})

watch(() => props.speed, (newSpeed) => {
    if (plasma.value) {
        plasma.value.options.speed = newSpeed
        plasma.value.updateUniforms()
    }
})

watch(() => props.direction, (newDirection) => {
    if (plasma.value) {
        plasma.value.options.direction = newDirection
        plasma.value.updateUniforms()
    }
})

watch(() => props.scale, (newScale) => {
    if (plasma.value) {
        plasma.value.options.scale = newScale
        plasma.value.updateUniforms()
    }
})

watch(() => props.opacity, (newOpacity) => {
    if (plasma.value) {
        plasma.value.options.opacity = newOpacity
        plasma.value.updateUniforms()
    }
})

watch(() => props.mouseInteractive, (newValue) => {
    if (plasma.value) {
        plasma.value.options.mouseInteractive = newValue
        plasma.value.updateUniforms()
    }
})
</script>

<style scoped>
.plasma-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}
</style>