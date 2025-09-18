<template>
    <div class="overflow-hidden w-full">
        <div
            class="flex w-max items-center gap-12"
            :class="animationClass"
        >
            <template v-for="(icon, index) in repeatedIcons" :key="index">
                <img
                    :src="`https://skillicons.dev/icons?i=${icon}`"
                    class="h-14 w-14 object-contain border border-gray-200 bg-white rounded-lg dark:!border-neutral-800 dark:shadow-lg dark:bg-neutral-900"
                />
            </template>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    icons: Array,
    direction: {
        type: String,
        default: 'left', // 'left' or 'right'
    },
})

// Repetir íconos 3 veces para asegurar transición perfecta
const repeatedIcons = [...props.icons, ...props.icons, ...props.icons]

const animationClass = props.direction === 'left'
    ? 'animate-marquee-left'
    : 'animate-marquee-right'
</script>

<style scoped>
@keyframes marquee-left {
    0% {
        transform: translateX(0%);
    }
    100% {
        transform: translateX(-33.333%);
    }
}

@keyframes marquee-right {
    0% {
        transform: translateX(-33.333%);
    }
    100% {
        transform: translateX(0%);
    }
}

.animate-marquee-left {
    animation: marquee-left 30s linear infinite;
}

.animate-marquee-right {
    animation: marquee-right 30s linear infinite;
}
</style>