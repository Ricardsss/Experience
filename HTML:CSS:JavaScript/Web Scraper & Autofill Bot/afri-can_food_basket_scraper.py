import urllib.request
from bs4 import BeautifulSoup
import json

root_url = 'http://africanfoodbasket.ca'
request = urllib.request.Request(root_url)
html = urllib.request.urlopen(request).read()
soup = BeautifulSoup(html,'html.parser')

data = dict()

name = 'Afri-Can Food Basket'
data['name'] = name
data['website'] = root_url[7:]
data['category'] = "Farmer's Market"

contact_url = soup.find('li', attrs = {'class':'menu-item-21'}).a['href']
contact_request = urllib.request.Request(contact_url)
contact_html = urllib.request.urlopen(contact_request).read()
contact_soup = BeautifulSoup(contact_html,'html.parser')

contact_div_tag = contact_soup.find('div', attrs = {'id':'panel-17-1-0-0'})
contact_fields = contact_div_tag.div.p.text.split(':')
email = contact_fields[1].strip().strip(' Address').strip()
address = contact_fields[2].strip().strip(' Open Daily').split('\xa0')
location = address[0] + " " + address[1]
phone_number = contact_fields[6].strip()

data['phone number'] = phone_number
data['email'] = email
data['location'] = location

facebook_a_tag = soup.find('a', attrs = {'title':'Follow Us on Facebook'})
facebook_url = facebook_a_tag['href']

data['facebook'] = facebook_url
data['target age group'] = ['All Ages', '5']

about_url = soup.find('li', attrs = {'class':'menu-item-25'}).a['href']
about_request = urllib.request.Request(about_url)
about_html = urllib.request.urlopen(about_request).read()
about_soup = BeautifulSoup(about_html,'html.parser')

key_issues_pre_split = about_soup.find('div', attrs = {'id':'panel-9-2-0-0'}).div.p.text.strip().split('\u2019')
key_issues = ''
for text in key_issues_pre_split:
	key_issues += text
data['key issues'] = key_issues


with open('afric-can_food_basket.json', 'w') as outfile:  
    json.dump(data, outfile, indent = 4)