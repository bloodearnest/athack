'use strict';

const player_data = {
  "Airnel": {
    attacks: [
      {
        name: "Toll the Dead (full hitpoints)",
        save: '15 Wis',
        half: false,
        damage: {necrotic: "d8"},
      }, {
        name: "Toll the Dead (injured)",
        save: '15 Wis',
        half: false,
        damage: {necrotic: "d12"},
      }, {
        name: "Spiritual Weapon",
        tohit: 7,
        damage: {force: "d8+5"},
        conditions: {
            'Level 3-4': {force: "d8"},
            'Level 5-6': {force: "2d8"},
        }
      }, {
        name: "Guiding Bolt",
        tohit: 5,
        damage: {radiant: "4d6"},
        conditions: {
            'Level 2': {radiant: "1d6"},
            'Level 3': {radiant: "2d6"},
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
        tohit: 5,
        damage: {"slashing": "d6+3"},
        conditions: {
          "Level 1 Smite": {radiant: "2d8"},
          "Level 2 Smite": {radiant: "4d8"},
        },
      }, {
        name: "Oathbringer (offhand)",
        tohit: 5,
        damage: {"slashing": "d6+3"},
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
        save: '14 Wis',
        half: false,
        damage: {
          psychic: "d4",
          effect: "disadvantage on next attack roll",
        },
      }, {
        name: "Dissonant Whispers",
        save: '14 Wis',
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
  "Half-Pint": {
    attacks: [
      {
        name: "Battleaxe (one handed)",
        tohit: 6,
        damage: {"slashing": "d8+3"},
        conditions: {
          "Raging": {weapon: "2"}
        },
      }, {
        name: "Battleaxe (two handed)",
        tohit: 6,
        damage: {"slashing": "d10+3"},
        conditions: {
          "Raging": {weapon: "2"}
        },
      }, {
        name: "Chakram",
        tohit: 6,
        damage: {"slashing": "d6+3"},
        conditions: {
          "Raging (melee)": {weapon: "2"}
        }
      }, {
        name: "Handaxe",
        tohit: 6,
        damage: {"slashing": "d6+3"},
        conditions: {
          "Raging (melee)": {weapon: "2"}
        }
      }
    ],
  },
  "Nordan": {
    attacks: [
      {
        name: "2H Quarterstaff (Shillelagh)",
        tohit: 5,
        damage: {"magical bludgeoning": "d8+3"},
      }, {
        name: "1H Quarterstaff (Shillelagh)",
        tohit: 5,
        damage: {"magical bludgeoning": "d6+3"},
      }, {
        name: "2H Quarterstaff (Strength)",
        tohit: 4,
        damage: {"magical bludgeoning": "d8+2"},
      }, {
        name: "1H Quarterstaff (Strength)",
        tohit: 4,
        damage: {"magical bludgeoning": "d6+2"},
      },
    ],
  },
  "Timber": {
    attacks: [
      {
        name: "Longbow",
        tohit: 8,
        damage: {"piercing": "d8+4"},
      }, {
        name: "Bolas",
        tohit: "8",
        damage: {bludgeoning: "d4+4"},
        effect: "Large and smaller creatures are rendered prone. DC 10 Str, DC 15 Dex, or 5 slashing damage to escape. If you have advantage, and both hit, target is also restrained."
      }, {
        name: "Blowgun",
        tohit: "8",
        damage: {piercing: "1"},
      }, {
        name: "Net",
        tohit: "8",
        damage: {bludgeoning: "0"},
        effect: "Target is restrained. DC 10 Str check or 5 slashing damage to escape. Can only make 1 attack per turn."
      }, {
        name: "Trident (1 handed)",
        tohit: "3",
        damage: {piercing: "d6+1"},
      }, {
        name: "Trident (2 handed)",
        tohit: "3",
        damage: {piercing: "d8+1"},
      }, {
        name: "Cat's Claw",
        tohit: "3",
        damage: {piercing: "d4+1"},
      }
    ],
  },
};
