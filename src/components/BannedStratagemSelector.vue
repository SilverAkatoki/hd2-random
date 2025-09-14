<script setup lang="ts">
import Stratagem from './Stratagem.vue';
import { attack, defense, support } from '../random-dict/stratagem-type';
import { filename } from '../random-dict/filename';

import LiberButton from './LiberButton.vue';
import { ref, onMounted } from 'vue';
import { type Option } from '../type';

const bannedStratagems = defineModel<string[]>({ default: [] });
const emit = defineEmits(["close"]);

const toggleBan = (key: string) => {
  const idx = bannedStratagems.value.indexOf(key);
  if (
    idx === -1 &&
    attack.length + defense.length + support.length - bannedStratagems.value.length <= 4
  ) {
    alert("可用战备过少！");
    return;
  }
  if (idx !== -1) {
    bannedStratagems.value.splice(idx, 1);
  } else {
    bannedStratagems.value.push(key);
  }
};

const stratagemListsContainer = ref<Option<HTMLElement>>(null);
const scrollbarInner = ref<Option<HTMLElement>>(null);

const updateScrollbar = () => {
  const container = stratagemListsContainer.value!;
  const inner = scrollbarInner.value!;

  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;

  const scrollbarHeight = (clientHeight / scrollHeight) * clientHeight;
  const scrollOffset = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - scrollbarHeight);

  inner.style.height = `${scrollbarHeight}px`;
  inner.style.transform = `translateY(${scrollOffset}px)`;
};

onMounted(() => {
  if (stratagemListsContainer.value && scrollbarInner.value) {
    setTimeout(updateScrollbar, 100); // 不延后更新就没法在第一次进入的时候更新长度
  }
});
</script>

<template>
  <div class="banned-stratagem-selector" @click.right.prevent="emit('close')">
    <div class="title-container">
      <span>战备选择菜单</span>
    </div>

    <div class="stratagem-lists">
      <div class="stratagem-lists-container" ref="stratagemListsContainer" @scroll="updateScrollbar">
        <div class="stratagem-list">
          <span>进攻</span>
          <div class="stratagem-container">
            <Stratagem v-for="(key, idx) in attack" :key="key" :imageSrc="'/stratagems/' + filename[key]" :index="idx"
              :class="{ banned: bannedStratagems.includes(key) }" @click="toggleBan(key)" />
          </div>
        </div>
        <div class="stratagem-list">
          <span>支援</span>
          <div class="stratagem-container">
            <Stratagem v-for="(key, idx) in support" :key="key" :imageSrc="'/stratagems/' + filename[key]" :index="idx"
              :class="{ banned: bannedStratagems.includes(key) }" @click="toggleBan(key)" />
          </div>
        </div>
        <div class="stratagem-list">
          <span>防御</span>
          <div class="stratagem-container">
            <Stratagem v-for="(key, idx) in defense" :key="key" :imageSrc="'/stratagems/' + filename[key]" :index="idx"
              :class="{ banned: bannedStratagems.includes(key) }" @click="toggleBan(key)" />
          </div>
        </div>
      </div>
      <div class="scrollbar-outer">
        <div class="scrollbar-inner" ref="scrollbarInner">
          <div class="scrollbar-inner-top" />
          <div class="scrollbar-inner-bottom" />
        </div>
      </div>
    </div>

    <div class="bottom-container">
      <liber-button colorA="#D5D5D5" colorB="#CBCBCE" @click="bannedStratagems = []"
        :disabled="bannedStratagems.length === 0">
        <div class="liber-button-inner">
          <svg xmlns="http://www.w3.org/2000/svg" role="img" width="30px" height="30px" viewBox="0 0 24 24"
            aria-labelledby="refreshIconTitle" stroke="#CBCBCE" stroke-width="2" stroke-linecap="square"
            stroke-linejoin="miter" fill="none" color="#CBCBCE" style="margin: 0 0 0 20px;">
            <polyline points="22 12 19 15 16 12" />
            <path
              d="M11,20 C6.581722,20 3,16.418278 3,12 C3,7.581722 6.581722,4 11,4 C15.418278,4 19,7.581722 19,12 L19,14" />
          </svg>
          <span style="margin: 0 20px 0 0; color: #CBCBCE; font-size: 20px; font-weight: 500;">重置</span>
        </div>
      </liber-button>
      <liber-button colorA="#D5D5D5" colorB="#CBCBCE" @click="emit('close')">
        <div class="liber-button-inner">
          <span style="margin: 0 0 0 20px; color: #CBCBCE; font-weight: bold; font-size: 26px;">✓</span>
          <span style="margin: 0 20px 0 0; color: #CBCBCE; font-size: 20px; font-weight: 500;">确认</span>
        </div>
      </liber-button>
    </div>
  </div>
</template>

<style scoped lang="css">
div.banned-stratagem-selector {
  position: absolute;

  width: 70vw;
  height: 70vh;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;

  background-color: #111;
  border: 2px solid #646464;
  z-index: 1;

  display: flex;
  flex-direction: column;
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

div.stratagem-lists {
  margin: 20px 20px 0 20px;
  overflow: hidden;
  position: relative;

  div.stratagem-lists-container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  div.stratagem-lists-container::-webkit-scrollbar {
    display: none;
  }

  div.stratagem-list {
    gap: 10px;

    >span {
      display: block;
      color: #DDD;
      font-size: 20px;
      letter-spacing: 2px;
      margin-bottom: 10px;
      user-select: none;
    }

    >div.stratagem-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 10px;

      >* {
        width: 7%;
      }
    }
  }
}

div.bottom-container {
  width: 100%;
  height: 15%;

  background-color: black;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

div.liber-button {
  width: 120px;
  margin-right: 20px;
}

div.liber-button-inner {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  position: relative;
  border-style: none;
}

div.scrollbar-outer {
  position: absolute;
  height: 100%;
  width: 15px;
  right: 0;
  top: 0;
  background-color: #3e3e3e;
  box-sizing: border-box;
}

div.scrollbar-inner {
  position: absolute;
  width: 70%;
  height: 0;

  left: 0;
  right: 0;
  margin: auto;

  background-color: #bababa;
}

div.scrollbar-inner-top,
div.scrollbar-inner-bottom {
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #FEE70F;
}

div.scrollbar-inner-top {
  top: 0;
}

div.scrollbar-inner-bottom {
  bottom: 0;
}
</style>
