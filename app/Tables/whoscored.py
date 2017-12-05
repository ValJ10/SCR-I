#!/usr/bin/env python
# -*- coding: utf-8 -*-

from selenium import webdriver
from selenium.webdriver import DesiredCapabilities
from bs4 import BeautifulSoup


def driver():
	
	desired_capabilities = DesiredCapabilities.PHANTOMJS.copy()
	desired_capabilities['phantomjs.page.customHeaders.User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) ' \
																  'AppleWebKit/537.36 (KHTML, like Gecko) ' \
																  'Chrome/39.0.2171.95 Safari/537.36'
	driver = webdriver.PhantomJS(desired_capabilities=desired_capabilities)

	return driver


def fetcher(driver):
	
	driver.get('https://www.whoscored.com/Matches/958429/MatchReport/England-Premier-League-2015-2016-Everton-Watford')
	elem = driver.find_element_by_xpath("//*")
	source_code = elem.get_attribute("outerHTML").encode('utf-8')

	with open('WhoScored.html','w') as sf:
		sf.write(str(source_code))
		sf.flush()

	driver.quit()

def reader():
	with open('WhoScored.html','r') as sf:
		Page_Source = sf.read()
	
	soup = BeautifulSoup(Page_Source,"html.parser")

	LHS_Value = str(soup.findAll('span',{'class':'pulsable '})).replace('<span class="pulsable ">','').replace('</span>,','').replace('[','').replace('</span>]','').split()
	RHS_Value = str(soup.find_all("span", class_="pulsable greater")).replace('<span class="pulsable greater">','').replace('</span>,','').replace('[','').replace('</span>]','').split()
	print "LHS : ",LHS_Value
	print "RHS : ",RHS_Value
	

# Calling the functions in order now. driver() will create an instance of webdriver and return DRIVER, which can be used anywhere in the script to be used as a browser.
# Then you call the main function fetch(), which will do the actual fetching. Pass the argument driver in it so it can access the browser.
# You can do it all in one function, it's just my personal preference to make one function for PhantomJS and call it anywhere I need.
driver = driver()

fetcher(driver)

reader()