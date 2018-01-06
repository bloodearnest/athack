'use strict';

const player_data = {
  "Eldaerion": {
    attacks: [
    {
      name: "Sun Blade",
      tohit: "13",
      damage: {radiant: "3d8+9"},
      conditions: {
        Undead: {weapon: "d8"},
        "Green Flame": {
            fire: "d8",
            secondary: {fire: "d8+5", desc: 'to adjacent target'},
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
      tohit: 9,
      damage: {fire: "2d10"},
    }, {
      name: "Steel Wind Strike",
      tohit: 9,
      damage: {force: "6d10"},
    }, {
      name: "Synaptic Strike",
      save: '17 Int',
      damage: {
          psychic: "8d6",
          effect: "20' radius, -1d6 to attacks, ablility checks, and concentration for 1 min. Save at end of their turn ends condition.",
      },
    }, {
      name: "Fireball",
      save: '17 Dex',
      damage: {fire: "8d6"},
      conditions: {
        'Level 4 Slot': {fire: "1d6"},
        'Level 5 Slot': {fire: "2d6"},
      }
    }, {
      name: "Lightning Bolt",
      save: '17 Dex',
      damage: {lightning: "8d6"},
      conditions: {
        'Level 4 Slot': {lightning: "1d6"},
        'Level 5 Slot': {lightning: "2d6"},
      }
    }, {
      name: "Thunderwave",
      save: '17 Con',
      damage: {
          thunder: "2d8",
          effect: "Each creature in 15' cube pushed 10' away if they fail the save",
      },
      conditions: {
        'Level 2 Slot': {thunder: "1d8"},
        'Level 3 Slot': {thunder: "2d8"},
        'Level 4 Slot': {thunder: "3d8"},
        'Level 5 Slot': {thunder: "4d8"},
      },
    }
    ],
  },
  "Dakeyras": {
    attacks: [
    {
      name: "+1 Hand Oathbow",
      tohit: 12,
      damage: {"magical piercing": "3d6+6"},
      conditions: {
        "Hunters Mark": {weapon: "d6"},
        "Favored Enemy": {weapon: "4"},
        "Sharpshooter": {weapon: "10", tohit: "-5"},
        "Sworn Enemy": {weapon: "3d6"},
        "+1 Bolt": {weapon: "1", tohit: "1"},
      }
    }, {
      name: "Ensnaring Strike",
      save: '15 Str',
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
      tohit: 12,
      damage: {"magical slashing": "6d6+8"},
      conditions: {
        'Flame Tongue': {fire: "2d6"},
        "Trip Attack": {weapon: "d10", effect: "DC 20 Str save or prone (Large or smaller)"},
        "Pushing Attack": {weapon: "d10", effect: "DC 20 Str save or pushed 15ft away (Large or smaller)"},
        "Goading Attack": {weapon: "d10", effect: "DC 20 Wis save or has disadvantage against other targets"},
        "Feinting Attack": {weapon: "d10", advantage: true},
        "Riposte": {weapon: "d10"},
        "Great Weapon Master": {weapon: "10", tohit: "-5"},
      },
      rules: {"Great Weapon Fighting": true}
    }, {
      name: "Javelin",
      tohit: 12,
      damage: {piercing: "3d6+8"},
      conditions: {
        "Trip Attack": {weapon: "d10", effect: "DC 20 Str save or prone (Large or smaller)"},
        "Pushing Attack": {weapon: "d10", effect: "DC 20 Str save or pushed 15ft away (Large or smaller)"},
        "Goading Attack": {weapon: "d10", effect: "DC 20 Wis save or has disadvantage against other targets"},
      },
    }
    ],
  },
  "Steadyhand": {
    attacks: [
    {
      name: "+1 Giant Slayer Halberd",
      tohit: 12,
      damage: {"magical slashing": "3d10+8"},
      rules: {
          "Improved Critical": 19,
          "Great Weapon Fighting": true,
      },
      conditions: {
        "Giant": {weapon: "2d6"},
      }
    }, {
      name: "+1 Giant Slayer Halberd Butt",
      tohit: 12,
      damage: {"magical bludgeoning": "3d4+8"},
      conditions: {
        "Giant": {weapon: "2d6"},
      },
      rules: {
          "Improved Critical": 19,
          "Great Weapon Fighting": true,
      },
    }, {
      name: "Javelin of Lightning",
      tohit: 12,
      damage: {
        "magical piercing": "3d6+7",
        lightning: "4d6",
        secondary: {lightning: "4d6"}
      },
      rules: {"Improved Critical": 19},
    }, {
      name: "Javelin",
      tohit: 12,
      damage: {piercing: "3d6+8"},
      rules: {"Improved Critical": 19},
    }
    ],
  },
  "Bram": {
    attacks: [
    {
      name: "+1 Heavy Crossbow",
      tohit: 10,
      damage: {"magical piercing": "3d10+6"},
      conditions: {
        "Sneak Attack": {weapon: "5d6"},
        "Commanders Strike": {weapon: "d8"},
        "Sharpshooter": {weapon: "10", tohit: "-5"},
        "+1 Bolt": {weapon: "1", tohit: "1"},
      }
    },
    ],
  },
  "Lyra": {
    attacks: [
    {
      name: "Eldritch Blast",
      tohit: 9,
      damage: {
          force: "d10+5",
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
