<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();

const model = defineModel<boolean>({ required: true });

function toggle(val: boolean): void {
  model.value = val;
}

const hoverLeft = ref(false);
const hoverRight = ref(false);

</script>

<template>
  <div class="toggle-btn">
    <div class="click-overlay">
      <div class="click-area left" @click="toggle(true)" @mouseover="hoverLeft = true" @mouseleave="hoverLeft = false">
      </div>
      <div class="click-area right" @click="toggle(false)" @mouseover="hoverRight = true"
        @mouseleave="hoverRight = false"></div>
    </div>
    <div class="toggle-controls">
      <button class="arrow-btn arrow-left" :class="{ 'hovered': hoverLeft }">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <polygon points="33,10 15,20 33,30" fill="currentColor" />
        </svg>
      </button>
      <div class="description">
        <span class="value">{{ model ? t('app.yes') : t('app.no') }}</span>
        <div class="options">
          <div :class="['option', model ? 'active' : '']" />
          <div :class="['option', !model ? 'active' : '']" />
        </div>
      </div>
      <button class="arrow-btn arrow-right" :class="{ 'hovered': hoverRight }">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <polygon points="7,30 25,20 7,10" fill="currentColor" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.toggle-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  position: relative;
}

.label {
  margin-bottom: 8px;
  font-size: 16px;
}

.toggle-controls {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.arrow-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  color: #eee;
  transition: color 0.2s;
}

.arrow-btn.hovered {
  color: #FEE70F;
}

.arrow-btn:disabled {
  color: #ccc;
}

.arrow-left {
  padding-right: 20px;
}

.arrow-right {
  padding-left: 20px;
}

.value {
  margin: 0 16px;
  font-size: 18px;
  color: #B9B9B9;
  font-weight: medium;
}

.options {
  display: flex;
  gap: 12px;
}

.option {
  width: 48px;
  height: 5px;
  background: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 15px;
  transition: background 0.2s, color 0.2s;
}

.option.active {
  background: #DDD;
  color: #fff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.description {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.click-overlay {
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

.click-area {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.click-area.left {
  padding-right: 20px;
}

.click-area.right {
  padding-left: 20px;
}
</style>
