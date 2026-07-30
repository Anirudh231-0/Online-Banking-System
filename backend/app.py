import os
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from database import get_db_connection
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enables cross-origin requests from HTML/CSS/JS frontend


# ---------------------------------------------------------
# 1. HTML Page Routes (Rendering Templates)
# ---------------------------------------------------------
@app.route("/")
def home():
    """Serves the sign-in / registration page."""
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    """Serves the user dashboard page."""
    return render_template("dashboard.html")


# ---------------------------------------------------------
# 2. Database Connection Health Check Route
# ---------------------------------------------------------
@app.route("/api/db-check", methods=['GET'])
def db_check():
    """Dedicated route to verify database connection."""
    try:
        connection = get_db_connection()
        if connection.is_connected():
            return jsonify({
                "status": "success",
                "message": "Database Connected Successfully to online_banking_system!"
            }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Database Connection Failed: {str(e)}"
        }), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            connection.close()


# ---------------------------------------------------------
# 3. Authentication Routes
# ---------------------------------------------------------
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    full_name = data.get('full_name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')  # In production, hash this using werkzeug.security
    account_number = data.get('account_number')

    if not all([full_name, email, password, account_number]):
        return jsonify({'error': 'Missing required fields'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """INSERT INTO users (full_name, email, phone, password_hash, account_number) 
               VALUES (%s, %s, %s, %s, %s)""",
            (full_name, email, phone, password, account_number)
        )
        conn.commit()
        return jsonify({'message': 'User registered successfully!'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/api/login', methods=['POST'])
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    credential = data.get('email')  # Contains account_number, email, or phone
    password = data.get('password')

    if not credential or not password:
        return jsonify({'error': 'Please provide both credentials and password'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Check if the entered credential matches email OR account_number OR phone
    cursor.execute(
        """SELECT user_id, full_name, email, account_number, balance 
           FROM users 
           WHERE (email = %s OR account_number = %s OR phone = %s) 
             AND password_hash = %s""",
        (credential, credential, credential, password)
    )
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        return jsonify({'message': 'Login successful', 'user': user}), 200
    else:
        return jsonify({'error': 'Invalid credentials or password'}), 401


# ---------------------------------------------------------
# 4. User & Transaction Routes
# ---------------------------------------------------------
@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT user_id, full_name, email, phone, account_number, balance FROM users WHERE user_id = %s",
        (user_id,)
    )
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user), 200


@app.route('/api/transfer', methods=['POST'])
def transfer_funds():
    data = request.get_json()
    sender_id = data.get('sender_id')
    receiver_account = data.get('receiver_account')
    amount = data.get('amount')

    if not sender_id or not receiver_account or not amount or float(amount) <= 0:
        return jsonify({'error': 'Invalid request parameters'}), 400

    amount = float(amount)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # 1. Check Sender Balance
        cursor.execute("SELECT balance FROM users WHERE user_id = %s", (sender_id,))
        sender = cursor.fetchone()

        if not sender:
            return jsonify({'error': 'Sender account not found'}), 404
        if sender['balance'] < amount:
            return jsonify({'error': 'Insufficient balance'}), 400

        # 2. Find Receiver
        cursor.execute("SELECT user_id FROM users WHERE account_number = %s", (receiver_account,))
        receiver = cursor.fetchone()

        if not receiver:
            return jsonify({'error': 'Receiver account number not found'}), 404

        receiver_id = receiver['user_id']

        if sender_id == receiver_id:
            return jsonify({'error': 'Cannot transfer money to yourself'}), 400

        # 3. Update Balances
        cursor.execute("UPDATE users SET balance = balance - %s WHERE user_id = %s", (amount, sender_id))
        cursor.execute("UPDATE users SET balance = balance + %s WHERE user_id = %s", (amount, receiver_id))

        # 4. Log Transaction
        cursor.execute(
            """INSERT INTO transactions (sender_id, receiver_id, amount, transaction_type, status) 
               VALUES (%s, %s, %s, 'TRANSFER', 'SUCCESS')""",
            (sender_id, receiver_id, amount)
        )

        conn.commit()
        return jsonify({'message': f'Successfully transferred ${amount:.2f}'}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({'error': 'Transaction failed: ' + str(e)}), 500
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    app.run(debug=True, port=5000)