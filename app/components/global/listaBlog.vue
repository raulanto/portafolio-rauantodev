<script setup lang="ts">
import Blogs from "~/blog/blogs.vue";
import Keypad3D from "~/components/ui/Keypad3D.vue";
import Dither from "~/components/ui/Dither.vue";

// Obtener todos los blogs
const { data: blogs } = await useAsyncData('blogs', () => {
    return queryCollection('blog').all()
})
</script>

<template>
    <div id="blog" class="py-24 sm:py-32 fondo-blog bg">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="border rounded-lg bg-neutral-50  dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-2">
                <div class=" border rounded-md flex fondo-card flex-col justify-center items-center  dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 py-8">

                    <h2  class="text-4xl font-bold sm:text-5xl serif-text">Blog</h2>
                    <p class="mt-2 text-lg leading-8">Articulos relacionados con distintas tecnologias.</p>

                    <div class="flex flex-col justify-center items-center mt-4">
                        <keypad3-d/>
                    </div>
                </div>
            </div>
            <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-4 lg:mx-0 lg:mt-20 lg:max-w-none lg:grid-cols-3">
                <blogs v-if="blogs" :blogs="blogs" />

                <p v-else>Cargando blogs...</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fondo-blog {
    position: relative;
}

.fondo-blog::before {
    content: '';
    position: absolute;
    top: 0;

    width: 100%;
    height: 100%;
    z-index: -1;
    background-image:
        linear-gradient(45deg, transparent 49%, rgba(229, 231, 235, 0.68) 49%, rgba(229, 231, 235, 0.14) 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, rgba(229, 231, 235, 0.68) 49%, rgba(229, 231, 235, 0.14) 51%, transparent 51%);
    background-size: 40px 40px;
    -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%);
    mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%);
}


.fondo-card{
    background-image:
    repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
    repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
    repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
    repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px);

}

</style>


