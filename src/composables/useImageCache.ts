import { ref } from "vue";
import { filename } from "@/random-dict/filename";

const keyUrlDict = ref<Record<string, string>>({});
const isLoaded = ref(false);

// 使用 blob 缓存图片
const preloadImages = async (): Promise<void> => {
  if (isLoaded.value) return;

  const url2Blob = async (url: string): Promise<Blob> => {
    return window.fetch(url).then(response => response.blob());
  };

  const baseUrl = import.meta.env.BASE_URL;

  // 为每个图片创建 blob URL 并存储映射关系
  for (const [_, filenameValue] of Object.entries(filename)) {
    const imagePath = `stratagems/${filenameValue}`;
    const fullUrl = baseUrl + imagePath;

    try {
      const blob = await url2Blob(fullUrl);
      const blobUrl = URL.createObjectURL(blob);
      keyUrlDict.value[imagePath] = blobUrl;
    } catch (error) {
      console.warn(`预加载图片时出现错误：${imagePath}`, error);
      // 如果加载失败，使用原始路径作为回退
      keyUrlDict.value[imagePath] = fullUrl;
    }
  }

  isLoaded.value = true;
};

// 获取缓存的图片 URL
const getCachedImageUrl = (imagePath: string): string => {
  return keyUrlDict.value[imagePath] || import.meta.env.BASE_URL + imagePath;
};

export const useImageCache = () => {
  return {
    preloadImages,
    getCachedImageUrl,
    isLoaded,
  };
};
