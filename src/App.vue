<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getRandomCombinations } from './random';
import { backpack, supportWeaponWithBackpack, supportWeapon } from './random-dict/stratagem-type';
import { filename } from './random-dict/filename';
import ToggleButton from './components/ToggleButton.vue';
import stratagem from './components/Stratagem.vue';

const stratagems = ref(getRandomCombinations());
const allowSingleBackpack = ref(false);
const allowSingleSupportWeapon = ref(false);
const allowVehicle = ref(true);
const banedStratagemCount = ref(0);

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
  const images = Object.entries(filename).map(([_, value]) => `stratagems/${value}`);
  images.forEach(src => {
    const img = new Image();
    img.src = import.meta.env.BASE_URL + src;
  });
};

onMounted(() => {
  preloadImages();
});

// 更改设置后重新随机
watch([allowSingleBackpack, allowSingleSupportWeapon, allowVehicle], () => {
  randomizeStratagems();
});

</script>

<template>
  <main>
    <div class="top-bar"></div>
    <div class="main-container">
      <div class="sub-container">
        <div class="title-container">
          <img src="/title.svg" style="height: 32px; margin-right: 10px; transform: scaleX(-1);" />
          <span>Helldivers 2 全随机战备</span>
          <img src="/title.svg" style="height: 32px; margin-left: 10px;" />
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
                  <span class="setting-description" style="color: #FEE70F;"> {{ banedStratagemCount }} </span>
                  <span class="setting-description"> 个战备</span>
                </div>
              </div>
              <div class="setting-button-container">
                <button class="filter-button">打开</button>
              </div>
            </div>
          </div>
        </div>
        <div class="stratagems-outer-container">
          <div class="stratagems-inner-container">
            <stratagem v-for="(item, index) in stratagems" :imageSrc="'/stratagems/' + item.imgSrc" :text="item.text"
              :index="index" @randomize="randomizeSingleStratagem" />
          </div>
        </div>
        <div class="random-button-container">
          <div>
            <div class="random-button" @click="randomizeStratagems">
              <span>全部随机</span>
              <img src="/dice.png" />
            </div>
          </div>
          <div style="user-select: none;">
            <span style="color: #FEE70F;">点击战备图标</span>
            <span style="color: white;">以进行单个战备的随机</span>
          </div>
        </div>
      </div>
      <img class="background-img" src="/background.webp" />
    </div>
    <div class="bottom-bar"></div>
  </main>
</template>

<style scoped>
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);

  >img.background-img {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100vw;
    height: calc(100vh - 100px);
    object-fit: cover;
    z-index: -1;
    filter: brightness(0.5);
  }
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

button.filter-button:hover {
  background-color: #211F06;
  border-color: #FEE70F;
  box-shadow: 0 0 15px 5px rgba(254, 231, 15, 0.35);
  color: #FEE70F;
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

  transition: all 0.2s ease;

  display: flex;
  align-items: center;

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
}
</style>
