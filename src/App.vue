<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getRandomCombinations, randomizeSingleStratagem } from './random';
import { filename } from './random-dict/filename';
import { vehicle } from './random-dict/stratagem-type';

import ToggleButton from './components/ToggleButton.vue';
import Stratagem from './components/Stratagem.vue';
import BannedStratagemSelector from './components/BannedStratagemSelector.vue';

const stratagems = ref(getRandomCombinations());
const allowSingleBackpack = ref(false);
const allowSingleSupportWeapon = ref(false);
const allowVehicle = ref(false);
const hasEnabledBannedStratagem = ref(false);

let banedStratagems = ref<string[]>([]);

const reRandomizeStratagems = () => {
  stratagems.value = getRandomCombinations(allowSingleBackpack.value, allowSingleSupportWeapon.value, allowVehicle.value);
};

const reRandomizeSingleStratagem = (index: number) => {
  stratagems.value[index] = randomizeSingleStratagem(index, stratagems.value, allowSingleBackpack.value, allowSingleSupportWeapon.value, allowVehicle.value);
};

const closeStratagemSelector = () => {
  if (hasEnabledBannedStratagem.value) {
    hasEnabledBannedStratagem.value = false;
  }
};

onMounted(() => {
  preloadImages();

  if (allowVehicle.value) {
    banedStratagems.value = banedStratagems.value.concat(vehicle);
  }
});

// 更改设置后重新随机
watch([allowSingleBackpack, allowSingleSupportWeapon, allowVehicle], reRandomizeStratagems);

watch(banedStratagems, () => {
  const allVehicleBanned = vehicle.every(v => banedStratagems.value.includes(v));
  allowVehicle.value = !allVehicleBanned;
});

// 只在切换“允许载具”时批量禁用/启用所有载具
watch(allowVehicle, (val) => {
  if (!val) {
    for (const v of vehicle) {
      if (!banedStratagems.value.includes(v)) {
        banedStratagems.value.push(v);
      }
    }
  } else {
    // 允许载具时，从 banedStratagems 移除所有载具
    banedStratagems.value = banedStratagems.value.filter(str => !vehicle.includes(str));
  }
});

// 不缓存图片卡飞了
const preloadImages = () => {
  const images = Object.entries(filename).map(([_, value]) => `stratagems/${value}`);
  images.forEach(src => {
    const img = new Image();
    img.src = import.meta.env.BASE_URL + src;
  });
};
</script>

<template>
  <main>
    <transition name="fade">
      <banned-stratagem-selector v-if="hasEnabledBannedStratagem" @close="hasEnabledBannedStratagem = false"
        v-model="banedStratagems" />
    </transition>
    <div class="top-bar"></div>
    <div class="main-container" @click="closeStratagemSelector"
      :style='{ "filter": (hasEnabledBannedStratagem ? "brightness(50%)" : "none") }'>
      <div class="sub-container">
        <div class="title-container">
          <img src="/title.svg" style="height: 32px; margin-right: 10px; transform: scaleX(-1);" draggable="false" />
          <span>Helldivers 2 全随机战备</span>
          <img src="/title.svg" style="height: 32px; margin-left: 10px;" draggable="false" />
        </div>
        <div class="rules-setting">
          <div class="rules-title-container">
            <span class="rules-title">限制条件</span>
          </div>
          <div class="settings-container">
            <div class="setting-container">
              <div class="setting-description-container">
                <span class="setting-title">只允许占据一个背包位</span>
                <span class="setting-description">包括背包战备与包含弹药背包的支援武器</span>
              </div>
              <div class="setting-button-container">
                <toggle-button v-model:valueModel="allowSingleBackpack" />
              </div>
            </div>
            <div class="setting-container">
              <div class="setting-description-container">
                <span class="setting-title">只允许一个支援武器战备</span>
                <span class="setting-description">也就是常说的「三号位」</span>
              </div>
              <div class="setting-button-container">
                <toggle-button v-model:valueModel="allowSingleSupportWeapon" />
              </div>
            </div>
            <div class="setting-container">
              <div class="setting-description-container">
                <span class="setting-title">允许载具</span>
                <span class="setting-description">总有人不会驾驶，对吧</span>
              </div>
              <div class="setting-button-container">
                <toggle-button v-model:valueModel="allowVehicle" />
              </div>
            </div>
            <div class="setting-container">
              <div class="setting-description-container">
                <span class="setting-title">战备过滤菜单</span>
                <div>
                  <span class="setting-description">当前已在随机结果中排除 </span>
                  <span class="setting-description" style="color: #FEE70F;"> {{ banedStratagems.length }} </span>
                  <span class="setting-description"> 个战备</span>
                </div>
              </div>
              <div class="setting-button-container">
                <button class="filter-button" @click.stop="hasEnabledBannedStratagem = true">打开</button>
              </div>
            </div>
          </div>
        </div>
        <div class="stratagems-outer-container">
          <div class="stratagems-inner-container">
            <stratagem v-for="(item, index) in stratagems" :imageSrc="'/stratagems/' + item.imgSrc" :text="item.text"
              :index="index" @click="reRandomizeSingleStratagem" />
          </div>
        </div>
        <div class="random-button-container">
          <div>
            <div class="random-button" @click="reRandomizeStratagems">
              <span>全部随机</span>
              <img src="/dice.png" draggable="false" />
              <div class="corner top-left"></div>
              <div class="corner top-right"></div>
              <div class="corner bottom-left"></div>
              <div class="corner bottom-right"></div>
            </div>
          </div>
          <div style="user-select: none;">
            <span style="color: #FEE70F;">点击战备图标</span>
            <span style="color: white;">以进行单个战备的随机</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-bar"></div>
  </main>
</template>

<style scoped lang="css">
main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

div.top-bar,
div.bottom-bar {
  height: 50px;
  background-color: #333;
}

div.main-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);

  transition: filter 0.3s ease;
}

div.main-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(/background.webp);
  z-index: -1;
  filter: brightness(0.5);
}

div.sub-container {
  width: 40%;
  height: 95%;
  background-color: rgba(0, 0, 0, 0.6);
  border: 2px solid #333;
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

div.rules-setting {
  display: flex;
  flex-direction: column;
  width: 100%;
}

div.rules-title-container {
  display: flex;
  justify-content: left;
  align-items: center;
  flex-direction: row;
  width: 100%;
  height: 24px;
  background-color: #333;

  >span.rules-title {
    margin-left: 20px;
    font-size: 16px;
    color: #FDFDFD;
    translate: 0 -1px;
    letter-spacing: 1px;
  }
}

div.title-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-top: 20px;

  >span {
    font-size: 32px;
    font-weight: bold;
    color: #FEE70F;
    user-select: none;
  }
}

div.settings-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

div.setting-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 75px;
  align-items: center;
  background-color: #0C0C0C;
  border-bottom: 2px solid #222;
}

div.setting-description-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-left: 20px;
  width: 70%;
  height: 100%;
  user-select: none;
}

div.setting-button-container {
  margin-right: 20px;
}

span.setting-title {
  font-size: 18px;
  color: #FDFDFD;
  letter-spacing: 1px;
}

span.setting-description {
  font-size: 14px;
  color: #AAAAAA;
  margin-top: 4px;
  letter-spacing: 0.5px;
}

button.filter-button {
  margin-right: 37px;

  width: 120px;
  height: 36px;
  font-size: 16px;
  cursor: pointer;
  background: none;
  border: 2px solid #333;

  color: #FDFDFD;
  font-style: medium;

  transition: all 0.2s ease;
}

button.filter-button:hover:not(:disabled) {
  background-color: #211F06;
  border-color: #FEE70F;
  box-shadow: 0 0 15px 5px rgba(254, 231, 15, 0.35);
  color: #FEE70F;
}

button.filter-button:disabled {
  border-color: #555;
  color: #555;
  cursor: not-allowed;
}

div.stratagems-outer-container {
  margin-top: 10px;
  width: 85%;
  height: 25%;
  background-image: url(/stripes_gray.svg);
  background-size: 250%;

  display: flex;
  align-items: top;
  justify-content: center;

  >div.stratagems-inner-container {
    margin-top: 25px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 20px;
  }
}

div.random-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 85%;
  height: 50px;
  margin-top: 10px;
  gap: 12px;
}

div.random-button {
  width: 200px;
  height: 36px;
  font-size: 16px;
  cursor: pointer;
  border: 2px solid #A1920B;

  background-color: #282302;
  background-image: url(/stripes_gray.svg);
  background-size: 500%;
  background-blend-mode: multiply;

  transition: all 0.3s ease;

  display: flex;
  align-items: center;

  position: relative;
  z-index: 1;

  >span {
    user-select: none;
    margin-left: 20px;
    color: #FEE70F;
    font-size: 20px;
    letter-spacing: 1px;

    font-weight: 500;
  }

  >img {
    user-select: none;
    height: 24px;
    margin-left: auto;
    margin-right: 10px;
  }

  >div.corner {
    position: absolute;
    width: 5px;
    height: 5px;
    background: none;
    border: #FEE70F solid 2px;
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
}

div.random-button:hover {
  background: #FEE70F;
  border-color: #FEE70F;
  box-shadow: 0 0 15px 5px #FEE70F;

  >span {
    color: black;
  }

  >img {
    filter: brightness(0);
  }

  >div.corner {
    width: 30px;
    height: 20px;
  }
}

.fade-enter-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from {
  opacity: 0;
}
</style>
