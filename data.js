'use strict';

const party_data = {
  "Areni": {
    attacks: [
      {
        name: "Firebolt",
        tohit: 6,
        damage: {"fire": "1d10"},
        sounds: SPELL_SOUNDS,
      }, {
        name: "Shortsword",
        tohit: 5,
        damage: {"piercing": "d6+3"},
      }, {
        name: "Shocking Grasp",
        tohit: 6,
        damage: {"lightning": "1d8"},
        secondary: {"desc": "target cannot use reaction this turn"},
        sounds: SPELL_SOUNDS,
      }, {
        name: "Chromatic Orb",
        tohit: 6,
        damage: {"acid|cold|fire|lightning|poison|thunder": "3d8"},
        conditions: {
          "level 2": {"weapon": "d8"},
          "level 3": {"weapon": "2d8"},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Burning Hands",
        save: "14 Dex",
        damage: {"fire": "3d6"},
        conditions: {
          "level 2": {"weapon": "d6"},
          "level 3": {"weapon": "2d6"},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Sleep",
        damage: {sleep: "5d8"},
        conditions: {
          "level 2": {"weapon": "2d8"},
          "level 3": {"weapon": "4d8"},
        },
        sounds: SPELL_SOUNDS,
      }
    ]
  },
  "Caimbarel": {
    attacks: [
      {
        name: "Scimitar/Chakram",
        tohit: 7,
        damage: {"slashing": "1d6+4"},
        conditions: {
          "Menacing": {"weapon": "d8", "effect": "DC 15 Wis save or frightened till next turn"},
          "Maneuver": {"weapon": "d8"},
        },
      }, {
        name: "Dagger of Venom",
        tohit: 8,
        damage: {"peircing": "1d4+5"},
        conditions: {
          "Menacing": {"weapon": "d8", "effect": "DC 15 Wis save or frightened till next turn"},
          "Maneuver": {"weapon": "d8"},
          "Venom": {
              secondary: {poison: "2d10"},
              effect: "DC 15 Con save, or take poison damage and poisoned for 1 min",
          },
        }
      }, {
        name: "Hand Crossbow",
        tohit: 7,
        damage: {"peircing": "1d6+4"},
        conditions: {
          "Menacing": {"weapon": "d8", "effect": "DC 15 Wis save or frightened till next turn"},
          "Maneuver": {"weapon": "d8"},
          "Drow Poison": {
              effect: "DC 13 Con save or poisoned for 1 hour. Fail by 5+ and unconcious (woken if attacked or shaken)",
          },
        },
        sounds: RANGED_SOUNDS,

      }, {
        name: "Dart",
        tohit: 7,
        damage: {"slashing": "1d4+4"},
        conditions: {
          "Menacing": {"weapon": "d8", "effect": "DC 15 Wis save or frightened till next turn"},
          "Maneuver": {"weapon": "d8"},
          "Drow Poison": {
              effect: "DC 13 Con save or poisoned for 1 hour. Fail by 5+ and unconcious (woken if attacked or shaken)",
          },
        },
        sounds: RANGED_SOUNDS,
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
        sounds: RANGED_SOUNDS,
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
        save: "14 Wis",
        half: false,
        damage: {"necrotic": "d8"},
        conditions: {
          "Injured": {weapon: "d12", replace: true},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Spiritual Weapon",
        tohit: 5,
        damage: {force: "d8+4"},
        sounds: SPELL_SOUNDS,
      }, {
        name: "Guided Bolt",
        tohit: 5,
        damage: {radiant: "4d6", effect: "Next attack on target has advantage"},
        conditions: {
          "level 2": {weapon: "d6"},
          "level 3": {weapon: "d6"},
        },
        sounds: SPELL_SOUNDS,
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
        sounds: RANGED_SOUNDS,
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
        tohit: 7,
        damage: {slashing: "1d10+5"},
        conditions: {
          "Hexed": {weapon: "d6"},
          "Cursed": {weapon: "2", rules: {"Improved Critical": "19"}},
          "One Handed": {weapon: "d8+5", replace: true},
        },
      }, {
        name: "Eldritch Blast",
        tohit: 6,
        damage: {force: "d10"},
        conditions: {
          "Hexed": {weapon: "d6"},
          "Cursed": {weapon: "2", rules: {"Improved Critical": "19"}},
        },
        sounds: SPELL_SOUNDS,
      },
    ]
  },
  "Dorlamir": {
    attacks: [
      {
        name: "Firebolt",
        tohit: 6,
        damage: {"fire": "1d10"},
        sounds: SPELL_SOUNDS,
      }, {
        name: "Mind Sliver",
        save: "14 Int",
        half: false,
        damage: {psychic: "1d6", effect: "Subract 1d4 from next saving throw"},
        sounds: SPELL_SOUNDS,
      }, {
        name: "Dissonant Whispers",
        save: "14 Wis",
        damage: {psychic: "3d6", effect: "Must use reaction to as far as possible away from you"},
        conditions: {
          "level 2": {"weapon": "1d6"},
          "level 3": {"weapon": "2d6"},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Arms of Hadar",
        save: "14 Str",
        damage: {necrotic: "2d6", effect: "Cannot take reactions till next turn"},
        conditions: {
          "level 2": {"weapon": "1d6"},
          "level 3": {"weapon": "2d6"},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Sleep",
        damage: {sleep: "5d8"},
        conditions: {
          "level 2": {"weapon": "2d8"},
          "level 3": {"weapon": "4d8"},
        },
        sounds: SPELL_SOUNDS,
      },
    ],
  },

};
