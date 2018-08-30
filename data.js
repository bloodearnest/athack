'use strict';

const party_data = {
  "Airnel": {
    attacks: [
      {
        name: "Toll the Dead",
        save: '15 Wis',
        half: false,
        damage: {necrotic: "d8"},
        conditions: {
          'Injured': {weapon: "d12", replace: true},
        },
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
        name: "Battleaxe",
        tohit: 6,
        damage: {"slashing": "d8+4"},
        conditions: {
          "Raging": {weapon: "2"},
          "Two Handed": {weapon: "d10+4", replace: true},
        },
      }, {
        name: "Chakram",
        tohit: 6,
        damage: {"slashing": "d6+4"},
        conditions: {
          "Raging (melee)": {weapon: "2"}
        }
      }, {
        name: "Handaxe",
        tohit: 6,
        damage: {"slashing": "d6+4"},
        conditions: {
          "Raging (melee)": {weapon: "2"}
        }
      }
    ],
  },
  "Nordan": {
    attacks: [
      {
        name: "Staff of the Jungle (Shillelagh)",
        tohit: 7,
        damage: {"magical bludgeoning": "d6+5"},
        conditions: {
          'Two Handed': {weapon: "d8+5", replace: true},
        }
      }, {
        name: "Staff of the Jungle (Strength)",
        tohit: 5,
        damage: {"bludgeoning": "d6+3"},
        conditions: {
          'Two Handed': {weapon: "d8+3", replace: true},
        }
      },
    ],
  },
  "Timber": {
    attacks: [
      {
        name: "Longbow",
        tohit: 8,
        damage: {"piercing": "d8+6"},
        conditions: {
          'Maneuver': {weapon: "d8"},
        }
      }, {
        name: "Bolas",
        tohit: "8",
        damage: {bludgeoning: "d4+4"},
        effect: "Large and smaller creatures are rendered prone. DC 10 Str, DC 15 Dex, or 5 slashing damage to escape. If you have advantage, and both hit, target is also restrained.",
        conditions: {
          'Maneuver': {weapon: "d8"},
        }
      }, {
        name: "Blowgun",
        tohit: "8",
        damage: {piercing: "1"},
        conditions: {
          'Maneuver': {weapon: "d8"},
        }
      }, {
        name: "Net",
        tohit: "8",
        damage: {bludgeoning: "0"},
        effect: "Target is restrained. DC 10 Str check or 5 slashing damage to escape. Can only make 1 attack per turn.",
        conditions: {
          'Maneuver': {weapon: "d8"},
        }
      }, {
        name: "Trident",
        tohit: "4",
        damage: {piercing: "d6+2"},
        conditions: {
          'Maneuver': {weapon: "d8"},
          "Two Handed": {weapon: "d8+2", replace: true},
        }
      }, {
        name: "Cat's Claw",
        tohit: "4",
        damage: {piercing: "d4+2"},
        conditions: {
          'Maneuver': {weapon: "d8"},
        }
      }
    ],
  },
};
