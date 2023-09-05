<script setup>
import {initializeApp} from "firebase/app";
import {getFirestore, collection, query, where, getDocs} from "firebase/firestore";
//declare const process:{env:{FIREBASE_CONFIG:string}};
const db = getFirestore(initializeApp(JSON.parse(process.env.FIREBASE_CONFIG)));

import { ref, reactive } from "vue"
const ye = ref(true);

const alldoc = ref(new Object());
(await getDocs(query(collection(db, 'peminjaman', ),where('kembali','==',null)))).forEach(doc=>{
  alldoc.value[doc.id]=doc.data()
});

const bulanAngkaKeHuruf = {
  1:'Januari',
  2:'Februari',
  3:'Maret',
  4:'April',
  5:'Mei',
  6:'Juni',
  7:'Juli',
  8:'Agustus',
  9:'September',
  10:'Oktober',
  11:'November',
  12:'Desember',
}
</script>

<template>
  <div v-if="ye">
    <ol>
      <span v-for="(data, id) in alldoc">
        <li>{{ data.peminjam }} meminjam "{{ data.buku }}" pada tanggal {{ data.pinjam!=null?(tgl=>`${tgl.getDate()} ${bulanAngkaKeHuruf[1+tgl.getMonth()]} ${tgl.getFullYear()}`)(data.pinjam.waktu.toDate()):'tak tertulis' }}</li>
      </span>
    </ol>
  </div>
  <div v-else>
    <NuxtWelcome />
  </div>
</template>