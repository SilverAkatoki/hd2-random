<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getRandomCombinations, randomizeSingleStratagem } from './random';
import { filename } from './random-dict/filename';

import ToggleButton from './components/ToggleButton.vue';
import Stratagem from './components/Stratagem.vue';
import BannedStratagemSelector from './components/BannedStratagemSelector.vue';
import LiberButton from './components/LiberButton.vue';

const stratagems = ref(getRandomCombinations());
const allowSingleBackpack = ref(false);
const allowSingleSupportWeapon = ref(false);
const hasEnabledBannedStratagem = ref(false);

let bannedStratagems = ref<string[]>([]);

const { t } = useI18n();

const reRandomizeStratagems = () => {
  stratagems.value = getRandomCombinations(allowSingleBackpack.value, allowSingleSupportWeapon.value, bannedStratagems.value);
};

const reRandomizeSingleStratagem = (index: number) => {
  stratagems.value[index] = randomizeSingleStratagem(index, stratagems.value, allowSingleBackpack.value, allowSingleSupportWeapon.value, bannedStratagems.value);
};

const closeStratagemSelector = () => {
  if (hasEnabledBannedStratagem.value) {
    hasEnabledBannedStratagem.value = false;
  }
};

onMounted(() => {
  preloadImages();
});

// 更改设置后重新随机
watch([allowSingleBackpack, allowSingleSupportWeapon], reRandomizeStratagems);


// 更改筛选后重新随机
let previousBannedStratagems: string[] = [];
watch(hasEnabledBannedStratagem, (x: Boolean) => {
  if (x) {
    previousBannedStratagems = [...bannedStratagems.value];
  } else {
    const hasChanged =
      previousBannedStratagems.length !== bannedStratagems.value.length ||
      previousBannedStratagems.some(str => !bannedStratagems.value.includes(str));
    if (hasChanged) {
      reRandomizeStratagems();
    }
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
        v-model="bannedStratagems" />
    </transition>
    <div class="top-bar"></div>
    <div class="main-container" @click="closeStratagemSelector"
      :style='{ "filter": (hasEnabledBannedStratagem ? "brightness(50%)" : "none") }'>
      <div class="sub-container">
        <div class="title-container">
          <img src="/title.svg" style="height: 32px; margin-right: 10px; transform: scaleX(-1);" draggable="false" />
          <span>{{ t('app.title') }}</span>
          <img src="/title.svg" style="height: 32px; margin-left: 10px;" draggable="false" />
        </div>
        <div class="rules-setting">
          <div class="rules-title-container">
            <span class="rules-title">{{ t('settings.title') }}</span>
          </div>
          <div class="settings-container">
            <div class="setting-container">
              <div class="setting-description-container">
                <span class="setting-title">{{ t('settings.singleBackpack.title') }}</span>
                <span class="setting-description">{{ t('settings.singleBackpack.description') }}</span>
              </div>
              <div class="setting-button-container">
                <toggle-button v-model:valueModel="allowSingleBackpack" />
              </div>
            </div>
            <div class="setting-container">
              <div class="setting-description-container">
                <span class="setting-title">{{ t('settings.singleSupportWeapon.title') }}</span>
                <span class="setting-description">{{ t('settings.singleSupportWeapon.description') }}</span>
              </div>
              <div class="setting-button-container">
                <toggle-button v-model:valueModel="allowSingleSupportWeapon" />
              </div>
            </div>
            <div class="setting-container">
              <div class="setting-description-container">
                <span class="setting-title">{{ t('settings.stratagemFilter.title') }}</span>
                <div>
                  <span class="setting-description">{{ t('settings.stratagemFilter.currentlyBanned') }} </span>
                  <span class="setting-description" style="color: #FEE70F;"> {{ bannedStratagems.length }} </span>
                  <span class="setting-description"> {{ t('settings.stratagemFilter.bannedCount') }}</span>
                </div>
              </div>
              <div class="setting-button-container">
                <button class="filter-button" @click.stop="hasEnabledBannedStratagem = true">{{ t('settings.stratagemFilter.openButton') }}</button>
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
            <liber-button colorA="#A1920B" colorB="#FEE70F" @click="reRandomizeStratagems">
              <div class="random-button-inner">
                <span style="color: #FEE70F; font-size: 20px; font-weight: 500;">{{ t('app.randomizeAll') }}</span>
                <img src="/dice.png" style="height: 24px; margin-left: 10px;" />
              </div>
            </liber-button>
          </div>
          <div style="user-select: none;">
            <span style="color: white;">{{ t('app.clickToRandomize') }}</span>
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
  user-select: none;
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
  height: 85%;
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
  height: 28%;
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

div.random-button::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: #282302;
  background-image: url(/stripes_gray.svg);
  background-size: 500%;
  background-blend-mode: multiply;
  /* 弄到伪类里就能用 transform 转了 */
  transform: scaleX(-1);
  transition: none;
}

div.random-button-inner {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  position: relative;

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
}

.fade-enter-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from {
  opacity: 0;
}
</style>
