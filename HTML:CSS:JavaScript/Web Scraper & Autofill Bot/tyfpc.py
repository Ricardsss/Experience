from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import time
import json

class TYFPCBot():
	def __init__(self, information):
		self.name = information['name']
		self.website = information['website']
		self.phoneNumber = information['phone number']
		self.email = information['email']
		self.location = information['location']
		self.facebook = information['facebook']
		self.ageGroup = information['target age group']
		self.description = information['key issues']
		self.category = information['category']
		self.username = 'EmmaT'
		self.password = 'UofTAccess123@'
		self.browser = webdriver.Chrome(ChromeDriverManager().install())

	def signIn(self):
		self.browser.get('http://tyfpc.ca/wp-login.php')

		usernameInput = self.browser.find_element_by_id('user_login')
		passwordInput = self.browser.find_element_by_id('user_pass')
		logIn = self.browser.find_element_by_id('wp-submit')

		usernameInput.send_keys(self.username)
		passwordInput.send_keys(self.password)
		logIn.click()

	def addToWebsite(self):
		self.browser.get('http://tyfpc.ca/add-to-our-list-of-contacts-in-toronto/')

		nameInput = self.browser.find_element_by_id('field_qh4icy')
		websiteInput = self.browser.find_element_by_id('field_29yf4d')
		desciptionInput = self.browser.find_element_by_id('field_ocfup1')
		locationInput = self.browser.find_element_by_id('field_xhpx3')
		emailInput = self.browser.find_element_by_id('field_9jv0r1')
		phoneNumberInput = self.browser.find_element_by_id('field_2bo5b')
		categoryInput = self.browser.find_element_by_id('field_w4yjc')
		ageGroupInput = self.browser.find_element_by_id('field_56qpb-' + self.ageGroup[1])
		submit = self.browser.find_element_by_class_name('frm_button_submit')

		nameInput.send_keys(self.name)
		websiteInput.send_keys(self.website)
		desciptionInput.send_keys(self.description)
		locationInput.send_keys(self.location)
		emailInput.send_keys(self.email)
		phoneNumberInput.send_keys(self.phoneNumber)
		categoryInput.send_keys(self.category)
		ageGroupInput.send_keys(self.ageGroup[0])
		submit.click()

with open('afric-can_food_basket.json') as json_file:
	data = json.load(json_file)
	bot = TYFPCBot(data)
	bot.signIn()
	bot.addToWebsite()

with open('big_carrot.json') as json_file:
	data = json.load(json_file)
	bot = TYFPCBot(data)
	bot.signIn()
	bot.addToWebsite()