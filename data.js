'use strict';

const party_data = {
  "Airnel": {
    channel: 'toa',
    saves: {
      'Str': 0,
      'Dex': 2,
      'Con': 2,
      'Int': 3,
      'Wis': 10,
      'Cha': 7,
    },
    attacks: [
      {
        name: "Toll the Dead",
        save: '17 Wis',
        half: false,
        sounds: SPELL_SOUNDS,
        damage: {necrotic: "2d8+5"},
        conditions: {
          'Injured': {weapon: "2d12+5", replace: true},
        },
      }, {
        name: "Spiritual Weapon",
        tohit: 9,
        sounds: SPELL_SOUNDS,
        damage: {force: "d8+5"},
        conditions: {
            'Level 3-4': {force: "d8"},
            'Level 5-6': {force: "2d8"},
        }
      }, {
        name: "Guiding Bolt",
        sounds: SPELL_SOUNDS,
        tohit: 9,
        damage: {radiant: "4d6"},
        conditions: {
            'Level 2': {radiant: "1d6"},
            'Level 3': {radiant: "2d6"},
            'Level 4': {radiant: "3d6"},
            'Level 5': {radiant: "4d6"},
        },
      }, {
        name: "Spirit Guardians",
        save: "16 Wis",
        damage: {radiant: "3d8", effect: "speed halved"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "Level 4": {weapon: "d8"},
          "Level 5": {weapon: "2d8"},
        }
      }, {
        name: "Vampiric Touch",
        tohit: 9,
        sounds: SPELL_SOUNDS,
        damage: {
          necrotic: "3d6",
          effect: "You heal half",
        },
        conditions: {
          "Level 4": {weapon: "d6"},
          "Level 5": {weapon: "2d6"},
        }
      }, {
        name: "Healing Word",
        damage: {healing: "d4+5"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "Level 2": {weapon: "d4"},
          "Level 3": {weapon: "2d4"},
          "Level 4": {weapon: "3d4"},
          "Level 5": {weapon: "4d4"},
        }
      }, {
        name: "Cure Wounds",
        damage: {healing: "d8+5"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "Level 2": {weapon: "d8"},
          "Level 3": {weapon: "2d8"},
          "Level 4": {weapon: "3d8"},
          "Level 5": {weapon: "4d8"},
        },
      }, {
        name: "Mass Healing Word",
        damage: {healing: "d4+5"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "Level 4": {weapon: "1d4"},
          "Level 5": {weapon: "2d4"},
        },
      }, {
        name: "Mass Cure Wounds",
        damage: {healing: "3d8+5"},
        sounds: SPELL_SOUNDS,
      }, {
        name: "Blight",
        save: "17 Wis",
        damage: {necrotic: "8d8", effect: "Undead and constructs immune. Plants have disadvantage and max damage."},
        sounds: SPELL_SOUNDS,
        conditions: {
          "Level 5": {weapon: "1d8"},
        }
      }, {
        name: "Dagger",
        tohit: "3",
        damage: {piercing: "d4+1"},
      }, {
        name: "Light Crossbow",
        tohit: 3,
        damage: {piercing: "d8+1"},
      },
    ]
  },
  "Thorin": {
    channel: 'toa',
    saves: {
      'Str': 7,
      'Dex': 3,
      'Con': 5,
      'Int': 1,
      'Wis': 7,
      'Cha': 8,
    },
    attacks: [
      {
        name: "Thunder",
        tohit: 9,
        damage: {
            "slashing": "d6+5",
            thunder: "d6",
            effect: "If Lightning also hits, DC13 CON or stunned for one round",
        },
      }, {
        name: "Lightning",
        tohit: 9,
        damage: {
            "slashing": "d6+5",
            "lightning": "d6",
            effect: "If Thunder also hits, DC13 CON or stunned for one round",
        },
      }, {
        name: "Smite",
        damage: {radiant: "2d8"},
        conditions: {
          "Undead/Fiend": {radiant: "1d8"},
          "Level 2": {radiant: "1d8"},
          "Level 3": {radiant: "2d8"},
        },
      }, {
        name: "Javelin of Lightning",
        tohit: 9,
        damage: {
          piercing: "1d6+5",
          lightning: "4d6",
          secondary: { lightning: "4d6", desc: "To all in a line to target"},
        },
      }, {
        name: "Crag Cat Claw",
        tohit: 5,
        damage: {"slashing": "d8+3"},
        conditions: {
          "Pounce": {effect: "DC 13 Str save or prone. If prone, can Bite as bonus action"}
        },
      }, {
        name: "Crag Cat Bite",
        tohit: 5,
        damage: {"slashing": "d10+3"},
      }, {
        name: "Ashbringer",
        tohit: 9,
        damage: {"slashing": "d6+5"},
      }, {
        name: "Oathbringer (offhand)",
        tohit: 9,
        damage: {"slashing": "d6+5"},
      }, {
        name: "Cure Wounds",
        damage: {healing: "d8+2"},
        conditions: {
          "Level 2": {weapon: "d8"},
          "Level 3": {weapon: "2d8"},
        }
      }
    ],
  },
  "Corminar": {
    channel: 'toa',
    saves: {
      'Str': 1,
      'Dex': 7,
      'Con': 2,
      'Int': 3,
      'Wis': 3,
      'Cha': 9,
    },
    attacks: [
      {
        name: "Eldritch Blast",
        tohit: 8,
        damage: {force: "d10+4"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "hex": {necrotic: "d6"}
        },
      }, {
        name: "Poison Spray",
        save: '16 Con',
        half: false,
        sounds: SPELL_SOUNDS,
        damage: {
          poison: "2d12",
        }
      }, {
        name: "Vicious Mockery",
        save: '16 Wis',
        half: false,
        sounds: SPELL_SOUNDS,
        damage: {
          psychic: "2d4",
          effect: "disadvantage on next attack roll",
        },
      }, {
        name: "Hellish Rebuke",
        save: '16 Dex',
        damage: {fire: "2d10"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "Level 2": {fire: "1d10"},
          "Level 3": {fire: "2d10"},
          "Level 4": {fire: "3d10"},
        }
      }, {
        name: "Rapier",
        tohit: 6,
        damage: {'piercing': "d8+2"},
        conditions: {hex: {necrotic: "d6"}},
      }, {
        name: "Dagger of Venom",
        tohit: 7,
        damage: {piercing: "d4+3"},
        conditions: {
            "Venom": {
                secondary: {poison: "2d10"},
                effect: "DC 16 Con save, or take poison damage and poisoned",
            },
            hex: {necrotic: "d6"},
        },
      }, {
        name: "Dissonant Whispers",
        save: '16 Wis',
        half: true,
        sounds: SPELL_SOUNDS,
        damage: {
          psychic: "3d6",
          effect: "must use reaction to move full speed away from you.",
        },
        conditions: {
            'Level 2': {weapon: "1d6"},
            'Level 3': {weapon: "2d6"},
            'Level 4': {weapon: "3d6"},
        },
      }, {
        name: "Heat Metal",
        sounds: SPELL_SOUNDS,
        damage: {
          "fire": "2d8",
          effect: "If holding/wearing, DC 16 Con save or must drop, disadvantage on attacks and checks if it cannot",
        },
        conditions: {
          'Level 3': {weapon: "1d8"},
          'Level 4': {weapon: "2d8"},
        }
      }, {
        name: "Pistol",
        tohit: 5,
        damage: {piercing: "1d10+2"},
        conditions: {hex: {necrotic: "d6"}},
      }, {
        name: "Healing Word",
        damage: {healing: "d4+4"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "Level 2": {weapon: "d4"},
          "Level 3": {weapon: "2d4"},
          "Level 3": {weapon: "3d4"},
        }
      }, {
        name: "Fireball",
        save: '16 Dex',
        sounds: SPELL_SOUNDS,
        damage: {
          fire: "8d6",
          effect: "sets stuff on fire",
        },
        conditions: {
          "Level 4": {weapon: "d8"},
        }
      },
    ]
  },
 "Nordan": {
    channel: 'toa',
    saves: {
      'Str': 2,
      'Dex': -1,
      'Con': 2,
      'Int': 5,
      'Wis': 9,
      'Cha': 0,
    },
    attacks: [
      {
        name: "Staff of the Jungle (Shillelagh)",
        tohit: 10,
        damage: {"bludgeoning": "d8+6"},
      }, {
        name: "Primal Savagery",
        tohit: 10,
        sounds: SPELL_SOUNDS,
        damage: {"acid": "2d10"},
      }, {
        name: "Call Lightning",
        save: "17 Dex",
        sounds: SPELL_SOUNDS,
        damage: {"lightning": "3d10"},
        conditions: {
          'Level 4': {weapon: "1d10"},
          'Level 5': {weapon: "2d10"},
        }
      }, {
        name: "Moonbeam",
        save: "17 Con",
        sounds: SPELL_SOUNDS,
        damage: {"radiant": "2d10"},
        conditions: {
          'Level 3': {weapon: "1d10"},
          'Level 4': {weapon: "2d10"},
          'Level 4': {weapon: "3d10"},
        }
      }, {
        name: "Heat Metal",
        sounds: SPELL_SOUNDS,
        damage: {
          "fire": "2d8",
          effect: "If holding/wearing, DC 17 Con save or must drop, disadvantage on attacks and checks if it cannot",
        },
        conditions: {
          'Level 3': {weapon: "1d8"},
          'Level 4': {weapon: "2d8"},
          'Level 5': {weapon: "3d8"},
        }
      }, {
        name: "Staff of the Jungle (Strength)",
        tohit: 7,
        damage: {"bludgeoning": "d6+3"},
        conditions: {
          'Two Handed': {weapon: "d8+3", replace: true},
        }
      }, {
        name: "Healing Word",
        damage: {healing: "d4+5"},
        conditions: {
          "Level 2": {weapon: "1d4"},
          "Level 3": {weapon: "2d4"},
          "Level 4": {weapon: "3d4"},
          "Level 5": {weapon: "4d4"},
        }
      }
    ],
  },
  "Heston": {
    channel: 'toa',
    saves: {
      'Str': 5,
      'Dex': 3,
      'Con': 8,
      'Int': 9,
      'Wis': 6,
      'Cha': 0,
    },
    attacks: [
      {
        name: "Quarterstaff",
        tohit: 8,
        damage: {bludgeoning: "d6+4"},
        conditions: {
          'Two Handed': {weapon: "d8+4", replace: true},
        },
      }, {
        name: "Ray of Sickness",
        tohit: 8,
        sounds: SPELL_SOUNDS,
        damage: {
            poison: "2d8",
            effect: "DC 16 Con save or poisoned",
        },
        conditions: {
          "Level 2": {weapon: "1d8"},
          "Level 3": {weapon: "2d8"},
          "Level 4": {weapon: "3d8"},
        },
      },
    ],
  },
  "Grondrath": {
    saves: {
      'Str': 9,
      'Dex': 1,
      'Con': 8,
      'Int': -1,
      'Wis': 1,
      'Cha': 2,
    },
    attacks: [
      {
        name: "Athletics",
        tohit: 9,
        damage: {bludgeoning: "0"},
      }, {
        name: "Unarmed Attack",
        tohit: 10,
        damage: {"bludgeoning": "1d4+6"},
        rules: {"Brutal Critical": 1},
        conditions: {
          "Raging": {weapon: "2"},
        },
      }, {
        name: "Dragon Breath",
        save: "DEX 16",
        damage: {"fire": "3d6"},
      }, {
        name: "Hand Axe",
        tohit: 9,
        damage: {"slashing": "1d6+5"},
        rules: {"Brutal Critical": 1},
        conditions: {
          "Raging": {weapon: "2"},
        },
      }, {
        name: "Javelin",
        tohit: 9,
        damage: {"piercing": "1d6+2"},
        sounds: RANGED_SOUNDS,
        rules: {"Brutal Critical": 1},
        conditions: {
          "Raging": {weapon: "2"},
        },
      },
    ],
  },
  "Areni": {
    channel: 'toa',
    saves: {
      'Str': 0,
      'Dex': 4,
      'Con': 0,
      'Int': 10,
      'Wis': 6,
      'Cha': 1,
    },
    attacks: [
      {
        name: "Firebolt",
        tohit: 10,
        sounds: SPELL_SOUNDS,
        damage: {"fire": "2d10"},
        rules: {
          "Damage Speciality": {"fire": 1},
        },
      }, {
        name: "Burning Hands",
        save: "DEX 17",
        sounds: SPELL_SOUNDS,
        damage: {
          fire: "3d6",
          effect: "sets stuff on fire",
        },
        rules: {
          "Damage Speciality": {"fire": 1},
        },
        conditions: {
          "level 2": {"fire": "d6"},
          "level 3": {"fire": "2d6"},
          "level 4": {"fire": "3d6"},
          "level 5": {"fire": "4d6"},
        },
      }, {
        name: "Fireball",
        save: '17 Dex',
        sounds: SPELL_SOUNDS,
        damage: {
          fire: "8d6",
          effect: "sets stuff on fire",
        },
        rules: {
          "Damage Speciality": {"fire": 1},
        },
        conditions: {
          "Level 4": {weapon: "d8"},
          "Level 5": {weapon: "2d8"},
        }
      }, {
        name: "Melf's Minute Meteors",
        save: "DEX 17",
        sounds: SPELL_SOUNDS,
        damage: {
          fire: "2d6",
        },
        rules: {
          "Damage Speciality": {"fire": 1},
        },
      }, {
        name: "Shadowblade",
        tohit: 7,
        sounds: SPELL_SOUNDS,
        damage: {"psychic": "2d8"},
        conditions: {
          "level 3/4": {"weapon": "d8"},
          "level 5/6": {"weapon": "2d8"},
        },
      }, {
        name: "Booming blade (Shadowblade)",
        tohit: 7,
        sounds: SPELL_SOUNDS,
        damage: {"psychic": "2d8", "thunder": "d8"},
        secondary: {"thunder": "3d8", "desc": "if the target moves"},
        conditions: {
          "level 3/4": {"weapon": "d8"},
          "level 5/6": {"weapon": "2d8"},
        },
      }, {
        name: "Booming blade (short sword)",
        tohit: 7,
        sounds: SPELL_SOUNDS,
        damage: {"slashing": "d6+3", "thunder": "d8"},
        secondary: {"thunder": "3d8", "desc": "if the target moves"},
      },
    ]
  }

};
