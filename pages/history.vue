<script setup lang="tsx">
import {initializeApp} from "firebase/app";
import {getFirestore,getDocs,collection,DocumentData} from "firebase/firestore";
const db = getFirestore(initializeApp(JSON.parse(useRuntimeConfig().public.FIREBASE_CONFIG)));
const alldocs = ref((await getDocs(collection(db, 'peminjaman')))
                            .docs .map((d)=>({id:d.id,data:d.data()}))
                                  .sort((a,b)=>a.data.pinjam.waktu-b.data.pinjam.waktu));
function ExtractData(d:{id:string,data:DocumentData}){
  return <div>{d.id}, {d.data}</div>;
}

const bulanAngkaKeHurufDict = {
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
const bulanAngkaKeHuruf = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

//function uniqKaliYa(t:any={}){return (e:any)=>!(t[e]=e in t)}
//(arr:number[][])=>((acc:number[],curr:number[],i:number)=>i>0?(curr[0]==acc[0]&&curr[1]==acc[1]?arr:[...arr,curr]):[...arr,curr])(new Array<number[]>())
const bulans=alldocs.value.map(doc=>((date)=>[date.getFullYear(),date.getMonth()] as Array<number>)(doc.data.pinjam.waktu.toDate())).filter(((t:any)=>(e:any)=>!(t[e]=e in t))({})).map(tgl=>`${bulanAngkaKeHuruf[tgl[1]]} ${tgl[0]}`);
//const bulans=[...new Set(alldocs.value.map(doc=>((date:Date)=>new Date(date.getFullYear(),date.getMonth()) as Date)(doc.data.pinjam.waktu.toDate())))].sort((a,b)=>b[0]-a[0]);
const bulan = ref(bulans[0]?bulans[0]:'');
</script>

<template>
  <main>
    <div>
      <span>{{ bulans }}</span>
      <select v-model="bulan">
        <option v-for="b in bulans">{{ b }}</option>
      </select>
      <span>{{ bulan }}</span>
      <div v-for="d in alldocs" style="text-align: center;">{{ d.id }}, {{ d.data }}</div>
    </div>
  </main>
</template>