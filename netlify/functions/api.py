import os
import sys

# Add the root of your project to the sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from routes import handler as flask_handler

def handler(event, context):
    return flask_handler(event, context)