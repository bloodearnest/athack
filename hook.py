import flask
import requests
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)

channels = {
    "test": (
        "https://discordapp.com/api/webhooks/699241461576892416/"
        "U8xXZmj7N6gUjv-0tUUtbb7xMj7u72o68KvdIJZl3Y6FUURuWUqHoKCwTaPfuuyYAemk"
    ),
    "toa": (
        "https://discordapp.com/api/webhooks/699214978854682664/"
        "LrtFj83v9rODZH7YGZPd06rS0a_HCtdrz3iQmwGtJ1VQATPtzASe7BO5itJXVGLFzBrz"
    ),
}

@app.route('/attack/<channel>', methods=["POST"])
def attack(channel):
    data = flask.request.get_json()
    resp = post('attack', channels[channel], data)
    return flask.make_response('', resp.status_code)


@app.route('/save/<channel>', methods=["POST"])
def save(channel):
    data = flask.request.get_json()
    resp = post('save', channels[channel], data)
    return flask.make_response('', resp.status_code)


def post(action, hook, data):
    character = data.get('character')
    print(data)
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

    if type == 'attack':
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
