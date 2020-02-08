'use strict';

const party_data = {
  "Areni": {
    saves: {
      'Str': -1,
      'Dex': 3,
      'Con': 1,
      'Int': 7,
      'Wis': 4,
      'Cha': 0,
    },
    attacks: [
      {
        name: "Firebolt",
        tohit: 7,
        damage: {"fire": "2d10"},
        sounds: SPELL_SOUNDS,
      }, {
        name: "Shortsword",
        tohit: 6,
        damage: {"piercing": "d6+3"},
      }, {
        name: "Shocking Grasp",
        tohit: 7,
        damage: {
            lightning: "2d8",
            effect: "target cannot use reaction this turn",
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Fireball",
        save: "15 Dex",
        damage: {"fire": "8d6"},
        conditions: {
          "level 4": {"weapon": "1d6"},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Chromatic Orb",
        tohit: 7,
        damage: {"acid|cold|fire|lightning|poison|thunder": "3d8"},
        conditions: {
          "level 2": {"weapon": "d8"},
          "level 3": {"weapon": "2d8"},
          "level 4": {"weapon": "3d8"},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Burning Hands",
        save: "15 Dex",
        damage: {"fire": "3d6"},
        conditions: {
          "level 2": {"weapon": "d6"},
          "level 3": {"weapon": "2d6"},
          "level 4": {"weapon": "3d6"},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Sleep",
        damage: {sleep: "5d8"},
        conditions: {
          "level 2": {"weapon": "2d8"},
          "level 3": {"weapon": "4d8"},
          "level 4": {"weapon": "6d8"},
        },
        sounds: SPELL_SOUNDS,
      }
    ]
  },
  "Caimbarel": {
    saves: {
        'Str': 4,
        'Dex': 5,
        'Con': 3,
        'Int': 0,
        'Wis': 2,
        'Cha': 2,
    },
    attacks: [
      {
        name: "Picks",
        tohit: 8,
        damage: {"magical piercing": "1d6+5"},
        conditions: {
          "Menacing": {"weapon": "d8", "effect": "DC 16 Wis save or frightened till next turn"},
          "Maneuver": {"weapon": "d8"},
        },
      }, {
        name: "Scimitar/Chakram",
        tohit: 8,
        damage: {"slashing": "1d6+5"},
        conditions: {
          "Menacing": {"weapon": "d8", "effect": "DC 15 Wis save or frightened till next turn"},
          "Maneuver": {"weapon": "d8"},
        },
      }, {
        name: "Dagger of Venom",
        tohit: 9,
        damage: {"peircing": "1d4+6"},
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
        tohit: 8,
        damage: {"peircing": "1d6+5"},
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
        tohit: 8,
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
    saves: {
      'Str': 3,
      'Dex': 7,
      'Con': 1,
      'Int': 1,
      'Wis': 3,
      'Cha': -1,
    },
    attacks: [
      {
        name: "Kestrel's bow",
        tohit: 10,
        damage: {"piercing": "1d6+5"},
        conditions: {
          "Hunters Mark": {"weapon": "d6"},
        },
        sounds: RANGED_SOUNDS,
      }, {
        name: "Shortbow",
        tohit: 9,
        damage: {"piercing": "1d6+4"},
        conditions: {
          "Hunters Mark": {"weapon": "d6"},
        },
        sounds: RANGED_SOUNDS,
      }, {
        name: "Rapier",
        tohit: 7,
        damage: {"piercing": "1d8+4"},
        conditions: {
          "Hunters Mark": {"weapon": "d6"},
        },
      }
    ]
  },
  "Harethier": {
    saves: {
      'Str': 1,
      'Dex': 1,
      'Con': 2,
      'Int': 0,
      'Wis': 7,
      'Cha': 3,
    },
    attacks: [
      {
        name: "Toll the Dead",
        save: "15 Wis",
        half: false,
        damage: {"necrotic": "2d8"},
        conditions: {
          "Injured": {weapon: "2d12", replace: true},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Spiritual Weapon",
        tohit: 7,
        damage: {force: "d8+4"},
        sounds: SPELL_SOUNDS,
      }, {
        name: "Guided Bolt",
        tohit: 7,
        damage: {radiant: "4d6", effect: "Next attack on target has advantage"},
        conditions: {
          "level 2": {weapon: "d6"},
          "level 3": {weapon: "2d6"},
          "level 4": {weapon: "3d6"},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Healing Word",
        save: false,
        half: false,
        damage: {healing: "d4+4"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "level 2": {weapon: "d4"},
          "level 3": {weapon: "2d4"},
          "level 4": {weapon: "3d4"},
        },
      }, {
        name: "Cure Wounds",
        save: false,
        half: false,
        damage: {healing: "d8+4"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "level 2": {weapon: "d8"},
          "level 3": {weapon: "2d8"},
          "level 4": {weapon: "3d8"},
        },
      }, {
        name: "Prayer of Healing",
        save: false,
        half: false,
        damage: {healing: "2d8+4"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "level 3": {weapon: "d8"},
          "level 4": {weapon: "2d8"},
        },
      }
    ],
  },
  "Sigurd": {
    saves: {
      'Str': 7,
      'Dex': 2,
      'Con': 6,
      'Int': 0,
      'Wis': -1,
      'Cha': 1,
    },
    attacks: [
      {
        name: "Wulfstrom's Axe of Cleaving",
        tohit: 8,
        damage: {"magical slashing": "2d6+5"},
        conditions: {
          "Raging": {weapon: "2"},
        },
      }, {
        name: "Greataxe",
        tohit: 7,
        damage: {"slashing": "2d6+4"},
        conditions: {
          "Raging": {weapon: "2"},
        },
      }, {
        name: "+1 Heavy Crossbow",
        tohit: 6,
        damage: {"magical piercing": "d10+3"},
      }, {
        name: "Javelin",
        tohit: 7,
        damage: {"piercing": "1d6+4"},
        conditions: {
          "Raging": {weapon: "2"},
        },
        sounds: RANGED_SOUNDS,
      }, {
        name: "Light Hammer",
        tohit: 7,
        damage: {"piercing": "1d4+4"},
        conditions: {
          "Raging": {weapon: "2"},
        },
      }
    ],
  },
  "Zanavor": {
    saves: {
      'Str': 0,
      'Dex': 2,
      'Con': 2,
      'Int': 1,
      'Wis': 4,
      'Cha': 7,
    },
    attacks: [
      {
        name: "Shadowmourne",
        tohit: 8,
        damage: {slashing: "1d10+5"},
        conditions: {
          "Hexed": {weapon: "d6"},
          "Cursed": {weapon: "2", rules: {"Improved Critical": "19"}},
          "One Handed": {weapon: "d8+5", replace: true},
        },
      }, {
        name: "Eldritch Blast",
        tohit: 7,
        damage: {force: "d10"},
        conditions: {
          "Hexed": {weapon: "d6"},
          "Cursed": {weapon: "2", rules: {"Improved Critical": "19"}},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Vampiric Touch",
        tohit: 7,
        damage: {necrotic: "3d6"},
        conditions: {
          "Hexed": {weapon: "d6"},
          "Cursed": {weapon: "2", rules: {"Improved Critical": "19"}},
        },
        sounds: SPELL_SOUNDS,
      },
    ]
  },
  "Dorlamir": {
    saves: {
      'Str': -1,
      'Dex': 3,
      'Con': 5,
      'Int': 0,
      'Wis': 1,
      'Cha': 7,
    },
    attacks: [
      {
        name: "Firebolt",
        tohit: 8,
        damage: {"fire": "2d10"},
        sounds: SPELL_SOUNDS,
      }, {
        name: "Shocking Grasp",
        tohit: 8,
        damage: {
            lightning: "2d8",
            effect: "target cannot use reaction this turn",
        },
        sounds: SPELL_SOUNDS,

      }, {
        name: "Mind Sliver",
        save: "15 Int",
        half: false,
        damage: {psychic: "2d6", effect: "Subract 1d4 from next saving throw"},
        sounds: SPELL_SOUNDS,
      }, {
        name: "Dissonant Whispers",
        save: "15 Wis",
        damage: {psychic: "3d6", effect: "Must use reaction to as far as possible away from you"},
        conditions: {
          "level 2": {"weapon": "1d6"},
          "level 3": {"weapon": "2d6"},
          "level 4": {"weapon": "3d6"},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Arms of Hadar",
        save: "15 Str",
        damage: {necrotic: "2d6", effect: "Cannot take reactions till next turn"},
        conditions: {
          "level 2": {"weapon": "1d6"},
          "level 3": {"weapon": "2d6"},
          "level 4": {"weapon": "3d6"},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Hunger of Hadar",
        save: "15 Dex",
        damage: {
            acid: "2d6",
            secondary: {cold: "2d6"},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Mind Spike",
        save: "15 Dex",
        damage: {psychic: "3d8", effect: "You know location of target while spell lasts"},
        conditions: {
          "level 3": {"weapon": "1d8"},
          "level 4": {"weapon": "2d8"},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Psychic Blast",
        save: "15 Dex",
        damage: {force: "5d8", effect: "On failed save, pushed 20ft away and knocked prone"},
        conditions: {
          "level 3": {"weapon": "1d8"},
          "level 4": {"weapon": "2d8"},
        },
        sounds: SPELL_SOUNDS,
      }, {
        name: "Sleep",
        damage: {sleep: "5d8"},
        conditions: {
          "level 2": {"weapon": "2d8"},
          "level 3": {"weapon": "4d8"},
          "level 4": {"weapon": "5d8"},
        },
        sounds: SPELL_SOUNDS,
      },
    ],
  },

};
