<template>
  <div>
    <NuxtLink to="/list">list</NuxtLink>
    <NuxtLink to="/pinjam">pinjam</NuxtLink>
    <NuxtPage />
  </div>
</template>

<style>
div a{
  padding: 0 .25vw;
}

canvas {
  width: 75vmin;
  height: 75vmin;
  image-rendering: pixelated;
}

main{
  display: flex;
  align-items: center;
  justify-content: space-around;
}

@media screen and (max-aspect-ratio:1.25){
  canvas {
    width: 80vmin;
    height: 80vmin;
  }

  main{
    flex-direction: column;
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