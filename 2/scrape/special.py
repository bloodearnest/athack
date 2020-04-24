SPELL_BLACKLIST = set(b.lower() for b in [
    'Booming Blade',
    'Green-Flame Blade',
    'Armor of Agathys',
])


EFFECTS = {
    'Spritual Guardians': 'Speed halved',
    'Vampiric Touch': 'You heal half',
    'Blight': 'Undead and constructs immune. '
              'Plants have disadvantage and max damage.',
    'Thunder': "If Lightning also hits, DC13 CON or stunned for one round",
    'Lightning': "If Thunder also hits, DC13 CON or stunned for one round",
    'Vicious Mockery': "disadvantage on next attack roll",
    'Dissonant Whispers': "must use reaction to move "
                          "full speed away from you.",
    'Heat Metal': "If holding/wearing, DC 16 Con save or must drop, "
                  "disadvantage on attacks and checks if it cannot",
    'Ray of Sickness': "DC 16 Con save or poisoned",
    'Ray of Enfeeblement': "Half damage with Stength weapons. CON Save at end "
                           "of turn ends the spell.",
}

EFFECTS = {k.lower(): v for k, v in EFFECTS.items()}
SPECIAL_CASES = {}


def handle(name, data):
    key = name.lower()
    if key in EFFECTS:
        data['effect'] = EFFECTS[key]
    if key in SPECIAL_CASES:
        SPECIAL_CASES[key](data)


def special(f):
    name = f.__name__.replace('_', ' ').lower()
    SPECIAL_CASES[name] = f
    return f


@special
def toll_the_dead(data):
    """Add injured option."""
    data['options']['Injured'] = {
        'Necrotic': data['damage']['Necrotic'].replace('d8', 'd12'),
        'replace': True,
    }


@special
def absorb_elements(data):
    "Correct the damage type"
    dtype = 'Acid|Cold|Fire|Lightning|Thunder'

    def replace(dmg):
        if 'Acid' in dmg:
            d = dmg.pop('Acid')
            dmg[dtype] = d

    replace(data['damage'])
    for name, option in data['options'].items():
        if 'level' in name.lower():
            replace(option['damage'])


@special
def dagger_of_venom(data):
    "Make poison damage optional"

    dmg = data['damage'].pop('Poison')
    effect = data.pop('effect')
    data['options']['Venom'] = {
        'damage': dict(Poison=dmg),
        'effect': effect,
    }
