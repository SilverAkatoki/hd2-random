<script setup lang="ts">
const emit = defineEmits(["close"]);
</script>

<template>
  <div class="banned-stratagem-selector">
    <div class="title-container">
      <span>战备选择菜单</span>
      <button @click="emit('close')">✕</button>
    </div>
    <div class="stratagem-list">
    </div>
  </div>
</template>

<style scoped lang="css">
div.banned-stratagem-selector {
  position: absolute;
  top: 50%;
  left: 50%;

  width: 70vw;
  height: 70vh;

  transform: translate(-50%, -50%);
  background-color: #111;
  border: 2px solid #646464;
  z-index: 1000;

  display: flex;
  flex-direction: row;
}

div.title-container {
  width: 100%;
  height: 5%;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  >span {
    margin: 0 10px 0 20px;
    color: #FEE70F;
    font-size: 24px;
    letter-spacing: 2px;
    user-select: none;
  }

  >button {
    background: none;
    outline: none;
    border: none;

    width: 5%;
    color: white;
    font-weight: bold;
    font-size: 24px;
    cursor: pointer;
    position: absolute;
    right: 0;
    z-index: 1;
  }
  >button:hover {
    color: #FEE70F;
    filter: drop-shadow(0 0 5px rgba(254, 231, 15, 0.35));
  }
}

div.title-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(/stripes_gray.svg);
  background-size: 250%;
  z-index: -1;
}
</style>
