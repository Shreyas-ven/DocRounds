from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from datetime import datetime, timezone
import os
import random

app = Flask(__name__)
CORS(app)

# MongoDB
app.config["MONGO_URI"] = "mongodb+srv://shreyasvbangera_db_user:roiKaCaedbFbshRH@cluster0.tgurg51.mongodb.net/docrRoundsDB?retryWrites=true&w=majority"
mongo = PyMongo(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Generate Hospital ID
def generate_hospital_id():
    return f"HOSP-{random.randint(100000, 999999)}"


# -------------------- HOSPITAL REGISTER --------------------
@app.route("/api/hospital/register", methods=["POST"])
def register_hospital():
    try:
        data = request.form

        hospital_id = generate_hospital_id()
        hashed_password = generate_password_hash(data.get("password"))

        hospital = {
            "hospital_id": hospital_id,
            "hospitalName": data.get("hospitalName"),
            "managerNumber": data.get("managerNumber"),
            "location": data.get("location"),
            "icuWards": data.get("icuWards"),
            "generalWards": data.get("generalWards"),
            "medicalShop": data.get("medicalShop"),
            "ownerAadhar": data.get("ownerAadhar"),
            "password": hashed_password,
            "status": "PENDING",
            "verifiedByAdmin": False,
            "createdAt": datetime.now(timezone.utc)
        }

        license_image = request.files.get("licenseImage")
        hospital_image = request.files.get("hospitalImage")

        if license_image:
            license_path = os.path.join(UPLOAD_FOLDER, license_image.filename)
            license_image.save(license_path)
            hospital["licenseImage"] = license_image.filename

        if hospital_image:
            hospital_path = os.path.join(UPLOAD_FOLDER, hospital_image.filename)
            hospital_image.save(hospital_path)
            hospital["hospitalImage"] = hospital_image.filename

        mongo.db.hospitalLogin.insert_one(hospital)

        return jsonify({
            "message": "Hospital registered successfully",
            "hospital_id": hospital_id
        }), 201

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"message": "Server error"}), 500


# -------------------- ADMIN LOGIN --------------------
@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.json

    if data.get("email") == "alphadeveloper9@gmail.com" and data.get("password") == "admin123":
        return jsonify({"message": "Admin login success"}), 200

    return jsonify({"message": "Invalid credentials"}), 401


# -------------------- GET ALL HOSPITALS --------------------
@app.route("/api/admin/hospitals", methods=["GET"])
def get_all_hospitals():
    try:
        hospitals = list(mongo.db.hospitalLogin.find({}, {"_id": 0}))
        return jsonify(hospitals), 200
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"message": "Failed to fetch hospitals"}), 500


# -------------------- GET SINGLE HOSPITAL --------------------
@app.route("/api/admin/hospital/<hospital_id>", methods=["GET"])
def get_hospital(hospital_id):
    hospital = mongo.db.hospitalLogin.find_one(
        {"hospital_id": hospital_id}, {"_id": 0}
    )
    return jsonify(hospital), 200


# -------------------- APPROVE HOSPITAL --------------------
@app.route("/api/admin/hospital/approve/<hospital_id>", methods=["PUT"])
def approve_hospital(hospital_id):
    mongo.db.hospitalLogin.update_one(
        {"hospital_id": hospital_id},
        {"$set": {"status": "APPROVED", "verifiedByAdmin": True}}
    )
    return jsonify({"message": "Hospital approved"}), 200


# -------------------- DELETE HOSPITAL --------------------
@app.route("/api/admin/hospital/delete/<hospital_id>", methods=["DELETE"])
def delete_hospital(hospital_id):
    mongo.db.hospitalLogin.delete_one({"hospital_id": hospital_id})
    return jsonify({"message": "Hospital deleted"}), 200


# -------------------- GET EMERGENCY HOSPITALS --------------------
@app.route("/api/emergency/hospitals", methods=["GET"])
def get_emergency_hospitals():
    hospitals = list(
        mongo.db.emergencyHospitals.find(
            {},
            {"_id": 0}
        )
    )
    return jsonify(hospitals), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
