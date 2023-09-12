<script setup lang="tsx">
import {initializeApp} from "firebase/app";
import {getFirestore, collection, query, where, orderBy, getDocs} from "firebase/firestore";
//declare namespace process { namespace env {const FIREBASE_CONFIG:string}};
const db = getFirestore(initializeApp(JSON.parse(useRuntimeConfig().public.FIREBASE_CONFIG)));

import {generate} from 'lean-qr';
const panjang = (id:string)=>{
  if(qrcanv.value!=undefined){
    return generate(`x,${id}`).toCanvas(qrcanv.value);
  }
}
const kembali = (id:string)=>{
  if(qrcanv.value!=undefined){
    return generate(`k,${id}`).toCanvas(qrcanv.value);
  }
}

import { ref } from "vue";
const qrcanv = ref<HTMLCanvasElement>();
const alldocs = ref((await getDocs(
                            query(
                              collection(db, 'peminjaman'),
                              where('kembali','==',null)
                            )
                          )).docs.sort((a,b)=>a.data().pinjam.waktu-b.data().pinjam.waktu));

function tulisanTgl(tgl:Date){
  const bulanAngkaKeHuruf:any = {
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

  constructor(tgl:Date){
    this.tanggal = tgl.getDate();
    this.bulan = 1+tgl.getMonth();
    this.tahun = tgl.getFullYear();
  }

  toString(){
    return `${this.tanggal} ${simpleTgl.#bulanAngkaKeHuruf[this.bulan]} ${this.tahun}`;
  }

  static #bulanAngkaKeHuruf:any = {
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
  <table>
    <tr>
      <th>Nama</th>
      <th>Buku</th>
      <th>Tanggal</th>
      <th>Aksi</th>
    </tr>
    <tr>
      <td id="baru" colspan="4"><NuxtLink to="/pinjam"><button>+ pinjam</button></NuxtLink></td>
    </tr>
    <tr v-for="data in alldocs">
      <td class="nama">{{ data.data().peminjam }}</td>
      <td class="buku">{{ data.data().buku }}</td>
      <td class="tanggal">{{ data.data().pinjam!=null?tulisanTgl(data.data().pinjam.waktu.toDate()):'tak tercatat' }}</td>
      <td class="aksi"><button @click="(e)=>panjang(data.id)">+</button><button @click="(e)=>kembali(data.id)">v</button></td>
    </tr>
  </table>
  <div>
    <canvas ref="qrcanv"></canvas>
  </div>
</template>

<style>
table th, table td {
  text-align: center;
}

td#baru button{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

canvas{
  width: 600;
  width: 600;
  image-rendering: pixelated;
}
</style>