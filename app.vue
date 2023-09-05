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

function tulisanTgl(tgl){
  const bulanAngkaKeHuruf = {
    0:'Januari',
    1:'Februari',
    2:'Maret',
    3:'April',
    4:'Mei',
    5:'Juni',
    6:'Juli',
    7:'Agustus',
    8:'September',
    9:'Oktober',
    10:'November',
    11:'Desember',
  };
  return `${tgl.getDate()} ${bulanAngkaKeHuruf[tgl.getMonth()]} ${tgl.getFullYear()}`;
}

class simpleTgl {
  tanggal;
  bulan;
  tahun;

  constructor(tgl){
    this.tanggal = tgl.getDate();
    this.bulan = 1+tgl.getMonth();
    this.tahun = tgl.getFullYear();
  }

  toString(){
    return `${this.tanggal} ${simpleTgl.#bulanAngkaKeHuruf[this.bulan]} ${this.tahun}`;
  }

  static #bulanAngkaKeHuruf = {
    0:'Januari',
    1:'Februari',
    2:'Maret',
    3:'April',
    4:'Mei',
    5:'Juni',
    6:'Juli',
    7:'Agustus',
    8:'September',
    9:'Oktober',
    10:'November',
    11:'Desember',
  }
}


</script>

<template>
  <div v-if="ye">
    <ol>
      <span v-for="(data, id) in alldoc">
        <li>{{ data.peminjam }} meminjam "{{ data.buku }}" pada tanggal {{ data.pinjam!=null?tulisanTgl(data.pinjam.waktu.toDate()):'tak tertulis' }}</li>
      </span>
    </ol>
  </div>
  <div v-else>
    <NuxtWelcome />
  </div>
</template>