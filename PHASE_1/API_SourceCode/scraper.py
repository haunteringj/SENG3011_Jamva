from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re
import pycountry
import json

from firebase_admin import credentials
from firebase_admin import firestore
import firebase_admin

cred = credentials.Certificate("../dataBasePrivateKey.json")
firebase_admin.initialize_app(cred, {'projectId': "jamva-real",})
# # from requests_html import HTMLSession
# session = HTMLSession()

from firebase_admin import db
ref = db.reference("/")

url1 = "https://promedmail.org"
postid = 0
url2 = "https://promedmail.org/promed-post/?place="


driver = webdriver.Safari()


def getArticleData(element):
    driver1 = webdriver.Safari()

    wait = WebDriverWait(driver1, 10)
    fail = True
    driver1.get(
        f"https://promedmail.org/promed-post/?place={element['id']}#promedmailmap")
    while fail:
        try:
            wait.until(EC.presence_of_element_located(
                (By.XPATH, '//*[@id="main"]/div/div/div[4]/div')))
            fail = False
        except:
            print("failed fetching article")
            driver1.get(
        f"https://promedmail.org/promed-post/?place={element['id']}#promedmailmap")
    

    try:
        published_date = driver1.find_element(
            By.XPATH, '//*[@id="main"]/div/div/div[4]/p/text()[1]')
        # print(f"The published date on promed {published_date.text}")
        element['published_date'] = published_date.text
    except Exception as e:
        element['published_date'] = ''
        print(e)
    try:
        day = driver1.find_element(
            By.XPATH, '//*[@id="main"]/div/div/div[4]/div/text()[6]')
        # print(f"The date of the case being reported {day.text}")
        element['date'] = day.text
    except Exception as e:
        element['date'] = ''
        print(e)
    try:
        main_text = driver1.find_element(
            By.XPATH, '//*[@id="main"]/div/div/div[4]/div')
        # mt = re.search('A ProMED-mail post(.*)Mod.TYProMED',
        #                main_text.text).group(1)
        # print(f"The main text is {mt}")
        print(f"the main text is : {main_text.text}")
        element['main'] = main_text.text
        # if mt:
        #     element['main'] = mt
        # else:
        #     element['main'] = main_text.text
            
        
    except Exception as e:
        element['main'] = ''
        print(e)
    try:
        original_source = driver1.find_element(
            By.XPATH, '//*[@id="main"]/div/div/div[4]/div/a[3]')
        # print(f"The original source is {original_source.text}")
        element['original_source'] = original_source.text

    except Exception as e:
        element['original_source'] = ''
        print(e)

    driver1.close()


driver.get(url1)

# get the latest date from the db to check if there are any new posts
# if no posts, termintate scraper
# If there are new posts then:
# get the the ids of all those posts
# get all the info about those posts
# create a list
# push the list to the database

wait = WebDriverWait(driver, 10)
latest_id_list = []
countries = ['Afghanistan', 'USA', 'Europe', 'Aland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia, Plurinational State of', 'Bonaire, Sint Eustatius and Saba', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Congo, The Democratic Republic of the', 'Cook Islands', 'Costa Rica', "Côte d'Ivoire", 'Croatia', 'Cuba', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Holy See (Vatican City State)', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran, Islamic Republic of', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', "Korea, Democratic People's Republic of", 'Korea, Republic of', 'Kuwait', 'Kyrgyzstan', "Lao People's Democratic Republic", 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
             'Macao', 'Macedonia, Republic of', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia, Federated States of', 'Moldova, Republic of', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestinian Territory, Occupied', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Barthélemy', 'Saint Helena, Ascension and Tristan da Cunha', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin (French part)', 'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten (Dutch part)', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'South Sudan', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan, Province of China', 'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela, Bolivarian Republic of', 'Viet Nam', 'Virgin Islands, British', 'Virgin Islands, U.S.', 'Wallis and Futuna', 'Yemen', 'Zambia', 'Zimbabwe']


# get all the ids of the latest posts
try:
    print("fetching latest list")
    fail = True
    while fail:
        try:
            wait.until(EC.presence_of_element_located((By.XPATH, "//a[@class='lcl']")))
            fail = False
        except:
            print("failed fetching latest list")
            driver.get(url1)
   
    print("latest list loaded")
    # if this is the first time the scraper is running
    # time.sleep(5)
    list_div = driver.find_element(By.XPATH, "//div[@class='latest_list']/ul")
    items = list_div.find_elements(By.TAG_NAME, value="li")

    # print(list_div.get_attribute("innerHTML"))
    print("--------------------------------------")
    num = 1
    # print(items)]
    print(len(items))
    for item in items:
        link = item.find_element(By.TAG_NAME, value="a")
        # id = re.search('\d{7}', link.get_attribute("id"))÷
        id = link.get_attribute("id")[2:]
        title = link.text
        date = driver.execute_script(
            'return arguments[0].firstChild.textContent;', item).strip()
        ct = ''
        for c in countries:
            if c in title:
                ct = c

        latest_id_list.append(
            {'id': id, 'title': title, 'date': date, 'country': ct})

except Exception as e:
    print(e)
    print("fail")
    # print(latest_id_list)
    # driver.close()
    # exit(1)


driver.close()
# for post_id in latest_id_list:
#     driver.get(f"https://promedmail.org/promed-post/?place={post_id}#promedmailmap")


# for each id in the list get the article data
count = 0
for element in latest_id_list:
    if count == 5:
        break
    getArticleData(element)
    count += 1


ref.set(json.dumps(latest_id_list))

print(json.dumps(latest_id_list))
