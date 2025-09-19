<script setup lang="ts">
import list from '~/utils/proyectos';
</script>

<template>
    <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 place-items-center justify-items-center-safe">
        <!-- Project 1 -->

        <div
            v-for="proyecto in list"
            :key="proyecto.id"
            class="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ">
            <div class="h-64 overflow-hidden">
                <img :src="proyecto.imageUrl" alt="UI Design Project"
                     class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"/>
            </div>
            <div
                class="absolute inset-0 flex items-end bg-gradient-to-t from-gray-900 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-90">
                <div
                    class="translate-y-8 transform transition-transform duration-300 group-hover:translate-y-0 flex  flex-col justify-center items-center w-full">
                    <h3 class="text-2xl font-bold text-white text-center">{{ proyecto.title }}</h3>
                    <p class="mt-2 text-gray-300 text-center">{{ proyecto.description }}</p>
                    <div class="mt-4 flex space-x-2">
                        <UBadge
                            v-for="tag in proyecto.tag"
                            size="md"
                            :key="tag.id"
                            :color="tag.color"
                            variant="outline"
                        >
                            {{ tag.name }}
                        </UBadge>
                    </div>
                    <a :href="proyecto.link"
                       class="mt-4 inline-flex items-center text-white transition-colors hover:text-blue-300">
                        Mirar
                        <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </div>
        </div>

    </div>

</template>

<style scoped>

</style>