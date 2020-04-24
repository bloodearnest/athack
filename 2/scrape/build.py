import yaml, json
campaigns = yaml.safe_load(open('campaigns.yaml'))
attacks = yaml.safe_load(open('attacks.yaml'))
characters = {
    'campaigns': campaigns,
    'attacks': attacks,
}
print(json.dumps(characters, indent=4))
