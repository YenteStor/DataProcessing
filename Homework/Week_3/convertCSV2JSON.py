# Yente Stor
# University of Amsterdam
# Student Number: 10676643
# https://stackoverflow.com/questions/19697846/python-csv-to-json

import csv
import json

csvfile = open('data.csv', 'r')
jsonfile = open('data.json', 'w')
fieldnames = ("Date","Neerslag")

# dictionairy formatting of csv data
reader = csv.DictReader(csvfile, fieldnames)

# puts readers elements in jsonfile (in rowstyle)
# jsonfile.write('{"data":[\n')
# counter = 0
lijst = []
for row in reader:
    lijst.append(row)
json.dump(lijst,jsonfile,indent=4)
