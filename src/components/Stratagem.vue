<script setup lang="ts">
defineProps<{
  imageSrc: string,
  text?: string,
  index?: number,
}>();

const emit = defineEmits(["randomize"]);

const base = import.meta.env.BASE_URL;
</script>

<template>

  <div class="stratagem" @click="emit('randomize', index)">
    <img :src="base + imageSrc" alt="stratagem image" />
    <p v-if="text != null">{{ text }}</p>
  </div>
</template>

<style lang="css" scoped>
div.stratagem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: baseline;
  width: 100px;
  height: auto;
  box-sizing: border-box;
  cursor: pointer;

  >img {
    max-width: 100%;
    height: auto;
    user-select: none;
    background-color: #303030;
  }

  >p {
    margin-top: 8px;
    user-select: none;
    text-align: center;
    color: white;
  }
}



div.stratagem:hover {
  >img {
    outline: #FFEB00 1px solid;
  }
}
</style>
