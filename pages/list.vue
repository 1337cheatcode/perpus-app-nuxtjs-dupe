<script setup lang="tsx">
import {initializeApp} from "firebase/app";
import {getFirestore, collection, query, where, Unsubscribe, getDocs, Timestamp, onSnapshot, doc, DocumentSnapshot} from "firebase/firestore";
//declare namespace process { namespace env {const FIREBASE_CONFIG:string}};
const db = getFirestore(initializeApp(JSON.parse(useRuntimeConfig().public.FIREBASE_CONFIG)));
let snap:Unsubscribe;

const onSnap = (id:string)=>(d:DocumentSnapshot)=>{
  const data = d.data();
  if(data!=undefined && data.kembali!=null){
    location.reload()
    snap();
  }
}

import {generate} from 'lean-qr';
import { StyleValue } from "vue";
const panjang = (id:string)=>{
  if(snap)snap();
  if(qrcanv.value!=undefined){
    snap = onSnapshot(doc(db,'peminjaman',id),onSnap(id));
    return generate(`x,${id}`).toCanvas(qrcanv.value);
  }
}
const kembali = (id:string)=>{
  if(snap)snap();
  if(qrcanv.value!=undefined){
    snap = onSnapshot(doc(db,'peminjaman',id),onSnap(id));
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
                          )).docs.map((d)=>({id:d.id,data:d.data()}))
                                 .sort((a,b)=>a.data.pinjam.waktu-b.data.pinjam.waktu));

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

const deadlineBalik = (waktu:Timestamp|undefined)=>
                        ((now:Timestamp)=>
                          waktu!=undefined?
                          {backgroundColor:`hsl(${1/3+Math.max(waktu.toMillis()-now.toMillis(),-604800000)/(3*604800000)}turn 100% 50%)`}:
                          {})
                        (Timestamp.now()) as StyleValue;
</script>

<template>
  <main>
    <div>
      <table>
        <thead>
          <tr>
            <th id="th-nama">Nama</th>
            <th id="th-buku">Buku</th>
            <th id="th-waktu">Tanggal</th>
            <th id="th-aksi">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td id="baru" colspan="4"><NuxtLink to="/pinjam"><button>+ pinjam</button></NuxtLink></td>
          </tr>
          <tr v-for="doc in alldocs">
            <td class="nama">{{ doc.data.peminjam }}</td>
            <td class="buku">{{ doc.data.buku }}</td>
            <td class="tanggal" :style="deadlineBalik(doc.data.pinjam.waktu)">{{ doc.data.pinjam!=null?tulisanTgl(doc.data.pinjam.waktu.toDate()):'tak tercatat' }}</td>
            <td class="aksi"><button @click="(e)=>panjang(doc.id)">+</button><button @click="(e)=>kembali(doc.id)">v</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="qr">
      <canvas ref="qrcanv"></canvas>
    </div>
  </main>
</template>

<style>
table{
  border-collapse: collapse;
  border: 3px double;
}

thead th#th-waktu{
  width:25%;
}

thead th#th-aksi{
  width:10%;
}

table th, table td {
  text-align: center;
  padding: .125rem .5rem;
  border: 1px solid;
}

td#baru button{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
/*
main>*{
  float:left;
  margin: auto;
}

main>*:last-child{
  float:right;
}

@media screen and (max-aspect-ratio: 1) {
  main>*,main>*:last-child{
    float: unset;
    width: unset;
  }

  canvas{
    display:block;
  }
}
*/
</style>