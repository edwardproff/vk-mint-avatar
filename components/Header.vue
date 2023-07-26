<template>
  <div class="page-header">
    <NuxtLink to="/">
      Мои кошельки
    </NuxtLink>
    <NuxtLink to="/photos">
      Мои фотографии
    </NuxtLink>
  </div>
</template>

<style lang="scss">
.page-header {
  color: red;
  border-bottom: 1px solid #dce1e6;
  background: white;
  display: flex;
  padding: 0 20px;
  gap: 8px;

  a {
    height: 55px;
    display: flex;
    align-items: center;
    padding: 0 6px;
    font-size: 14px;
    font-family: sans-serif;
    text-decoration: none;
    color: #626d7a;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;

    &.router-link-active {
      color: #000000;
      border-color: #447bba;
    }
  }
}
</style>
