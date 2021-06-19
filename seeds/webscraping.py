import requests
from bs4 import BeautifulSoup

url = "https://onesearch.library.utoronto.ca/stgeorge-libraries"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")
tags = soup.select(selector="div.featured-library-home div a")

libraries = []
for library in tags:
    libraries.append(library.string)
print(libraries)
