export default defineNuxtConfig({
  nitro: {
    preset: 'vercel-edge'
  },
  runtimeConfig: {
    public: {
      FIREBASE_CONFIG: process.env.FIREBASE_CONFIG
    }
  }
})