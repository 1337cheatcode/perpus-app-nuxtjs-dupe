<script setup lang="tsx">
import {initializeApp} from "firebase/app"
import {Firestore, addDoc, collection, doc, getDoc, getFirestore, serverTimestamp, updateDoc} from "firebase/firestore"
declare namespace process { namespace env {const FIREBASE_CONFIG:string}};

import QrScanner from 'qr-scanner';

import { ref, watch, onMounted } from 'vue';
const videoElement = ref<HTMLVideoElement>(),
      hasCamera = ref(true),
      hasFlash = ref(false),
      cams = ref<QrScanner.Camera[]>([]),
      activeCamId = ref(''),
      multiScanStopper = ref(false);
let qrScanner:QrScanner, db:Firestore;

watch(activeCamId, (id)=>qrScanner.setCamera(id));

onMounted(async ()=>{
  hasCamera.value = await QrScanner.hasCamera();

  if (hasCamera.value) {
    cams.value = await QrScanner.listCameras(true);
    
    try {
      db = getFirestore(initializeApp(JSON.parse(useRuntimeConfig().public.FIREBASE_CONFIG)));
      qrScanner = new QrScanner(
        videoElement.value!,
        storeData,
        {
          returnDetailedScanResult: true,
          calculateScanRegion: (videoElement)=>{
            return {
              x:0,
              y:0,
              width:videoElement.videoWidth,
              height:videoElement.videoHeight
            } as QrScanner.ScanRegion
          },
          highlightCodeOutline: true,
          highlightScanRegion:true
        }
      );

      await qrScanner.start();

      hasFlash.value = await qrScanner.hasFlash();
      activeCamId.value = cams.value[cams.value.length-1].id
    } catch (e) {}
  }

  async function storeData(res:QrScanner.ScanResult){
    if(multiScanStopper.value)return;
    else multiScanStopper.value=true;
    navigator.vibrate(150);
    await qrScanner.stop();
    const validRes = ()=>{
      alert('Data terinput');
      useRouter().back();
    };
    const ress = res.data.split(',');
    switch (ress[0]) {
      case 'p':
        await addDoc(collection(db,'peminjaman'),{
          peminjam:ress[1],
          buku:ress[2],
          pinjam:{
            waktu:serverTimestamp(),
            staf: 'webscan'
          },
          kembali:null
        });
        validRes();
        break;
      case 'x':
        const t = await getDoc(doc(db,'peminjaman',ress[1]));
        await addDoc(collection(db,'peminjaman'),{
          peminjam:t.get('peminjam'),
          buku:t.get('buku'),
          pinjam:{
            waktu:serverTimestamp(),
            staf: 'webscan'
          },
          kembali:null
        });
        await updateDoc(doc(db,'peminjaman',ress[1]),{
          kembali:{
            waktu:serverTimestamp(),
            staf: 'webscan'
          }
        });
        validRes();
        break;
      case 'k':
        await updateDoc(doc(db,'peminjaman',ress[1]),{
          kembali:{
            waktu:serverTimestamp(),
            staf: 'webscan'
          }
        });
        validRes();
        break;
      default:
        console.log(res.data);
        alert('try again');
        multiScanStopper.value=false;
        qrScanner.start();
        break;
    }
  }
});
</script>

<template>
  <main>
    <div v-if="cams && cams.length > 1">
      <label for="cams">
        [ ◉¯]
      </label>
      <select v-model="activeCamId" name="cams" id="cams">
        <option v-for="c in cams" :value="c.id">{{ c.label }}</option>
      </select>
      <button v-if="hasFlash" @click="qrScanner.toggleFlash" >*</button>
    </div>

    <video v-if="hasCamera" ref="videoElement"></video>
  </main>
</template>

<style>
video {
  width: 80vw;
  object-fit: contain;
}

main {
  flex-direction: column;
}
</style>