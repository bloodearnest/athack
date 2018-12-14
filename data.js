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
        name: "Ashbringer",
        tohit: 7,
        damage: {"slashing": "d6+4"},
        conditions: {
          "Level 1 Smite": {radiant: "2d8"},
          "Level 2 Smite": {radiant: "4d8"},
        },
      }, {
        name: "Oathbringer (offhand)",
        tohit: 7,
        damage: {"slashing": "d6+4"},
        conditions: {
          "Level 1 Smite": {radiant: "2d8"},
          "Level 2 Smite": {radiant: "4d8"},
        },
      }
    ],
  },
  "Corminar": {
    attacks: [
      {
        name: "Rapier",
        tohit: 4,
        damage: {piercing: "d8+2"},
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
      }
    ]
  },
 "Nordan": {
    attacks: [
      {
        name: "Staff of the Jungle (Shillelagh)",
        tohit: 8,
        damage: {"magical bludgeoning": "d8+5"},
      }, {
        name: "Staff of the Jungle (Strength)",
        tohit: 6,
        damage: {"bludgeoning": "d6+3"},
        conditions: {
          'Two Handed': {weapon: "d8+3", replace: true},
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
        name: "Longbow",
        tohit: 9,
        damage: {"piercing": "d8+6"},
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
        name: "Bolas",
        tohit: 9,
        damage: {
            bludgeoning: "d4+4",
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
        tohit: 9,
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
        tohit: 9,
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
        damage: {"magical bludgeoning": "6"},
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
      },
    ],
  },
  "Hew Hackinstone" : {
    attacks: [
      {
        name: "Battleaxe",
        tohit: 7,
        damage: {"slashing": "1d8+4"},
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
    ]
  },
  "Half-Pint": {
    attacks: [
      {
        name: "Battleaxe",
        tohit: 7,
        damage: {"slashing": "d8+4"},
        conditions: {
          "Raging": {weapon: "2"},
          "Two Handed": {weapon: "d10+4", replace: true},
        },
      }, {
        name: "Chakram",
        tohit: 7,
        damage: {"slashing": "d6+4"},
        conditions: {
          "Raging (melee)": {weapon: "2"}
        }
      }, {
        name: "Handaxe",
        tohit: 7,
        damage: {"slashing": "d6+4"},
        conditions: {
          "Raging (melee)": {weapon: "2"}
        }
      }
    ],
  },
};
