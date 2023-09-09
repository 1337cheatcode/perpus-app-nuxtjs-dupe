export default defineNuxtConfig({
  nitro: {
    preset: 'vercel-edge'
  },
  runtimeConfig: {
    FIREBASE_CONFIG: process.env.FIREBASE_CONFIG
  }
})