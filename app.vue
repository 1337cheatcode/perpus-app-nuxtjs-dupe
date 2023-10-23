<template>
  <div>
    <header>
      <NuxtLink to="/list">list</NuxtLink>
      <NuxtLink to="/pinjam">pinjam</NuxtLink>
      <NuxtLink to="/history">riwayat</NuxtLink>
    </header>
    <NuxtPage />
  </div>
</template>

<style>
body {
  margin-left:0;
  margin-right:0;
}

header {
  border-bottom: 4px ridge;
}

div>header a{
  padding: 0 .25vw;
}

main{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

main * {
  width: auto;
}

main>div{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width:100%;
}

canvas {
  width: 80vmin;
  height: 80vmin;
  image-rendering: pixelated;
}

@media screen and (min-aspect-ratio:1.25){
  canvas {
    width: 75vmin;
    height: 75vmin;
  }

  main{
    flex-direction: row;
  }
  /*
  main{
    display: block;
  }

  main>*, main>*>*{
    margin-left:auto;
    margin-right:auto;
  }

  main div{
    text-align: center;
  }
  */
}
</style>