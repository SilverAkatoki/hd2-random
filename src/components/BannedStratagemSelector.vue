<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Stratagem from './Stratagem.vue';
import { attack, defense, support } from '../random-dict/stratagem-type';
import { filename } from '../random-dict/filename';
import { useImageCache } from '../composables/useImageCache';

import LiberButton from './LiberButton.vue';
import { ref, onMounted } from 'vue';
import { type Option } from '../type';

const bannedStratagems = defineModel<string[]>({ default: [] });
const emit = defineEmits(['close']);

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
  const container: HTMLElement = stratagemListsContainer.value!;
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
    @click.right.prevent="emit('close')"
    :class="['banned-stratagem-selector', currLang + '-style']"
  >
    <div class="title-container">
      <span>{{ t('stratagemSelector.title') }}</span>
    </div>

    <div class="stratagem-lists">
      <div
        class="stratagem-lists-container"
        ref="stratagemListsContainer"
        @scroll="updateScrollbar"
      >
        <div class="stratagem-list">
          <span>{{ t('stratagemSelector.attack') }}</span>
          <div class="stratagem-container">
            <Stratagem
              v-for="(key, idx) in attack"
              :key="key"
              :imageSrc="getCachedImageUrl('stratagems/' + filename[key])"
              :index="idx"
              :class="{ banned: bannedStratagems.includes(key) }"
              @click="toggleBan(key)"
            />
          </div>
        </div>
        <div class="stratagem-list">
          <span>{{ t('stratagemSelector.support') }}</span>
          <div class="stratagem-container">
            <Stratagem
              v-for="(key, idx) in support"
              :key="key"
              :imageSrc="getCachedImageUrl('stratagems/' + filename[key])"
              :index="idx"
              :class="{ banned: bannedStratagems.includes(key) }"
              @click="toggleBan(key)"
            />
          </div>
        </div>
        <div class="stratagem-list">
          <span>{{ t('stratagemSelector.defense') }}</span>
          <div class="stratagem-container">
            <Stratagem
              v-for="(key, idx) in defense"
              :key="key"
              :imageSrc="getCachedImageUrl('stratagems/' + filename[key])"
              :index="idx"
              :class="{ banned: bannedStratagems.includes(key) }"
              @click="toggleBan(key)"
            />
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
      <liber-button
        colorA="#D5D5D5"
        colorB="#CBCBCE"
        @click="bannedStratagems = []"
        :disabled="bannedStratagems.length === 0"
      >
        <div class="liber-button-inner">
          <img src="/reset.svg" style="margin: 0 0 0 20px" />
          <span class="right">{{ t('stratagemSelector.reset') }}</span>
        </div>
      </liber-button>
      <liber-button colorA="#D5D5D5" colorB="#CBCBCE" @click="emit('close')">
        <div class="liber-button-inner">
          <span class="left">✓</span>
          <span class="right">{{ t('stratagemSelector.confirm') }}</span>
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

div.banned-stratagem-selector.en-style {
  div.title-container {
    > span {
      letter-spacing: 0px;
    }
  }

  div.liber-button-inner {
    > span.left {
      margin-left: 15px;
    }

    > span.right {
      margin-left: 5px;
      font-size: 18px;
    }
  }
}

div.title-container {
  width: 100%;
  height: 5%;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > span {
    margin: 0 10px 0 20px;
    color: #fee70f;
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
  background-image: url(/stripes_background.svg);
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

    > span {
      display: block;
      color: #ddd;
      font-size: 20px;
      letter-spacing: 2px;
      margin-bottom: 10px;
      user-select: none;
    }

    > div.stratagem-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 10px;

      > * {
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

  > span.left {
    margin: 0 0 0 20px;
    color: #cbcbce;
    font-weight: bold;
    font-size: 26px;
  }

  > span.right {
    margin: 0 20px 0 0;
    color: #cbcbce;
    font-size: 20px;
    font-weight: 500;
  }
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
  background-color: #fee70f;
}

div.scrollbar-inner-top {
  top: 0;
}

div.scrollbar-inner-bottom {
  bottom: 0;
}
</style>
