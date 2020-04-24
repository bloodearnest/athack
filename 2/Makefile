characters.json: campaigns.yaml attacks.yaml scrape/build.py env/done 
	env/bin/python scrape/build.py > .tmp.json
	mv .tmp.json $@

attacks.yaml: env/done scrape/data/*.html scrape/parse.py scrape/special.py
	env/bin/python scrape/parse.py campaigns.yaml > .tmp.yaml
	mv .tmp.yaml attacks.yaml

.PHONY: update
update: attacks characters.json

env/done: scrape/requirements.txt
	virtualenv -p python3 env
	env/bin/pip install -r scrape/requirements.txt
	touch $@


.PHONY: build
build: | node_modules
	npx snowpack

node_modules:
	npm install
