# Yente Stor
# University of Amsterdam
# Student Number: 10676643
# https://stackoverflow.com/questions/19697846/python-csv-to-json

import csv
import json

csvfile = open('suicide_data.csv', 'r')
jsonfile = open('suicide_data.json', 'w')

fieldnames = ("country","male","female")

# dictionairy formatting of csv data
reader = csv.DictReader(csvfile, fieldnames)

# put all rows in list (so they are automatically comma seperated)
lijst = []
for row in reader:
    lijst.append(row)
# indent 4 for automatic json formatting
json.dump(lijst, jsonfile, indent = 4)
