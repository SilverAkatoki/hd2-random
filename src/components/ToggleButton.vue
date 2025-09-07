<script setup lang="ts">
import { type ModelRef } from 'vue'

const model: ModelRef<boolean> = defineModel("valueModel", { type: Boolean, required: true });

function toggle(val: boolean): void {
  model.value = val;
}
</script>

<template>
  <div class="toggle-btn">
    <div class="toggle-controls">
      <button @click="toggle(true)" :disabled="model" class="arrow-btn arrow-left">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <polygon points="33,10 15,20 33,30" fill="currentColor" />
        </svg>
      </button>
      <div class="description">
        <span class="value">{{ model ? '是' : '否' }}</span>
        <div class="options">
          <div :class="['option', model ? 'active' : '']" />
          <div :class="['option', !model ? 'active' : '']" />
        </div>
      </div>

      <button @click="toggle(false)" :disabled="!model" class="arrow-btn arrow-right">
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

.arrow-btn:hover:not(:disabled) {
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
</style>
