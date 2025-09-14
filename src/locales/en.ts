import type { MessageSchema } from ".";

const en: MessageSchema = {
  app: {
    title: 'Helldivers 2 Random Stratagems',
    randomizeAll: 'Randomize All',
    clickToRandomize: 'Click stratagem icons to randomize individual stratagems',
    yes: 'Yes',
    no: 'No',
  },
  settings: {
    title: 'Restrictions',
    singleBackpack: {
      title: 'Allow only one backpack',
      description: 'aaa',
    },
    singleSupportWeapon: {
      title: 'Allow only one support weapon',
      description: 'aaa',
    },
    stratagemFilter: {
      title: 'Stratagem Filter Menu',
      bannedCount: ' stratagems',
      openButton: 'Open',
      currentlyBanned: 'Excluded count: ',
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