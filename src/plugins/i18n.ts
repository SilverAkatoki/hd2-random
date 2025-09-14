import { createI18n } from 'vue-i18n';
import { messages } from '../locales';

// 支持的语言列表
const SUPPORTED_LOCALES = ['zh', 'en'];

/**
 * 检测浏览器语言，默认 fallback 为英文
 */
function detectLocale(): string {
  // 获取浏览器语言
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';

  // 匹配语言代码（如 zh-CN -> zh）
  const langCode = browserLang.split('-')[0];

  // 如果支持该语言则返回，否则返回英文
  // return 'en'
  return SUPPORTED_LOCALES.includes(langCode) ? langCode : 'en';
}

/**
 * 创建并配置 i18n 实例
 */
export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages,
});
