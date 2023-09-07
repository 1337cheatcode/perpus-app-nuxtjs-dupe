<script setup lang="ts">
import { ref } from "vue"
const ye = ref(true)

console.log(process.env.FIREBASE_CONFIG);
</script>

<template>
  <div>
    <div v-if="ye">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <div v-else>
      <NuxtWelcome />
    </div>
  </div>
</template>