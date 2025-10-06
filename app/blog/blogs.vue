<script setup lang="ts">
interface BlogType {
    title: string;
    description: string;
    tags?: string[];
    date: string;
    name: string; // Ruta del blog para el enlace
    path:string;
}

const props = defineProps({
    blogs: {
        type: Array as () => BlogType[],
        required: true
    }
})

// Función para formatear fecha
const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>

<template>
    <article
        v-for="blog in blogs"
        :key="blog.path"
        class="flex flex-col items-start justify-between "
    >
        <!-- Tags -->
        <div class="flex gap-2 flex-wrap">
            <UBadge
                v-for="tag in blog.tags"
                :key="tag"

                size="md"
                color="neutral"
                variant="soft"
            >
                {{ tag }}
            </UBadge>
        </div>

        <!-- Fecha -->
        <div class="mt-5 flex items-center gap-x-2 text-sm">
            <time :datetime="blog.date">{{ formatDate(blog.date) }}</time>
        </div>

        <!-- Título y descripción -->
        <div class="group relative mt-3">
            <h3 class="text-lg font-semibold leading-6">

                <ULink :to="`${blog.path}`">
                    {{ blog.title }}
                </ULink>


            </h3>
            <p class="mt-5 line-clamp-2 text-sm leading-6">
                {{ blog.description }}
            </p>
        </div>

        <lazy-auth-perfil-card/>
    </article>
</template>