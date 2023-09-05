<script setup>
import * as dotenv from "dotenv";
dotenv.config();

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
</script>

<template>
  <div v-if="ye">
    <ol v-for="(data, id) in alldoc">
      <li>{{ data }}</li>
    </ol>
  </div>
  <div v-else>
    <NuxtWelcome />
  </div>
</template>