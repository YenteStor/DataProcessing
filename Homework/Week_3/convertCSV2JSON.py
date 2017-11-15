# Yente Stor
# University of Amsterdam
# Student Number: 10676643
# https://stackoverflow.com/questions/19697846/python-csv-to-json

import csv
import json

csvfile = open('data.csv', 'r')
jsonfile = open('data.json', 'w')
fieldnames = ("Date","Etmaalsom van de Neerslag(in 0.1mm)")
reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write('\n')
