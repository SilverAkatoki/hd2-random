<template>
  <div class="liber-button" :style="{
    '--main-color': mainColor,
    '--hover-color': hoverColor
  }" @click="onClick">
    <div class="slot-content">
      <slot />
    </div>
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  mainColor?: string
  hoverColor?: string
}>();
const emit = defineEmits(['click']);
const onClick = () => emit('click');
</script>

<style scoped>
.liber-button {
  width: 200px;
  height: 36px;
  cursor: pointer;
  border: 2px solid var(--main-color);
  background: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.liber-button::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: #252525;
  background-image: url(/stripes_gray.svg);
  background-size: 500%;
  background-blend-mode: multiply;
  transform: scaleX(-1);
  border-radius: inherit;
  pointer-events: none;
  transition: background-color 0.2s;
}

.liber-button>* {
  position: relative;
  z-index: 1;
}

.slot-content {
  width: 100%;
  height: 100%;
}

.liber-button:hover .slot-content {
  filter: invert(1) hue-rotate(180deg);
}

.liber-button>.corner {
  position: absolute;
  width: 5px;
  height: 5px;
  background: none;
  border: var(--main-color) solid 2px;
  z-index: 2;
  transition: all 0.2s ease;
}

.liber-button>.corner.top-left {
  top: -2px;
  left: -2px;
  border-bottom: none;
  border-right: none;
}

.liber-button>.corner.top-right {
  top: -2px;
  right: -2px;
  border-bottom: none;
  border-left: none;
}

.liber-button>.corner.bottom-left {
  bottom: -2px;
  left: -2px;
  border-top: none;
  border-right: none;
}

.liber-button>.corner.bottom-right {
  bottom: -2px;
  right: -2px;
  border-top: none;
  border-left: none;
}

.liber-button:hover {
  border-color: var(--hover-color);
  box-shadow: 0 0 15px 5px var(--hover-color);
}

.liber-button:hover::before {
  background-color: var(--hover-color);
  background-image: none;
}

.liber-button:hover>.corner {
  width: 30px;
  height: 20px;
  border-color: var(--hover-color);
}
</style>