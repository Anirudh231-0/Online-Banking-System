from flask import Flask
from database import get_db_connection

app = Flask(__name__)


@app.route("/")
def home():

    try:
        connection = get_db_connection()

        if connection.is_connected():
            return "<h2>Database Connected Successfully!</h2>"

    except Exception as e:
        return f"Database Connection Failed:<br>{e}"

    finally:
        if 'connection' in locals() and connection.is_connected():
            connection.close()


if __name__ == "__main__":
    app.run(debug=True)