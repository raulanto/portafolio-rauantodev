<template>
    <UPageCard class="w-full max-w-4xl mx-auto overflow-hidden my-2 "

               spotlight
               spotlight-color="primary">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <!-- Left Side - Image Carousel -->
            <div class="relative">
                <!-- Main Image Display -->
                <div class="relative rounded-md overflow-hidden bg-neutral-50 group">
                    <div class="aspect-video relative">
                        <Transition name="fade" mode="out-in">
                            <img
                                :key="currentImageIndex"
                                :src="currentImage"
                                :alt="post.title"
                                class="w-full h-full object-cover"
                            />
                        </Transition>

                        <!-- Image Counter Badge -->
                        <div
                            v-if="post.imageUrl.length > 1"
                            class="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium"
                        >
                            {{ currentImageIndex + 1 }} / {{ post.imageUrl.length }}
                        </div>

                        <!-- Navigation Arrows - Only show if multiple images -->
                        <template v-if="post.imageUrl.length > 1">
                            <button
                                @click="previousImage"
                                class="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-neutral-800 rounded-full  shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110 flex p-2"
                            >
                                <Icon name="i-heroicons-chevron-left-20-solid" class="w-4 h-4"/>
                            </button>
                            <button
                                @click="nextImage"
                                class="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-neutral-800 rounded-full  shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110 flex p-2"
                            >
                                <Icon name="i-heroicons-chevron-right-20-solid" class="w-4 h-4"/>
                            </button>
                        </template>
                    </div>
                </div>

                <!-- Carousel Thumbnails - Only show if multiple images -->
                <div
                    v-if="post.imageUrl.length > 1"
                    class="flex w-full py-1 items-center justify-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide"
                >
                    <button
                        v-for="(image, index) in post.imageUrl"
                        :key="index"
                        @click="selectImage(index)"
                        :class="[
              'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300',
              currentImageIndex === index
                ? 'border-primary-500 ring-2 ring-primary-200 scale-105'
                : 'border-neutral-200 hover:border-neutral-300 opacity-70 hover:opacity-100'
            ]"
                    >
                        <img
                            :src="image"
                            :alt="`${post.title} - ${index + 1}`"
                            class="w-full h-full object-cover"
                        />
                    </button>
                </div>

                <!-- Progress Indicators -->
                <div
                    v-if="post.imageUrl.length > 1"
                    class="flex gap-2 mt-4 justify-center"
                >
                    <button
                        v-for="(_, index) in post.imageUrl"
                        :key="index"
                        @click="selectImage(index)"
                        :class="[
              'h-1.5 rounded-full transition-all duration-300',
              currentImageIndex === index
                ? 'bg-primary-500 w-8'
                : 'bg-neutral-300 w-1.5 hover:bg-neutral-400'
            ]"
                    />
                </div>
            </div>

            <!-- Right Side - Content -->
            <div class="flex flex-col justify-between space-y-6">
                <!-- Title and Tags -->
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-neutral-900 dark:text-white leading-tight">
                        {{ post.title }}
                    </h2>

                    <!-- Tags -->
                    <div class="flex flex-wrap gap-2">
                        <UBadge
                            v-for="tag in post.tag"
                            :key="tag.id"
                            :color="tag.color"
                            variant="soft"
                            size="md"
                            class="px-3 py-1"
                        >
                            {{ tag.name }}
                        </UBadge>
                    </div>

                    <!-- Description -->
                    <p class="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed">
                        {{ post.description }}
                    </p>
                </div>

                <!-- Author and Action Section -->
                <div class="space-y-4">
                    <!-- Divider -->
                    <USeparator/>

                    <!-- Author Info -->
                    <div class="flex items-center gap-3">
                        <UAvatar
                            alt="Rau Developer"
                            size="md"
                            class="ring-2 ring-primary-100 dark:ring-primary-900"
                        >
                            <template #fallback>
                                <span class="text-lg font-semibold">R</span>
                            </template>
                        </UAvatar>
                        <div>
                            <p class="text-sm font-semibold text-neutral-900 dark:text-white">
                                Rau Developer
                            </p>
                            <p class="text-xs text-neutral-500 dark:text-neutral-400">
                                {{ formatDate(new Date()) }}
                            </p>
                        </div>
                    </div>
                    <div class="w-full flex items-center gap-3 ">

                        <!-- Link Button -->
                        <UButton
                            v-if="post.link"
                            :to="post.link"
                            target="_blank"
                            external
                            size="lg"
                            block
                            icon="i-heroicons-arrow-top-right-on-square"
                            trailing
                            variant="soft"
                            class="justify-center w-44"
                        >
                            Ver Proyecto
                        </UButton>
                    </div>


                </div>
            </div>
        </div>
    </UPageCard>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from 'vue'

interface Tag {
    id: number
    name: string
    color: string
}

interface Post {
    id: number
    title: string
    description: string
    tag: Tag[]
    imageUrl: string[]
    link?: string
}

// Props
const props = defineProps<{
    post: Post
    autoPlayInterval?: number
}>()

// State
const currentImageIndex = ref(0)
let autoPlayTimer: NodeJS.Timeout | null = null

// Computed
const currentImage = computed(() => {
    return props.post.imageUrl[currentImageIndex.value]
})

// Methods
const nextImage = () => {
    currentImageIndex.value = (currentImageIndex.value + 1) % props.post.imageUrl.length
    resetAutoPlay()
}

const previousImage = () => {
    currentImageIndex.value =
        currentImageIndex.value === 0
            ? props.post.imageUrl.length - 1
            : currentImageIndex.value - 1
    resetAutoPlay()
}

const selectImage = (index: number) => {
    currentImageIndex.value = index
    resetAutoPlay()
}

const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// Auto-play functionality
const startAutoPlay = () => {
    if (props.post.imageUrl.length <= 1) return

    const interval = props.autoPlayInterval || 5000 // Default 5 seconds

    autoPlayTimer = setInterval(() => {
        nextImage()
    }, interval)
}

const stopAutoPlay = () => {
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer)
        autoPlayTimer = null
    }
}

const resetAutoPlay = () => {
    stopAutoPlay()
    startAutoPlay()
}

// Lifecycle
onMounted(() => {
    startAutoPlay()
})

onUnmounted(() => {
    stopAutoPlay()
})
</script>

<style scoped>
/* Fade transition for images */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Hide scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>