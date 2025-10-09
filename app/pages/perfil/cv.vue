<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";

const route = useRoute()
const items = computed<NavigationMenuItem[]>(() => [
    {
        label: 'Cv',
        to: '/perfil/cv',

    },
    {
        label: 'Linkedin',
        to: 'https://www.linkedin.com/in/raul-antonio-de-la-cruz-hernandez-514464185/',
        target: '_blank'
    }
])

</script>

<template>
    <Navar :items="items"></Navar>
        <section class="overflow-y-auto h-screen">
            <div id="pdf-content" class="container max-w-5xl mx-auto p-4 my-8">
                <div
                    class=" rounded-xl shadow-xl overflow-hidden border-neutral-600  bg-white dark:bg-neutral-900 dark:border-neutral-800">

                    <!-- Header Section -->
                    <header
                        class="bg-gradient-to-r from-primary-600 to-primary-700 animate-gradient text-white p-6 md:p-10">
                        <div class="flex flex-col md:flex-row items-center">
                            <div class="md:w-1/4 flex justify-center mb-6 md:mb-0">
                                <div
                                    class="h-40 w-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                                    <img src="https://avatars.githubusercontent.com/u/74162376?v=4"
                                         alt="Rual antonio de la cruz hernandez" class="w-full h-full object-cover">
                                </div>
                            </div>
                            <div class="md:w-3/4 text-center md:text-left md:pl-8">
                                <h1 class="text-3xl md:text-4xl font-bold mb-2">Raul antonio de la cruz hernandez</h1>
                                <h2 class="text-xl md:text-2xl font-medium mb-4">Desarrollador Full Stack</h2>
                                <div class="flex flex-wrap justify-center md:justify-start gap-3">
                                    <div
                                        class="flex items-center bg-white text-neutral-950 bg-opacity-20 rounded-full px-4 py-1">
                                        <a href="mailto:raulantodev@gmail.com" target="_blank"
                                           class="text-sm text-neutral-950">raulantodev@gmail.com</a>
                                    </div>

                                    <div class="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-1">
                                        <a href="www.linkedin.com/in/raul-antonio-de-la-cruz-hernandez-514464185"
                                           class="text-sm text-neutral-950">linkedin</a>
                                    </div>
                                    <div class="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-1">
                                        <a href="https://github.com/raulanto"
                                           class="text-sm text-neutral-950">github</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <!-- Main Content -->
                    <div class="p-6 md:p-10">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <!-- Left Column -->
                            <div class="col-span-2">
                                <!-- About Me -->
                                <div class="mb-8">
                                    <h2 class="text-xl font-bold  mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             class="h-5 w-5 mr-2 text-primary-600 dark:text-primary-300"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                        </svg>
                                        Resumen
                                    </h2>
                                    <div class="w-16 h-1 bg-primary-600 dark:bg-primary-300 mb-4"></div>
                                    <p class="">
                                        Desarrollador Full Stack especializado en Vue.js y Django entre otras, con
                                        experiencia en el desarrollo de aplicaciones web escalables y APIs RESTful.
                                        Orientado a la resolución eficiente de problemas y al trabajo colaborativo.
                                        Capacidad demostrada para abstraer conceptos complejos y transformarlos en
                                        soluciones prácticas que generen valor.
                                    </p>
                                </div>

                                <!-- Professional Experience -->
                                <div class="mb-8">
                                    <h2 class="text-xl font-bold  mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             class="h-5 w-5 mr-2 text-primary-600 dark:text-primary-300"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                        Experiencia Profesional
                                    </h2>
                                    <div class="w-16 h-1 bg-primary-600 mb-4 dark:bg-primary-300"></div>
                                    <!-- Experience 2 -->
                                    <div
                                        class="relative pl-6 border-l-2 border-primary-200 dark:border-neutral-700 mb-4">
                                        <div
                                            class="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary-600 dark:bg-primary-400 "></div>
                                        <h3 class="text-lg font-bold ">EsieGraph | Frontend
                                            Developer</h3>
                                        <p class="text-primary-600 dark:text-primary-300 font-medium text-sm mb-2">
                                            Agosto 2024 a Junio
                                            2025</p>
                                        <p class="font-medium text-sm  mt-2">Atribuciones:</p>
                                        <ul class="list-disc pl-5 text-sm  space-y-1">
                                            <li>
                                                Consumo e integración de API RESTful para gestión de datos.
                                            </li>
                                            <li>
                                                Interfaz de usuario responsive y optimizada para múltiples dispositivos.
                                            </li>

                                            <li>
                                                Endpoints optimizados para consultas históricas y reportes.
                                            </li>
                                        </ul>
                                        <!--                                                                                <p class="font-medium text-sm text-gray-700 mt-2">Key Skills:</p>
                                                                                                                        <p class="text-sm text-gray-600">React.js | Remix | TypeScript | JavaScript |
                                                                                                                            Tailwind CSS | API Integrations | UI/UX Development | Performance
                                                                                                                            Optimization</p>-->
                                    </div>
                                    <!-- Experience 1 -->
                                    <div
                                        class="mb-6 relative pl-6 border-l-2 border-primary-200 dark:border-neutral-700">
                                        <div
                                            class="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary-600 dark:bg-primary-400"></div>
                                        <h3 class="text-lg font-bold ">Desarrollador de Software para depuradora</h3>
                                        <p class="text-primary-600 dark:text-primary-300 font-medium text-sm mb-2">
                                            Diciembre 2023 a Junio
                                            2024</p>
                                        <p class="font-medium text-sm  mt-2">Atribuciones:</p>
                                        <ul class="list-disc pl-5 text-sm  space-y-1">
                                            <li>
                                                Desarrollo Full Stack de sistema de monitoreo IoT utilizando Nuxt.js
                                                (Vue.js) y Django REST Framework.
                                            </li>
                                            <li>
                                                Backend: API RESTful para gestión, procesamiento y almacenamiento de
                                                datos de sensores en tiempo real.
                                            </li>

                                            <li>
                                                Frontend: Interfaz de usuario interactiva con Nuxt.js para visualización
                                                de lecturas, gráficos históricos y gestión de dispositivos.
                                            </li>
                                            <li>
                                                Integración completa frontend-backend mediante consumo de API RESTful,
                                                garantizando comunicación eficiente y manejo de estados.
                                            </li>
                                        </ul>
                                    </div>


                                </div>

                                <!--                                 Projects
                                                                                                <div>
                                                                                                    <h2 class="text-xl font-bold  mb-2 flex items-center">
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600"
                                                                                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                                                                                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                                                                                                        </svg>
                                                                                                        Certifications
                                                                                                    </h2>
                                                                                                    <div class="w-16 h-1 bg-primary-600 mb-4"></div>

                                                                                                    &lt;!&ndash; Certification 1 &ndash;&gt;
                                                                                                    <div class="mb-4 p-4 border-l-4 border-primary-600 bg-primary-50 rounded-r">
                                                                                                        <h3 class="text-lg font-semibold ">Agile Principles and
                                                                                                            Methodologies Course</h3>
                                                                                                    </div>

                                                                                                    &lt;!&ndash; Certification 2 &ndash;&gt;
                                                                                                    <div class="mb-4 p-4 border-l-4 border-primary-600 bg-primary-50 rounded-r">
                                                                                                        <h3 class="text-lg font-semibold ">Front-End Engineer Career
                                                                                                            Path</h3>
                                                                                                    </div>

                                                                                                    &lt;!&ndash; Certification 3 &ndash;&gt;
                                                                                                    <div class="p-4 border-l-4 border-primary-600 bg-primary-50 rounded-r">
                                                                                                        <h3 class="text-lg font-semibold ">Learn CSS: Responsive Design
                                                                                                            Course</h3>
                                                                                                    </div>
                                                                                                </div>-->
                            </div>

                            <!-- Right Column -->
                            <div>
                                <!-- Skills -->
                                <div class="mb-8">
                                    <h2 class="text-xl font-bold  mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             class="h-5 w-5 mr-2 text-primary-600 dark:text-primary-300"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                        </svg>
                                        Skills
                                    </h2>
                                    <div class="w-16 h-1 bg-primary-600 dark:bg-primary-300 mb-4"></div>

                                    <!-- Skill Items -->

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <!-- Vue.js -->
                                        <div
                                            class="flex items-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg ">
                                            <div
                                                class="w-10 h-10 bg-primary-600 dark:bg-primary-300 dark:text-neutral-800 text-white  rounded-lg flex items-center justify-center mr-3">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                     class="w-6 h-6">
                                                    <path fill="currentColor"
                                                          d="M2 3h3.5L12 15l6.5-12H22L12 21L2 3m4.5 0h3L12 7.58L14.5 3h3L12 13.08L6.5 3Z"/>
                                                </svg>
                                            </div>
                                            <span class="font-medium ">Vue.js</span>
                                        </div>

                                        <!-- Nuxt.js -->
                                        <div
                                            class="flex items-center p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                            <div
                                                class="w-10 h-10 bg-primary-600 dark:bg-primary-300 dark:text-neutral-800 text-white rounded-lg flex items-center justify-center mr-3">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                     class="w-6 h-6">
                                                    <path fill="currentColor"
                                                          d="M13.98 3.43L20.95 15.68C21.55 16.68 20.85 18 19.68 18H5.32C4.15 18 3.45 16.68 4.05 15.68L11.02 3.43C11.62 2.43 13.38 2.43 13.98 3.43Z"/>
                                                </svg>
                                            </div>
                                            <span class="font-medium ">Nuxt.js</span>
                                        </div>

                                        <!-- JavaScript -->
                                        <div
                                            class="flex items-center p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                            <div
                                                class="w-10 h-10 bg-primary-600 dark:bg-primary-300 dark:text-neutral-800 text-white rounded-lg flex items-center justify-center mr-3">
                                                js
                                            </div>
                                            <span class="font-medium ">JavaScript</span>
                                        </div>

                                        <!-- TypeScript -->
                                        <div
                                            class="flex items-center p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                            <div
                                                class="w-10 h-10 bg-primary-600 dark:bg-primary-300 dark:text-neutral-800 text-white rounded-lg flex items-center justify-center mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                     class="w-6 h-6">
                                                    <path fill="currentColor"
                                                          d="M3 3h18v18H3V3m10.71 14.86c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8zM13 11.25H8v1.5h1.5V20h1.75v-7.25H13v-1.5z"/>
                                                </svg>
                                            </div>
                                            <span class="font-medium ">TypeScript</span>
                                        </div>

                                        <!-- Tailwind CSS -->
                                        <div
                                            class="flex items-center p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                            <div
                                                class="w-10 h-10 bg-primary-600 dark:bg-primary-300 dark:text-neutral-800 text-white rounded-lg flex items-center justify-center mr-3">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                     class="w-6 h-6">
                                                    <path fill="currentColor"
                                                          d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.5 6 12 6m-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.5 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.5 12 7 12Z"/>
                                                </svg>
                                            </div>
                                            <span class="font-medium ">Tailwind CSS</span>
                                        </div>

                                        <!-- Angular -->
                                        <div
                                            class="flex items-center p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                            <div
                                                class="w-10 h-10 bg-primary-600  dark:bg-primary-300 dark:text-neutral-800 text-white rounded-lg flex items-center justify-center mr-3">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                     class="w-6 h-6">
                                                    <path fill="currentColor"
                                                          d="M12 2L3.5 6.25l1.32 11.5L12 22l7.18-4.25L20.5 6.25L12 2m0 2.15l6.5 2.85-.9 7.85L12 18.7l-5.6-3.85-.9-7.85L12 4.15m-1 3.7L7.75 15h1.5l.5-1.5h4.5l.5 1.5h1.5L13 7.85h-2m1 2.5l1.25 3.5h-2.5L12 10.35Z"/>
                                                </svg>
                                            </div>
                                            <span class="font-medium ">Angular</span>
                                        </div>

                                        <!-- Python -->
                                        <div
                                            class="flex items-center p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                            <div
                                                class="w-10 h-10 bg-primary-600 dark:bg-primary-300 dark:text-neutral-800 text-white rounded-lg flex items-center justify-center mr-3">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                     class="w-6 h-6">
                                                    <path fill="currentColor"
                                                          d="M9.585 11.692h4.328s2.432.039 2.432-2.35V5.391S16.714 3 11.936 3C7.362 3 7.647 4.983 7.647 4.983l.006 2.055h4.363v.617H5.92s-2.927-.332-2.927 5.282 2.555 5.45 2.555 5.45h1.524v-2.141s-.083-2.554 2.513-2.554zm-.056-5.74a.784.784 0 1 1 0-1.57.784.784 0 1 1 0 1.57z"/>
                                                    <path fill="currentColor"
                                                          d="M18.452 7.532h-1.524v2.141s.083 2.554-2.513 2.554h-4.328s-2.432-.04-2.432 2.35v3.951s-.369 2.391 4.409 2.391c4.573 0 4.288-1.983 4.288-1.983l-.006-2.054h-4.363v-.617h6.097s2.927.332 2.927-5.282-2.555-5.451-2.555-5.451zm-4.863 10.417a.784.784 0 1 1 0 1.57.784.784 0 1 1 0-1.57z"/>
                                                </svg>
                                            </div>
                                            <span class="font-medium ">Python</span>
                                        </div>

                                        <!-- Django -->
                                        <div
                                            class="flex items-center p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                            <div
                                                class="w-10 h-10 bg-primary-600 dark:bg-primary-300 dark:text-neutral-800 text-white rounded-lg flex items-center justify-center mr-3">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                     class="w-6 h-6">
                                                    <path fill="currentColor"
                                                          d="M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.166-7.288-6.32 0-4.002 2.65-6.6 6.753-6.6.637 0 1.121.05 1.707.203zm0 9.143a3.894 3.894 0 0 0-1.325-.204c-1.988 0-3.134 1.223-3.134 3.365 0 2.09 1.096 3.236 3.109 3.236.433 0 .79-.025 1.35-.102V9.142zM21.314 6.06v9.097c0 3.134-.229 4.638-.917 5.937-.637 1.249-1.478 2.039-3.211 2.905l-3.644-1.733c1.733-.815 2.574-1.529 3.109-2.625.561-1.121.739-2.421.739-5.835V6.059h3.924zM17.39.021h3.924v4.026H17.39z"/>
                                                </svg>
                                            </div>
                                            <span class="font-medium ">Django</span>
                                        </div>

                                        <!-- PHP -->
                                        <div
                                            class="flex items-center p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                            <div
                                                class="w-10 h-10 bg-primary-600 text-white dark:bg-primary-300 dark:text-neutral-800 rounded-lg flex items-center justify-center mr-3">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                     class="w-6 h-6">
                                                    <path fill="currentColor"
                                                          d="M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12s-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.442 2.273h1.088c.696 0 1.182.183 1.458.55.275.366.335.896.179 1.589l-.589 3.03h-1.367zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.681h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.752zM17.766 10.207h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.125-.995s-.524-.29-1.047-.29z"/>
                                                </svg>
                                            </div>
                                            <span class="font-medium ">PHP</span>
                                        </div>

                                        <!-- Laravel -->
                                        <div
                                            class="flex items-center p-3 bg-gray-50 rounded-lg dark:bg-neutral-800">
                                            <div
                                                class="w-10 h-10 bg-primary-600 text-white  dark:bg-primary-300 dark:text-neutral-800 rounded-lg flex items-center justify-center mr-3">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                     class="w-6 h-6">
                                                    <path fill="currentColor"
                                                          d="M23.642 5.43a.364.364 0 0 1 .014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 0 1-.188.326L9.93 23.949a.316.316 0 0 1-.066.027c-.008.002-.016.008-.024.01a.348.348 0 0 1-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 0 1-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 0 1 .023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 0 1 .375 0L9.93 2.647h.002c.015.01.027.021.04.033l.038.027c.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.021.013.032.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.01.01-.02.013-.032a.487.487 0 0 1 .024-.059c.007-.012.018-.02.025-.033.012-.015.021-.03.033-.043.012-.012.025-.02.037-.028.014-.01.026-.023.041-.032h.001l4.513-2.598a.375.375 0 0 1 .375 0l4.513 2.598c.016.01.027.021.042.031.012.01.025.018.036.028.013.014.022.03.034.044.008.012.019.021.024.033.011.02.018.04.024.06.006.01.012.021.015.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.51 7.75v-4.287l-2.147 1.225-6.126 3.498v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445-.002-.003H5.04c-.014-.01-.025-.021-.04-.031-.011-.01-.024-.018-.035-.027l-.001-.002c-.013-.012-.021-.025-.031-.04-.01-.011-.021-.022-.028-.036h-.002c-.008-.014-.013-.031-.02-.047-.006-.016-.014-.027-.018-.043a.49.49 0 0 1-.008-.057c-.002-.014-.006-.027-.006-.041V5.789l-2.18-1.257zm5.23-2.276L1.84 3.539l4.482 2.58 4.483-2.58zm1.956 13.51l2.182-1.256V3.624l-1.58.91-2.182 1.255v9.979zm11.788-10.71l-4.481 2.58 4.481 2.58 4.483-2.58zm-.376 4.967l-2.182-1.256-1.579-.908v4.283l2.182 1.256 1.58.908zm-8.65-9.654v4.283l1.579-.908 2.182-1.256V3.624z"/>
                                                </svg>
                                            </div>
                                            <span class="font-medium ">Laravel</span>
                                        </div>
                                    </div>

                                </div>

                                <!-- Education -->
                                <div>
                                    <h2 class="text-xl font-bold  mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             class="h-5 w-5 mr-2 text-primary-600 dark:text-primary-300"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                                            <path
                                                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
                                        </svg>
                                        Educacion
                                    </h2>
                                    <div class="w-16 h-1 bg-primary-600 dark:bg-primary-300 mb-4"></div>

                                    <!-- Education Items -->
                                    <div class="space-y-4">
                                        <!-- Education 1 -->
                                        <div
                                            class="relative pl-6 border-l-2 border-primary-200 dark:border-primary-300">
                                            <div
                                                class="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full "></div>
                                            <div class="bg-neutral-50 p-3 rounded dark:bg-neutral-800">
                                                <p class="text-xs font-semibold text-primary-600  dark:text-primary-300">Agosto 2022 a Agosto
                                                    2025</p>
                                                <h3 class="font-semibold">Tec de Villahermosa </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Contact -->
                                <div class="mt-8">
                                    <h2 class="text-xl font-bold  mb-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-600 dark:text-primary-300"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                        Contacto
                                    </h2>
                                    <div class="w-16 h-1 bg-primary-600 dark:bg-primary-300 mb-4"></div>
                                    <div class="space-y-2">
                                        <div class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 class="h-5 w-5 mr-2 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24"
                                                 stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                            </svg>
                                            <span class="text-sm">raulantodev@gmail.com</span>
                                        </div>
                                        <div class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 class="h-5 w-5 mr-2 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24"
                                                 stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/>
                                            </svg>
                                            <a href="www.linkedin.com/in/raul-antonio-de-la-cruz-hernandez-514464185"
                                               class="text-sm">raul-antonio-de-la-cruz-hernandez</a>
                                        </div>
                                        <div class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 class="h-5 w-5 mr-2 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24"
                                                 stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                                            </svg>
                                            <a href="https://github.com/raulanto" class="text-sm">Github</a>
                                        </div>
                                        <div class="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 class="h-5 w-5 mr-2 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24"
                                                 stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                                            </svg>
                                            <a href="https://portafolio-rauantodev.vercel.app/" class="text-sm">portafolio-rauantodev.vercel.app/</a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div
                        class="bg-neutral-100 dark:bg-neutral-800 p-4 text-center text-sm  border-t border-neutral-200 dark:border-neutral-700">
                        <p> © 2025 rauanto</p>
                    </div>

                </div>
            </div>
        </section>


</template>

<style scoped>

</style>