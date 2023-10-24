<script setup lang="tsx">
import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";

import { generate } from "lean-qr";

import { ref } from 'vue';

const qs = useRoute().query,
      peminjam = ref(qs.nama?qs.nama:''),
      barang = ref(qs.barang?qs.barang:''),
      qr = ref(''),
      qrcanv = ref<HTMLCanvasElement>(),
      urlPusher = useRouter().push;

function yey(ev:KeyboardEvent){
  if(ev.key=="Enter")ye();
}

function ye(){
  if(peminjam.value&&barang.value){
    const db = getFirestore(initializeApp(JSON.parse(useRuntimeConfig().public.FIREBASE_CONFIG)));
    const dbQuery = query(
                      collection(db,'peminjaman barang'),
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
            alert(`Peminjaman terdaftar\n${peminjam.value}\n${barang.value}`)
            navigateTo('/list');
          }
        });
        generate(qr.value=`p,${peminjam.value},${barang.value}`).toCanvas(qrcanv.value);
      }
    });
  }
}

watch([peminjam,barang],function([p,b]){
  urlPusher({path:'pinjam',query:b?(p?{nama:p,barang:b}:{barang:b}):(p?{nama:p}:{})})
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
      <label>Barang</label>
      <input v-model="barang" required>
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