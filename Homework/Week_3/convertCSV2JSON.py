# Yente Stor
# University of Amsterdam
# Student Number: 10676643
# https://stackoverflow.com/questions/19697846/python-csv-to-json

import csv
import json

csvfile = open('Inwoners-van-15-jaar-en-ouder-die-dagelijks-roken-2012--16-05-30.csv', 'r')
jsonfile = open('data.json', 'w')

fieldnames = ("Land","Rokers")

# dictionairy formatting of csv data
reader = csv.DictReader(csvfile, fieldnames)

# put all rows in list (so they are automatically comma seperated)
lijst = []
for row in reader:
    lijst.append(row)
# indent 4 for automatic json formatting
json.dump(lijst, jsonfile, indent = 4)
