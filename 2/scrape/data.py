import sys
import time
import yaml
import json
from urllib.parse import urlparse
import requests
session = requests.Session()


def main(characters):

    for name, url in characters.items():
        parsed = urlparse(url)
        id = parsed.path.split('/')[2]
        json_url = (
            'https://character-service.dndbeyond.com'
            '/character/v3/character/' + id
            )
        resp = session.get(json_url)
        resp.raise_for_status()
        with open('data/{}.json'.format(name), 'w') as a:
            a.write(json.dumps(resp.json(), indent=4))


if __name__ == '__main__':
    CAMPAIGNS = yaml.safe_load(sys.stdin)
    CHARACTERS = {}
    for campaign in CAMPAIGNS.values():
        for name, character in campaign['characters'].items():
            CHARACTERS[name] = character['url']

    urls = [u for u in sys.argv if u.startswith('http')]
    chars = [ch for ch in sys.argv if ch in CHARACTERS]

    characters = {}

    if urls:
        for i, url in enumerate(urls):
            characters[str(i)] = url
    if chars:
        for ch in chars:
            characters[ch] = CHARACTERS[ch]

    if not characters:
        characters.update(CHARACTERS)

    main(characters)

