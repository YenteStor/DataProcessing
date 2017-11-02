#!/usr/bin/env python
# Name: Yente Stor
# Student number: 10676643
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
TEEEEEEEST
'''
import csv

from pattern.web import URL, DOM, plaintext

TARGET_URL = URL("http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series")
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

dom = DOM(TARGET_URL.download(cached=True))

def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).
    '''
    
    mother_list = []
    for e in dom.by_class("lister-item-content"):
        actors = ""
        for i in range(len(e.by_tag("p"))):
            actors += e.by_tag("p")[2].by_tag("a")[i].content.encode('utf-8')
            if i != (len(e.by_tag("p"))-1):
                actors += ", "

        contents = []
        # Title
        contents.append(e.by_class("lister-item-header")[0].by_tag("a")[0].content.encode('utf-8'))

        # Rating
        contents.append(e.by_class("ratings-bar")[0].by_class("inline-block ratings-imdb-rating")[0].by_tag("strong")[0].content.encode('utf-8'))

        # Genre
        contents.append(e.by_class("text-muted")[1].by_class("genre")[0].content.encode('utf-8').strip(" ").strip("\n"))

        # Actors
        contents.append(actors)

        # Runtime
        contents.append(e.by_class("text-muted")[1].by_class("runtime")[0].content.encode('utf-8'))

        mother_list.extend([contents])

    return mother_list 


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    
    for row in tvseries:
        writer.writerow(row)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
