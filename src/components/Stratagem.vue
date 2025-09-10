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
    <div class="img-container">
      <div class="top" />
      <img :src="base + imageSrc" alt="stratagem image" />
      <div class="bottom" />
    </div>

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


  transition: all 0.2s ease;

  >div.img-container {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #303030c8;
    border-top: none;
    box-sizing: border-box;
    padding: 4px;
    z-index: 1;

    position: relative;

    >div.top,
    >div.bottom {
      box-sizing: border-box;
      width: 100%;
      height: 30%;
      background: none;
      border: #7B7B7B solid 3px;
      z-index: 2;
      position: absolute;
    }

    >div.top {
      top: 0;
      border-bottom: none;
    }

    >div.bottom {
      bottom: 0;
      border-top: none;
    }
  }

  >p {
    margin-top: 8px;
    user-select: none;
    text-align: center;
    color: white;
  }
}

div.stratagem:hover {
  >div.img-container {
    background-color: #383838c8;

    >div.top,
    >div.bottom {
      border-color: white;
    }
  }
}
</style>
