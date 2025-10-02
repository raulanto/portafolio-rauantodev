<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'

const keypadRef = ref<HTMLElement | null>(null)
const muted = ref(false)
const platform = ref<'macos' | 'gemini' | 'claude' | 'perplexity'>('macos')

const keys = ref({
    one: {
        travel: 26,
        key: 'Meta',
        pressed: true
    },
    two: {
        travel: 26,
        text: 'R',
        key: 'r',
        pressed: false
    },
    three: {
        travel: 18,
        text: 'A',
        key: 'a',
        pressed: false
    },
    four: {
        travel: 18,
        text: 'U',
        key: 'u',
        pressed: false
    },
    five: {
        travel: 18,
        text: '🤷‍♂️',
        key: 'Escape',
        pressed: false
    }
})

let clickAudio: HTMLAudioElement | null = null

onMounted(() => {
    clickAudio = new Audio('https://cdn.freesound.org/previews/378/378085_6260145-lq.mp3')
    if (clickAudio) clickAudio.muted = muted.value

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
})

const playClickSound = () => {
    if (!muted.value && clickAudio) {
        clickAudio.currentTime = 0
        clickAudio.play()
    }
}

const handleKeyPress = (keyId: keyof typeof keys.value) => {
    keys.value[keyId].pressed = true
    playClickSound()
}

const handleKeyRelease = (keyId: keyof typeof keys.value) => {
    keys.value[keyId].pressed = false
}

const handleKeyDown = (event: KeyboardEvent) => {
    Object.entries(keys.value).forEach(([id, config]) => {
        if (event.key === config.key) {
            keys.value[id as keyof typeof keys.value].pressed = true
            playClickSound()
        }
    })
}

const handleKeyUp = (event: KeyboardEvent) => {
    Object.entries(keys.value).forEach(([id, config]) => {
        if (event.key === config.key || event.key === 'Meta') {
            keys.value[id as keyof typeof keys.value].pressed = false
        }
    })
}
</script>

<template>
    <div class="keypad-container" :data-platform="platform">
        <div ref="keypadRef" class="keypad">
            <!-- Base -->
            <div class="keypad__base">
                <img src="https://assets.codepen.io/605876/ai-base.png?format=auto&quality=86" alt=""/>
            </div>

            <!-- Key One (AI Platform) -->
            <button
                id="one"
                class="key keypad__single"
                :data-pressed="keys.one.pressed"
                :style="{ '--travel': keys.one.travel }"
                @pointerdown="handleKeyPress('one')"
                @pointerup="handleKeyRelease('one')"
                @pointerleave="handleKeyRelease('one')"
            >
        <span class="key__mask">
          <span class="key__content">
            <span class="key__text">
              <span data-key="macos">
                                  <svg id="Layer_2" class="stroke-white fill-white" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108.89 108.89">

    <g id="Layer_1-2" data-name="Layer 1">
        <path class="cls-1" d="M90.74,36.3h-15.12c-1.67,0-3.02-1.35-3.02-3.02v-15.12c0-10.02-8.13-18.15-18.15-18.15s-18.15,8.13-18.15,18.15v15.12c0,1.67-1.35,3.02-3.02,3.02h-15.12C8.13,36.3,0,44.42,0,54.45s8.13,18.15,18.15,18.15h15.12c1.67,0,3.02,1.35,3.02,3.02v15.12c0,10.02,8.13,18.15,18.15,18.15s18.15-8.13,18.15-18.15v-15.12c0-1.67,1.35-3.02,3.02-3.02h15.12c10.02,0,18.15-8.13,18.15-18.15s-8.13-18.15-18.15-18.15ZM90.74,57.47h-15.12c-10.02,0-18.15,8.13-18.15,18.15v15.12c0,1.67-1.35,3.02-3.02,3.02s-3.02-1.35-3.02-3.02v-15.12c0-10.02-8.13-18.15-18.15-18.15h-15.12c-1.67,0-3.02-1.35-3.02-3.02s1.35-3.02,3.02-3.02h15.12c10.02,0,18.15-8.13,18.15-18.15v-15.12c0-1.67,1.35-3.02,3.02-3.02s3.02,1.35,3.02,3.02v15.12c0,10.02,8.13,18.15,18.15,18.15h15.12c1.67,0,3.02,1.35,3.02,3.02s-1.35,3.02-3.02,3.02Z"/>
    </g>
</svg>
              </span>

            </span>
            <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt=""/>
          </span>
        </span>
            </button>

            <!-- Key Two (Tab) -->
            <button
                id="two"
                class="key keypad__single"
                :data-pressed="keys.two.pressed"
                :style="{ '--travel': keys.two.travel }"
                @pointerdown="handleKeyPress('two')"
                @pointerup="handleKeyRelease('two')"
                @pointerleave="handleKeyRelease('two')"
            >
        <span class="key__mask">
          <span class="key__content">
            <span class="key__text">{{ keys.two.text }}</span>
            <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt=""/>
          </span>
        </span>
            </button>

            <!-- Key Three (C) -->
            <button
                id="three"
                class="key keypad__single"
                :data-pressed="keys.three.pressed"
                :style="{ '--travel': keys.three.travel }"
                @pointerdown="handleKeyPress('three')"
                @pointerup="handleKeyRelease('three')"
                @pointerleave="handleKeyRelease('three')"
            >
        <span class="key__mask">
          <span class="key__content">
            <span class="key__text">{{ keys.three.text }}</span>
            <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt=""/>
          </span>
        </span>
            </button>

            <!-- Key Four (V) -->
            <button
                id="four"
                class="key keypad__single"
                :data-pressed="keys.four.pressed"
                :style="{ '--travel': keys.four.travel }"
                @pointerdown="handleKeyPress('four')"
                @pointerup="handleKeyRelease('four')"
                @pointerleave="handleKeyRelease('four')"
            >
        <span class="key__mask">
          <span class="key__content">
            <span class="key__text">{{ keys.four.text }}</span>
            <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt=""/>
          </span>
        </span>
            </button>

            <!-- Key Five (Escape/Shrug) -->
            <button
                id="five"
                class="key keypad__single"
                :data-pressed="keys.five.pressed"
                :style="{ '--travel': keys.five.travel }"
                @pointerdown="handleKeyPress('five')"
                @pointerup="handleKeyRelease('five')"
                @pointerleave="handleKeyRelease('five')"
            >
        <span class="key__mask">
          <span class="key__content">
            <span class="key__text">{{ keys.five.text }}</span>
            <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt=""/>
          </span>
        </span>
            </button>
        </div>

    </div>
</template>

<style scoped>
.keypad-container {
    display: flex;
    flex-direction: column;
    align-items: center;

}

/* Platform Icon Visibility */
[data-key] {
    display: none;
    position: absolute;
    inset: 0;
    place-items: center;
}

[data-key] svg {
    width: 50%;
}

img {
    pointer-events: none;
}

/* Platform-specific styles for key #one */
[data-platform='gemini'] #one img {
    --brightness: 1.4;
    --saturate: 0.4;
    --hue: 330;
}

[data-platform='gemini'] #one .key__text {
    color: hsl(214, 81%, 100%);
}

[data-platform='gemini'] [data-key='gemini'] {
    display: grid;
}

[data-platform='claude'] #one img {
    --brightness: 0.6;
    --saturate: 0;
}

[data-platform='claude'] #one .key__text {
    color: #d97757;
}

[data-platform='claude'] [data-key='claude'] {
    display: grid;
}

[data-platform='perplexity'] #one img {
    --hue: 280;
    --brightness: 0.8;
    --saturate: 1.2;
}

[data-platform='perplexity'] #one .key__text {
    color: #fff;
}

[data-platform='perplexity'] [data-key='perplexity'] {
    display: grid;
}

[data-platform='macos'] #one .key__text {
    color: #fff;
    font-size: 22cqi;
}

[data-platform='macos'] #one img {
    --saturate: 0;
    --brightness: 0.6;
}

[data-platform='macos'] [data-key='macos'] {
    display: grid;
}

/* Keypad Base */
.keypad {
    position: relative;
    aspect-ratio: 400 / 310;
    display: flex;
    place-items: center;
    width: clamp(280px, 45vw, 500px);
    -webkit-tap-highlight-color: transparent;
    transition: translate 0.26s ease-out, transform 0.26s ease-out;
    transform-style: preserve-3d;
    scale: 1;
}

.key {
    transform-style: preserve-3d;
    border: 0;
    background: transparent;
    padding: 0;
    cursor: pointer;
    outline: none;
    position: absolute;
}

.key[data-pressed='true'] .key__content,
.key:active .key__content {
    translate: 0 calc(var(--travel) * 1%);
}

/* Key positions */
#one {
    left: 13.5%;
    bottom: 57.2%;
}

#two {
    left: 25.8%;
    bottom: 48.5%;
}

#three {
    left: 38%;
    bottom: 39.2%;
}

#four {
    left: 50.4%;
    bottom: 30.2%;
}

#five {
    left: 62.7%;
    bottom: 21%;
}

#five .key__text {
    font-size: 34cqi;
    filter: grayscale(1);
}

.key__content {
    width: 100%;
    height: 100%;
    display: inline-block;
    transition: translate 0.12s ease-out;
    container-type: inline-size;
}

.key__text {
    width: 52%;
    height: 62%;
    position: absolute;
    font-size: 18cqi;
    z-index: 21;
    top: 5%;
    left: 0;
    color: hsl(0 0% 4%);
    translate: 45% -16%;
    transform: rotateX(36deg) rotateY(45deg) rotateX(-90deg) rotate(0deg);
    display: grid;
    place-items: center;
}

.keypad__single {
    width: 21%;
    height: 24%;
    clip-path: polygon(
        0 0,
        54% 0,
        89% 24%,
        100% 70%,
        54% 100%,
        46% 100%,
        0 69%,
        12% 23%,
        47% 0%
    );
    mask: url(https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86) 50% 50% / 100% 100%;
}

.keypad__single img {
    --brightness: 2;
    --saturate: 0;
    --hue: 0;
    top: 0;
    opacity: 1;
    width: 96%;
    position: absolute;
    left: 50%;
    translate: -50% 1%;
    filter: hue-rotate(calc(var(--hue, 0) * 1deg)) saturate(var(--saturate, 1)) brightness(var(--brightness, 1));
}

.key__mask {
    width: 100%;
    height: 100%;
    display: inline-block;
}

.keypad__base {
    position: absolute;
    bottom: 0;
    width: 100%;
}

.keypad__base img {
    width: 100%;
}

/* Platform Selector */
.platform-selector {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
}

.platform-btn {
    padding: 0.5rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.2);
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    text-transform: capitalize;
}

.platform-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
}

.platform-btn.active {
    background: rgba(62, 146, 250, 0.5);
    border-color: rgba(62, 146, 250, 0.8);
}

/* Mobile responsive */
@media (max-width: 768px) {
    .keypad {
        width: clamp(240px, 80vw, 400px);
    }
}
</style>