from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from datetime import datetime, timezone
from werkzeug.security import check_password_hash
from bson import ObjectId

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

# -------------------- GET INSURANCE PROVIDERS --------------------
@app.route("/api/insurance-providers", methods=["GET"])
def get_insurance_providers():
    providers = list(mongo.db.insuranceProviders.find({}, {"_id": 0}))
    return jsonify(providers), 200

# -------------------- HOSPITAL LOGIN --------------------
@app.route("/api/hospital/login", methods=["POST"])
def hospital_login():
    try:
        data = request.json
        hospital_id = data.get("hospitalId")
        password = data.get("password")

        hospital = mongo.db.hospitalLogin.find_one(
            {"hospital_id": hospital_id}
        )

        # 1️⃣ Hospital not found
        if not hospital:
            return jsonify({
                "success": False,
                "message": "Hospital not found. Please register first."
            }), 404

        # 2️⃣ Not approved
        if hospital.get("status") != "APPROVED" or not hospital.get("verifiedByAdmin"):
            return jsonify({
                "success": False,
                "message": f"Hospital status: {hospital.get('status')}. Please wait for admin approval."
            }), 403

        # 3️⃣ Password check
        if not check_password_hash(hospital["password"], password):
            return jsonify({
                "success": False,
                "message": "Invalid credentials"
            }), 401

        # 4️⃣ Success
        return jsonify({
            "success": True,
            "message": "Hospital login successful",
            "hospital_id": hospital["hospital_id"]
        }), 200

    except Exception as e:
        print("LOGIN ERROR:", e)
        return jsonify({
            "success": False,
            "message": "Server error"
        }), 500


# -------------------- GET HOSPITAL DETAILS --------------------
@app.route("/api/hospital/<hospital_id>", methods=["GET"])
def get_hospital_details(hospital_id):
    hospital = mongo.db.hospitalLogin.find_one(
        {"hospital_id": hospital_id},
        {"_id": 0, "password": 0}  # hide password
    )

    if not hospital:
        return jsonify({"message": "Hospital not found"}), 404

    return jsonify(hospital), 200


# -------------------- UPDATE HOSPITAL DETAILS --------------------
@app.route("/api/hospital/update/<hospital_id>", methods=["PUT"])
def update_hospital(hospital_id):
    try:
        data = request.json

        update_fields = {}

        allowed_fields = [
            "hospitalName",
            "managerNumber",
            "location",
            "icuWards",
            "generalWards",
            "medicalShop"
        ]

        for field in allowed_fields:
            if field in data and data[field] is not None:
                update_fields[field] = data[field]

        if not update_fields:
            return jsonify({"message": "No valid fields to update"}), 400

        result = mongo.db.hospitalLogin.update_one(
            {"hospital_id": hospital_id},
            {"$set": update_fields}
        )

        if result.matched_count == 0:
            return jsonify({"message": "Hospital not found"}), 404

        return jsonify({"message": "Hospital details updated successfully"}), 200

    except Exception as e:
        print("UPDATE ERROR:", e)
        return jsonify({"message": "Server error"}), 500


# -------------------- ADD DOCTOR --------------------
@app.route("/api/hospital/<hospital_id>/add-doctor", methods=["POST"])
def add_doctor(hospital_id):
    try:
        data = request.json

        doctor = {
            "hospital_id": hospital_id,
            "name": data.get("name"),
            "qualification": data.get("qualification"),
            "specialty": data.get("specialty"),
            "experience": data.get("experience"),
            "languages": data.get("languages"),
            "credentials": data.get("credentials"),
            "createdAt": datetime.now(timezone.utc)
        }

        result = mongo.db.doctors.insert_one(doctor)

        doctor["_id"] = str(result.inserted_id)

        return jsonify({
            "message": "Doctor added successfully",
            "doctor": doctor
        }), 201

    except Exception as e:
        print("ADD DOCTOR ERROR:", e)
        return jsonify({"message": "Server error"}), 500

# -------------------- GET DOCTORS --------------------
@app.route("/api/hospital/<hospital_id>/doctors", methods=["GET"])
def get_doctors(hospital_id):
    try:
        limit = int(request.args.get("limit", 0))

        cursor = mongo.db.doctors.find(
            {"hospital_id": hospital_id},
            {"hospital_id": 0}
        ).sort("createdAt", -1)

        if limit > 0:
            cursor = cursor.limit(limit)

        doctors = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            doctors.append(doc)

        return jsonify(doctors), 200

    except Exception as e:
        print("GET DOCTORS ERROR:", e)
        return jsonify([]), 500


# -------------------- UPDATE DOCTOR --------------------
@app.route("/api/doctor/update/<doctor_id>", methods=["PUT"])
def update_doctor(doctor_id):
    data = request.json

    mongo.db.doctors.update_one(
        {"_id": ObjectId(doctor_id)},
        {"$set": {
            "name": data.get("name"),
            "qualification": data.get("qualification"),
            "specialty": data.get("specialty"),
            "experience": data.get("experience"),
            "languages": data.get("languages"),
            "credentials": data.get("credentials")
        }}
    )

    return jsonify({"message": "Doctor updated successfully"}), 200

# -------------------- DELETE DOCTOR --------------------
@app.route("/api/doctor/delete/<doctor_id>", methods=["DELETE"])
def delete_doctor(doctor_id):
    mongo.db.doctors.delete_one({"_id": ObjectId(doctor_id)})
    return jsonify({"message": "Doctor deleted successfully"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
