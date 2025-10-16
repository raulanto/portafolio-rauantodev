<script setup lang="ts">

import Particles from "~/components/ui/Particles.vue";
import AllKey from "~/components/ui/allKey.vue";
import ShinyText from "~/components/ui/ShinyText.vue";
</script>

<template>
    <div  class="relative w-full min-h-screen overflow-hidden grid-background fondo">
    <div class="absolute h-full w-full">
        <div class="absolute bottom-0 left-0 right-0 top-0
            bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]
            [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
        </div>
        <!--            <LazyUiPlasma-->
        <!--                color="#60a5fa"-->
        <!--                :speed="0.5"-->
        <!--                direction="forward"-->
        <!--                :scale="1"-->
        <!--                :opacity="2"-->
        <!--                :pause-when-hidden="false"-->
        <!--                :mouseInteractive="false"-->
        <!--            />-->

    </div>
        <div class="relative z-10 ">
            <section class="w-full">
                <UError
                    class="z-10"
                    :error="{
      statusCode: 404,
      statusMessage: 'Page not found',
      message: 'The page you are looking for does not exist.'
    }"
                />
            </section>
        </div>

    </div>
</template>

<style scoped>

</style>