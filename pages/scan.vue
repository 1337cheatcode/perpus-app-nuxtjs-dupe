<script setup lang="tsx">
import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"
declare namespace process { namespace env {const FIREBASE_CONFIG:string}};
const db = getFirestore(initializeApp(JSON.parse(process.env.FIREBASE_CONFIG)));

import QrScanner from 'qr-scanner';

import { ref, watch, onMounted } from 'vue';
const videoElement = ref<HTMLVideoElement>(),
      text = ref<string>(),
      hasCamera = ref<boolean>(),
      hasFlash = ref(false),
      cams = ref<QrScanner.Camera[]>(),
      activeCamId = ref<string>();
let qrScanner:QrScanner;

watch(activeCamId, (id)=>qrScanner.setCamera);
watch(text, ()=>navigator.vibrate(150))

interface PinjamQRIntf {

}

function storeData(res:QrScanner.ScanResult){
  const ress = res.data.split(',');
  switch (ress[0]) {
    case 'p':
      console.log(ress[1],ress[2]);
      break;
    case 'x':
      console.log(ress[1],ress[2]);
      break;
    default:
      console.log(res.data)
      break;
  }
  qrScanner.stop();
}

onMounted(async ()=>{
  hasCamera.value = await QrScanner.hasCamera();

  if (hasCamera.value) {
    cams.value = await QrScanner.listCameras(true);
    
    try {
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
      if (videoElement.value!=undefined) console.log(videoElement.value);

      hasFlash.value = await qrScanner.hasFlash();
      activeCamId.value = cams.value[cams.value.length-1].id
    } catch (e) {}
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