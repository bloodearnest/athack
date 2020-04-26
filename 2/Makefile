characters.json: campaigns.yaml attacks.yaml scrape/build.py env/done 
	env/bin/python scrape/build.py > .tmp.json
	mv .tmp.json $@

attacks.yaml: env/done scrape/data/*.html scrape/extract.py scrape/special.py
	env/bin/python scrape/extract.py campaigns.yaml > .tmp.yaml
	mv .tmp.yaml attacks.yaml

.PHONY: update
update: attacks characters.json

env/done: scrape/requirements.txt
	virtualenv -p python3 env
	env/bin/pip install -r scrape/requirements.txt
	touch $@

serve:
	python3 -m http.server

.PHONY: build
build: | node_modules
	npx snowpack

node_modules:
	npm install

clean: 
	rm -rf node_modules web_modules
