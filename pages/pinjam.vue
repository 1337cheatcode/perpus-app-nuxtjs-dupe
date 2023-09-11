<script setup lang="tsx">
import { generate } from "lean-qr";

import { ref } from 'vue';
const peminjam = ref('')
const buku = ref('')
const qr = ref('')
const canvas = ref<HTMLCanvasElement>();

function ye(){
  if (canvas.value!=undefined) {
    qr.value = `p,${peminjam.value},${buku.value}`;
    return generate(qr.value).toCanvas(canvas.value);
  }
}
</script>

<template>
  <div>
    <label>Nama</label>
    <input v-model="peminjam">
    <label>Buku</label>
    <input v-model="buku">
    <button @click="ye">Pinjam!</button>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style>
  canvas {
    aspect-ratio: 1;
    image-rendering: pixelated;
  }

@media screen and (max-aspect-ratio: 1) {
  canvas {
    min-width: 80vw;
  }
}

@media screen and (min-aspect-ratio: 1) {
  canvas {
    min-height: 75vh;
  }
}
</style>