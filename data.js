'use strict';

const player_data = [
  {
    name: "Eldaerion",
    attacks: [
    {
      name: "Sun Blade",
      tohit: 8,
      damage: {radiant: "d8+5"},
      conditions: {
        Undead: {radiant: "d8"},
        "Green Flame Blade": {fire: "d8", secondary: {fire: "d8+4"}},
        "Booming Blade": {thunder: "d8", secondary: {thunder:"2d8"}},
      }
    }, {
      name: "Firebolt",
      tohit: 7,
      damage: {fire: "2d10"},
    }
    ],
  },
  {
    name: "Dakeyras",
    attacks: [
    {
      name: "Hand Crossbow",
      tohit: 9,
      damage: {piercing: "d6+4"},
      conditions: {
        "Hunters Mark": {piercing: "d6"},
        "Favored Enemy": {piercing: "4"},
      }
    }, {
      name: "+1 Longbow",
      tohit: 10,
      damage: {"magical piercing": "d8+5"},
      conditions: {
        "Hunters Mark": {"magical piercing": "d6"},
        "Favored Enemy": {"magical piercing": "4"},
      }
    }, {
      name: "Oathbow",
      tohit: 9,
      damage: {"magical piercing": "d8+4"},
      conditions: {
        "Hunters Mark": {"magical piercing": "d6"},
        "Favored Enemy": {"magical piercing": "4"},
        "Sworn Enemy": {"magical piercing": "3d6"},
      }
    }
    ],
  },
  {
    name: "Skywatcher",
    attacks: [
    {
      name: "Flame Tongue Greatsword",
      tohit: 8,
      damage: {"magical slashing": "2d6+5"},
      conditions: {
        'Flame Tongue': {fire: "2d6"},
      },
      rules: {"Great Weapon Fighting": true}
    }, {
      name: "Javelin",
      tohit: 8,
      damage: {piercing: "d6+5"}
    }
    ],
  },
  {
    name: "Steadyhand",
    attacks: [
    {
      name: "Giant Slayer Halberd",
      tohit: 8,
      damage: {"magical slashing": "d10+5"},
      rules: {"Improved Critical": 19},
      conditions: {
        "Giant": {"magical slashing": "2d6"},
        "Trip Attack": {"magical slashing": "d8"},
        "Goading Attack": {"magical slashing": "d8"},
        "Sweeping Attack": {secondary: {"magical slashing": "d8"}},
      }
    }, {
      name: "Giant Slayer Halberd Butt",
      tohit: 8,
      damage: {"magical bludgeoning": "d4+5"},
      conditions: {
        "Giant": {"magical bludgeoning": "2d6"},
        "Trip Attack": {"magical bludgeoning": "d8"},
        "Goading Attack": {"magical bludgeoning": "d8"},
        "Sweeping Attack": {secondary: {"magical bludgeoning": "d8"}},
      },
      rules: {"Improved Critical": 19},
    }, {
      name: "Javelin of Lightning",
      tohit: 7,
      damage: {"magical piercing": "d6+4", lightning: "4d6"},
      rules: {"Improved Critical": 19},
      secondary: {lightning: "4d6"}
    }, {
      name: "Javelin",
      tohit: 7,
      damage: {piercing: "d6+4"},
      rules: {"Improved Critical": 19},
    }
    ],
  },
  {
    name: "Bram",
    attacks: [
    {
      name: "+1 Heavy Crossbow",
      tohit: 8,
      damage: {"magical piercing": "d10+5"},
      conditions: {
        "Sneak Attack": {"magical piercing": "3d6"},
        "Commanders Strike": {"magical piercing": "d8"},
      }
    },
    ],
  },
  {
    name: "Lyra",
    attacks: [
    {
      name: "Eldritch Blast",
      tohit: 7,
      damage: {force: "d10"},
      conditions: {
        "Hex": {"necrotic": "d6"},
      }
    },
    ],
  },
];
