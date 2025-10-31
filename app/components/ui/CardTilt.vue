<script setup lang="ts">
import { ref, type Ref } from 'vue';

interface RotateState {
    x: number;
    y: number;
}

function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

const rotate: Ref<RotateState> = ref({ x: 0, y: 0 });

const onMouseMove = throttle((e: MouseEvent) => {
    const card = e.currentTarget as HTMLDivElement;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 4;
    const rotateY = (centerX - x) / 4;

    rotate.value = { x: rotateX, y: rotateY };
}, 100);

const onMouseLeave = () => {
    rotate.value = { x: 0, y: 0 };
};
</script>

<template>
    <div
        class="card relative h-52 w-52 transition-[all_400ms_cubic-bezier(0.03,0.98,0.52,0.99)_0s] will-change-transform"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
        :style="{
      transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
      transition: 'all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s',
    }"
    >
        <div
            class="group relative flex h-full w-full select-none items-center justify-center      "
        >
      <span
          class="text-md bg-gradient-to-t from-neutral-400 to-white bg-clip-text font-bold "
      >
                    <h2 class="text-4xl font-bold serif-text sm:text-5xl  text-center">Transformando <br/>ideas en
                        aplicaciones
                        <br/> web
                        completas</h2>
      </span>
        </div>
    </div>
</template>