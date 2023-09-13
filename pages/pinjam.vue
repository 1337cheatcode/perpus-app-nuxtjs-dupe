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
  <main>
    <div class="form">
      <label>Nama</label>
      <input v-model="peminjam">
      <label>Buku</label>
      <input v-model="buku">
      <button @click="ye">Pinjam!</button>
    </div>
    <div id="qr">
      <canvas ref="qrcanv" />
    </div>
  </main>
  
</template>

<style>
div.form *{
  display: block;
}
</style>