from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re
# from requests_html import HTMLSession
# session = HTMLSession()

url1 = "https://promedmail.org"
postid = 0
url2 = "https://promedmail.org/promed-post/?place="


driver = webdriver.Safari()
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


# get all the ids of the latest posts
try:
    print("fetching latest list")
    wait.until(EC.presence_of_element_located((By.XPATH, "//a[@class='lcl']")))
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

        latest_id_list.append({'id': id, 'title': title, 'date': date})
        print({'id': id, 'title': title, 'date': date})

        num += 1

except Exception as e:
    print(e)
    print("fail")
    print(latest_id_list)
    driver.close()
    exit(1)





# TODO for each id in the list get the article data





driver.close()
