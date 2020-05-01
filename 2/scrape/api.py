import json
import re
import html


def parse_json(path):
    data = json.load(open(path))['data']

    inventory = {
        i['definition']['name']: extract_item(i['definition'])
        for i in data['inventory']
    }

    spell_list = []
    for class_spells in data.get('classSpells', []):
        spell_list.extend(class_spells.get('spells', []))

    try:
        spell_list.extend(data['classSpells'][0]['spells'])
    except KeyError:
        pass

    extra_spells = data['spells'] or {}

    for source, extra in extra_spells.items():
        if extra:
            spell_list.extend(extra)

    spells = {
        s['definition']['name']: extract_spell(s['definition'])
        for s in spell_list
    }

    return inventory, spells


def get_desc(item):
    paragraphs = re.sub('<[^<]+?>', '', item['description']).split('\r\n')
    return [html.unescape(p) for p in paragraphs]

def extract_item(item):
    return {
        'name': item['name'],
        'description': get_desc(item),
        'tags': item['tags'],
        'properties': {
            p['name']: get_desc(p) for p in (item['properties'] or [])
        },
    }

def extract_spell(spell):
    return {
        'name': spell['name'],
        'tags': spell['tags'],
        'description': get_desc(spell),
    }



if __name__ == '__main__':
    import sys
    from pprint import pprint
    i, s = parse_json(sys.argv[1])
    pprint(i)
    pprint(s)



