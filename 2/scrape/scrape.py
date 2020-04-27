import sys
import time
import yaml

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException


def main(driver, characters, debug):

    for name, url in characters.items():
        start = time.time()
        print("Fetching {} from {}...".format(name, url))
        driver.get(url)

        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".ct-actions"))
        )

        tabs = element.find_elements(
            By.CSS_SELECTOR,
            ".ct-tab-options__header",
        )
        assert tabs[1].text == 'ATTACK'
        tabs[1].click()


        root = driver.find_element(By.TAG_NAME, "html")
        all = root.get_attribute('outerHTML')

        spells = None

        try:
            spells_tab = driver.find_element(
                By.CSS_SELECTOR, '.ct-primary-box__tab--spells',
            )
        except NoSuchElementException:
            pass  # no spells for this character

        else:
            spells_tab.click()
            spells_element = driver.find_element(By.CSS_SELECTOR, '.ct-spells')
            spells = spells_element.get_attribute('innerHTML')

        with open('data/{}.html'.format(name), 'w') as a:
            a.write(all)
        if spells:
            with open('data/{}_spells.html'.format(name), 'w') as a:
                a.write(spells)


if __name__ == '__main__':
    path = '/home/wavy/.mozilla/firefox/n8yczn28.@hack'
    profile = webdriver.FirefoxProfile(path)
    options = webdriver.FirefoxOptions()
    options.headless = True
    debug = False

    if '--debug' in sys.argv:
        debug = True
        options.headless = False

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

    driver = webdriver.Firefox(profile, options=options)
    try:
        main(driver, characters, debug)
    finally:
        driver.quit()

