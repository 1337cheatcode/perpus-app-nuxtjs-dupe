<script setup lang="tsx">
import {initializeApp} from "firebase/app";
import {getFirestore,getDocs,collection,DocumentData} from "firebase/firestore";
const db = getFirestore(initializeApp(JSON.parse(useRuntimeConfig().public.FIREBASE_CONFIG)));
const alldocs = ref((await getDocs(collection(db, 'peminjaman')))
                            .docs .map((d)=>({id:d.id,data:d.data()}))
                                  .sort((a,b)=>b.data.pinjam.waktu-a.data.pinjam.waktu));
function ExtractData(d:{id:string,data:DocumentData}){
  return <div>{d.id}, {d.data}</div>;
}

//TODO: bikin xl download
//TODO: tabel merge 2 baris (untuk waktu dan staf peminjam) dan keterlambatan
//TODO: reverse urutan bulans

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
  mainFocus.value?.focus();
}

const antiblur = (ev:FocusEvent)=>mainFocus.value?.focus();

const isTelat = (pinjam:Date,kembali:Date)=>!(new Date(kembali.getFullYear(),kembali.getMonth(),kembali.getDate()).valueOf() // sekarang
                                              -new Date(pinjam.getFullYear(),pinjam.getMonth(),pinjam.getDate()).valueOf() // pinjam
                                              <604800000) // a week

import {utils,writeFileXLSX} from 'xlsx'
function saveExcel(ev:MouseEvent){
  let ws = utils.aoa_to_sheet([
    ['Nama','Buku','Tanggal Pinjam',,'Tanggal Kembali',,'Telat'],
    [,,'Tanggal','Staf','Tanggal','Staf']
  ].concat(docsPadaBulan.value.map((doc,i)=>((d)=>
    [d.peminjam,d.buku,d.pinjam.waktu.toDate(),d.pinjam.staf,d.kembali?d.kembali.waktu.toDate():null,d.kembali?d.kembali.staf:null,`=IF(FLOOR(C${3+i};1)+7<=FLOOR(E${3+i};1);"v";"")`]
  )(doc.data))));
  //const sexp = utils.json_to_sheet(docsPadaBulan.value.map(d=>d.data));
  const xlexp = utils.book_new();
  utils.book_append_sheet(xlexp,ws);
  return writeFileXLSX(xlexp,'cobates.xlsx')
}

onMounted(()=>{
  mainFocus.value?.focus();
})
</script>

<template>
  <main @keydown="keyListen">
    <div>
      <div>
        <select ref="mainFocus" v-model="bulan" @blur="antiblur">
          <option v-for="b in bulans">{{ b }}</option>
        </select>
        <button @click="saveExcel" :disabled="bulan=='Semua'">Download .xl</button>
      </div>
      <table>
        <thead>
          <tr>
            <th id="th-nama" rowspan="2">Nama</th>
            <th id="th-buku" rowspan="2">Buku</th>
            <th id="th-pinjam" colspan="2">Tanggal Pinjam</th>
            <th id="th-kempali" colspan="2">Tanggal Kembali</th>
            <th id="th-telat" rowspan="2">Telat</th>
          </tr>
          <tr>
            <th id="th-pinjam-waktu">Tanggal</th>
            <th id="th-pinjam-staf">Staf</th>
            <th id="th-kembali-waktu">Tanggal</th>
            <th id="th-kembali-staf">Staf</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in bulan=='Semua'?alldocs:docsPadaBulan">
            <td class="nama">{{ doc.data.peminjam }}</td>
            <td class="buku">{{ doc.data.buku }}</td>
            <td class="waktu pinjam">{{ tulisanTgl(doc.data.pinjam.waktu.toDate()) }}</td>
            <td class="staf pinjam">{{ doc.data.pinjam.staf }}</td>
            <td class="waktu kembali">{{ doc.data.kembali?tulisanTgl(doc.data.kembali.waktu.toDate()):'' }}</td>
            <td class="staf kembali">{{ doc.data.kembali?doc.data.kembali.staf:'' }}</td>
            <td class="telat"><span v-if="isTelat(doc.data.pinjam.waktu.toDate(),doc.data.kembali?doc.data.kembali.waktu.toDate():new Date())">v</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>