'use strict';

const player_data = {
  "Eldaerion": {
    attacks: [
    {
      name: "Sun Blade",
      tohit: 9,
      damage: {radiant: "d8+6"},
      conditions: {
        Undead: {weapon: "d8"},
        "Green Flame": {
            fire: "d8",
            secondary: {fire: "d8+4", desc: 'to adjacent target'},
        },
        "Booming Blade": {
            thunder: "d8",
            secondary: {thunder:"2d8", desc: 'if they voluntarily move'},
        },
        "Bless": {tohit: 'd4'},
        "Bane": {tohit: '-d4'},
      }
    }, {
      name: "Firebolt",
      tohit: 7,
      damage: {fire: "2d10"},
    }, {
      name: "Fireball",
      save: '15 Dex',
      damage: {fire: "8d6"},
      conditions: {
        'Level 4 Slot': {fire: "1d6"},
      }
    }, {
      name: "Lightning Bolt",
      save: '15 Dex',
      damage: {lightning: "8d6"},
      conditions: {
        'Level 4 Slot': {lightning: "1d6"},
      }
    }, {
      name: "Thunderwave",
      save: '15 Con',
      damage: {
          thunder: "2d8",
          effect: "Each creature in 15' cube pushed 10' away if they fail the save",
      },
      conditions: {
        'Level 2 Slot': {thunder: "1d8"},
        'Level 3 Slot': {thunder: "2d8"},
        'Level 4 Slot': {thunder: "3d8"},
      }
    }
    ],
  },
  "Dakeyras": {
    attacks: [
    {
      name: "Hand Crossbow",
      tohit: 10,
      damage: {piercing: "d6+5"},
      conditions: {
        "Hunters Mark": {weapon: "d6"},
        "Favored Enemy": {weapon: "4"},
        "Sharpshooter": {weapon: "10", tohit: "-5"},
      }
    }, {
      name: "+1 Longbow",
      tohit: 11,
      damage: {"magical piercing": "d8+6"},
      conditions: {
        "Hunters Mark": {weapon: "d6"},
        "Favored Enemy": {weapon: "4"},
        "Sharpshooter": {weapon: "10", tohit: "-5"},
      }
    }, {
      name: "Oathbow",
      tohit: 10,
      damage: {"magical piercing": "d8+5"},
      conditions: {
        "Hunters Mark": {weapon: "d6"},
        "Favored Enemy": {weapon: "4"},
        "Sworn Enemy": {weapon: "3d6"},
        "Sharpshooter": {weapon: "10", tohit: "-5"},
      }
    }, {
      name: "Ensnaring Strike",
      save: '14 Str',
      damage: {
        "magical piercing": "d6",
        effect: "Restrained, takes the damage at the start of it's turn.",
      },
      conditions: {
        'Level 2 Slot': {weapon: "d6"},
      },
    }
    ],
  },
  "Skywatcher": {
    attacks: [
    {
      name: "Flame Tongue Greatsword",
      tohit: 8,
      damage: {"magical slashing": "2d6+5"},
      conditions: {
        'Flame Tongue': {fire: "2d6"},
        "Trip Attack": {weapon: "d8", effect: "DC 16 Str save or prone (Large or smaller)"},
        "Pushing Attack": {weapon: "d8", effect: "DC 16 Str save or pushed 15ft away (Large or smaller)"},
        "Goading Attack": {weapon: "d8", effect: "DC 16 Wis save or has disadvantage against other targets"},
        "Feinting Attack": {weapon: "d8", advantage: true},
        "Riposte": {weapon: "d8"},
        "Great Weapon Master": {weapon: "10", tohit: "-5"},
      },
      rules: {"Great Weapon Fighting": true}
    }, {
      name: "Javelin",
      tohit: 8,
      damage: {piercing: "d6+5"},
      conditions: {
        "Trip Attack": {weapon: "d8", effect: "DC 16 Str save or prone (Large or smaller)"},
        "Pushing Attack": {weapon: "d8", effect: "DC 16 Str save or pushed 15ft away (Large or smaller)"},
        "Goading Attack": {weapon: "d8", effect: "DC 16 Wis save or has disadvantage against other targets"},
      },
    }
    ],
  },
  "Steadyhand": {
    attacks: [
    {
      name: "Giant Slayer Halberd",
      tohit: 8,
      damage: {"magical slashing": "d10+5"},
      rules: {
          "Improved Critical": 19,
          "Great Weapon Fighting": true,
      },
      conditions: {
        "Giant": {weapon: "2d6"},
      }
    }, {
      name: "Giant Slayer Halberd Butt",
      tohit: 8,
      damage: {"magical bludgeoning": "d4+5"},
      conditions: {
        "Giant": {weapon: "2d6"},
      },
      rules: {
          "Improved Critical": 19,
          "Great Weapon Fighting": true,
      },
    }, {
      name: "Javelin of Lightning",
      tohit: 7,
      damage: {
        "magical piercing": "d6+4",
        lightning: "4d6",
        secondary: {lightning: "4d6"}
      },
      rules: {"Improved Critical": 19},
    }, {
      name: "Javelin",
      tohit: 7,
      damage: {piercing: "d6+4"},
      rules: {"Improved Critical": 19},
    }
    ],
  },
  "Bram": {
    attacks: [
    {
      name: "+1 Heavy Crossbow",
      tohit: 9,
      damage: {"magical piercing": "d10+6"},
      conditions: {
        "Sneak Attack": {weapon: "4d6"},
        "Commanders Strike": {weapon: "d8"},
        "Sharpshooter": {weapon: "10", tohit: "-5"},
      }
    },
    ],
  },
  "Lyra": {
    attacks: [
    {
      name: "Eldritch Blast",
      tohit: 8,
      damage: {
          force: "d10",
          effect: "Pushes target 10ft away",
      },
      conditions: {
        "Hex": {"necrotic": "d6"},
      }
    },
    ],
  },
  "King Kong": {
    attacks: [
    {
      name: "Fist",
      tohit: 9,
      damage: {bludgeoning: "3d10+6"},
    },
    {
      name: "Rock",
      tohit: 9,
      damage: {bludgeoning: "7d6+6"},
    },
    ],
  },
};
