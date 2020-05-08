SPELL_BLACKLIST = set(b.lower() for b in [
    'Booming Blade',
    'Green-Flame Blade',
    'Armor of Agathys',
])

SPELL_OPTIONS = set(b.lower() for b in [
    'Hex',
    'Hunter\'s Mark',
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
    key = name.lower().replace("'", '')
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
    if 'Cantrip' not in data['damage']:
        return

    default = data['damage'].pop('Cantrip')

    data['damage']['Uninjured'] = default
    data['damage']['Injured'] = {
        'Necrotic': default['Necrotic'].replace('d8', 'd12')
    }
    data['default'] = 'Uninjured'


@special
def absorb_elements(data):
    "Correct the damage type"
    dtype = 'Elemental'

    data['effect'] = (
        'You choose from Acid, Cold, Fire, Lightning, or Thunder. You can'
        'and can damage to your first melee hit next turn.'
    )

    for k, v in data['damage'].items():
        if 'Acid' in v:
            d = v.pop('Acid')
            v[dtype] = d


@special
def dagger_of_venom(data):
    "Make poison damage optional"

    dmg = data['damage']['default'].pop('Poison')
    effect = data.pop('effect')
    data['options']['Venom'] = {
        'damage': dict(Poison=dmg),
        'effect': effect,
    }


@special
def thunder_step(data):
    if 'Ranged' in data['types']:
        data['types'].remove('Ranged')
        data['types'] = ['Melee'] + data['types']

@special
def melfs_minute_meteors(data):
    if 'Melee' in data['types']:
        data['types'].remove('Melee')
        data['types'] = ['Ranged'] + data['types']

@special
def unarmed_strike(data):
    if not data['damage']['default']:
        data['damage']['default'] = dict(Bludgeoning='1')

