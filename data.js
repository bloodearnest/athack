'use strict';

const party_data = {
  "Airnel": {
    channel: 'toa',
    saves: {
      'Str': 0,
      'Dex': 2,
      'Con': 7,
      'Int': 3,
      'Wis': 11,
      'Cha': 7,
    },
    attacks: [
      {
        name: "Toll the Dead",
        save: '18 Wis',
        half: false,
        sounds: SPELL_SOUNDS,
        damage: {necrotic: "3d8+5"},
        conditions: {
          'Injured': {weapon: "3d12+5", replace: true},
        },
      }, {
        name: "Spiritual Weapon",
        tohit: 10,
        sounds: SPELL_SOUNDS,
        damage: {force: "d8+6"},
        conditions: {
            'Level 3-4': {force: "d8"},
            'Level 5-6': {force: "2d8"},
        }
      }, {
        name: "Guiding Bolt",
        sounds: SPELL_SOUNDS,
        tohit: 10,
        damage: {radiant: "4d6"},
        conditions: {
            'Level 2': {radiant: "1d6"},
            'Level 3': {radiant: "2d6"},
            'Level 4': {radiant: "3d6"},
            'Level 5': {radiant: "4d6"},
            'Level 6': {radiant: "5d6"},
        },
      }, {
        name: "Spirit Guardians",
        save: "18 Wis",
        damage: {radiant: "3d8", effect: "speed halved"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "Level 4": {weapon: "d8"},
          "Level 5": {weapon: "2d8"},
          "Level 6": {weapon: "3d8"},
        }
      }, {
        name: "Vampiric Touch",
        tohit: 10,
        sounds: SPELL_SOUNDS,
        damage: {
          necrotic: "3d6",
          effect: "You heal half",
        },
        conditions: {
          "Level 4": {weapon: "d6"},
          "Level 5": {weapon: "2d6"},
          "Level 6": {weapon: "3d6"},
        }
      }, {
        name: "Healing Word",
        damage: {healing: "d4+6"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "Level 2": {weapon: "d4"},
          "Level 3": {weapon: "2d4"},
          "Level 4": {weapon: "3d4"},
          "Level 5": {weapon: "4d4"},
          "Level 5": {weapon: "5d4"},
        }
      }, {
        name: "Cure Wounds",
        damage: {healing: "d8+6"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "Level 2": {weapon: "d8"},
          "Level 3": {weapon: "2d8"},
          "Level 4": {weapon: "3d8"},
          "Level 5": {weapon: "4d8"},
          "Level 5": {weapon: "5d8"},
        },
      }, {
        name: "Mass Healing Word",
        damage: {healing: "d4+6"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "Level 4": {weapon: "1d4"},
          "Level 5": {weapon: "2d4"},
          "Level 6": {weapon: "3d4"},
        },
      }, {
        name: "Mass Cure Wounds",
        damage: {healing: "3d8+6"},
        sounds: SPELL_SOUNDS,
      }, {
        name: "Blight",
        save: "18 Wis",
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
      'Str': 9,
      'Dex': 4,
      'Con': 6,
      'Int': 2,
      'Wis': 8,
      'Cha': 10,
    },
    attacks: [
      {
        name: "Thunder",
        tohit: 10,
        damage: {
            slashing: "d6+6",
            radiant: "d8",
            thunder: "d6",
            effect: "If Lightning also hits, DC13 CON or stunned for one round",
        },
      }, {
        name: "Lightning",
        tohit: 10,
        damage: {
            slashing: "d6+6",
            lightning: "d6",
            radiant: "d8",
            effect: "If Thunder also hits, DC13 CON or stunned for one round",
        },
      }, {
        name: "Mace of Wongo",
        tohit: 10,
        damage: {
            bludgeoning: "d6+6",
            radiant: "d8",
        },
      }, {
        name: "Smite",
        damage: {radiant: "2d8"},
        conditions: {
          "Undead/Fiend": {radiant: "1d8"},
          "Level 2": {radiant: "1d8"},
          "Level 3": {radiant: "2d8"},
          "Level 4": {radiant: "3d8"},
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
        damage: {
          slashing: "d10+3",
          radiant: "d8",
        },
      }, {
        name: "Cure Wounds",
        damage: {healing: "d8+3"},
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
      'Wis': 7,
      'Cha': 11,
    },
    attacks: [
      {
        name: "Eldritch Blast",
        tohit: 10,
        damage: {force: "d10+6"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "hex": {necrotic: "d6"}
        },
      }, {
        name: "Mind Sliver",
        save: '18 Int',
        half: false,
        sounds: SPELL_SOUNDS,
        damage: {
          psychic: "3d6",
          effect: "-1d4 on first save before end of your next turn",
        }
      }, {
        name: "Shocking Grasp",
        tohit: "10",
        half: false,
        sounds: SPELL_SOUNDS,
        damage: {
          poison: "3d8",
          effect: "Cannot take reactions",
        }
      }, {
        name: "Poison Spray",
        save: '18 Con',
        half: false,
        sounds: SPELL_SOUNDS,
        damage: {
          poison: "3d12",
        }
      }, {
        name: "Vicious Mockery",
        save: '18 Wis',
        half: false,
        sounds: SPELL_SOUNDS,
        damage: {
          psychic: "3d4",
          effect: "disadvantage on next attack roll",
        },
      }, {
        name: "Hellish Rebuke",
        save: '18 Dex',
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
        save: '18 Wis',
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
          effect: "If holding/wearing, DC 18 Con save or must drop, disadvantage on attacks and checks if it cannot",
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
        damage: {healing: "d4+6"},
        sounds: SPELL_SOUNDS,
        conditions: {
          "Level 2": {weapon: "d4"},
          "Level 3": {weapon: "2d4"},
          "Level 4": {weapon: "3d4"},
        }
      }, {
        name: "Fireball",
        save: '18 Dex',
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
      'Con': 8,
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
        damage: {"acid": "3d10"},
      }, {
        name: "Call Lightning",
        save: "17 Dex",
        sounds: SPELL_SOUNDS,
        damage: {"lightning": "3d10"},
        conditions: {
          'Level 4': {weapon: "1d10"},
          'Level 5': {weapon: "2d10"},
          'Level 6': {weapon: "3d10"},
        }
      }, {
        name: "Moonbeam",
        save: "17 Con",
        sounds: SPELL_SOUNDS,
        damage: {"radiant": "2d10"},
        conditions: {
          'Level 3': {weapon: "1d10"},
          'Level 4': {weapon: "2d10"},
          'Level 5': {weapon: "3d10"},
          'Level 6': {weapon: "4d10"},
        }
      }, {
        name: "Healing Word",
        damage: {healing: "d4+5"},
        conditions: {
          "Level 2": {weapon: "1d4"},
          "Level 3": {weapon: "2d4"},
          "Level 4": {weapon: "3d4"},
          "Level 5": {weapon: "4d4"},
          "Level 6": {weapon: "6d4"},
        }
      }, {
        name: "Sunbeam",
        save: "17 Con",
        damage: {
          radiant: "6d8",
          effect: "blinded until your next turn"
        },
      }
    ],
  },
  "Heston": {
    channel: 'toa',
    saves: {
      'Str': 5,
      'Dex': 7,
      'Con': 8,
      'Int': 11,
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
        name: "Acid Splash",
        save: "Dex 18",
        half: false,
        sounds: SPELL_SOUNDS,
        damage: {
            acid: "3d6",
            effect: "Choose two creatures within 5ft of each other",
        },
 
      }, {
        name: "Ray of Frost",
        tohit: 10,
        sounds: SPELL_SOUNDS,
        damage: {
            poison: "3d8",
            effect: "Speed reduced 10 ft for a turn",
        },
      }, {
        name: "Ray of Sickness",
        tohit: 10,
        sounds: SPELL_SOUNDS,
        damage: {
            poison: "2d8",
            effect: "DC 18 Con save or poisoned",
        },
        conditions: {
          "Level 2": {weapon: "1d8"},
          "Level 3": {weapon: "2d8"},
          "Level 4": {weapon: "3d8"},
          "Level 5": {weapon: "4d8"},
        },
      }, {
        name: "Color Spray",
        sounds: SPELL_SOUNDS,
        damage: {
            hitpoints: "6d10",
            effect: "Creatures in 15 ft cone, up to value of hit points, are blinded for 1 turn",
        },
        conditions: {
          "Level 2": {weapon: "2d10"},
          "Level 3": {weapon: "4d10"},
          "Level 4": {weapon: "6d10"},
          "Level 5": {weapon: "8d10"},
        },
       }, {
        name: "Sickening Radiance",
        save: '18 Con',
        half: false,
        sounds: SPELL_SOUNDS,
        damage: {
            radiant: "4d10",
            effect: "Suffer 1 level of exhaustion, emit dim light",
        },
        conditions: {
          "Level 2": {weapon: "2d10"},
          "Level 3": {weapon: "4d10"},
          "Level 4": {weapon: "6d10"},
          "Level 5": {weapon: "8d10"},
        },
      },
    ],
  },
  "Grondrath": {
    channel: "toa",
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
      'Str': -1,
      'Dex': 4,
      'Con': 4,
      'Int': 9,
      'Wis': 5,
      'Cha': 0,
    },
    attacks: [
      {
        name: "Firebolt",
        tohit: 10,
        sounds: SPELL_SOUNDS,
        damage: {"fire": "3d10+3"},
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
          "level 6": {"fire": "5d6"},
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
          "Level 6": {weapon: "3d8"},
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
        tohit: 8,
        sounds: SPELL_SOUNDS,
        damage: {"psychic": "2d8"},
        conditions: {
          "level 3/4": {"weapon": "d8"},
          "level 5/6": {"weapon": "2d8"},
        },
      }, {
        name: "Booming blade (Shadowblade)",
        tohit: 8,
        sounds: SPELL_SOUNDS,
        damage: {
          "psychic": "2d8", 
          "thunder": "d8",
          secondary: {"thunder": "3d8", "desc": "if the target moves"},
        },
        conditions: {
          "level 3/4": {"weapon": "d8"},
          "level 5/6": {"weapon": "2d8"},
        },
      }, {
        name: "Booming blade (short sword)",
        tohit: 8,
        sounds: SPELL_SOUNDS,
        damage: {
          "slashing": "d6+4", 
          "thunder": "2d8",
          secondary: {"thunder": "3d8", "desc": "if the target moves"},
        },
      }, {
        name: "Wall of Fire",
        save: "17 Dex",
        sounds: SPELL_SOUNDS,
        damage: {fire: "5d8"},
        conditions: {
          "level 5": {"weapon": "d8"},
          "level 6": {"weapon": "2d8"},
        },
        rules: {
          "Damage Speciality": {"fire": 1},
        },
      }, {
        name: "Cone of Cold",
        save: "17 Con",
        sounds: SPELL_SOUNDS,
        damage: {cold: "8d8"},
        conditions: {
          "level 6": {"weapon": "1d8"},
        },
      }, {
        name: "Synaptic Static",
        save: "17 Int",
        sounds: SPELL_SOUNDS,
        damage: {
          psychic: '8d6',
          effect: "-1d6 to attacks, ability checks, and Concentration checks until they save"
        },
      }, {
        name: "Chain Lightning",
        save: "17 Dex",
        sounds: SPELL_SOUNDS,
        damage: {
          lightning: '10d8'
        },
      },
    ]
  },
  "TheCount": {
    channel: 'wm',
    saves: {
      'Str': -1,
      'Dex': 7,
      'Con': 2,
      'Int': 2,
      'Wis': 1,
      'Cha': 4,
    },
    attacks: [
        {
            "damage": {
                "Piercing": "1d4+4"
            },
            "name": "Dagger",
            "notes": [
                "Melee Weapon",
                "Simple",
                "Finesse",
                "Light",
                "Thrown"
            ],
            "conditions": { 'Sneak Attack': {'weapon': '3d6'}},
            "options": {},
            "range": "20 (60)",
            "tohit": "+7",
            "types": [
                "Ranged",
                "Melee"
            ]
        }, {
            "damage": {
                "Piercing": "1d4+4"
            },
            "name": "Dart",
            "notes": [
                "Ranged Weapon",
                "Simple",
                "Finesse",
                "Thrown"
            ],
            "conditions": { 'Sneak Attack': {'weapon': '3d6'}},
            "options": {},
            "range": "20 (60)",
            "tohit": "+7",
            "types": [
                "Ranged"
            ]
        }, {
            "damage": {
                "Bludgeoning": "1d6-1"
            },
            "name": "Quarterstaff",
            "notes": [
                "Melee Weapon",
                "Simple",
                "Versatile"
            ],
            "conditions": {
                "Versatile": {
                    "weapon": "1d8-1",
                    "replace": true
                }
            },
            "range": "5 ft. Reach",
            "tohit": "+2",
            "types": [
                "Melee"
            ]
        }, {
            "damage": {
                "Piercing": "1d8+5"
            },
            "name": "Vicious Rapier",
            "notes": [
                "Melee Weapon",
                "Martial",
                "Finesse"
            ],
            "conditions": { 'Sneak Attack': {'weapon': '3d6'}},
            "options": {},
            "range": "5 ft. Reach",
            "tohit": "+8",
            "types": [
                "Melee"
            ]
        },
    ]
  },
  "Jerem": {
    channel: 'wm',
    saves: {
      'Str': 0,
      'Dex': 5,
      'Con': 1,
      'Int': 1,
      'Wis': 2,
      'Cha': 7,
    },
    attacks: [
        {
            "name": "Duelling Rapier",
            "damage": {
                "Piercing": "1d8+3"
            },
            "tohit": "6",
        }, {
            "name": "Vicious Mockery",
            "damage": {
                "Psychic": "2d4"
            },
            "effect": "Disadvantage on next attack",
            "save": "WIS 15",
        }, {
            "name": "Dissonant Whispers",
            "damage": {
                "Psychic": "3d6"
            },
            "effect": "Must use reaction to move away. Disadvantage on next attack",
            "conditions": {
                'Level 2': {'damage': '1d6'},
                'Level 3': {'damage': '2d6'},
            },
            "save": "WIS 15",
        }, {
            "name": "Light Crossbow",
            "damage": {
                "Piercing": "1d8+2"
            },
            "tohit": "+5",
        }, {
            "name": "Healing Work",
            "damage": {
                "Healing": "1d4+4"
            },
            "conditions": {
                'Level 2': {'Healing': '2d4+4'},
                'Level 3': {'Healing': '3d4+4'},
            },
        }, {
            "name": "Sleep",
            "damage": {"Hit Points": "5d8"},
            "conditions": {
                'Level 2': {'weapon': '1d8'},
                'Level 3': {'weapon': '2d8'},
            }
        }

    ]
 },
  "Vanuath": {
    channel: 'wm',
    saves: {
      'Str': 3,
      'Dex': 7,
      'Con': 1,
      'Int': 0,
      'Wis': 3,
      'Cha': 0,
    },
    attacks: [
        {
            "name": "Unarmed",
            "damage": {
                "Bludgeoning": "1d4+4"
            },
            "tohit": "7",
        }, {
            "name": "Quarterstaff",
            "damage": {
                "Bludgeoning": "1d6+4"
            },
            "tohit": "7",
            conditions: {
            'Versatile': {weapon: "1d8+4", replace: true},
            },

        }, {
            "name": "Dart",
            "damage": {
                "piercing": "1d4+4"
            },
            "tohit": "7",
        }
    ]
 },
 "Galmyn": {
    channel: 'wm',
    saves: {
      'Str': 3,
      'Dex': 6,
      'Con': 1,
      'Int': 2,
      'Wis': 2,
      'Cha': -1,
    },
    attacks: [
        {
            "name": "Long bow",
            "damage": {
                "Piercing": "1d8+3"
            },
            "tohit": "+8",
            conditions: {'Hunter\'s Mark': {weapon: '1d6'}},
        }, {
            "name": "Dagger",
            "damage": {
                "Piercing": "1d4+3"
            },
            "tohit": "+7",
            conditions: {'Hunter\'s Mark': {weapon: '1d6'}},
        }, {
            "name": "Hand Axe",
            "damage": {
                "Slashing": "1d6"
            },
            "tohit": "3",
            conditions: {'Hunter\'s Mark': {weapon: '1d6'}},
        }, {
            "name": "Spear",
            "damage": {
                "Piercing": "1d6"
            },
            "tohit": "3",
            conditions: {
                'Hunter\'s Mark': {weapon: '1d6'},
                'Versatile': {weapon: "1d8+3", replace: true},
            }
        }

    ]


  }





};
