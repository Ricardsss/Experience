from flask import Flask, jsonify, request
from flask_cors import CORS
import os

# Start the app and setup the static directory for the html, css, and js files.
app = Flask(__name__, static_url_path='', static_folder='static')
CORS(app)

# This is your 'database' of scripts with their blocking info.
# You can store python dictionaries in the format you decided on for your JSON
   # parse the text files in script_data to create these objects - do not send the text
   # files to the client! The server should only send structured data in the sallest format necessary.
scripts = []

### DO NOT modify this route ###
@app.route('/')
def hello_world():
    return 'Theatre Blocking root route'

### DO NOT modify this example route. ###
@app.route('/example')
def example_block():
    example_script = "O Romeo, Romeo, wherefore art thou Romeo? Deny thy father and refuse thy name. Or if thou wilt not, be but sworn my love And I’ll no longer be a Capulet."

    # This example block is inside a list - not in a dictionary with keys, which is what
    # we want when sending a JSON object with multiple pieces of data.
    return jsonify([example_script, 0, 41, 4])


''' Modify the routes below accordingly to 
parse the text files and send the correct JSON.'''

## GET route for script and blocking info
@app.route('/script/<int:script_id>')
def script(script_id):
    # right now, just sends the script id in the URL
    scripts_path = os.path.dirname(os.path.realpath(__file__)) + "/script_data"
    actors_file = os.path.dirname(os.path.realpath(__file__)) + "/actors.csv"
    actors = dict()
    with open(actors_file) as csv_f:
        csv_lines = [line.rstrip('\n') for line in csv_f]

    for l in range(len(csv_lines)):
        actors[l + 1] = csv_lines[l].split(",")[1]

    for k in range(len(scripts)):
        if scripts[k]["script_id"] == script_id:
            return jsonify(scripts[k])

    for filename in os.listdir(scripts_path):
        if filename.endswith(".txt"):
            with open(scripts_path + "/" + filename) as f:
                lines = [line.rstrip('\n') for line in f]
                if lines[0] == str(script_id):
                    script = dict()
                    script["script_id"] = int(lines[0])
                    script["lines"] = lines[2]
                    parts = dict()
                    part = 1
                    for i in range(4, len(lines)):
                        details = lines[i].split(". ")[1].split(", ")
                        blocking = dict()
                        blocking["start_char"] = int(details[0])
                        blocking["end_char"] = int(details[1])
                        actor = 1
                        for j in range(2, len(details)):
                            description = dict()
                            description["actor"] = details[j].split("-")[0]
                            description["block"] = int(details[j].split("-")[1])
                            blocking[str(actor)] = description
                            actor += 1
                        if actor <= len(actors):
                            for a in range(actor - 1, len(actors)):
                                description = dict()
                                description["actor"] = actors[actor]
                                description["block"] = 0
                                blocking[str(actor)] = description
                        parts[str(part)] = blocking
                        part += 1
                    script["parts"] = parts
                    script["actors"] = actors
                    if script not in scripts:
                        scripts.append(script)

    return jsonify(script)

## POST route for replacing script blocking on server
# Note: For the purposes of this assignment, we are using POST to replace an entire script.
# Other systems might use different http verbs like PUT or PATCH to replace only part
# of the script.
@app.route('/script', methods=['POST'])
def addBlocking():
    # right now, just sends the original request json
    script_num = request.json["scriptNum"]
    blocking = request.json["blocking"]
    scripts_path = os.path.dirname(os.path.realpath(__file__)) + "/script_data"
    for filename in os.listdir(scripts_path):
        if filename.endswith(".txt"):
            with open(scripts_path + "/" + filename) as f:
                lines = [line.rstrip('\n') for line in f]
                if lines[0] == str(script_num):
                    return jsonify(script_num)
    return jsonify(blocking)



if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host='0.0.0.0', debug=True, port=os.environ.get('PORT', 80))

