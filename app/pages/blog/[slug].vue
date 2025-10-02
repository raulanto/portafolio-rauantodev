<script setup>
const slug = useRoute().params.slug
const {data: post} = await useAsyncData(`blog-${slug}`, () => {
    return queryCollection('blog').path(`/blog/${slug}`).first()
})


</script>

<template>

    <lazy-navar/>
    <main class="container mx-auto mt-8">
        <div class="flex flex-wrap justify-between">
            <div class="w-full md:w-8/12 px-4 mb-8">
                <div class="max-w-3xl mx-auto">
                    <div
                        class="mt-3  rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
                        <div class="">
                            <address class="flex items-center mb-6 not-italic">
                                <div class="inline-flex items-center mr-3 text-sm  ">
                                    <img class="mr-4 w-16 h-16 rounded-full"
                                         src="https://avatars.githubusercontent.com/u/74162376?v=4" alt="Jese Leos">
                                    <div>
                                        <a href="#" rel="author" class="text-xl font-bold  ">rauanto</a>
                                        <p class="text-base text-gray-500 dark:text-gray-400">Desarrollador Full Stack,</p>
                                        <p class="text-base text-gray-500 dark:text-gray-400">
                                            <time pubdate datetime="2022-02-08" title="February 8th, 2022">{{ post.date }}
                                            </time>
                                        </p>
                                    </div>
                                </div>
                            </address>
                            <h1  class=" font-bold text-4xl serif-text">{{post.title}}</h1>
                            <div class="py-5 text-sm font-regular  flex gap-2">
                                <UBadge>{{post.date}}</UBadge>
                                <div class="flex gap-2 flex-wrap">
                                    <UBadge
                                        v-for="tag in post.tags"
                                        :key="tag"
                                        size="md"
                                        color="neutral"
                                        variant="soft">
                                        {{ tag }}
                                    </UBadge>
                                </div>

                            </div>
                            <p v-if="post" class="text-base leading-8">
                                <ContentRenderer  :value="post"/>
                            </p>
                            <div v-else class="flex gap-2">
                                No se encontraron resultados
                            </div>


                        </div>

                    </div>
                </div>
            </div>
            <div class="w-full md:w-4/12 px-4 mb-8">
                <div class="bg-gray-100 px-4 py-6 rounded sticky top-0">
                    <h3 class="text-lg font-bold mb-2">Categories</h3>
                    <ul class="list-disc list-inside">
                        <li><a href="#" class="text-gray-700 hover:text-gray-900">Technology</a></li>
                        <li><a href="#" class="text-gray-700 hover:text-gray-900">Travel</a></li>
                        <li><a href="#" class="text-gray-700 hover:text-gray-900">Food</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </main>

</template>