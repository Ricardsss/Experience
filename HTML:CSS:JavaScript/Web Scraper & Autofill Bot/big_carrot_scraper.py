import urllib.request
from bs4 import BeautifulSoup
import json

root_url = 'https://thebigcarrot.ca'
request = urllib.request.Request(root_url)
html = urllib.request.urlopen(request).read()
soup = BeautifulSoup(html,'html.parser')

data = dict()

name = 'The Big Carrot'

data['name'] = name
data['website'] = root_url[8:]
data['category'] = 'Food Bank'

contact_url = soup.find('li', attrs = {'id':'menu-item-4084'}).a['href']
contact_request = urllib.request.Request(contact_url)
contact_html = urllib.request.urlopen(contact_request).read()
contact_soup = BeautifulSoup(contact_html,'html.parser')
contact_a_tags = contact_soup.find_all('a')

phone_number = None
for a_tag in contact_a_tags:
	if 'tel' in a_tag['href']:
		phone_number = a_tag.text.strip()

data['phone number'] = str(phone_number)

email_descriptions = []
for a_tag in contact_a_tags:
	if 'mailto' in a_tag['href']:
		if a_tag.parent.strong != None:
			email_descriptions.append(a_tag.parent.strong.text.strip())
email_descriptions.insert(1, 'Beaches Info')

emails = []
for a_tag in contact_a_tags:
	if 'mailto' in a_tag['href']:
		if a_tag.text not in emails:
		    emails.append(a_tag.text)

data['email'] = emails[0]

h2_htmls = contact_soup.find_all('h2')
danforth_html = h2_htmls[2].parent
beach_html = h2_htmls[3].parent
danforth_name = danforth_html.h2.text.strip()
beach_name = beach_html.h2.text.strip()
danforth_address = danforth_html.p.text
beach_address = beach_html.p.text.split('\n')
locations = dict()
locations[str(danforth_name)] = danforth_address
locations[str(beach_name)] = beach_address
danforth_address = danforth_address[:19] + ", " + danforth_address[19:]
data['location'] = danforth_address

facebook_a_tag = soup.find('a', attrs = {'title':'Facebook'})
data['facebook'] = facebook_a_tag['href']
data['target age group'] = ['All Ages', '5']

about_url = soup.find('li', attrs = {'id':'menu-item-86'}).a['href']
about_request = urllib.request.Request(about_url)
about_html = urllib.request.urlopen(about_request).read()
about_soup = BeautifulSoup(about_html,'html.parser')

p_htmls = about_soup.find_all('p')
key_issues = None
for p in p_htmls:
	if 'Mission' in p.text:
		key_issues = p.text
data['key issues'] = key_issues.split(':')[1].strip()


with open('big_carrot.json', 'w') as outfile:  
    json.dump(data, outfile, indent = 4)