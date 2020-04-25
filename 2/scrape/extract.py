import sys
import os
import yaml

from parsel import Selector
import parse

import special

DAMAGE_TYPES = {
   'acid',
   'cold',
   'fire',
   'lightning',
   'poison',
   'thunder',
   'force',
   'radiant',
   'necrotic',
   'psychic',
   'slashing',
   'piercing',
   'bludgeoning',
}


def get_type_from_css_class(e, cls):
    needle = cls + '--'
    for c in e.attrib['class'].split(' '):
        if c.startswith(needle):
            return c.replace(needle, '')


def get_text(attack, selector, join=''):
    return join.join(attack.css(selector).getall())


class CSS:
    attacks = '.ct-combat-attack'
    name = '.ct-combat-attack__label *::text'
    type = '.ct-combat-attack__meta *::text'
    tohit = '.ct-combat-attack__tohit *::text'
    save = '.ct-combat-attack__save *::text'
    damage = '.ct-combat-attack__damage *::text'
    range = '.ct-combat-attack__range *::text'
    dtype = '.ct-damage-type-icon'


def get_tooltip_type(elem):
    tooltip = elem.css('.ct-tooltip')
    return tooltip.attrib.get('data-original-title')


def add_damage(dmg, type, amount):
    if type in dmg:
        dmg[type] += '+' + amount
    else:
        dmg[type] = amount


def get_attack(attack):
    name = get_text(attack, CSS.name).replace('Concentration', '')
    notes = attack.css(CSS.type).getall()
    types = set()
    range = get_text(attack, CSS.range, ' ')


    if notes:
        if 'melee' in notes[0].lower():
            types.add('Melee')
        elif 'ranged' in notes[0].lower():
            types.add('Ranged')
        if ('Level' in notes[0] or 'Cantrip' in notes[0]):
            types.add('Spell')

    if 'reach' in range.lower():
        types.add('Melee')
    elif range:
        types.add('Ranged')

    damage = {}
    options = {}
    save = None
    effects = []

    tohit = get_text(attack, CSS.tohit)
    if not tohit:
        save = get_text(attack, CSS.save, ' ')

    # weapons and spells have a different layout for damage
    damage_elements = attack.css('.ct-combat-attack__damage .ct-damage')
    if not damage_elements:
        damage_elements = attack.css(
            '.ct-combat-attack__damage '
            '.ct-spell-damage-effect__damages'
        )

    for dmg in damage_elements:
        damage_str = get_text(dmg, '.ct-damage__value::text')
        damage_type = get_tooltip_type(dmg)

        # weapons only
        if 'ct-damage--versatile' in dmg.attrib.get('class', ''):
            options['versatile'] = {
                damage_type: damage_str,
                'replace': True,
            }
        else:
            add_damage(damage, damage_type, damage_str)

    note_elements = iter(attack.css('.ct-note-components__component'))
    damage_mod = ""

    for note in note_elements:
        note_type = get_type_from_css_class(
            note, 'ct-note-components__component')
        text = get_text(note, '*::text')
        if note_type == 'plain':
            if text == '-':
                damage_mod = text
            elif text in ('Booming Blade', 'Green-Flame Blade'):
                options.update(attack_cantrip(text, note_elements))
            elif text != '+':
                notes.append(text)

        elif note_type == 'damage':
            dtype = get_tooltip_type(note)
            if dtype.lower() not in DAMAGE_TYPES:
                effects.append(dtype)
                dtype = get_type_from_css_class(
                    note.css('.ct-damage-type-icon'),
                    'ct-damage-type-icon',
                ).title()

            add_damage(damage, dtype, damage_mod + text)
            damage_mod = ""

    if tohit or damage:
        data = {
            'name': name,
            'types': list(types),
            'range': range,
            'damage': dict(damage),
            'options': options,
            'notes': notes,
        }
        if effects:
            data['effect'] = ', '.join(effects)
        if tohit:
            data['tohit'] = tohit
        if save:
            data['save'] = save
        special.handle(name, data)
        return data


def attack_cantrip(text, notes):
    base = next(notes)
    base_note_type = get_type_from_css_class(
        base, 'ct-note-components__component')
    assert base_note_type == 'damage'
    dtype = get_tooltip_type(base)
    base_damage = get_text(base, '.ct-damage__value::text')

    secondary = next(notes)
    secondary_note_type = get_type_from_css_class(
        base, 'ct-note-components__component')
    assert secondary_note_type == 'damage'
    secondary_header = get_tooltip_type(secondary)
    secondary_damage = get_text(secondary, '.ct-damage__value::text')

    damage = {}

    if base_damage:
        damage[dtype] = base_damage

    options = {
        text: {
            'damage': damage,
            'secondary': {
                'damage': {dtype: secondary_damage},
                'effect': secondary_header,
            }
        }
    }

    return options


def get_spell(level, spell, attacks):
    name = get_text(spell, '.ct-spell-name::text')
    if name.lower() in special.SPELL_BLACKLIST:
        return

    if name.lower() in special.SPELL_OPTIONS:
        return

    tohit = get_text(spell, '.ct-spells-spell__tohit *::text')
    tohit = tohit.replace('--', '')

    damage = get_text(spell, '.ct-damage__value::text')
    if not damage:
        return

    dtype = get_tooltip_type(spell.css('.ct-spell-damage-effect'))

    if spell.css('.ct-spells-spell__label--scaled'):
        base_spell = attacks[name]
        base_spell['options'][level] = {
            'damage': {dtype: damage},
            'replace': True,
            'type': 'spell slot'
        }
        special.handle(name, base_spell)
    elif name not in attacks:
        save = get_text(spell, '.ct-spells-spell__save *::text', ' ').upper()
        range = get_text(spell, '.ct-spells-spell__range *::text', ' ').upper()
        types = ['Spell']

        notes = [level, range.title()]

        cls = 'ct-note-components__component'
        note_elements = spell.css('.' + cls)
        distance = None
        for note in note_elements:
            type = get_type_from_css_class(note, cls)
            if type == 'distance':
                distance = get_text(note, '*::text')
            elif type == 'aoe-icon':
                icon_type = note.css('i').attrib['class'][6:].title()
                notes.append(distance + ' ' + icon_type)
                types.append('AoE')
                distance = None
            elif type == 'tooltip':
                notes.append(get_tooltip_type(note).title())

        data = dict(
            name=name,
            types=types,
            save=save,
            range=range,
            damage={dtype: damage},
            options={},
            notes=notes,
        )
        if save and level == 'Cantrip':
            data['half'] = False
        special.handle(name, data)
        return data


def clean(attack):
    def pop(l, i):
        if i in l:
            l.remove(i)
            return i
        else:
            return None

    components = [
        pop(attack['notes'], 'Verbal'),
        pop(attack['notes'], 'Somatic'),
        pop(attack['notes'], 'Material'),
    ]
    components = [c[0].upper() for c in components if c]
    if components:
        attack['components'] = components

    attack['range'] = attack['range'].replace('FT', 'ft')
    attack['range'] = attack['range'].replace('SELF', 'Self')

    for note in attack['notes']:
        if note.lower() == attack['range'].lower():
            attack['notes'].remove(note)
        elif note.startswith('Range ('):
            values = parse.parse('Range ({}/{})', note)
            value = '{} ({})'.format(*values)
            assert value == attack['range'], 'mismatched ranges'
            attack['notes'].remove(note)



def main(characters):

    for name in characters:

        attacks = dict()

        dir = os.path.dirname(os.path.abspath(__file__))
        apath = os.path.join(dir, 'data', '{}_attacks.html'.format(name))
        spath = os.path.join(dir, 'data', '{}_spells.html'.format(name))

        with open(apath) as fp:
               attacks_html = fp.read()
        attack_selector = Selector(attacks_html)

        for attack in attack_selector.css('.ct-combat-attack'):
            data = get_attack(attack)
            if data:
                clean(data)
                attacks[data['name']] = data

        spells = None
        try:

            with open(spath) as fp:
               spells_html = fp.read()
            spells = Selector(spells_html)
        except Exception:
            pass
        else:
            for level_spells in spells.css('.ct-content-group'):
                level = get_text(
                    level_spells, '.ct-content-group__header-content::text')

                for spell in level_spells.css('.ct-spells-spell'):
                    data = get_spell(level, spell, attacks)
                    if data:
                        clean(data)
                        attacks[data['name']] = data

        yield name, attacks



if __name__ == '__main__':
    characters = []
    if os.path.exists(sys.argv[1]):
        campaigns = yaml.safe_load(open(sys.argv[1]))
        for id, campaign in campaigns.items():
            characters.extend(campaign['characters'].keys())
    else:
        characters = sys.argv[1:]

    attacks = {}
    for name, data in main(characters):
        attacks[name] = data

    print(yaml.dump(attacks, default_flow_style=False))
