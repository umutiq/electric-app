<template>
 <div class="flex flex-col gap-2">
  <label :for="inputFor" class="uppercase text-xs font-bold ml-2">{{
   inputLabel
  }}</label>
  <textarea
   :id="inputFor"
   type="text"
   :name="inputFor"
   :value="modelValue"
   class="w-full bg-slate-200 border-slate-600 border-2 border-opacity-0 focus:border-opacity-100 rounded-3xl px-4 py-2 outline-none transition text-sm"
   resiz
   :rows="rows"
   autocomplete="false"
   autocorrect="false"
   @input="emitChanges"
  ></textarea>
 </div>
</template>
<script lang="ts" setup>
defineProps<{
 inputFor: string;
 inputLabel: string;
 modelValue: string | number;
 rows: number;
}>();
const emit = defineEmits(['update:modelValue']);
const emitChanges = (e: Event) => {
 emit('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>
<style scoped>
textarea {
 resize: none;
}
</style>
