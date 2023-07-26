<script setup>
const props = defineProps(['text'])
</script>

<template>
  <div class="noty">
    {{ text }}
  </div>
</template>

<style>
.noty {
  text-align: center;
  font-size: 13px;
  color: rgb(129, 140, 153);
}
</style>
