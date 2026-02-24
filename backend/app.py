from flask import Flask, request, jsonify
from twilio.rest import Client
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from datetime import datetime, timezone
from werkzeug.security import check_password_hash
from bson import ObjectId
import cloudinary
import cloudinary.uploader
import cloudinary.api


import os
import random

PATIENT_UPLOAD = "patient_uploads"
os.makedirs(PATIENT_UPLOAD, exist_ok=True)

cloudinary.config(
    cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINARY_API_KEY"),
    api_secret=os.environ.get("CLOUDINARY_API_SECRET")
)

TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER")

twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

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

        hospital = {
            "hospital_id": hospital_id,
            "hospitalName": data.get("hospitalName"),
            "managerNumber": data.get("managerNumber"),
            "location": data.get("location"),
            "icuWards": data.get("icuWards"),
            "generalWards": data.get("generalWards"),
            "medicalShop": data.get("medicalShop"),
            "ownerAadhar": data.get("ownerAadhar"),
            "password": generate_password_hash(data.get("password")),
            "status": "PENDING",
            "verifiedByAdmin": False,
            "createdAt": datetime.now(timezone.utc)
        }

        license_image = request.files.get("licenseImage")
        hospital_image = request.files.get("hospitalImage")

        if license_image:
            result = cloudinary.uploader.upload(
                license_image,
                folder="docrRounds/licenses"
            )
            hospital["licenseImage"] = result["secure_url"]

        if hospital_image:
            result = cloudinary.uploader.upload(
                hospital_image,
                folder="docrRounds/hospitals"
            )
            hospital["hospitalImage"] = result["secure_url"]

        mongo.db.hospitalLogin.insert_one(hospital)

        return jsonify({
            "message": "Hospital registered successfully",
            "hospital_id": hospital_id
        }), 201

    except Exception as e:
        print("REGISTER ERROR:", e)
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


# Generate Doctor ID
def generate_doctor_id():
    return f"DOC-{random.randint(100000, 999999)}"

# -------------------- ADD DOCTOR --------------------
@app.route("/api/hospital/<hospital_id>/add-doctor", methods=["POST"])
def add_doctor(hospital_id):
    try:
        data = request.json
        doctor_id = generate_doctor_id()

        doctor = {
             "doctorId": doctor_id, 
            "hospital_id": hospital_id,
            "name": data.get("name"),
            "qualification": data.get("qualification"),
            "specialty": data.get("specialty"),
            "experience": data.get("experience"),
            "languages": data.get("languages"),
            "credentials": data.get("credentials"),
            "password": generate_password_hash(data.get("password")),
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



# ================= BLOOD REQUIREMENTS =================

# -------------------- ADD BLOOD REQUIREMENT --------------------
@app.route("/api/blood/<hospital_id>/add", methods=["POST"])
def add_blood_requirement(hospital_id):
    try:
        data = request.json

        hospital = mongo.db.hospitalLogin.find_one(
            {"hospital_id": hospital_id},
            {"hospitalName": 1,
                "managerNumber": 1,
                "location": 1,
        })

        blood = {
            "hospital_id": hospital_id,
            "hospitalName": hospital.get("hospitalName"),
            "hospitalLocation": hospital.get("location"),      
            "managerNumber": hospital.get("managerNumber"),
            "patientName": data.get("patientName"),
            "patientId": data.get("patientId"),
            "disease": data.get("disease"),
            "bloodType": data.get("bloodType"),
            "units": data.get("units"),
            "requiredBeforedate": data.get("requiredBeforedate"),
            "requiredBeforetime": data.get("requiredBeforetime"),
            "donorName": "",
            "status": "OPEN",
            "createdAt": datetime.now(timezone.utc)
        }

        result = mongo.db.bloodRequirements.insert_one(blood)
        blood["_id"] = str(result.inserted_id)

        return jsonify(blood), 201

    except Exception as e:
        print("ADD BLOOD ERROR:", e)
        return jsonify({"message": "Server error"}), 500


# -------------------- GET ALL BLOOD REQUIREMENTS (PUBLIC) --------------------
@app.route("/api/blood/all", methods=["GET"])
def get_all_blood_requirements():
    try:
        data = mongo.db.bloodRequirements.find(
            {"status": "OPEN"}  # optional filter
        ).sort("createdAt", -1)

        result = []
        for d in data:
            d["_id"] = str(d["_id"])
            result.append(d)

        return jsonify(result), 200

    except Exception as e:
        print("GET ALL BLOOD ERROR:", e)
        return jsonify([]), 500



# -------------------- CLOSE BLOOD REQUIREMENT --------------------
@app.route("/api/blood/close/<blood_id>", methods=["PUT"])
def close_blood_requirement(blood_id):
    mongo.db.bloodRequirements.update_one(
        {"_id": ObjectId(blood_id)},
        {"$set": {"status": "CLOSED"}}
    )

    return jsonify({"message": "Blood requirement closed"}), 200


# -------------------- DELETE BLOOD REQUIREMENT --------------------
@app.route("/api/blood/delete/<blood_id>", methods=["DELETE"])
def delete_blood_requirement(blood_id):
    mongo.db.bloodRequirements.delete_one(
        {"_id": ObjectId(blood_id)}
    )

    return jsonify({"message": "Blood requirement deleted"}), 200


# -------------------- UPDATE DONOR DETAILS --------------------
@app.route("/api/blood/donate/<blood_id>", methods=["PUT"])
def update_donor_details(blood_id):
    try:
        data = request.json

        mongo.db.bloodRequirements.update_one(
            {"_id": ObjectId(blood_id)},
            {
                "$set": {
                    "donorName": data.get("donorName"),
                    "donorContact": data.get("donorContact"),
                    "status": "Donar Assigned"
                }
            }
        )

        return jsonify({"message": "Donor details updated"}), 200

    except Exception as e:
        print("DONOR UPDATE ERROR:", e)
        return jsonify({"message": "Server error"}), 500


@app.route("/api/patient/admit", methods=["POST"])
def admit_patient():
    try:
        data = request.form

        patient = {
            "patientId": data.get("patientId"),
            "patientName": data.get("patientName"),
            "disease": data.get("disease"),
            "doctorId": data.get("doctorId"),
            "guardianNumber": data.get("guardianNumber"),
            "wardNumber": data.get("wardNumber"),
            "createdAt": datetime.now(timezone.utc),
            "insuranceClaim": data.get("insuranceClaim"),  
            "totalFees": data.get("totalFees"),            
            "paidFees": data.get("paidFees"),             
            "balance": data.get("balance")              
        }

        image = request.files.get("patientImage")

        if image:
            result = cloudinary.uploader.upload(
                image,
                folder="docrRounds/patients"
            )
            patient["patientImage"] = result["secure_url"]

        mongo.db.patients.insert_one(patient)

        return jsonify({"message": "Patient admitted successfully"}), 201

    except Exception as e:
        print("PATIENT ERROR:", e)
        return jsonify({"message": "Server error"}), 500

@app.route("/api/patient/all", methods=["GET"])
def get_all_patients():
    patients = []
    for p in mongo.db.patients.find():
        p["_id"] = str(p["_id"])
        patients.append(p)
    return jsonify(patients), 200

@app.route("/api/patient/discharge/<patient_id>", methods=["DELETE"])
def discharge_patient(patient_id):
    result = mongo.db.patients.delete_one(
        {"patientId": patient_id}
    )

    if result.deleted_count == 0:
        return jsonify({"message": "Patient not found"}), 404

    return jsonify({"message": "Patient discharged successfully"}), 200


# -------------------- DOCTOR LOGIN --------------------
@app.route("/api/doctor/login", methods=["POST"])
def doctor_login():
    try:
        data = request.json
        doctor_id = data.get("doctorId")
        password = data.get("password")

        doctor = mongo.db.doctors.find_one(
            {"doctorId": doctor_id}
        )

        # 1️⃣ Doctor not found
        if not doctor:
            return jsonify({
                "success": False,
                "message": "Doctor not found"
            }), 404

        # 2️⃣ Password check
        if not check_password_hash(doctor["password"], password):
            return jsonify({
                "success": False,
                "message": "Invalid password"
            }), 401

        # 3️⃣ Success
        return jsonify({
            "success": True,
            "message": "Doctor login successful",
            "doctorId": doctor["doctorId"],
            "doctorMongoId": str(doctor["_id"]),
            "hospitalId": doctor["hospital_id"],
            "name": doctor["name"]
        }), 200

    except Exception as e:
        print("DOCTOR LOGIN ERROR:", e)
        return jsonify({
            "success": False,
            "message": "Server error"
        }), 500


# -------------------- GET PATIENTS BY DOCTOR --------------------
@app.route("/api/doctor/<doctor_id>/patients", methods=["GET"])
def get_patients_by_doctor(doctor_id):
    try:
        patients = []

        cursor = mongo.db.patients.find(
            {"doctorId": doctor_id}
        ).sort("createdAt", -1)

        for p in cursor:
            p["_id"] = str(p["_id"])
            patients.append(p)

        return jsonify(patients), 200

    except Exception as e:
        print("GET DOCTOR PATIENTS ERROR:", e)
        return jsonify([]), 500


#--------------------Docortor Dashboard Stats--------------------
#--------------------ROUNDS REPORT--------------------
@app.route("/api/patient/round-report", methods=["POST"])
def round_report():
    data = request.json

    patientId = data.get("patientId")
    doctorId = data.get("doctorId")
    reportText = data.get("reportText")
    reportTime = data.get("reportTime")

    # 🔍 Fetch patient
    patient = mongo.db.patients.find_one({"patientId": patientId})
    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    # 🔍 Fetch doctor
    doctor = mongo.db.doctors.find_one({"doctorId": doctorId})
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404

    guardianNumber = patient.get("guardianNumber")

    # 🇮🇳 Convert to E.164 format
    if guardianNumber and not guardianNumber.startswith("+91"):
        guardianNumber = "+91" + guardianNumber

    # 📦 Save report in DB
    report_doc = {
        "patientId": patientId,
        "patientName": patient.get("patientName", ""),
        "guardianNumber": guardianNumber,
        "doctorId": doctorId,
        "doctorName": doctor.get("name", ""),
        "report": reportText,
        "time": reportTime,
        "createdAt": datetime.now(timezone.utc)
    }

    mongo.db.round_reports.insert_one(report_doc)

    # 📩 SMS MESSAGE FORMAT
    sms_message = f"""
    DocRounds – Patient Update

    ID: {patientId}
    Patient Name: {patient.get('patientName')} 
    Round Time: {reportTime}
    Feedback: {reportText}

    Thank you.
    By - Dr. {doctor.get('name')}
    """

    # 📤 Send SMS via Twilio
    try:
        twilio_client.messages.create(
            body=sms_message,
            from_=TWILIO_PHONE_NUMBER,
            to=guardianNumber
        )
    except Exception as e:
        print("Twilio SMS Error:", e)

    return jsonify({"message": "Report saved & SMS sent"}), 201



#--------------------Medical Requirement-------------
@app.route("/api/patient/medical-requirement", methods=["POST"])
def medical_requirement():
    data = request.json

    patientId = data.get("patientId")
    doctorId = data.get("doctorId")
    medicalItem = data.get("medicalItem")
    medicalTime = data.get("medicalTime")

    # 🔍 Fetch patient
    patient = mongo.db.patients.find_one({"patientId": patientId})
    if not patient:
        return jsonify({"message": "Patient not found"}), 404

    # 🔍 Fetch doctor
    doctor = mongo.db.doctors.find_one({"doctorId": doctorId})
    if not doctor:
        return jsonify({"message": "Doctor not found"}), 404

    guardian_number = patient.get("guardianNumber", "")
    doctor_name = doctor.get("name", "")
    patient_name = patient.get("patientName", "")

    # 📦 Save to DB
    medical_doc = {
        "patientId": patientId,
        "patientName": patient_name,
        "guardianNumber": guardian_number,
        "doctorId": doctorId,
        "doctorName": doctor_name,
        "item": medicalItem,
        "within": medicalTime,
        "status": "PENDING",
        "createdAt": datetime.now(timezone.utc)
    }

    mongo.db.medical_requirements.insert_one(medical_doc)

    # 📲 SHORT SMS MESSAGE (India Safe)
    sms_message = (
        f"DocRounds Alert - Medical Requirement \n"
        f"Patient Name: {patient_name}\n"
        f"Dr: {doctor_name}\n"
        f"Need: {medicalItem}\n"
        f"Within: {medicalTime}"
    )

    # 🔐 Force single SMS
    sms_message = sms_message[:150]

    # 📞 Send SMS
    try:
        twilio_client.messages.create(
            body=sms_message,
            from_=TWILIO_PHONE_NUMBER,
            to=f"+91{guardian_number}"
        )
    except Exception as e:
        print("SMS ERROR:", e)

    return jsonify({"message": "Medical requirement sent"}), 201



#--------------------Shift Ward---------------------
@app.route("/api/patient/shift-ward", methods=["PUT"])
def shift_ward():
    data = request.json
    mongo.db.patients.update_one(
        {"patientId": data["patientId"]},
        {"$set": {"wardNumber": data["newWard"]}}
    )
    return jsonify({"message": "Ward updated"}), 200


@app.route("/api/patient/login", methods=["POST"])
def patient_login():
    data = request.get_json()

    patient = mongo.db.patients.find_one({
        "patientId": data.get("patientId"),
        "doctorId": data.get("accessCode")
    })

    if not patient:
        return jsonify({"message": "Invalid credentials"}), 401

    patient["_id"] = str(patient["_id"])

    if patient.get("createdAt"):
        patient["createdAt"] = patient["createdAt"].isoformat()

    return jsonify({
        "message": "Login successful",
        "patient": patient
    }), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
