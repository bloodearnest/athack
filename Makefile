ENV=env
BIN=$(ENV)/bin
VENV=$(ENV)/timestamp

default: $(VENV)

requirements/%.txt: requirements/%.in
	test -e $(BIN)/pip-compile && $(BIN)/pip-compile $< -o $@

.PHONY: update-dependencies
update-dependencies:
	touch requirements/*.in
	$(MAKE) requirements/*.txt

$(VENV): requirements/*.txt
	virtualenv -p python3 env
	$(BIN)/pip install -U -r requirements/prod.txt
	$(BIN)/pip install -U -r requirements/dev.txt
	touch $@

.PHONY: run
run: $(VENV)
	DEVEL=1 $(BIN)/talisker.gunicorn hook:app

