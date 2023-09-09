<script setup lang="tsx">
import VueQrcode from '@chenfengyuan/vue-qrcode'

import { ref } from 'vue';
const peminjam = ref('')
const buku = ref('')
const qr = ref('')

function ye(){
  return qr.value = `p,${peminjam.value},${buku.value}`;
}
</script>

<template>
  <div>
    <label>Nama</label>
    <input v-model="peminjam">
    <label>Buku</label>
    <input v-model="buku">
    <button @click="ye">Pinjam!</button>
    <VueQrcode :value="qr" v-if="qr"></VueQrcode>
  </div>
</template>