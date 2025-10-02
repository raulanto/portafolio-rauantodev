<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'

const keypadRef = ref<HTMLElement | null>(null)
const muted = ref(false)

const tecnologias = [
    { id: 'git', name: 'Git', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.574 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.581 9.581 0 01-3.167-2.111c-2.862-2.86-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00-.001-11.501z"/></svg>` },
    { id: 'js', name: 'JavaScript', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M2 1v125h125V1H2zm66.119 106.513c-1.845 3.749-5.367 6.212-9.448 7.401-6.271 1.44-12.269.619-16.731-2.059-2.986-1.832-5.318-4.652-6.901-7.901l9.52-5.83c.083.035.333.487.667 1.071 1.214 2.034 2.261 3.474 4.319 4.485 2.022.69 6.461 1.131 8.175-2.427 1.047-1.81.714-7.628.714-14.065C58.433 78.073 58.48 68 58.48 58h11.709c0 11 .06 21.418 0 32.152.025 6.58.596 12.446-2.07 17.361zm48.574-3.308c-4.07 13.922-26.762 14.374-35.83 5.176-1.916-2.165-3.117-3.296-4.26-5.795 4.819-2.772 4.819-2.772 9.508-5.485 2.547 3.915 4.902 6.068 9.139 6.949 5.748.702 11.531-1.273 10.234-7.378-1.333-4.986-11.77-6.199-18.873-10.531-7.211-4.843-8.901-16.611-2.975-23.335 1.975-2.487 5.343-4.343 8.877-5.235l3.688-.477c7.081-.143 11.507 1.727 14.756 5.355.904.916 1.642 1.904 3.022 4.045-3.772 2.404-3.76 2.381-9.163 5.879-1.154-2.486-3.069-4.046-5.093-4.724-3.142-.952-7.104.083-7.926 3.403-.285 1.023-.226 1.975.227 3.665 1.273 2.903 5.545 4.165 9.377 5.926 11.031 4.474 14.756 9.271 15.672 14.981.882 4.916-.213 8.105-.38 8.581z"/></svg>` },
    { id: 'html', name: 'HTML', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z"/><path fill="currentColor" opacity="0.8" d="M64 116.8l36.378-10.086 8.559-95.878H64z"/></svg>` },
    { id: 'css', name: 'CSS', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M19.67 26l8.069 90.493 36.206 10.05 36.307-10.063L108.32 26zm69.21 50.488l-2.35 21.892.009 1.875-22.539 6.295v.001l-.018.015-22.719-6.225-1.537-17.341h11.141l.79 8.766 12.347 3.295-.004.015v-.032l12.394-3.495 1.308-14.549H51.723l-.25-2.88-.571-6.448-.296-3.289h27.616l1.086-11.367H49.982l-.25-2.882-.567-6.447-.296-3.289h36.908L85 30.359H27.989l.981 11.367h44.751L72.634 52.95H28.136l.395 4.392 2.509 28.23.077.86h13.295l-1.588-17.331h22.861l2.124 11.516z"/></svg>` },
    { id: 'vue', name: 'Vue', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M0 8.934l49.854.158 14.167 24.47 14.432-24.47L128 8.935l-63.834 110.14zm126.98.637l-24.36.02-38.476 66.053L25.691 9.592.942 9.572l63.211 107.89z"/></svg>` },
    { id: 'python', name: 'Python', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M49.33 62h29.159C86.606 62 93 55.132 93 46.981V19.183c0-7.912-6.632-13.856-14.555-15.176-5.014-.835-10.195-1.215-15.187-1.191-4.99.023-9.612.448-13.805 1.191C37.098 6.188 35 10.758 35 19.183V26h29v4H23.776c-8.484 0-15.914 5.108-18.237 14.811-2.681 11.12-2.8 17.919 0 29.53C7.614 82.38 14.795 89 23.279 89H32V74.423c0-9.658 8.356-18.168 18.237-18.168 0 0 11.093-.046 29.093-.046z"/></svg>` },
    { id: 'react', name: 'React', svg: `<svg viewBox="0 0 128 128"><circle cx="64" cy="64" r="11.4" fill="currentColor"/><path fill="currentColor" d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 2.6 56.5 2.6 64s5.6 14 15.1 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 9.5-4.7 15.1-11.2 15.1-18.8s-5.6-14-15.1-18.8z"/></svg>` },
    { id: 'docker', name: 'Docker', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M124.8 52.1c-4.3-2.5-10-2.8-14.8-1.4-.6-5.2-4-9.7-8-12.9l-1.6-1.3-1.4 1.6c-2.7 3.1-3.5 8.3-3.1 12.3.3 2.9 1.2 5.9 3 8.3-1.4.8-2.9 1.9-4.3 2.4-2.8 1-5.9 2-8.9 2H79V49H66V24H51v12H26v13H13v14H1.8l.2 1.5c.5 4.2 1.5 8.3 3.2 12.1 3.5 7.8 9.2 13.5 17.5 16.4 9.3 3.4 19.5 4 29.7 3.1 6.7-.6 13.3-2 19.6-4.5 5.7-2.3 11.1-5.6 15.8-9.6 3.3-2.9 6.3-6.3 8.8-10.1l.3-.6c2.2-.3 4.4-.5 6.5-.9 3.9-.7 7.8-1.7 11.5-3.5 4.3-2.1 7.3-5.4 9.3-9.5l.8-1.7z"/></svg>` },
    { id: 'nuxt', name: 'Nuxt', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M65.344 24.368l36.208 62.694H29.136z"/><path fill="currentColor" opacity="0.7" d="M8 87.062l28.688-49.69 28.688 49.69z"/></svg>` },
    { id: 'angular', name: 'Angular', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M63.81 1.026L4.553 21.88l9.363 77.637 49.957 27.457 50.214-27.828 9.36-77.635L63.81 1.026z"/></svg>` },
    { id: 'mongodb', name: 'MongoDB', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M88.038 42.812c1.605 4.643 2.761 9.383 3.141 14.296.472 6.095.256 12.147-1.029 18.142-.035.165-.109.32-.164.48-.403.001-.814-.049-1.208.012-3.329.523-6.655 1.065-9.981 1.604-3.438.557-6.881 1.092-10.313 1.687-1.216.21-2.721-.041-3.212 1.641-.014.046-.154.054-.235.08l.166-10.051c-.057-8.084-.113-16.168-.169-24.252l1.602-.275c2.62-.429 5.24-.864 7.862-1.281 3.129-.497 6.261-.98 9.392-1.465 1.381-.215 2.764-.412 4.148-.618z"/></svg>` },
    { id: 'postgresql', name: 'PostgreSQL', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M93.809 92.112c.785-6.533.55-7.492 5.416-6.433l1.235.108c3.742.17 8.637-.602 11.513-1.938 6.191-2.873 9.861-7.668 3.758-6.409-13.924 2.873-14.881-1.842-14.881-1.842 14.703-21.815 20.849-49.508 15.543-56.287-14.47-18.489-39.517-9.746-39.936-9.52l-.134.025c-2.751-.571-5.83-.912-9.289-.968-6.301-.104-11.082 1.652-14.709 4.402 0 0-44.683-18.409-42.604 23.151.442 8.841 12.672 66.898 27.26 49.362 5.332-6.412 10.484-11.834 10.484-11.834 2.558 1.699 5.622 2.567 8.834 2.255l.249-.212c-.078.796-.044 1.575.099 2.497-3.757 4.199-2.653 4.936-10.166 6.482-7.602 1.566-3.136 4.355-.221 5.084 3.535.884 11.712 2.136 17.238-5.598l-.22.882c1.474 1.18 1.375 8.477 1.583 13.69.209 5.214.558 10.079 1.621 12.948 1.063 2.868 2.317 10.256 12.191 8.14 8.252-1.764 14.561-4.309 15.136-27.985"/></svg>` },
    { id: 'figma', name: 'Figma', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M45.5 129c11.9 0 21.5-9.6 21.5-21.5V86H45.5C33.6 86 24 95.6 24 107.5S33.6 129 45.5 129z"/></svg>` },
    { id: 'npm', name: 'NPM', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M2 38.5h124v43.71H64v7.29H36.44v-7.29H2zm6.89 36.43h13.78V53.07h6.89v21.86h6.89V45.79H8.89zm34.44-29.14v36.42h13.78v-7.28h13.78V45.79zm13.78 7.29v14.56h-6.89V53.08zM91.56 45.79v29.14h13.78V53.07h6.89v21.86h6.89V53.07h6.89v21.86h6.89V45.79z"/></svg>` },
    { id: 'mysql', name: 'MySQL', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M2.001 90.458h4.108V74.235l6.36 14.143c.75 1.712 1.777 2.317 3.792 2.317s3.003-.605 3.753-2.317l6.36-14.143v16.223h4.108V74.262c0-1.58-.632-2.345-1.936-2.739-3.121-.974-5.215-.131-6.163 1.976l-6.241 13.958-6.043-13.959c-.909-2.106-3.042-2.949-6.163-1.976C2.632 71.917 2 72.681 2 74.261v16.197z"/></svg>` },
    { id: 'django', name: 'Django', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M59.448 0h13.894v86.57c-7.356 1.42-12.736 1.984-18.592 1.984-17.45 0-26.545-7.92-26.545-23.084 0-14.597 9.665-24.076 24.641-24.076 2.33 0 4.09.188 6.602.752V0z"/></svg>` },
    { id: 'java', name: 'Java', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969z"/></svg>` },
    { id: 'kubernetes', name: 'K8s', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M60.8 45.1l-4.5 13.9c-.2.6.2 1.3.9 1.3h14.8c.7 0 1.1-.7.9-1.3l-4.5-13.9c-.2-.6-1-.6-1.2 0l-3.2 9.9-3.2-9.9z"/></svg>` },
    { id: 'c', name: 'C', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M117.5 33.5l.3-.2c-.6-1.1-1.5-2.1-2.4-2.6L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.3.9 3.4l-.2.1c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c.1-.8 0-1.7-.4-2.6z"/></svg>` },
    { id: 'pinia', name: 'Pinia', svg: `<svg viewBox="0 0 128 128"><path fill="currentColor" d="M50.25 17.188c-4.875 0-8.844 3.969-8.844 8.843v47.063c0 4.875 3.969 8.844 8.844 8.844h27.5c4.875 0 8.844-3.969 8.844-8.844V26.03c0-4.875-3.969-8.844-8.844-8.844h-27.5z"/></svg>` }
]

const currentTechs = ref<typeof tecnologias>([])

const keys = ref({
    tab: {
        travel: 26,
        text: 'Tab',
        key: 'Tab',
        pressed: false,
        isTab: true
    },
    two: {
        travel: 26,
        pressed: false,
        isTab: false
    },
    three: {
        travel: 18,
        pressed: false,
        isTab: false
    },
    four: {
        travel: 18,
        pressed: false,
        isTab: false
    },
    five: {
        travel: 18,
        pressed: false,
        isTab: false
    }
})

let clickAudio: HTMLAudioElement | null = null

const getRandomTechs = () => {
    const shuffled = [...tecnologias].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 4)
}

onMounted(() => {
    currentTechs.value = getRandomTechs()
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

const changeTechnologies = () => {
    currentTechs.value = getRandomTechs()
}

const handleKeyPress = (keyId: keyof typeof keys.value) => {
    keys.value[keyId].pressed = true
    playClickSound()

    if (keyId === 'tab') {
        changeTechnologies()
    }
}

const handleKeyRelease = (keyId: keyof typeof keys.value) => {
    keys.value[keyId].pressed = false
}

const handleKeyDown = (event: KeyboardEvent) => {
    Object.entries(keys.value).forEach(([id, config]) => {
        if (event.key === config.key) {
            event.preventDefault()
            keys.value[id as keyof typeof keys.value].pressed = true
            playClickSound()

            if (id === 'tab') {
                changeTechnologies()
            }
        }
    })
}

const handleKeyUp = (event: KeyboardEvent) => {
    Object.entries(keys.value).forEach(([id, config]) => {
        if (event.key === config.key) {
            keys.value[id as keyof typeof keys.value].pressed = false
        }
    })
}

const getTechByIndex = (index: number) => {
    return currentTechs.value[index] || tecnologias[0]
}
</script>

<template>
    <div class="keypad-container">
        <div ref="keypadRef" class="keypad">
            <!-- Base -->
            <div class="keypad__base">
                <img src="https://assets.codepen.io/605876/ai-base.png?format=auto&quality=86" alt=""/>
            </div>

            <!-- Tecla Tab (Primera) -->
            <button
                id="tab"
                class="key keypad__single tab-key"
                :data-pressed="keys.tab.pressed"
                :style="{ '--travel': keys.tab.travel }"
                @pointerdown="handleKeyPress('tab')"
                @pointerup="handleKeyRelease('tab')"
                @pointerleave="handleKeyRelease('tab')"
            >
                <span class="key__mask">
                    <span class="key__content">
                        <span class="key__text tab-text">
                            {{ keys.tab.text }}
                        </span>
                        <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt=""/>
                    </span>
                </span>
            </button>

            <!-- Tecla 2 -->
            <button
                id="two"
                class="key keypad__single tech-key"
                :data-pressed="keys.two.pressed"
                :style="{ '--travel': keys.two.travel }"
                @pointerdown="handleKeyPress('two')"
                @pointerup="handleKeyRelease('two')"
                @pointerleave="handleKeyRelease('two')"
            >
                <span class="key__mask">
                    <span class="key__content">
                        <span class="key__text tech-icon">
                            <span v-html="getTechByIndex(0).svg"></span>
                        </span>
                        <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt=""/>
                    </span>
                </span>
            </button>

            <!-- Tecla 3 -->
            <button
                id="three"
                class="key keypad__single tech-key"
                :data-pressed="keys.three.pressed"
                :style="{ '--travel': keys.three.travel }"
                @pointerdown="handleKeyPress('three')"
                @pointerup="handleKeyRelease('three')"
                @pointerleave="handleKeyRelease('three')"
            >
                <span class="key__mask">
                    <span class="key__content">
                        <span class="key__text tech-icon">
                            <span v-html="getTechByIndex(1).svg"></span>
                        </span>
                        <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt=""/>
                    </span>
                </span>
            </button>

            <!-- Tecla 4 -->
            <button
                id="four"
                class="key keypad__single tech-key"
                :data-pressed="keys.four.pressed"
                :style="{ '--travel': keys.four.travel }"
                @pointerdown="handleKeyPress('four')"
                @pointerup="handleKeyRelease('four')"
                @pointerleave="handleKeyRelease('four')"
            >
                <span class="key__mask">
                    <span class="key__content">
                        <span class="key__text tech-icon">
                            <span v-html="getTechByIndex(2).svg"></span>
                        </span>
                        <img src="https://assets.codepen.io/605876/keypad-single.png?format=auto&quality=86" alt=""/>
                    </span>
                </span>
            </button>

            <!-- Tecla 5 -->
            <button
                id="five"
                class="key keypad__single tech-key"
                :data-pressed="keys.five.pressed"
                :style="{ '--travel': keys.five.travel }"
                @pointerdown="handleKeyPress('five')"
                @pointerup="handleKeyRelease('five')"
                @pointerleave="handleKeyRelease('five')"
            >
                <span class="key__mask">
                    <span class="key__content">
                        <span class="key__text tech-icon">
                            <span v-html="getTechByIndex(3).svg"></span>
                        </span>
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

img {
    pointer-events: none;
}

.tech-icon {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    color: #9ca3af;
    transition: color 0.3s ease;
}

.tech-icon :deep(svg) {
    width: 50%;
    height: 50%;
}

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
#tab {
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
    translate: 45% -16%;
    transform: rotateX(36deg) rotateY(45deg) rotateX(-90deg) rotate(0deg);
    display: grid;
    place-items: center;
}

.tab-text {
    color: #3b82f6;
    font-weight: bold;
    font-size: 16cqi;
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

/* Tecla Tab - Azul */
.tab-key img {
    --brightness: 1.5;
    --saturate: 1;
    --hue: 210;
    top: 0;
    opacity: 1;
    width: 96%;
    position: absolute;
    left: 50%;
    translate: -50% 1%;
    filter: hue-rotate(calc(var(--hue, 0) * 1deg)) saturate(var(--saturate, 1)) brightness(var(--brightness, 1));
}

/* Teclas de Tecnologías - Gris */
.tech-key img {
    --brightness: 0.6;
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

/* Mobile responsive */
@media (max-width: 768px) {
    .keypad {
        width: clamp(240px, 80vw, 400px);
    }
}
</style>