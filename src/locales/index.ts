// 语言包类型定义
export interface MessageSchema {
  app: {
    title: string;
    randomizeAll: string;
    clickToRandomize: string;
  };
  settings: {
    title: string;
    singleBackpack: {
      title: string;
      description: string;
    };
    singleSupportWeapon: {
      title: string;
      description: string;
    };
    stratagemFilter: {
      title: string;
      description: string;
      currentlyBanned: string;
      bannedCount: string;
      openButton: string;
    };
  };
  stratagemSelector: {
    title: string;
    attack: string;
    support: string;
    defense: string;
    reset: string;
    confirm: string;
    tooFewStratagemAlert: string;
  };
  [key: string]: any;
}

// 语言包导入
import zh from './zh';
import en from './en';

export const messages = {
  zh,
  en,
};

export type LocaleMessages = typeof messages;