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

//TODO: bikin xl download
//TODO: tabel merge 2 baris (untuk waktu dan staf peminjam)

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

function tulisanTgl(tgl:Date){
  const bulanAngkaKeHuruf = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${tgl.getDate()} ${bulanAngkaKeHuruf[tgl.getMonth()]} ${tgl.getFullYear()}`;
}

//function uniqKaliYa(t:any={}){return (e:any)=>!(t[e]=e in t)}
//(arr:number[][])=>((acc:number[],curr:number[],i:number)=>i>0?(curr[0]==acc[0]&&curr[1]==acc[1]?arr:[...arr,curr]):[...arr,curr])(new Array<number[]>())
//unique value filter magic .filter(((t:any)=>(e:any)=>!(t[e]=e in t))({}))
const bulans=['Semua'].concat(alldocs.value.map(doc=>((date)=>[date.getFullYear(),date.getMonth()] as Array<number>)(doc.data.pinjam.waktu.toDate())).filter(((t:any)=>(e:any)=>!(t[e]=e in t))({})).map(tgl=>`${bulanAngkaKeHuruf[tgl[1]]} ${tgl[0]}`));
//const bulans=[...new Set(alldocs.value.map(doc=>((date:Date)=>new Date(date.getFullYear(),date.getMonth()) as Date)(doc.data.pinjam.waktu.toDate())))].sort((a,b)=>b[0]-a[0]);
const bulan = ref('Semua');
const docsPadaBulan = computed(()=>alldocs.value.filter(d=>((date,b,t)=>date<new Date(t,1+b)&&date>=new Date(t,b))(d.data.pinjam.waktu.toDate(),bulanAngkaKeHuruf.indexOf(bulan.value.slice(0,-5)),+bulan.value.slice(-4))));

const mainFocus = ref<HTMLSelectElement>();
function keyListen(ev:KeyboardEvent){
  console.log(ev);
  if(mainFocus.value)mainFocus.value.focus();
}
</script>

<template>
  <main>
    <div>
      <select ref="mainFocus" v-model="bulan">
        <option v-for="b in bulans">{{ b }}</option>
      </select>
      <table>
        <thead>
          <tr>
            <th id="th-nama">Nama</th>
            <th id="th-buku">Buku</th>
            <th id="th-waktu">Tanggal Pinjam</th>
            <th id="th-waktu">Tanggal Kembali</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in bulan=='Semua'?alldocs:docsPadaBulan">
            <td class="nama">{{ doc.data.peminjam }}</td>
            <td class="buku">{{ doc.data.buku }}</td>
            <td class="waktu pinjam">{{ tulisanTgl(doc.data.pinjam.waktu.toDate()) }}</td>
            <td class="waktu kembali">{{ doc.data.kembali?tulisanTgl(doc.data.kembali.waktu.toDate()):'' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>