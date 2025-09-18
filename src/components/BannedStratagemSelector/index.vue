<script setup lang="ts">
import { ref, onMounted } from "vue";

import { useI18n } from "vue-i18n";

import LiberButton from "@/components/LiberButton.vue";
import Stratagem from "@/components/Stratagem.vue";
import { useImageCache } from "@/composables/useImageCache";
import { filename } from "@/random-dict/filename";
import { attack, defense, support } from "@/random-dict/stratagem-type";
import { type Option } from "@/type";

const bannedStratagems = defineModel<string[]>({ default: [] });
const emit = defineEmits(["close"]);

const { t, locale } = useI18n();
const { getCachedImageUrl } = useImageCache();
const currLang = locale.value;

const toggleBan = (key: string) => {
  const banned = bannedStratagems.value;
  bannedStratagems.value = banned.includes(key)
    ? banned.filter(item => item !== key)
    : [...banned, key];
};

const stratagemListsContainer = ref<Option<HTMLElement>>(null);
const scrollbarInner = ref<Option<HTMLElement>>(null);

const updateScrollbar = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const container: HTMLElement = stratagemListsContainer.value!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const inner: HTMLElement = scrollbarInner.value!;

  const scrollTop = container.scrollTop;
  const scrollHeight = container.scrollHeight;
  const clientHeight = container.clientHeight;

  const scrollbarHeight = (clientHeight / scrollHeight) * clientHeight;
  const scrollOffset =
    (scrollTop / (scrollHeight - clientHeight)) *
    (clientHeight - scrollbarHeight);

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
  <div
    class="banned-stratagem-selector"
    :class="['banned-stratagem-selector', currLang + '-style']"
    @click.right.prevent="emit('close')"
  >
    <div class="title-container">
      <span>{{ t("stratagemSelector.title") }}</span>
    </div>

    <div class="stratagem-lists">
      <div
        ref="stratagemListsContainer"
        class="stratagem-lists-container"
        @scroll="updateScrollbar"
      >
        <div class="stratagem-list">
          <span>{{ t("stratagemSelector.attack") }}</span>
          <div class="stratagem-container">
            <Stratagem
              v-for="(key, idx) in attack"
              :key="key"
              :image-src="getCachedImageUrl('stratagems/' + filename[key])"
              :index="idx"
              :class="{ banned: bannedStratagems.includes(key) }"
              @click="toggleBan(key)"
            />
          </div>
        </div>
        <div class="stratagem-list">
          <span>{{ t("stratagemSelector.support") }}</span>
          <div class="stratagem-container">
            <Stratagem
              v-for="(key, idx) in support"
              :key="key"
              :image-src="getCachedImageUrl('stratagems/' + filename[key])"
              :index="idx"
              :class="{ banned: bannedStratagems.includes(key) }"
              @click="toggleBan(key)"
            />
          </div>
        </div>
        <div class="stratagem-list">
          <span>{{ t("stratagemSelector.defense") }}</span>
          <div class="stratagem-container">
            <Stratagem
              v-for="(key, idx) in defense"
              :key="key"
              :image-src="getCachedImageUrl('stratagems/' + filename[key])"
              :index="idx"
              :class="{ banned: bannedStratagems.includes(key) }"
              @click="toggleBan(key)"
            />
          </div>
        </div>
      </div>
      <div class="scrollbar-outer">
        <div ref="scrollbarInner" class="scrollbar-inner">
          <div class="scrollbar-inner-top" />
          <div class="scrollbar-inner-bottom" />
        </div>
      </div>
    </div>

    <div class="bottom-container">
      <liber-button
        color-a="#D5D5D5"
        color-b="#CBCBCE"
        :disabled="bannedStratagems.length === 0"
        @click="bannedStratagems = []"
      >
        <div class="liber-button-inner">
          <img src="/reset.svg" style="margin: 0 0 0 20px">
          <span class="right">{{ t("stratagemSelector.reset") }}</span>
        </div>
      </liber-button>
      <liber-button color-a="#D5D5D5" color-b="#CBCBCE" @click="emit('close')">
        <div class="liber-button-inner">
          <span class="left">✓</span>
          <span class="right">{{ t("stratagemSelector.confirm") }}</span>
        </div>
      </liber-button>
    </div>
  </div>
</template>

<style scoped lang="css" src="./index.css"></style>
