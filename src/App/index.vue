<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

import { useI18n } from "vue-i18n";


import BannedStratagemSelector from "@/components/BannedStratagemSelector/index.vue";
import LiberButton from "@/components/LiberButton.vue";
import Stratagem from "@/components/Stratagem.vue";
import ToggleButton from "@/components/ToggleButton.vue";

import { useImageCache } from "../composables/useImageCache";
import {
  getRandomCombinations,
  randomizeSingleStratagem
} from "../utils/liberRandom";

const stratagems = ref(getRandomCombinations());
const bannedStratagems = ref<string[]>([]);

const allowSingleBackpack = ref(false);
const allowSingleSupportWeapon = ref(false);
const hasStratagemsError = ref(false);

const hasEnabledBannedStratagem = ref(false);

const lastUpdateDate = ref<string>("2025-09-12"); // <- 记得改这个 Update this

const { t, locale } = useI18n();
const currLang = locale.value;

const { preloadImages, getCachedImageUrl } = useImageCache();

const reRandomizeStratagems = () => {
  stratagems.value = getRandomCombinations(
    bannedStratagems.value,
    allowSingleBackpack.value,
    allowSingleSupportWeapon.value
  );
  hasStratagemsError.value = stratagems.value.length < 4;
};

const reRandomizeSingleStratagem = (index: number) => {
  stratagems.value[index] = randomizeSingleStratagem(
    index,
    stratagems.value,
    bannedStratagems.value,
    allowSingleBackpack.value,
    allowSingleSupportWeapon.value
  );
};

const closeStratagemSelector = () => {
  if (hasEnabledBannedStratagem.value) {
    hasEnabledBannedStratagem.value = false;
  }
};

onMounted(() => {
  hasStratagemsError.value = stratagems.value.length < 4;
  document.title = t("app.title");
  preloadImages();
});

// 更改设置后重新随机
watch([allowSingleBackpack, allowSingleSupportWeapon], reRandomizeStratagems);

// 更改筛选后重新随机
let previousBannedStratagems: string[] = [];
watch(hasEnabledBannedStratagem, (x: boolean) => {
  if (x) {
    previousBannedStratagems = [...bannedStratagems.value];
  } else {
    const hasChanged =
      previousBannedStratagems.length !== bannedStratagems.value.length ||
      previousBannedStratagems.some(
        str => !bannedStratagems.value.includes(str)
      );
    if (hasChanged) {
      reRandomizeStratagems();
    }
  }
});
</script>

<template>
  <main>
    <transition name="fade">
      <banned-stratagem-selector
        v-if="hasEnabledBannedStratagem"
        v-model="bannedStratagems"
        @close="hasEnabledBannedStratagem = false"
      />
    </transition>
    <div class="top-bar" />
    <div
      class="main-container"
      :class="['main-container', currLang + '-style']"
      :style="{
        filter: hasEnabledBannedStratagem ? 'brightness(50%)' : 'none',
      }"
      @click="closeStratagemSelector"
    >
      <div class="sub-container">
        <div class="title-container">
          <div class="title">
            <img
              src="/title.svg"
              style="height: 32px; margin-right: 10px; transform: scaleX(-1)"
              draggable="false"
            >
            <span>{{ t("app.title") }}</span>
            <img
              src="/title.svg"
              style="height: 32px; margin-left: 10px"
              draggable="false"
            >
          </div>
          <div class="latest-date-container">
            <span style="color: #aaa; margin-right: 10px">{{
              t("app.updateDateTip")
            }}</span>
            <span style="color: white">{{ lastUpdateDate }}</span>
          </div>
        </div>

        <div class="rules-setting">
          <div class="rules-title-container">
            <span class="rules-title">{{ t("settings.title") }}</span>
          </div>
          <div class="settings-container">
            <div class="setting-container">
              <div class="setting-description-container">
                <span class="setting-title">{{
                  t("settings.singleBackpack.title")
                }}</span>
                <span class="setting-description">{{
                  t("settings.singleBackpack.description")
                }}</span>
              </div>
              <div class="setting-button-container">
                <toggle-button v-model="allowSingleBackpack" />
              </div>
            </div>
            <div class="setting-container">
              <div class="setting-description-container">
                <span class="setting-title">{{
                  t("settings.singleSupportWeapon.title")
                }}</span>
                <span class="setting-description">{{
                  t("settings.singleSupportWeapon.description")
                }}</span>
              </div>
              <div class="setting-button-container">
                <toggle-button v-model="allowSingleSupportWeapon" />
              </div>
            </div>
            <div class="setting-container">
              <div class="setting-description-container">
                <span class="setting-title">{{
                  t("settings.stratagemFilter.title")
                }}</span>
                <div>
                  <span class="setting-description">{{ t("settings.stratagemFilter.currentlyBanned") }}
                  </span>
                  <span class="setting-description" style="color: #fee70f">
                    {{ bannedStratagems.length }}
                  </span>
                  <span class="setting-description">
                    {{ t("settings.stratagemFilter.bannedCount") }}
                  </span>
                </div>
              </div>
              <div class="setting-button-container">
                <button
                  class="filter-button"
                  @click.stop="hasEnabledBannedStratagem = true"
                >
                  {{ t("settings.stratagemFilter.openButton") }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="stratagems-outer-container">
          <div v-if="hasStratagemsError" class="error-message-container">
            <div class="error-text">
              {{ t("settings.stratagemFilter.lackingStratagemErrorInfo") }}
            </div>
          </div>
          <div v-else class="stratagems-inner-container">
            <stratagem
              v-for="(item, index) in stratagems"
              :key="item.ID"
              :image-src="getCachedImageUrl('stratagems/' + item.imgSrc)"
              :text="t(`stratagems.${item.ID}`)"
              :index="index"
              @click="reRandomizeSingleStratagem"
            />
          </div>
        </div>
        <div class="random-button-container">
          <div>
            <liber-button
              color-a="#A1920B"
              color-b="#FEE70F"
              :disabled="hasStratagemsError"
              @click="reRandomizeStratagems"
            >
              <div class="random-button-inner">
                <span>{{ t("app.randomizeAll") }}</span>
                <img src="/dice.png" style="height: 24px; margin-left: 10px">
              </div>
            </liber-button>
          </div>
          <div v-if="!hasStratagemsError" style="user-select: none">
            <span style="color: white">{{ t("app.clickToRandomize") }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-bar" />
  </main>
</template>

<style scoped lang="css" src="./index.css"></style>
