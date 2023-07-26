<template>
  <div class="app">
    <div class="app__header">
      <Header/>
    </div>
    <div class="app__body">
      <NuxtPage/>
    </div>
    <div class="app__footer">
      <Footer/>
    </div>
  </div>
</template>

<style lang="scss">
.app {
  &__header {
    position: sticky;
    top: 0;
    z-index: 1;
  }

  &__body {
    padding: 26px 26px 50px 26px;
    flex-grow: 1;
  }

  &__footer {
  }
}
</style>
