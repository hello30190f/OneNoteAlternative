#!/bin/bash
pip install -r requirements.txt
python -u main.py --loadExtension
python -u main.py --startServer
