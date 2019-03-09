'use strict';

const party_data = {
  "Airnel": {
    attacks: [
      {
        name: "Toll the Dead",
        save: '15 Wis',
        half: false,
        damage: {necrotic: "2d8"},
        conditions: {
          'Injured': {weapon: "2d12", replace: true},
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
        tohit: 7,
        damage: {
            "magical slashing": "d6+4",
            thunder: "d6",
            effect: "If Lightning also hits, DC13 CON or stunned for one round",
        },
        conditions: {
          "Level 1 Smite": {radiant: "2d8"},
          "Level 2 Smite": {radiant: "3d8"},
        },
      }, {
        name: "Lightning",
        tohit: 7,
        damage: {
            "magical slashing": "d6+4",
            "lightning": "d6",
            effect: "If Thunder also hits, DC13 CON or stunned for one round",
        },
        conditions: {
          "Level 1 Smite": {radiant: "2d8"},
          "Level 2 Smite": {radiant: "3d8"},
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
        tohit: 7,
        damage: {"slashing": "d6+4"},
        conditions: {
          "Level 1 Smite": {radiant: "2d8"},
          "Level 2 Smite": {radiant: "3d8"},
        },
      }, {
        name: "Oathbringer (offhand)",
        tohit: 7,
        damage: {"slashing": "d6+4"},
        conditions: {
          "Level 1 Smite": {radiant: "2d8"},
          "Level 2 Smite": {radiant: "3d8"},
        },
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
        name: "Rapier",
        tohit: 5,
        damage: {'magical piercing': "d8+2"},
      }, {
        name: "Dagger of Venom",
        tohit: 6,
        damage: {piercing: "d4+3"},
        conditions: {
            "Venom": {
                secondary: {poison: "2d10"},
                effect: "DC 15 Con save, or take poison damage and poisoned",
            },
        },
      }, {
        name: "Vicious Mockery",
        save: '15 Wis',
        half: false,
        damage: {
          psychic: "2d4",
          effect: "disadvantage on next attack roll",
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
        tohit: 8,
        damage: {"magical bludgeoning": "d8+5"},
      }, {
        name: "Call Lightning",
        save: "15 Dex",
        damage: {"lightning": "3d10"},
        conditions: {
          'Level 4': {weapon: "1d10"},
        }
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
        name: "Staff of the Jungle (Strength)",
        tohit: 6,
        damage: {"bludgeoning": "d6+3"},
        conditions: {
          'Two Handed': {weapon: "d8+3", replace: true},
        }
      }, {
        name: "Healing Word",
        damage: {healing: "d4+4"},
        conditions: {
          "Level 2": {weapon: "d4"},
          "Level 3": {weapon: "2d4"},
        }
      }, {
        name: "Primal Savagery",
        tohit: 8,
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
              effect: "DC 15 Wis save or disadvantage on all attacks not against Timber",
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
              effect: "DC 15 Wis save or disadvantage on all attacks not against Timber",
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
              effect: "DC 15 Wis save or disadvantage on all attacks not against Timber",
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
              effect: "DC 15 Wis save or disadvantage on all attacks not against Timber",
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
              effect: "DC 15 Wis save or disadvantage on all attacks not against Timber",
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
        name: "Unarmed Attack",
        tohit: 8,
        damage: {"magical bludgeoning": "1d4+5"},
        conditions: {
          "Raging": {weapon: "2"},
        },
      }, {
        name: "Hand Axe",
        tohit: 7,
        damage: {"slashing": "1d6+4"},
        conditions: {
          "Raging": {weapon: "2"},
        },
      }, {
        name: "Javelin",
        tohit: 7,
        damage: {"piercing": "1d6+4"},
        conditions: {
          "Raging": {weapon: "2"},
        },
      },
    ],
  },
};
