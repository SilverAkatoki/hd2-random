import { filename } from "./random-dict/filename";
import { stratagemName } from "./random-dict/stratagem-name";
import {
  backpack,
  supportWeapon,
  supportWeaponWithBackpack,
} from "./random-dict/stratagem-type";

// Fisher-Yates
const shuffle = <T>(array: T[]): T[] => {
  const shuffled: T[] = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getRandomCombinations = (
  allowSingleBackpack: boolean = false,
  allowSingleSupportWeapon: boolean = false,
  bannedStratagems: string[] = []
): { ID: string; imgSrc: string; text: string }[] => {
  const keys = Object.keys(filename).filter((key) => key in stratagemName);
  const combinations: { ID: string; imgSrc: string; text: string }[] = [];

  const shuffledKeys = shuffle(keys);

  let backpackAdded = false;
  let supportWeaponAdded = false;

  for (let i = 0; i < shuffledKeys.length && combinations.length < 4; i++) {
    const key = shuffledKeys[i];

    if (
      allowSingleBackpack &&
      (backpack.includes(key) || supportWeaponWithBackpack.includes(key))
    ) {
      if (backpackAdded) continue;
      backpackAdded = true;
    }

    if (
      allowSingleSupportWeapon &&
      (supportWeapon.includes(key) || supportWeaponWithBackpack.includes(key))
    ) {
      if (supportWeaponAdded) continue;
      supportWeaponAdded = true;
    }

    if (bannedStratagems.includes(key)) {
      continue;
    }

    combinations.push({
      ID: key,
      imgSrc: filename[key],
      text: stratagemName[key],
    });
  }

  return combinations;
};

export const randomizeSingleStratagem = (
  index: number,
  stratagems: { ID: string; imgSrc: string; text: string }[],
  allowSingleBackpack: boolean,
  allowSingleSupportWeapon: boolean,
  bannedStratagems: string[]
): { ID: string; imgSrc: string; text: string } => {
  let newStratagem;
  let attempts = 0;

  do {
    const allCombinations = getRandomCombinations(false, false, bannedStratagems);
    newStratagem = allCombinations[Math.floor(Math.random() * allCombinations.length)];

    const otherKeys = stratagems
      .map((item, i) => i !== index ? item.ID : null)
      .filter(key => key !== null);

    const hasConflict = otherKeys.includes(newStratagem.ID) ||
      (allowSingleBackpack && hasBackpackConflict(newStratagem.ID, otherKeys)) ||
      (allowSingleSupportWeapon && hasSupportWeaponConflict(newStratagem.ID, otherKeys));

    if (!hasConflict) break;

  } while (++attempts < 100);

  return newStratagem;
};

const hasBackpackConflict = (newKey: string, otherKeys: string[]): boolean => {
  const isNewBackpack = backpack.includes(newKey) || supportWeaponWithBackpack.includes(newKey);
  const hasOtherBackpack = otherKeys.some(key => backpack.includes(key) || supportWeaponWithBackpack.includes(key));
  return isNewBackpack && hasOtherBackpack;
};

const hasSupportWeaponConflict = (newKey: string, otherKeys: string[]): boolean => {
  const isNewSupport = supportWeapon.includes(newKey) || supportWeaponWithBackpack.includes(newKey);
  const hasOtherSupport = otherKeys.some(key => supportWeapon.includes(key) || supportWeaponWithBackpack.includes(key));
  return isNewSupport && hasOtherSupport;
};
