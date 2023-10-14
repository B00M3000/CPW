#
# Created on Fri Oct 13 2023
#
# Copyright (c) 2023 Thomas Zhou
#

import csv
import json


def csvToJson(csvFile, jsonFile):
    data = []

    with open(csvFile, 'r') as csvFile:
        csv_reader = csv.DictReader(csvFile)
        for row in csv_reader:
            data.append(row)


    with open(jsonFile, 'w') as jsonFile:
        json.dump(data, jsonFile, indent=4)


csvToJson("raw-data/project19.csv", "src/client/data/projects19.json")