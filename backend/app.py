from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token
from pathlib import Path
import random
from datetime import datetime

BASE_DIR = Path(__file__).resolve().parent.parent

app = Flask(
    __name__,
    static_folder=str(BASE_DIR / 'frontend' / 'dist'),
    static_url_path='/'
)

CORS(app)

app.config['SECRET_KEY'] = 'secret-key'
app.config['JWT_SECRET_KEY'] = 'jwt-secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///signals.db'

db = SQLAlchemy(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins='*')


class MacroSignal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event = db.Column(db.String(50))
    bias = db.Column(db.String(50))
    confidence = db.Column(db.Integer)
    actual = db.Column(db.Float)
    forecast = db.Column(db.Float)
    previous = db.Column(db.Float)
    timestamp = db.Column(db.String(100))


with app.app_context():
    db.create_all()


def generate_event(name):
    bullish = random.choice([True, False])

    return {
        "event": name,
        "actual": round(random.uniform(2.5, 4.5), 2),
        "forecast": 3.2,
        "previous": 3.0,
        "bias": "BULLISH_USD" if bullish else "BEARISH_USD",
        "confidence": random.randint(70, 95),
        "strength": random.choice(["MODERATE", "STRONG"]),
        "context": f"{name} macroeconomic release analysis.",
        "dxy_est": "+0.6%",
        "gold_est": "-0.8%",
        "key_risk": "Unexpected macroeconomic reversal.",
        "shock_sigma": round(random.uniform(1.0, 5.0), 1),
        "timestamp": datetime.utcnow().isoformat()
    }


@app.route('/api/events')
def events():
    data = [
        generate_event("CPI"),
        generate_event("NFP"),
        generate_event("CPI")
    ]

    return jsonify(data)


@app.route('/manual/CPI')
def cpi():
    return jsonify(generate_event("CPI"))


@app.route('/manual/NFP')
def nfp():
    return jsonify(generate_event("NFP"))


@app.route('/login', methods=['POST'])
def login():
    data = request.json

    if data.get('username') == 'admin' and data.get('password') == 'admin123':
        token = create_access_token(identity='admin')

        return jsonify({
            "access_token": token
        })

    return jsonify({"error": "Invalid credentials"}), 401


@app.route('/')
@app.route('/home')
@app.route('/index')
def serve():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/<path:path>')
def static_proxy(path):
    file_path = Path(app.static_folder) / path

    if file_path.exists():
        return send_from_directory(app.static_folder, path)

    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
