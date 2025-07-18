import requests

with open('imagenes.txt') as f:
    urls = f.read().splitlines()

for i, url in enumerate(urls):
    if url.strip() == "":
        continue
    name = f"{abs(40-i)}.png"
    with open(f'img/{name}', 'wb') as f_out:
        f_out.write(requests.get(url).content)