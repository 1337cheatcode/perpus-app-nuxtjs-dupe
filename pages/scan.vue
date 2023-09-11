<script setup lang="tsx">
import {initializeApp} from "firebase/app"
import {Firestore, Timestamp, addDoc, collection, getFirestore} from "firebase/firestore"
declare namespace process { namespace env {const FIREBASE_CONFIG:string}};

import QrScanner from 'qr-scanner';

import { ref, watch, onMounted } from 'vue';
const videoElement = ref<HTMLVideoElement>(),
      text = ref(''),
      hasCamera = ref(true),
      hasFlash = ref(false),
      cams = ref<QrScanner.Camera[]>([]),
      activeCamId = ref('');
let qrScanner:QrScanner, db:Firestore;

watch(activeCamId, (id)=>qrScanner.setCamera(id));
watch(text, ()=>navigator.vibrate(150))

interface PinjamQRIntf {

}

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
          highlightCodeOutline: true
        }
      );

      await qrScanner.start();

      hasFlash.value = await qrScanner.hasFlash();
      activeCamId.value = cams.value[cams.value.length-1].id
    } catch (e) {}
  }

  async function storeData(res:QrScanner.ScanResult){
    const validRes = ()=>{
      qrScanner.stop();
      alert('yeah');
      useRouter().back();
    };

    const ress = res.data.split(',');
    switch (ress[0]) {
      case 'p':
        console.log(ress[1],ress[2]);
        addDoc(collection(db,'peminjaman'),{
          peminjam:ress[1],
          buku:ress[2],
          waktu:{
            pinjam:Timestamp.now(),
            staf: 'webscan'
          }
        })
        validRes();
        break;
      case 'x':
        console.log(ress[1],ress[2]);
        validRes();
        break;
      case 'k':
        console.log(ress[1],ress[2]);
        validRes();
      default:
        console.log(res.data);
        qrScanner.pause().then(()=>alert('try again'));
        qrScanner.start();
        break;
    }
    qrScanner.stop();
  }
});
</script>

<template>
  <div>bro it works {{ text }}</div>
  <div>
    <div v-if="cams && cams.length > 1">
      <label for="cams">
        [ ◉¯]
      </label>
      <select v-model="activeCamId" name="cams" id="cams">
        <option v-for="c in cams" :value="c.id">{{ c.label }}</option>
      </select>
      <button v-if="hasFlash" @click="qrScanner.toggleFlash" ></button>
    </div>

    <video v-if="hasCamera" ref="videoElement"></video>
  </div>
</template>