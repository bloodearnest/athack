import yaml, json
campaigns = yaml.safe_load(open('campaigns.yaml'))
characters = yaml.safe_load(open('characters.yaml'))
characters = {
    'campaigns': campaigns,
    'characters': characters,
}
print(json.dumps(characters, indent=4))
