import os
import json
import gspread
import random
import string
from flask import Flask, request, jsonify, send_from_directory
from oauth2client.service_account import ServiceAccountCredentials
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

app = Flask(__name__, static_url_path='', static_folder='.')

# --- Passcode Generation ---
def generate_passcode(worker_id):
    """
    Generates a unique passcode for the participant.
    """
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    
    # Format worker_id part gracefully
    try:
        worker_id_int = int(worker_id)
        id_part = f"W{worker_id_int:02d}"
    except (ValueError, TypeError):
        id_part = str(worker_id)

    return f"EXP1-{id_part}-{suffix}"

# --- Google Sheets Integration ---

def get_google_creds():
    """
    Authenticates with Google using service account credentials.
    """
    service_account_json = os.getenv("SERVICE_ACCOUNT_JSON")
    if service_account_json:
        creds_dict = json.loads(service_account_json)
        scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
        creds = ServiceAccountCredentials.from_json_keyfile_dict(creds_dict, scope)
        return gspread.authorize(creds)
    else:
        print("Error: Google service account credentials not found in .env file.")
        return None

def upload_to_google_drive(user_id, passcode, responses):
    """
    Uploads a list of response data for a given user to the specified Google Sheet.
    """
    try:
        client = get_google_creds()
        if not client:
            raise Exception("Failed to authenticate with Google.")

        sheet_name = os.getenv("GOOGLE_SHEET_NAME", "EXP1-main")

        try:
            sheet = client.open(sheet_name).sheet1
        except gspread.exceptions.SpreadsheetNotFound:
            sheet = client.create(sheet_name).sheet1
            # Add new columns to the header
            sheet.append_row(["worker_id", "passcode", "timestamp", "sample_index", "uq_index", "keyword", "user_choice", "correct_answer", "is_correct", "response_time_sec"])

        # Format data for appending
        rows_to_append = [
            [
                user_id,
                passcode,
                res.get("timestamp", ""),
                res.get("sample_index", ""),
                res.get("uq_index", ""),
                res.get("keyword", ""),
                res.get("user_choice", ""),
                res.get("correct_answer", ""),
                res.get("is_correct", ""),
                res.get("response_time_sec", "")
            ] for res in responses
        ]

        sheet.append_rows(rows_to_append, value_input_option='USER_ENTERED')

        print(f"✅ Responses for user '{user_id}' recorded successfully with passcode {passcode}.")
        return True, "Data saved successfully."
    except Exception as e:
        print(f"Error uploading to Google Drive: {str(e)}")
        return False, str(e)


# --- API Endpoints ---

@app.route('/api/save-results', methods=['POST'])
def save_results():
    """
    API endpoint to receive experiment data, generate passcode, and save everything.
    """
    data = request.json
    if not data:
        return jsonify({"status": "error", "message": "No data received."}), 400

    user_id = data.get('userId')
    responses = data.get('responses')

    if not user_id or not responses:
        return jsonify({"status": "error", "message": "Missing 'userId' or 'responses' in request."}), 400

    # Generate the passcode
    passcode = generate_passcode(user_id)
    
    # Save data along with the passcode
    success, message = upload_to_google_drive(user_id, passcode, responses)

    if success:
        # Return the passcode to the frontend
        return jsonify({"status": "success", "message": message, "passcode": passcode})
    else:
        return jsonify({"status": "error", "message": f"Server error: {message}"}), 500

# --- Serve Frontend ---

@app.route('/')
def root():
    """
    Serves the main index.html file.
    """
    return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    app.run(port=5000, debug=True)
