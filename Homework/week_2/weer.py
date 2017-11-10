# Name: Yente Stor
# Student number: 10676643

# python3 -m http.server 8080
# runnen wanneer de je in de dataprocessing directory zit (niet templates!)

import os
from flask import Flask, render_template

app = Flask(__name__)

# @app.route('/')
# @app.route('/hello/')
# @app.route('/hello/<name>')
# def hello(name=None):
#     return render_template('weer.html', name=name)

app.run(host=os.getenv('IP', '0.0.0.0'),port=int(os.getenv('PORT', 8080)))

