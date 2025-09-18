// 语言包导入
import en from "./en";
import zh from "./zh";

export const messages = {
  zh,
  en
};

export type MessageSchema = typeof zh;
export type LocaleMessages = typeof messages;
