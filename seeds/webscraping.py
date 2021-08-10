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
    address_tag = soup.select(selector="div.library-address")
    if len(address_tag):
        postal_code_string = address_tag[0].text.split(
            "\r\n")[-2].replace(" ", "")
        postal_code = [postal_code_string[:3], postal_code_string[3:]]
        geocoding_url = f"https://geocoder.ca/?auth=714440059466492457220x101434&locate={postal_code[0]}+{postal_code[1]}&json=1"
        address = requests.get(geocoding_url).json()
        longt = address["longt"]
        latt = address["latt"]
        libraries[library.string] = [longt, latt]

with open('seeds/libraryLocationMap.json', 'w') as outfile:
    json.dump(libraries, outfile)
print("=== all done ===")
