<script setup lang="ts">
import { ref, onMounted } from 'vue';
import stratagem from './components/Stratagem.vue';
import { getRandomCombinations } from './random';
import { backpack, supportWeaponWithBackpack, supportWeapon } from './random-dict/stratagem-type';
import { filename } from './random-dict/filename';

const stratagems = ref(getRandomCombinations());
const allowSingleBackpack = ref(false);
const allowSingleSupportWeapon = ref(false);
const allowVehicle = ref(true);

const randomizeStratagems = () => {
  stratagems.value = getRandomCombinations(allowSingleBackpack.value, allowSingleSupportWeapon.value, allowVehicle.value);
};

const randomizeSingleStratagem = (index: number) => {
  let newStratagem;
  let attempts = 0;

  do {
    const allCombinations = getRandomCombinations(false, false, allowVehicle.value);
    newStratagem = allCombinations[Math.floor(Math.random() * allCombinations.length)];

    const otherKeys = stratagems.value
      .map((item, i) => i !== index ? item.ID : null)
      .filter(key => key !== null);

    const hasConflict = otherKeys.includes(newStratagem.ID) ||
      (allowSingleBackpack.value && hasBackpackConflict(newStratagem.ID, otherKeys)) ||
      (allowSingleSupportWeapon.value && hasSupportWeaponConflict(newStratagem.ID, otherKeys));

    if (!hasConflict) break;

  } while (++attempts < 100);

  stratagems.value[index] = newStratagem;
};

const hasBackpackConflict = (newKey: string, otherKeys: string[]) => {
  const isNewBackpack = backpack.includes(newKey) || supportWeaponWithBackpack.includes(newKey);
  const hasOtherBackpack = otherKeys.some(key => backpack.includes(key) || supportWeaponWithBackpack.includes(key));
  return isNewBackpack && hasOtherBackpack;
};

const hasSupportWeaponConflict = (newKey: string, otherKeys: string[]) => {
  const isNewSupport = supportWeapon.includes(newKey) || supportWeaponWithBackpack.includes(newKey);
  const hasOtherSupport = otherKeys.some(key => supportWeapon.includes(key) || supportWeaponWithBackpack.includes(key));
  return isNewSupport && hasOtherSupport;
};

// 不缓存图片卡飞了
const preloadImages = () => {
  const images = Object.entries(filename).map(([_, value]) => `/public/stratagems${value}`);
  
  images.forEach(src => {
    const img = new Image();
    img.src = import.meta.env.BASE_URL + src;
  });
};

onMounted(() => {
  preloadImages();
});
</script>

<template>
  <main>
    <h1 style="color: #FFEB00">随机战备</h1>
    <div class="options" style="display: flex; flex-direction: column; align-items: baseline;">
      <label style="color: white; user-select: none;">
        <input type="checkbox" v-model="allowSingleBackpack" style="transform: translateY(12.5%) ;" />
        只允许一个背包战备（包含支援武器的弹药背包）
      </label>
      <label style="color: white; user-select: none; margin-left: 16px;">
        <input type="checkbox" v-model="allowSingleSupportWeapon" style="transform: translateY(12.5%) ;" />
        只允许一个支援武器
      </label>
      <label style="color: white; user-select: none; margin-left: 16px;">
        <input type="checkbox" v-model="allowVehicle" style="transform: translateY(12.5%) ;" />
        允许载具战备
      </label>
    </div>
    <div class="stratagem-container">
      <stratagem v-for="(item, index) in stratagems" :imageSrc="'/public/stratagems/' + item.imgSrc" :text="item.text"
        :index="index" @randomize="randomizeSingleStratagem" />
    </div>
    <button class="random-button" @click="randomizeStratagems">随机</button>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

div.stratagem-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 16px 0;
}

div.options {
  margin-bottom: 16px;
}

button.random-button {
  margin-top: 16px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
}
</style>
