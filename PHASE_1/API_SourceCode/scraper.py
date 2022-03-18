from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re
import json
from firebase_admin import credentials
from firebase_admin import firestore
import firebase_admin
from firebase_admin import db
import pycountry
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())
cred = credentials.Certificate("../dataBasePrivateKey.json")
firebase_admin.initialize_app(
    cred,
    {
        "projectId": "jamva-real",
    },
)


db = firestore.client()


url1 = "https://promedmail.org"
postid = 0
url2 = "https://promedmail.org/promed-post/?place="


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
countries = [
    "Afghanistan",
    "USA",
    "Europe",
    "Aland Islands",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia, Plurinational State of",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros",
    "Congo",
    "Congo, The Democratic Republic of the",
    "Cook Islands",
    "Costa Rica",
    "Côte d'Ivoire",
    "Croatia",
    "Cuba",
    "Curaçao",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands (Malvinas)",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and McDonald Islands",
    "Holy See (Vatican City State)",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran, Islamic Republic of",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea, Democratic People's Republic of",
    "Korea, Republic of",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Macedonia, Republic of",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia, Federated States of",
    "Moldova, Republic of",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestinian Territory, Occupied",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Réunion",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "Saint Barthélemy",
    "Saint Helena, Ascension and Tristan da Cunha",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin (French part)",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten (Dutch part)",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "South Sudan",
    "Svalbard and Jan Mayen",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan, Province of China",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "United States Minor Outlying Islands",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela, Bolivarian Republic of",
    "Viet Nam",
    "Virgin Islands, British",
    "Virgin Islands, U.S.",
    "Wallis and Futuna",
    "Yemen",
    "Zambia",
    "Zimbabwe",
]


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
    list_div = driver.find_element(By.XPATH, "//div[@class='latest_list']/ul")
    items = list_div.find_elements(By.TAG_NAME, value="li")

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
            "return arguments[0].firstChild.textContent;", item
        ).strip()
        ct = ""
        for c in countries:
            if c in title:
                ct = c

        latest_id_list.append({"id": id, "title": title, "date": date, "country": ct})

except Exception as e:
    print(e)
    print("fail")

driver.close()


def findDisease(title):
    diseases = []
    for disease in diseasesList:
        search = re.search(disease["name"], title, re.IGNORECASE)
        if search:
            diseases.append(search[0])
    if diseases == []:
        return ["unknown"]
    return diseases


# for each id in the list get the article data
count = 0
for element in latest_id_list:
    diseasesList = [
        {"name": "unknown"},
        {"name": "other"},
        {"name": "anthrax cutaneous"},
        {"name": "anthrax gastrointestinous"},
        {"name": "anthrax inhalation"},
        {"name": "botulism"},
        {"name": "brucellosis"},
        {"name": "chikungunya"},
        {"name": "cholera"},
        {"name": "cryptococcosis"},
        {"name": "cryptosporidiosis"},
        {"name": "crimean-congo haemorrhagic fever"},
        {"name": "dengue"},
        {"name": "diphteria"},
        {"name": "ebola haemorrhagic fever"},
        {"name": "ehec (e.coli)"},
        {"name": "enterovirus 71 infection"},
        {"name": "influenza a/h5n1"},
        {"name": "influenza a/h7n9"},
        {"name": "influenza a/h9n2"},
        {"name": "influenza a/h1n1"},
        {"name": "influenza a/h1n2"},
        {"name": "influenza a/h3n5"},
        {"name": "influenza a/h3n2"},
        {"name": "influenza a/h2n2"},
        {"name": "hand, foot and mouth disease"},
        {"name": "hantavirus"},
        {"name": "hepatitis a"},
        {"name": "hepatitis b"},
        {"name": "hepatitis c"},
        {"name": "hepatitis d"},
        {"name": "hepatitis e"},
        {"name": "histoplasmosis"},
        {"name": "hiv/aids"},
        {"name": "lassa fever"},
        {"name": "malaria"},
        {"name": "marburg virus disease"},
        {"name": "measles"},
        {"name": "mers-cov"},
        {"name": "mumps"},
        {"name": "nipah virus"},
        {"name": "norovirus infection"},
        {"name": "pertussis"},
        {"name": "plague"},
        {"name": "pneumococcus pneumonia"},
        {"name": "poliomyelitis"},
        {"name": "q fever"},
        {"name": "rabies"},
        {"name": "rift valley fever"},
        {"name": "rotavirus infection"},
        {"name": "rubella"},
        {"name": "salmonellosis"},
        {"name": "sars"},
        {"name": "shigellosis"},
        {"name": "smallpox"},
        {"name": "staphylococcal enterotoxin b"},
        {"name": "thypoid fever"},
        {"name": "tuberculosis"},
        {"name": "tularemia"},
        {"name": "vaccinia and cowpox"},
        {"name": "varicella"},
        {"name": "west nile virus"},
        {"name": "yellow fever"},
        {"name": "yersiniosis"},
        {"name": "zika"},
        {"name": "legionares"},
        {"name": "listeriosis"},
        {"name": "monkeypox"},
        {"name": "COVID-19"},
    ]
    if count == 1:
        break
    driver1 = webdriver.Chrome(ChromeDriverManager().install())

    wait = WebDriverWait(driver1, 10)
    fail = True
    driver1.get(
        f"https://promedmail.org/promed-post/?place={element['id']}#promedmailmap"
    )
    while fail:
        try:
            wait.until(
                EC.presence_of_element_located(
                    (By.XPATH, '//*[@id="main"]/div/div/div[4]/div')
                )
            )
            fail = False
        except:
            print("failed fetching article")
            driver1.get(
                f"https://promedmail.org/promed-post/?place={element['id']}#promedmailmap"
            )

    try:
        published_date = driver1.find_element(
            By.XPATH, '//*[@id="main"]/div/div/div[4]/p/text()[1]'
        )
        # print(f"The published date on promed {published_date.text}")
        element["published_date"] = published_date.text
    except Exception as e:
        element["published_date"] = ""
        print(e)
    try:
        day = driver1.find_element(
            By.XPATH, '//*[@id="main"]/div/div/div[4]/div/text()[6]'
        )
        # print(f"The date of the case being reported {day.text}")
        element["date"] = day.text
    except Exception as e:
        element["date"] = ""
        print(e)
    try:
        main_text = driver1.find_element(By.XPATH, '//*[@id="main"]/div/div/div[4]/div')
        # mt = re.search('A ProMED-mail post(.*)Mod.TYProMED',
        #                main_text.text).group(1)
        # print(f"The main text is {mt}")
        print(f"the main text is : {main_text.text}")
        element["main"] = main_text.text
        # if mt:
        #     element['main'] = mt
        # else:
        #     element['main'] = main_text.text
    except Exception as e:
        element["main"] = ""
        print(e)
    try:
        original_source = driver1.find_element(
            By.XPATH, '//*[@id="main"]/div/div/div[4]/div/a[3]'
        )
        # print(f"The original source is {original_source.text}")
        element["original_source"] = original_source.text

    except Exception as e:
        element["original_source"] = ""
        print(e)

    a = {
        "date_of_publication": element["published_date"],
        "headline": element["title"],
        "id": element["id"],
        "main_text": element["main"],
        "reports": [],
        "url": element["original_source"],
    }
    diseases = findDisease(a["headline"])
    #
    articleRef = db.collection("articles").document(element["id"])
    diseaseRefList = []
    print("DISEASES", diseases)
    for disease in diseases:
        diseaseref = db.collection("diseases").document(disease)
        if diseaseref.get().exists:
            diseaseRefList.append(diseaseref)
        else:
            db.collection("diseases").document(disease).set(
                {
                    "diseaseName": disease,
                    "id": len(db.collection("diseases").get()),
                    "reports": [],
                    "syndromes": [],
                }
            )
            diseaseRefList.append(db.collection("diseases").document(disease))

    # Now we create our report, which takes our diseases reference list
    countrycode = pycountry.countries.search_fuzzy(element["country"])[0].alpha_2
    report = {
        "article": articleRef,
        "cases": 0,
        "diseases": diseaseRefList,
        "event_date": element["published_date"],
        "locations": [db.collection("countries").document(countrycode)],
    }

    db.collection("reports").document(element["id"]).set(report)
    a["reports"].append(db.collection("reports").document(id))
    db.collection("articles").document(element["id"]).set(a)
    # Get the country list of articles and add our article to it.
    updated_country = (
        db.collection("countries")
        .document(countrycode)
        .update(
            {
                "articles": firestore.ArrayUnion(
                    [db.collection("articles").document(element["id"])]
                )
            }
        )
    )
    # Get the diseases list of reports, add our report to it
    for disease in diseases:
        diseaseref = (
            db.collection("diseases")
            .document(disease)
            .update(
                {
                    "reports": firestore.ArrayUnion(
                        [db.collection("reports").document(element["id"])]
                    )
                }
            )
        )

    driver1.close()
    count += 1
