<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const model = defineModel<boolean>({ required: true });

const toggle = (val: boolean): void => {
  model.value = val;
};

const hoverLeft = ref(false);
const hoverRight = ref(false);
</script>

<template>
  <div class="toggle-button">
    <div class="click-overlay">
      <div
        class="click-area left"
        @click="toggle(true)"
        @mouseover="hoverLeft = true"
        @mouseleave="hoverLeft = false"
      ></div>
      <div
        class="click-area right"
        @click="toggle(false)"
        @mouseover="hoverRight = true"
        @mouseleave="hoverRight = false"
      ></div>
    </div>
    <div class="toggle-controls">
      <button class="arrow-button arrow-left" :class="{ hovered: hoverLeft }">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <polygon points="33,10 15,20 33,30" fill="currentColor" />
        </svg>
      </button>
      <div class="description">
        <span class="value">{{ model ? t("app.yes") : t("app.no") }}</span>
        <div class="options">
          <div :class="['option', model ? 'active' : '']" />
          <div :class="['option', !model ? 'active' : '']" />
        </div>
      </div>
      <button class="arrow-button arrow-right" :class="{ hovered: hoverRight }">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <polygon points="7,30 25,20 7,10" fill="currentColor" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped lang="css">
div.toggle-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  position: relative;
}

div.toggle-controls {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

button.arrow-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  color: #eee;
  transition: color 0.2s;
}

button.arrow-button.hovered {
  color: #fee70f;
}

button.arrow-button:disabled {
  color: #ccc;
}

button.arrow-left {
  padding-right: 20px;
}

button.arrow-right {
  padding-left: 20px;
}

span.value {
  margin: 0 16px;
  font-size: 18px;
  color: #b9b9b9;
  font-weight: medium;
}

div.options {
  display: flex;
  gap: 12px;
}

div.option {
  width: 48px;
  height: 5px;
  background: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 15px;
  transition:
    background 0.2s,
    color 0.2s;
}

div.option.active {
  background: #ddd;
  color: #fff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

div.description {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

div.click-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
}

div.click-area {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

div.click-area.left {
  padding-right: 20px;
}

div.click-area.right {
  padding-left: 20px;
}
</style>
