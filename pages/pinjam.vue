<script setup lang="tsx">
import { generate } from "lean-qr";

import { ref } from 'vue';
const peminjam = ref('')
const buku = ref('')
const qr = ref('')
const qrcanv = ref<HTMLCanvasElement>();

function ye(){
  if (qrcanv.value!=undefined) {
    return generate(qr.value=`p,${peminjam.value},${buku.value}`).toCanvas(qrcanv.value);
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
  </div>
  <div>
    <canvas ref="qrcanv"></canvas>
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