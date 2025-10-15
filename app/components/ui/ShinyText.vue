<script setup lang="ts">
import { computed } from 'vue';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
    mode?: 'light' | 'dark';
}

const props = withDefaults(defineProps<ShinyTextProps>(), {
    text: '',
    disabled: false,
    speed: 5,
    className: '',
    mode: 'light'
});

const animationDuration = computed(() => `${props.speed}s`);

const textColor = computed(() => {
    return props.mode === 'dark' ? 'text-neutral-400' : 'text-neutral-500';
});

const gradientColors = computed(() => {
    if (props.mode === 'dark') {
        return 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 60%)';
    }
    return 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)';
});
</script>

<template>
    <div
        :class="`${textColor} bg-clip-text inline-block ${!props.disabled ? 'animate-shine' : ''} ${props.className}`"
        :style="{
            backgroundImage: gradientColors,
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            animationDuration: animationDuration
        }"
    >
        {{ props.text }}
    </div>
</template>

<style scoped>
@keyframes shine {
    0% {
        background-position: 100%;
    }
    100% {
        background-position: -100%;
    }
}

.animate-shine {
    animation: shine 5s linear infinite;
}
</style>