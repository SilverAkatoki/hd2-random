<script setup lang="ts">
import Stratagem from './Stratagem.vue';
import { attack, defense, support } from '../random-dict/stratagem-type';
import { filename } from '../random-dict/filename';
import LiberButton from './LiberButton.vue';


const bannedStratagems = defineModel<string[]>({ default: () => [] });
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
    // 直接赋值会破坏响应式？
    bannedStratagems.value.splice(idx, 1);
  } else {
    bannedStratagems.value.push(key);
  }
};
</script>

<template>
  <div class="banned-stratagem-selector" @click.right.prevent="emit('close')">
    <div class="title-container">
      <span>战备选择菜单</span>
    </div>
    <div class="stratagem-lists">
      <div class="stratagem-list">
        <span>进攻</span>
        <div class="stratagem-container">
          <Stratagem v-for="(key, idx) in attack" :key="key" :imageSrc="'/stratagems/' + filename[key]" :index="idx"
            :class="{ banned: bannedStratagems!.includes(key) }" @click="toggleBan(key)" />
        </div>
      </div>
      <div class="stratagem-list">
        <span>支援</span>
        <div class="stratagem-container">
          <Stratagem v-for="(key, idx) in support" :key="key" :imageSrc="'/stratagems/' + filename[key]" :index="idx"
            :class="{ banned: bannedStratagems!.includes(key) }" @click="toggleBan(key)" />
        </div>
      </div>
      <div class="stratagem-list">
        <span>防御</span>
        <div class="stratagem-container">
          <Stratagem v-for="(key, idx) in defense" :key="key" :imageSrc="'/stratagems/' + filename[key]" :index="idx"
            :class="{ banned: bannedStratagems!.includes(key) }" @click="toggleBan(key)" />
        </div>
      </div>
    </div>
    <div class="bottom-container">
      <liber-button mainColor="#D5D5D5" hoverColor="#CBCBCE" @click="emit('close')">
        <div class=" liber-button-inner">
          <span style="margin: 0 0 0 20px; font-weight: bold; font-size: 28px;">✓</span>
          <span style="margin: 0 20px 0 0; color: #CBCBCE; font-size: 20px; font-weight: 500;">确认</span>
        </div>
      </liber-button>
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

div.stratagem-lists {
  margin: 0 20px 0 20px;
  overflow: hidden;

  >div.stratagem-list {
    gap: 10px;

    >span {
      display: block;
      color: #DDD;
      font-size: 20px;
      letter-spacing: 2px;
      margin: 10px 0 10px 0;
      user-select: none;
    }

    >div.stratagem-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px;

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

.liber-button {
  width: 120px;
  margin: 20px;
}

div.liber-button-inner {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  position: relative;

  >span {
    user-select: none;
    margin-left: auto;
    margin-right: 20px;
    color: #CBCBCE;
    font-size: 20px;
    letter-spacing: 1px;

    font-weight: 500;
  }

  >img {
    user-select: none;
    height: 24px;

    margin-left: 10px;
  }
}
</style>
