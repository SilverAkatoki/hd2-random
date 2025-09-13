<script setup lang="ts">
const props = defineProps<{
  colorA?: string,
  colorB?: string,
  disabled?: boolean
}>();

const emit = defineEmits(['click']);

const onClick = () => {
  if (!props.disabled) {
    emit('click');
  }
};
</script>

<template>
  <div class="liber-button" :class="{ disabled }" :style="{
    '--color-a': colorA,
    '--color-b': colorB
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



<style scoped lang="css">
div.liber-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(0.7) brightness(0.7);
  pointer-events: none;
  box-shadow: none;
}

div.liber-button {
  width: 200px;
  height: 36px;
  cursor: pointer;
  border: 2px solid var(--color-a);
  background: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;

  >* {
    position: relative;
    z-index: 1;
  }

  >div.corner {
    position: absolute;
    width: 5px;
    height: 5px;
    background: none;
    border: var(--color-a) solid 2px;
    z-index: 2;
    transition: all 0.2s ease;
  }

  >div.corner.top-left {
    top: -2px;
    left: -2px;
    border-bottom: none;
    border-right: none;
  }

  >div.corner.top-right {
    top: -2px;
    right: -2px;
    border-bottom: none;
    border-left: none;
  }

  >div.corner.bottom-left {
    bottom: -2px;
    left: -2px;
    border-top: none;
    border-right: none;
  }

  >div.corner.bottom-right {
    bottom: -2px;
    right: -2px;
    border-top: none;
    border-left: none;
  }

  div.slot-content {
    width: 100%;
    height: 100%;
  }
}

div.liber-button::before {
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

div.liber-button:hover {
  border-color: var(--color-b);
  box-shadow: 0 0 15px 5px var(--color-b);

  >div.corner {
    width: 30px;
    height: 20px;
    border-color: var(--color-b);
  }

  div.slot-content {
    filter: invert(1) hue-rotate(180deg);
  }
}

div.liber-button:hover::before {
  background-color: var(--color-b);
  background-image: none;
}
</style>