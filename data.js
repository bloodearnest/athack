'use strict';

const player_data = {
  "Eldaerion": {
    attacks: [
    {
      name: "Sun Blade",
      tohit: 8,
      damage: {radiant: "d8+5"},
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
      tohit: 9,
      damage: {piercing: "d6+4"},
      conditions: {
        "Hunters Mark": {weapon: "d6"},
        "Favored Enemy": {weapon: "4"},
        "Sharpshooter": {weapon: "10", tohit: "-5"},
      }
    }, {
      name: "+1 Longbow",
      tohit: 10,
      damage: {"magical piercing": "d8+5"},
      conditions: {
        "Hunters Mark": {weapon: "d6"},
        "Favored Enemy": {weapon: "4"},
        "Sharpshooter": {weapon: "10", tohit: "-5"},
      }
    }, {
      name: "Oathbow",
      tohit: 9,
      damage: {"magical piercing": "d8+4"},
      conditions: {
        "Hunters Mark": {weapon: "d6"},
        "Favored Enemy": {weapon: "4"},
        "Sworn Enemy": {weapon: "3d6"},
        "Sharpshooter": {weapon: "10", tohit: "-5"},
      }
    }, {
      name: "Hail of Thorns",
      save: '14 Dex',
      damage: {"magical piercing": "d10"},
      conditions: {
        'Level 2 Slot': {"weapon": "d10"},
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
        "Trip Attack": {"weapon": "d8", effect: "DC 16 Str save or prone (Large or smaller)"},
        "Pushing Attack": {"weapon": "d8", effect: "DC 16 Str save or pushed 15ft away (Large or smaller)"},
        "Goading Attack": {"weapon": "d8", effect: "DC 16 Wis save or has disadvantage against other targets"},
        "Riposte": {"weapon": "d8"},
      },
      rules: {"Great Weapon Fighting": true}
    }, {
      name: "Javelin",
      tohit: 8,
      damage: {piercing: "d6+5"},
      conditions: {
        "Trip Attack": {"weapon": "d8", effect: "DC 16 Str save or prone (Large or smaller)"},
        "Pushing Attack": {"weapon": "d8", effect: "DC 16 Str save or pushed 15ft away (Large or smaller)"},
        "Goading Attack": {"weapon": "d8", effect: "DC 16 Wis save or has disadvantage against other targets"},
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
        "Giant": {"weapon": "2d6"},
      }
    }, {
      name: "Giant Slayer Halberd Butt",
      tohit: 8,
      damage: {"magical bludgeoning": "d4+5"},
      conditions: {
        "Giant": {"weapon": "2d6"},
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
      tohit: 8,
      damage: {"magical piercing": "d10+5"},
      conditions: {
        "Sneak Attack": {"weapon": "4d6"},
        "Commanders Strike": {"weapon": "d8"},
      }
    },
    ],
  },
  "Lyra": {
    attacks: [
    {
      name: "Eldritch Blast",
      tohit: 7,
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
};
