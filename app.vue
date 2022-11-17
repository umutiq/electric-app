<template>
  <div class="flex flex-col" style="height: calc(100vh)">
    <HeaderNav />
    <NuxtPage class="h-full" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Elektrik",
  htmlAttrs: {
    lang: "tr",
  },
});
</script>
