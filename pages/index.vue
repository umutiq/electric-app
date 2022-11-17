<template>
  <div
    class="h-full w-full flex flex-col gap-12 items-center justify-center bg-gray-600"
  >
    <div class="text-3xl text-white font-semibold">
      Hangisi için güneş panelleri ile ilgileniyorsunuz?
    </div>
    <div class="grid grid-cols-3 items-center justify-content center gap-12">
      <div
        v-for="(tip, key) in CustomerTypes"
        :key="tip.name"
        class="px-4 pb-4 pt-8 cursor-pointer flex flex-col items-center justify-center gap-4 group hover:bg-white transition rounded-lg"
        :class="{ 'bg-white': key === selectedCustomerType }"
        @click="change(key)"
      >
        <img class="h-64 w-64 object-cover" :src="tip.image" alt="" />
        <p
          class="text-center text-xl font-semibold text-white uppercase group-hover:text-black"
          :class="{ 'text-black': key === selectedCustomerType }"
        >
          {{ tip.name }}
        </p>
      </div>
    </div>
    <div>
      <nuxt-link
        to="solars"
        class="px-12 py-2 uppercase rounded-3xl bg-sky-500 text-white text-xl"
      >
        Devam
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CustomerTypes, useMainStore } from "~~/store/main";
const store = useMainStore();
const change = (customerType: keyof typeof CustomerTypes) => {
  store.setCustomerType(customerType);
};
const selectedCustomerType = computed(() => {
  return store.customerType;
});
</script>

<style scoped></style>
