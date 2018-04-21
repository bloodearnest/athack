'use strict';

const player_data = {
  "Airnel": {
    attacks: [
      {
        name: "Toll the Dead (full hitpoints)",
        save: '13 Wis',
        half: false,
        damage: {necrotic: "d8"},
      }, {
        name: "Toll the Dead (injured)",
        save: '13 Wis',
        half: false,
        damage: {necrotic: "d12"},
      }, {
        name: "Guiding Bolt",
        tohit: 5,
        damage: {radiant: "4d6"},
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
        }
      }, {
        name: "Oathbringer (offhand)",
        tohit: 5,
        damage: {"slashing": "d6"},
        conditions: {
          "Level 1 Smite": {radiant: "2d8"},
        }
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
        save: '13 Wis',
        half: false,
        damage: {
          psychic: "d4",
          effect: "disadvantage on next attack roll",
        },
      }
    ]
  },
  "Half-Pint": {
    attacks: [
      {
        name: "Battleaxe (one handed)",
        tohit: 5,
        damage: {"slashing": "d8+3"},
        conditions: {
          "Raging": {weapon: "2"}
        },
      }, {
        name: "Battleaxe (two handed)",
        tohit: 5,
        damage: {"slashing": "d10+3"},
        conditions: {
          "Raging": {weapon: "2"}
        },
      }, {
        name: "Chakram",
        tohit: 5,
        damage: {"slashing": "d6+3"},
        conditions: {
          "Raging (melee)": {weapon: "2"}
        }
      }, {
        name: "Handaxe",
        tohit: 5,
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
        tohit: 7,
        damage: {"piercing": "d8+3"},
      }, {
        name: "Cat's Claw",
        tohit: "3",
        damage: {piercing: "d4+ 1"},
      }
    ],
  },
};
