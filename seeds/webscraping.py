import requests
from bs4 import BeautifulSoup
import json


url = "https://onesearch.library.utoronto.ca/stgeorge-libraries"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")
tags = soup.select(selector="div.featured-library-home div a")
libraries = {}
for library in tags:
    url = f"https://onesearch.library.utoronto.ca{library['href']}"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    tag = soup.select(selector="div.library-address")
    if len(tag):
        postal_code = tag[0].text.split("\r\n")[-2]
        libraries[library.string] = postal_code

with open('seeds/data.json', 'w') as outfile:
    json.dump(libraries, outfile)
print("=== all done ===")
