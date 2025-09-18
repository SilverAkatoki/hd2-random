// 语言包导入
import zh from "./zh";
import en from "./en";

export const messages = {
  zh,
  en,
};

export type MessageSchema = typeof zh;
export type LocaleMessages = typeof messages;
