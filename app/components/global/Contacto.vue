<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')
const isLoading = ref(false)

const sendEmail = () => {
    if (!message.value.trim()) {
        alert('Por favor escribe un mensaje')
        return
    }

    isLoading.value = true

    // Crear el enlace de Gmail
    const subject = encodeURIComponent('Nuevo mensaje de contacto')
    const body = encodeURIComponent(message.value)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=raulantodev@gmail.com&subject=${subject}&body=${body}`

    // Abrir Gmail en nueva ventana
    window.open(gmailUrl, '_blank')

    // Limpiar el formulario
    message.value = ''
    isLoading.value = false
}

const handleSubmit = (e: Event) => {
    e.preventDefault()
    sendEmail()
}
</script>

<template>
    <section id="contacto" class="relative overflow-hidden py-30">
        <div class="absolute inset-0 w-full h-full">
            <div
                class="absolute h-full w-full bg-[radial-gradient(#9ca3af_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        <div class="mx-auto mt-10 max-w-7xl px-6 lg:px-8 relative z-10">

            <div
                class="relative isolate overflow-hidden bg-neutral-950 px-6 py-24 shadow-2xl rounded-2xl sm:rounded-3xl sm:px-24 xl:py-32">

                <div class="absolute inset-0 z-0">
                    <lazy-ui-animate-graph/>
                </div>

                <h2 class="mx-auto relative z-10 max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl serif-text">
                    Contactame</h2>

                <p class="mx-auto relative z-10 mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
                    ¿Tienes un proyecto en mente? Hagámoslo realidad
                </p>

                <form @submit="handleSubmit" class="mx-auto relative z-10 mt-10 flex flex-col max-w-md gap-4">

                    <label for="message" class="sr-only">Mensaje</label>
                    <textarea
                        id="message"
                        v-model="message"
                        name="message"
                        rows="4"
                        :disabled="isLoading"
                        class="w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 resize-none"
                        placeholder="Escribe tu mensaje aquí...">
                    </textarea>

                    <button
                        type="submit"
                        :disabled="isLoading || !message.trim()"
                        class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ isLoading ? 'Enviando...' : 'Enviar' }}
                    </button>
                </form>

                <svg viewBox="0 0 1024 1024"
                     class="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
                     aria-hidden="true">
                    <circle cx="512" cy="512" r="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                            fill-opacity="0.7">
                    </circle>
                    <defs>
                        <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641" cx="0" cy="0" r="1"
                                        gradientUnits="userSpaceOnUse"
                                        gradientTransform="translate(512 512) rotate(90) scale(512)">
                            <stop stop-color="#3b82f6"></stop>
                            <stop offset="1" stop-color="#1d4ed8" stop-opacity="0"></stop>
                        </radialGradient>
                    </defs>
                </svg>

            </div>
        </div>
    </section>
</template>

<style scoped>
</style>