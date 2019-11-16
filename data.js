'use strict';

const party_data = {
  "Areni": {
    attacks: [
      {
        name: "Firebolt",
        tohit: 6,
        damage: {"fire": "1d10"},
      }, {
        name: "Shortsword",
        tohit: 5,
        damage: {"piercing": "d6+3"},
      }, {
        name: "Shocking Grasp",
        tohit: 6,
        damage: {"lightning": "1d8"},
        secondary: {"desc": "target cannot use reaction this turn"},
      }, {
        name: "Chromatic Orb",
        tohit: 6,
        damage: {"acid|cold|fire|lightning|poison|thunder": "3d8"},
        conditions: {
          "level 2": {"weapon": "d8"},
          "level 3": {"weapon": "2d8"},
        },
      }, {
        name: "Burning Hands",
        save: "14 Dex",
        damage: {"fire": "3d6"},
        conditions: {
          "level 2": {"weapon": "d6"},
          "level 3": {"weapon": "2d6"},
        },
      }, {
        name: "Sleep",
        damage: {sleep: "5d8"},
        conditions: {
          "level 2": {"weapon": "2d8"},
          "level 3": {"weapon": "4d8"},
        },
      }
    ]
  },
  "Caimbarel": {
    attacks: [
      {
        name: "Scimitar/Chakram",
        tohit: 6,
        damage: {"slashing": "1d6+4"},
        conditions: {
          "Menacing": {"weapon": "d8", "effect": "DC 14 Wis save or frightened till next turn"},
          "Maneuver": {"weapon": "d8"},
        },
      }, {
        name: "Dart",
        tohit: 6,
        damage: {"slashing": "1d6+4"},
        conditions: {
          "Menacing": {"weapon": "d8", "effect": "DC 14 Wis save or frightened till next turn"},
          "Maneuver": {"weapon": "d8"},
        },
      }
    ]
  },
  "Haemyr": {
    attacks: [
      {
        name: "Shortbow",
        tohit: 8,
        damage: {"piercing": "1d8+4"},
        conditions: {
          "Hunters Mark": {"weapon": "d6"},
        },
      }, {
        name: "Rapier",
        tohit: 6,
        damage: {"piercing": "1d8+4"},
        conditions: {
          "Hunters Mark": {"weapon": "d6"},
        },
      }
    ]
  },
  "Harethier": {
    attacks: [
      {
        name: "Toll the Dead",
        save: "13 Wis",
        half: false,
        damage: {"necrotic": "d8"},
        conditions: {
          "Injured": {weapon: "d12", replace: true},
        },
      }, {
        name: "Spiritual Weapon",
        tohit: 5,
        damage: {force: "d8+3"},
      }, {
        name: "Guided Bolt",
        tohit: 5,
        damage: {radiant: "4d6", effect: "Next attack on target has advantage"},
        conditions: {
          "level 2": {weapon: "d6"},
          "level 3": {weapon: "d6"},
        },
      },
    ],
  },
  "Sigurd": {
    attacks: [
      {
        name: "Greataxe",
        tohit: 6,
        damage: {"slashing": "2d6+4"},
        conditions: {
          "Raging": {weapon: "2"},
        },
      }, {
        name: "Javelin",
        tohit: 6,
        damage: {"piercing": "1d6+4"},
        conditions: {
          "Raging": {weapon: "2"},
        },
      }, {
        name: "Light Hammer",
        tohit: 6,
        damage: {"piercing": "1d4+4"},
        conditions: {
          "Raging": {weapon: "2"},
        },
      }
    ],
  },
  "Zanavor": {
    attacks: [
      {
        name: "Shadowmourne",
        tohit: 6,
        damage: {slashing: "1d10+4"},
        conditions: {
          "Hexed": {weapon: "d6"},
          "Cursed": {weapon: "2", rules: {"Improved Critical": "19"}},
          "One Handed": {weapon: "d8+4", replace: true},
        },
      }, {
        name: "Eldritch Blast",
        tohit: 5,
        damage: {force: "d10"},
        conditions: {
          "Hexed": {weapon: "d6"},
          "Cursed": {weapon: "2", rules: {"Improved Critical": "19"}},
        },
      },
    ]
  }
};
