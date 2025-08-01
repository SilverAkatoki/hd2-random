import { filename } from "./random-dict/filename";
import { stratagemName } from "./random-dict/stratagem-name";
import {
  backpack,
  supportWeapon,
  supportWeaponWithBackpack,
  vehicle,
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
  allowVehicle: boolean = true
) => {
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

    if (!allowVehicle && vehicle.includes(key)) {
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
