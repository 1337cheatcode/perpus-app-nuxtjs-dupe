<script setup lang="tsx">
import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";

import { generate } from "lean-qr";

import { ref } from 'vue';

const qs = useRoute().query,
      peminjam = ref(qs.nama?qs.nama:''),
      buku = ref(qs.buku?qs.buku:''),
      qr = ref(''),
      qrcanv = ref<HTMLCanvasElement>(),
      urlPusher = useRouter().push;

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
        const snap = onSnapshot(dbQuery,(qsnap)=>{
          if(qsnap.docs.length==1){
            snap();
            //alert(qsnap.docs[0].id);
            alert(`Peminjaman terdaftar\n${peminjam.value}\n${buku.value}`)
            navigateTo('/list');
          }
        });
        generate(qr.value=`p,${peminjam.value},${buku.value}`).toCanvas(qrcanv.value);
      }
    });
  }
}

watch([peminjam,buku],function([p,b]){
  urlPusher({path:'pinjam',query:b?(p?{nama:p,buku:b}:{buku:b}):(p?{nama:p}:{})})
});
//TODO: shortcut pinjam buku gitu gtw sy -> queryString buku
//TODO: encode kode QR
//TODO: add alert
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