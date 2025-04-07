import json
import os
import hashlib
import requests
from flask import render_template, redirect, request, send_file, flash, url_for, jsonify
from werkzeug.utils import secure_filename
from app import app
from timeit import default_timer as timer

# Stores all the post transaction in the node
request_tx = []
# store filename
files = {}
# destiantion for upload files
UPLOAD_FOLDER = "app/static/Uploads"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# store address
ADDR = "http://127.0.0.1:8800"

# Set a secret key for flash messages
app.secret_key = 'blockchain_image_auth_key'


# Calculate SHA-256 hash of an image file
def calculate_hash(file_path):
    """Calculate SHA-256 hash of an image file"""
    hash_sha256 = hashlib.sha256()
    with open(file_path, 'rb') as f:
        # Read and update hash in chunks for memory efficiency
        for byte_block in iter(lambda: f.read(4096), b""):
            hash_sha256.update(byte_block)
    return hash_sha256.hexdigest()


# create a list of requests that peers has send to upload files
def get_tx_req():
    global request_tx
    chain_addr = "{0}/chain".format(ADDR)
    resp = requests.get(chain_addr)
    if resp.status_code == 200:
        content = []
        chain = json.loads(resp.content.decode())
        for block in chain["chain"]:
            for trans in block["transactions"]:
                trans["index"] = block["index"]
                trans["hash"] = block["prev_hash"]
                content.append(trans)
        request_tx = sorted(content, key=lambda k: k["hash"], reverse=True)


# Loads and runs the home page
@app.route("/")
def index():
    get_tx_req()
    return render_template("index.html", title="FileStorage",
                           subtitle="A Decentralized Network for File Storage/Sharing", node_address=ADDR,
                           request_tx=request_tx)


@app.route("/submit", methods=["POST"])
# When new transaction is created it is processed and added to transaction
def submit():
    start = timer()
    user = request.form["user"]
    up_file = request.files["v_file"]

    # Save the uploaded file in destination
    filename = secure_filename(up_file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    up_file.save(file_path)

    # Add the file to the list to create a download link
    files[filename] = os.path.join(app.root_path, "static", "Uploads", filename)

    # Calculate the hash of the uploaded image
    image_hash = calculate_hash(file_path)

    # Determines the size of the file uploaded in bytes
    file_states = os.stat(files[filename]).st_size

    # Create a transaction object
    post_object = {
        "user": user,  # username
        "v_file": filename,  # filename
        "file_data": str(up_file.stream.read()),  # file data
        "file_size": file_states,  # file size
        "image_hash": image_hash  # Add image hash to transaction
    }

    # Submit a new transaction
    address = "{0}/new_transaction".format(ADDR)
    response = requests.post(address, json=post_object)

    if response.status_code == 400:
        # Image has been tampered with
        try:
            error_data = response.json()
            flash(f"Error: {error_data['message']}", "error")
        except:
            flash("Error: The image appears to have been tampered with!", "error")
        return redirect("/")

    end = timer()
    print(end - start)
    flash("Image uploaded successfully!", "success")
    return redirect("/")


# creates a download link for the file
@app.route("/submit/<string:variable>", methods=["GET"])
def download_file(variable):
    p = files[variable]
    return send_file(p, as_attachment=True)


# New endpoint for AJAX mining
@app.route("/mine_ajax", methods=["GET"])
def mine_ajax():
    # Call the mining endpoint
    mine_addr = "{0}/mine".format(ADDR)
    response = requests.get(mine_addr)

    if response.status_code == 200:
        response_text = response.text

        # Check if mining was successful
        if "successfully" in response_text:
            # Update our transaction list
            get_tx_req()
            return jsonify({
                "success": True,
                "message": response_text
            })
        else:
            return jsonify({
                "success": False,
                "message": response_text
            })
    else:
        return jsonify({
            "success": False,
            "message": "Error communicating with blockchain node"
        })


# New endpoint to get updated uploaded files
@app.route("/get_uploaded_files", methods=["GET"])
def get_uploaded_files():
    get_tx_req()
    return jsonify({
        "files": request_tx
    })