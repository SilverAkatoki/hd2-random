<script setup lang="ts">
defineProps({
  imageSrc: String,
  text: String,
  index: Number,
});

const emit = defineEmits(["randomize"]);
</script>

<template>
  <div class="stratagem" @click="emit('randomize', index)">
    <img :src="imageSrc" alt="stratagem image" />
    <p>{{ text }}</p>
  </div>
</template>

<style lang="css" scoped>
div.stratagem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: baseline;
  width: 100px;
  height: 180px;
  box-sizing: border-box;
  cursor: pointer;
}

div.stratagem:hover {
  outline: #FFEB00 1px solid;
}

img {
  max-width: 100%;
  height: auto;
  user-select: none;
}

p {
  margin-top: 8px;
  user-select: none;
  text-align: center;
  color: white;
}
</style>
