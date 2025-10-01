<script setup lang="ts">
import {onMounted, ref} from 'vue'

const keypadRef = ref<HTMLElement | null>(null)
const exploded = ref(false)
const muted = ref(false)

const keys = ref({
    one: {
        travel: 26,
        text: 'ok',
        key: 'o',
        hue: 114,
        saturation: 1.4,
        brightness: 1.2,
        pressed: false
    },
    two: {
        travel: 26,
        text: 'go',
        key: 'g',
        hue: 0,
        saturation: 0,
        brightness: 1.4,
        pressed: false
    },
    three: {
        travel: 18,
        text: 'create.',
        key: 'Enter',
        hue: 0,
        saturation: 0,
        brightness: 0.4,
        pressed: false
    }
})

let clickAudio: HTMLAudioElement | null = null

onMounted(() => {
    clickAudio = new Audio('https://cdn.freesound.org/previews/378/378085_6260145-lq.mp3')
    if (clickAudio) clickAudio.muted = muted.value

    // Show keypad with animation
    setTimeout(() => {
        if (keypadRef.value) {
            keypadRef.value.style.opacity = '1'
        }
    }, 100)
})

const playClickSound = () => {
    if (!muted.value && clickAudio) {
        clickAudio.currentTime = 0
        clickAudio.play()
    }
}

const handleKeyDown = (keyId: 'one' | 'two' | 'three') => {
    keys.value[keyId].pressed = true
    playClickSound()
}

const handleKeyUp = (keyId: 'one' | 'two' | 'three') => {
    keys.value[keyId].pressed = false
}

const handleKeyPress = (event: KeyboardEvent) => {
    Object.entries(keys.value).forEach(([id, config]) => {
        if (event.key === config.key) {
            handleKeyDown(id as 'one' | 'two' | 'three')
            setTimeout(() => handleKeyUp(id as 'one' | 'two' | 'three'), 150)
        }
    })
}

const handleSubmit = (event: Event) => {
    event.preventDefault()
    console.log('Form submitted!')
}

// Add keyboard listener
if (process.client) {
    window.addEventListener('keydown', handleKeyPress)
}
</script>

<template>
    <div class="">
        <main>

            <!-- 3D Keypad -->
            <div
                ref="keypadRef"
                class="keypad opacity-0 transition-opacity duration-500"
                :class="{ 'keypad--exploded': exploded }"
            >
                <!-- Base -->
                <div class="keypad__base">
                    <img src="https://assets.codepen.io/605876/keypad-base.png?format=auto&quality=86" alt=""/>
                </div>

                <!-- Key One (OK - Orange) -->
                <button
                    class="key keypad__single keypad__single--left"
                    :data-pressed="keys.one.pressed"
                    :style="{
            '--travel': keys.one.travel,
            '--hue': keys.one.hue,
            '--saturate': keys.one.saturation,
            '--brightness': keys.one.brightness
          }"
                    @pointerdown="handleKeyDown('one')"
                    @pointerup="handleKeyUp('one')"
                    @pointerleave="handleKeyUp('one')"
                >
          <span class="key__mask">
            <span class="key__content">
              <span class="key__text">{{ keys.one.text }}</span>
              <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt=""/>
            </span>
          </span>
                </button>

                <!-- Key Two (GO - Gray) -->
                <button
                    class="key keypad__single"
                    :data-pressed="keys.two.pressed"
                    :style="{
            '--travel': keys.two.travel,
            '--hue': keys.two.hue,
            '--saturate': keys.two.saturation,
            '--brightness': keys.two.brightness
          }"
                    @pointerdown="handleKeyDown('two')"
                    @pointerup="handleKeyUp('two')"
                    @pointerleave="handleKeyUp('two')"
                >
          <span class="key__mask">
            <span class="key__content">
              <span class="key__text">{{ keys.two.text }}</span>
              <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt=""/>
            </span>
          </span>
                </button>

                <!-- Key Three (CREATE - Black) -->
                <button
                    class="key keypad__double"
                    :data-pressed="keys.three.pressed"
                    :style="{
            '--travel': keys.three.travel,
            '--hue': keys.three.hue,
            '--saturate': keys.three.saturation,
            '--brightness': keys.three.brightness
          }"
                    @pointerdown="handleKeyDown('three')"
                    @pointerup="handleKeyUp('three')"
                    @pointerleave="handleKeyUp('three')"
                >
          <span class="key__mask">
            <span class="key__content">
              <span class="key__text">{{ keys.three.text }}</span>
              <img src="https://assets.codepen.io/605876/keypad-double.png?format=auto&quality=86" alt=""/>
            </span>
          </span>
                </button>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* Grid Background */
.grid-background {
    --size: 45px;
    --line: color-mix(in hsl, currentColor, transparent 80%);
    position: fixed;
    inset: 0;
    background: linear-gradient(90deg, var(--line) 1px, transparent 1px var(--size)) calc(var(--size) * 0.36) 50% / var(--size) var(--size),
    linear-gradient(var(--line) 1px, transparent 1px var(--size)) 0% calc(var(--size) * 0.32) / var(--size) var(--size);
    mask: linear-gradient(-20deg, transparent 50%, white);
    pointer-events: none;
    z-index: 0;
}

/* Keypad Container */
.keypad {
    position: relative;
    aspect-ratio: 400 / 310;
    width: clamp(280px, 35vw, 400px);
    display: flex;
    align-items: center;
    justify-content: center;
    transform-style: preserve-3d;
    transition: translate 0.26s ease-out, transform 0.26s ease-out;
}

/* Keypad Base */
.keypad__base {
    position: absolute;
    bottom: 0;
    width: 100%;
    transition: translate 0.26s ease-out;
}

.keypad__base img {
    width: 100%;
    transition: translate 0.12s ease-out;
}

/* Keys */
.key {
    position: absolute;
    transform-style: preserve-3d;
    border: 0;
    background: transparent;
    padding: 0;
    cursor: pointer;
    outline: none;
    transition: translate 0.26s ease-out;
}

.key::after {
    z-index: -1;
    content: '';
    position: absolute;
    opacity: 0;
    inset: 0;
    transition: opacity 0.26s ease-out;
    background: repeating-linear-gradient(-45deg, transparent 0 5px, hsl(220 100% 70%) 5px 6px);
}

.key[data-pressed='true'] .key__content,
.key:active .key__content {
    translate: 0 calc(var(--travel) * 1%);
}

.key__mask {
    width: 100%;
    height: 100%;
    display: inline-block;
}

.key__content {
    width: 100%;
    height: 100%;
    display: inline-block;
    transition: translate 0.12s ease-out;
    container-type: inline-size;
}

.key img {
    width: 100%;
    filter: hue-rotate(calc(var(--hue, 0) * 1deg)) saturate(var(--saturate, 1)) brightness(var(--brightness, 1));
    transition: translate 0.12s ease-out;
}

.key__text {
    position: absolute;
    z-index: 21;
    top: 5%;
    left: 0;
    width: 86%;
    height: 46%;
    font-size: 12cqi;
    color: hsl(0 0% 94%);
    translate: 8% 10%;
    transform: rotateX(36deg) rotateY(45deg) rotateX(-90deg) rotate(0deg);
    text-align: left;
    padding: 1ch;
}

/* Single Key Styles */
.keypad__single {
    width: 40.5%;
    height: 46%;
    bottom: 36%;
    left: 54%;
    clip-path: polygon(0 0, 54% 0, 89% 24%, 100% 70%, 54% 100%, 46% 100%, 0 69%, 12% 23%, 47% 0%);
    mask: url(https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86) 50% 50% / 100% 100%;
}

.keypad__single--left {
    left: 29.3%;
    bottom: 54.2%;
}

.keypad__single .key__text {
    width: 52%;
    height: 62%;
    font-size: 18cqi;
    translate: 45% -16%;
}

.keypad__single img {
    position: absolute;
    top: 0;
    left: 50%;
    width: 96%;
    opacity: 1;
    translate: -50% 1%;
}

/* Double Key Styles */
.keypad__double {
    width: 64%;
    height: 65%;
    left: 6%;
    bottom: 17.85%;
    clip-path: polygon(34% 0, 93% 44%, 101% 78%, 71% 100%, 66% 100%, 0 52%, 0 44%, 7% 17%, 30% 0);
    mask: url(https://assets.codepen.io/605876/keypad-double.png?format=auto&quality=86) 50% 50% / 100% 100%;
}

.keypad__double img {
    position: absolute;
    top: 0;
    left: 50%;
    width: 99%;
    opacity: 1;
    translate: -50% 1%;
}

/* Exploded State */
.keypad--exploded {
    translate: calc(-50% - 1rem) 0;
}

.keypad--exploded .keypad__base {
    translate: 0 calc(2.5 * 10vh);
}

.keypad--exploded .keypad__single {
    translate: 0 calc(-1 * 10vh);
}

.keypad--exploded .keypad__single--left {
    translate: 0 calc(-2 * 10vh);
}

.keypad--exploded .keypad__double {
    translate: 0 0;
}

.keypad--exploded .key::after {
    opacity: 1;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .keypad {
        order: 1;
    }

    section {
        order: 2;
    }

    .keypad--exploded {
        translate: 0 calc(50% + 1rem);
    }
}
</style>