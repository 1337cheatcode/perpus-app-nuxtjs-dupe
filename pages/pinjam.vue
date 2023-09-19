<script setup lang="tsx">
import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, collection, query, where, getDocs, QuerySnapshot } from "firebase/firestore";

import { generate } from "lean-qr";

import { ref } from 'vue';
const peminjam = ref(''),
  buku = ref(''),
  qr = ref(''),
  qrcanv = ref<HTMLCanvasElement>();

function yey(ev:KeyboardEvent){
  if(ev.key=="Enter")ye();
}

function ye(){
  if(peminjam.value&&buku.value){
    const db = getFirestore(initializeApp(JSON.parse(useRuntimeConfig().public.FIREBASE_CONFIG)));
    const dbQuery = query(
                      collection(db,'peminjaman'),
                      where('peminjam','==',peminjam.value),
                      where('kembali','==',null)
                    );
    getDocs(dbQuery).then((docs)=>{
      if(!docs.empty){
        alert('anda masih pinjem cuy');
        navigateTo('/list');
      }else if(qrcanv.value!=undefined){
        const snap = onSnapshot(dbQuery,(qs)=>{
          if(qs.docs.length==1){
            navigateTo('/list');
            snap();
          }
        });
        generate(qr.value=`p,${peminjam.value},${buku.value}`).toCanvas(qrcanv.value);
      }
    });
  }
}
</script>

<template>
  <main>
    <div class="form" @keydown="yey">
      <label>Nama</label>
      <input v-model="peminjam" required>
      <label>Buku</label>
      <input v-model="buku" required>
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