import type { MessageSchema } from './index';

const en: MessageSchema = {
  app: {
    title: 'Helldivers 2 Random Stratagems',
    randomizeAll: 'Randomize All',
    clickToRandomize: 'Click stratagem icons to randomize individual stratagems',
  },
  settings: {
    title: 'Restrictions',
    singleBackpack: {
      title: 'Allow only one backpack slot',
      description: 'Including backpack stratagems and support weapons with ammo packs',
    },
    singleSupportWeapon: {
      title: 'Allow only one support weapon stratagem',
      description: 'Also known as "slot 3"',
    },
    stratagemFilter: {
      title: 'Stratagem Filter Menu',
      description: 'Currently excluded from random results:',
      bannedCount: 'stratagems',
      openButton: 'Open',
      currentlyBanned: 'Currently excluded from random results:',
    },
  },
  stratagemSelector: {
    title: 'Stratagem Selection Menu',
    attack: 'Offensive',
    support: 'Support',
    defense: 'Defensive',
    reset: 'Reset',
    confirm: 'Confirm',
    tooFewStratagemAlert: 'Too few available stratagems!',
  },
};

export default en;