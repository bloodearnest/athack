'use strict';

const party_data = {
  "Airnel": {
    attacks: [
      {
        name: "Toll the Dead",
        save: '15 Wis',
        half: false,
        damage: {necrotic: "2d8+4"},
        conditions: {
          'Injured': {weapon: "2d12+4", replace: true},
        },
      }, {
        name: "Spiritual Weapon",
        tohit: 7,
        damage: {force: "d8+4"},
        conditions: {
            'Level 3-4': {force: "d8"},
            'Level 5-6': {force: "2d8"},
        }
      }, {
        name: "Guiding Bolt",
        tohit: 7,
        damage: {radiant: "4d6"},
        conditions: {
            'Level 2': {radiant: "1d6"},
            'Level 3': {radiant: "2d6"},
            'Level 4': {radiant: "3d6"},
        },
      }, {
        name: "Spirit Guardians",
        save: "15 Wis",
        damage: {radiant: "3d8", effect: "speed halved"},
        conditions: {
          "Level 4": {weapon: "d8"},
        }
      }, {
        name: "Vampiric Touch",
        tohit: 7,
        damage: {
          necrotic: "3d6",
          effect: "You heal half",
        },
        conditions: {
          "Level 4": {weapon: "d6"},
        }
      }, {
        name: "Healing Word",
        damage: {healing: "d4+4"},
        conditions: {
          "Level 2": {weapon: "d4"},
          "Level 3": {weapon: "2d4"},
        }
      }, {
        name: "Cure Wounds",
        damage: {healing: "d8+4"},
        conditions: {
          "Level 2": {weapon: "d8"},
          "Level 3": {weapon: "2d8"},
        },
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
    attacks: [
      {
        name: "Thunder",
        tohit: 8,
        damage: {
            "magical slashing": "d6+5",
            thunder: "d6",
            effect: "If Lightning also hits, DC13 CON or stunned for one round",
        },
      }, {
        name: "Lightning",
        tohit: 8,
        damage: {
            "magical slashing": "d6+5",
            "lightning": "d6",
            effect: "If Thunder also hits, DC13 CON or stunned for one round",
        },
      }, {
        name: "Smite",
        tohit: "auto",
        damage: {radiant: "2d8"},
        conditions: {
          "Level 2": {radiant: "1d8"},
          "Level 3": {radiant: "2d8"},
        },
      }, {
        name: "Javelin of Lightning",
        tohit: 8,
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
        tohit: 8,
        damage: {"slashing": "d6+5"},
      }, {
        name: "Oathbringer (offhand)",
        tohit: 8,
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
    attacks: [
      {
        name: "Eldritch Blast",
        tohit: 7,
        damage: {force: "d10"},
        conditions: {
          "hex": {necrotic: "d6"}
        },
      }, {
        name: "Poison Spray",
        save: '15 Con',
        half: false,
        damage: {
          poison: "2d12",
        }
      }, {
        name: "Vicious Mockery",
        save: '15 Wis',
        half: false,
        damage: {
          psychic: "2d4",
          effect: "disadvantage on next attack roll",
        },
      }, {
        name: "Hellish Rebuke",
        save: '15 Dex',
        damage: {
          fire: "2d10",
        },
        conditions: {
          "Level 2": {fire: "1d10"},
          "Level 3": {fire: "2d10"},
          "Level 4": {fire: "3d10"},
        }
      }, {
        name: "Rapier",
        tohit: 5,
        damage: {'magical piercing': "d8+2"},
        conditions: {hex: {necrotic: "d6"}},
      }, {
        name: "Dagger of Venom",
        tohit: 6,
        damage: {piercing: "d4+3"},
        conditions: {
            "Venom": {
                secondary: {poison: "2d10"},
                effect: "DC 15 Con save, or take poison damage and poisoned",
            },
            hex: {necrotic: "d6"},
        },
      }, {
        name: "Dissonant Whispers",
        save: '15 Wis',
        half: true,
        damage: {
          psychic: "3d6",
          effect: "must use reaction to move full speed away from you.",
        },
        conditions: {
            'Level 2': {weapon: "1d6"},
            'Level 3': {weapon: "2d6"},
        },
      }, {
        name: "Heat Metal",
        damage: {
          "fire": "2d8",
          effect: "If holding/wearing, DC 15 Con save or must drop, disadvantage on attacks and checks if it cannot",
        },
        conditions: {
          'Level 3': {weapon: "1d8"},
        }
      }, {
        name: "Pistol",
        tohit: 4,
        damage: {piercing: "1d10+2"},
        conditions: {hex: {necrotic: "d6"}},
      }, {
        name: "Healing Word",
        damage: {healing: "d4+4"},
        conditions: {
          "Level 2": {weapon: "d4"},
          "Level 3": {weapon: "2d4"},
        }
      }, {
        name: "Fireball",
        save: '15 Dex',
        damage: {
          fire: "8d6",
          effect: "sets stuff on fire",
        },
        conditions: {
          "Level 4": {weapon: "d8"},
          "Level 5": {weapon: "2d8"},
        }
      },
    ]
  },
 "Nordan": {
    attacks: [
      {
        name: "Staff of the Jungle (Shillelagh)",
        tohit: 9,
        damage: {"magical bludgeoning": "d8+5"},
      }, {
        name: "Call Lightning",
        save: "16 Dex",
        damage: {"lightning": "3d10"},
        conditions: {
          'Level 4': {weapon: "1d10"},
          'Level 5': {weapon: "2d10"},
        }
      }, {
        name: "Moonbeam",
        save: "16 Con",
        damage: {"radiant": "2d10"},
        conditions: {
          'Level 3': {weapon: "1d10"},
          'Level 4': {weapon: "2d10"},
          'Level 4': {weapon: "3d10"},
        }
      }, {
        name: "Heat Metal",
        damage: {
          "fire": "2d8",
          effect: "If holding/wearing, DC 16 Con save or must drop, disadvantage on attacks and checks if it cannot",
        },
        conditions: {
          'Level 3': {weapon: "1d8"},
          'Level 4': {weapon: "2d8"},
          'Level 5': {weapon: "3d8"},
        }
      }, {
        name: "Staff of the Jungle (Strength)",
        tohit: 6,
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
      }, {
        name: "Primal Savagery",
        tohit: 9,
        damage: {"acid": "2d10"},
      }
    ],
  },
  "Timber": {
    attacks: [
      {
        name: "Oathbow",
        tohit: 10,
        damage: {"magical piercing": "d8+7"},
        conditions: {
          'Sworn Enemy': {weapon: "2d6"},
          'Goading': {
              secondary: {weapon: "d8"},
              effect: "DC 15 Wis save or disadvantage on all attacks not against Timber",
          },
          'Distracting': {
              secondary: {weapon: "d8"},
              effect: "Allies next attack against target has advantage",
          },
        },
      }, {
        name: "Bolas",
        tohit: 10,
        damage: {
            bludgeoning: "d4+5",
            effect: "Target is prone. DC 10 Str/15 Dex or 5 slashing damage to escape. If you have advantage, and both hit, target is also restrained.",
        },
        conditions: {
          'Goading': {
              secondary: {weapon: "d8"},
              effect: "DC 16 Wis save or disadvantage on all attacks not against Timber",
          },
          'Distracting': {
              secondary: {weapon: "d8"},
              effect: "Allies next attack against target has advantage",
          },
        },
      }, {
        name: "Blowgun",
        tohit: 10,
        damage: {piercing: "1"},
        conditions: {
          'Goading': {
              secondary: {weapon: "d8"},
              effect: "DC 16 Wis save or disadvantage on all attacks not against Timber",
          },
          'Distracting': {
              secondary: {weapon: "d8"},
              effect: "Allies next attack against target has advantage",
          },
        },
      }, {
        name: "Net",
        tohit: 10,
        damage: {
            bludgeoning: "0",
            effect: "Target is restrained. DC 13 Str check or 5 slashing damage to escape",
        },
        conditions: {
          'Goading': {
              secondary: {weapon: "d8"},
              effect: "DC 16 Wis save or disadvantage on all attacks not against Timber",
          },
          'Distracting': {
              secondary: {weapon: "d8"},
              effect: "Allies next attack against target has advantage",
          },
        },
      }, {
        name: "Trident",
        tohit: 5,
        damage: {piercing: "d6+2"},
        conditions: {
          "Two Handed": {weapon: "d8+2", replace: true},
          'Goading': {
              secondary: {weapon: "d8"},
              effect: "DC 16 Wis save or disadvantage on all attacks not against Timber",
          },
          'Distracting': {
              secondary: {weapon: "d8"},
              effect: "Allies next attack against target has advantage",
          },
        }
      }, {
        name: "Cat's Claw",
        tohit: 5,
        damage: {piercing: "d4+2"},
        conditions: {
          'Goading': {
              secondary: {weapon: "d8"},
              effect: "DC 16 Wis save or disadvantage on all attacks not against Timber",
          },
          'Distracting': {
              secondary: {weapon: "d8"},
              effect: "Allies next attack against target has advantage",
          },
        }
      }
    ],
  },
  "Grondrath": {
    attacks: [
      {
        name: "Athletics",
        tohit: 8,
        damage: {bludgeoning: "0"},
      }, {
        name: "Unarmed Attack",
        tohit: 9,
        damage: {"magical bludgeoning": "1d4+6"},
        conditions: {
          "Raging": {weapon: "2"},
        },
      }, {
        name: "Dragon Breath",
        save: "DEX 15",
        damage: {"fire": "3d6"},
      }, {
        name: "Hand Axe",
        tohit: 8,
        damage: {"slashing": "1d6+5"},
        conditions: {
          "Raging": {weapon: "2"},
        },
      }, {
        name: "Javelin",
        tohit: 8,
        damage: {"piercing": "1d6+2"},
        conditions: {
          "Raging": {weapon: "2"},
        },
      },
    ],
  },
  "HalfPint": {
    attacks: [
      {
        name: "Mysterious Axe",
        tohit: 11,
        damage: {"magical slashing": "1d8+8"},
        conditions: {
          "Raging": {weapon: "2"},
          "2H": {weapon: "1d10+8", replace: true},
          "Giant": {weapon: "1d8"},
        }
      }
    ],
  },

};
