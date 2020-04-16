import logging
import os

import requests
import flask
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)


channels = {
    "toa": os.getenv("DISCORD_TOA"),
    "wm": os.getenv("DISTORD_WM"),
}

logger = logging.getLogger(__name__)


def validate(request):
    body = request.get_json()
    try:
        assert channels.get(body['channel']) is not None
    except Exception:
        logger.error('bad request', extra=body)
        flask.abort(400)

    return body


@app.route('/attack', methods=["POST"])
def attack():
    data = validate(flask.request)
    resp = post('attack', data)
    return flask.make_response('', resp.status_code)


@app.route('/save', methods=["POST"])
def save():
    data = validate(flask.request)
    resp = post('save', data)
    return flask.make_response('', resp.status_code)


def post(action, data):
    logger.info("{}".format(action), extra=data)
    character = data.get('character')
    hook = channels[data['channel']]
    if action == 'save':
        title = '{} makes a {} saving throw!'.format(
            character,
            data.get('save'),
        )
    else:
        title = "{} attacks with {}!".format(character, data.get('attack'))

    body = {
        "username": "@hack",
        "embeds": [{
            "title": title,
            "description": data.get('result'),
            "thumbnail": {"url": data.get("url")},
            "fields": [],
        }]
    }

    def add_field(name, join=None):
        value = data.get(name, [] if join else None)
        if value:
            if join:
                value = join.join(value)
            body["embeds"][0]["fields"].append(
                {"name": name.title(), "value": value},
            )

    if action == 'attack':
        add_field('save')
        add_field('secondary')
        add_field('effects', join='\n')

    add_field('meta', join='\n')
    add_field('conditions', join=', ')

    return requests.post(hook, json=body)


if __name__ == "__main__":
    import sys
    if len(sys.argv) == 1:
        app.run()
    else:
        args = sys.argv[1:]
        r = post(channels['test'], *args)
        print(r.status)
        print(r.text)
