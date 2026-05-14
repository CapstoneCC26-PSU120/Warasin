from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional
import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras import layers
import os

# ──────────────────────────────────────────
#  Custom Layer (harus didefinisikan sebelum load model)
# ──────────────────────────────────────────
@tf.keras.utils.register_keras_serializable()
class CustomDense(layers.Layer):
    def __init__(self, units, **kwargs):
        super(CustomDense, self).__init__(**kwargs)
        self.units = units

    def build(self, input_shape):
        self.w = self.add_weight(
            shape=(input_shape[-1], self.units),
            initializer="he_normal",
            trainable=True
        )
        self.b = self.add_weight(
            shape=(self.units,),
            initializer="zeros",
            trainable=True
        )

    def call(self, inputs):
        return tf.matmul(inputs, self.w) + self.b

    def get_config(self):
        config = super().get_config()
        config.update({"units": self.units})
        return config


# ──────────────────────────────────────────
#  Inisialisasi aplikasi
# ──────────────────────────────────────────
app = FastAPI(
    title="Stress Level Prediction API",
    description="REST API untuk prediksi level stres menggunakan model Machine Learning",
    version="1.0.0"
)

# Izinkan semua origin (ganti saat production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────
#  Load model & preprocessor saat server start
# ──────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    preprocessor = joblib.load(os.path.join(BASE_DIR, "models", "prepocessor.save"))
    model = load_model(
        os.path.join(BASE_DIR, "models", "stress_level_prediction_model.keras"),
        custom_objects={"CustomDense": CustomDense}
    )
    print("✅ Model dan preprocessor berhasil dimuat")
except Exception as e:
    print(f"❌ Gagal memuat model: {e}")
    preprocessor = None
    model = None

LABEL_MAP = {0: "Rendah", 1: "Sedang", 2: "Tinggi"}

VALID_GENDERS     = ["Male", "Female"]
VALID_OCCUPATIONS = [
    "Accountant", "Doctor", "Engineer", "Lawyer", "Manager",
    "Nurse", "Sales Representative", "Salesperson", "Scientist",
    "Software Engineer", "Teacher"
]
VALID_BMI         = ["Normal", "Obese", "Overweight"]
VALID_DISORDERS   = ["Insomnia", "Sleep Apnea", None]


# ──────────────────────────────────────────
#  Schema input (validasi otomatis)
# ──────────────────────────────────────────
class StressInput(BaseModel):
    Gender: str                   = Field(..., example="Female")
    Age: int                      = Field(..., ge=18, le=100, example=28)
    Occupation: str               = Field(..., example="Nurse")
    Sleep_Duration: float         = Field(..., ge=0, le=24, example=6.5, alias="Sleep Duration")
    Quality_of_Sleep: int         = Field(..., ge=1, le=10, example=5, alias="Quality of Sleep")
    Physical_Activity_Level: int  = Field(..., ge=0, le=180, example=30, alias="Physical Activity Level")
    BMI_Category: str             = Field(..., example="Normal", alias="BMI Category")
    Heart_Rate: int               = Field(..., ge=40, le=200, example=80, alias="Heart Rate")
    Daily_Steps: int              = Field(..., ge=0, le=50000, example=4000, alias="Daily Steps")
    Sleep_Disorder: Optional[str] = Field(None, example=None, alias="Sleep Disorder")
    BP_Systolic: int              = Field(..., ge=80, le=200, example=125)
    BP_Diastolic: int             = Field(..., ge=50, le=130, example=82)

    class Config:
        populate_by_name = True

    @validator("Gender")
    def validate_gender(cls, v):
        if v not in VALID_GENDERS:
            raise ValueError(f"Gender harus salah satu dari: {VALID_GENDERS}")
        return v

    @validator("Occupation")
    def validate_occupation(cls, v):
        if v not in VALID_OCCUPATIONS:
            raise ValueError(f"Occupation tidak valid. Pilihan: {VALID_OCCUPATIONS}")
        return v

    @validator("BMI_Category", pre=True)
    def validate_bmi(cls, v):
        if v not in VALID_BMI:
            raise ValueError(f"BMI Category harus salah satu dari: {VALID_BMI}")
        return v

    @validator("Sleep_Disorder", pre=True)
    def validate_disorder(cls, v):
        if v not in VALID_DISORDERS:
            raise ValueError(f"Sleep Disorder harus salah satu dari: {VALID_DISORDERS}")
        return v


# ──────────────────────────────────────────
#  Schema output
# ──────────────────────────────────────────
class ProbabilityDetail(BaseModel):
    Rendah: float
    Sedang: float
    Tinggi: float

class StressOutput(BaseModel):
    label: str
    class_index: int
    probabilities: ProbabilityDetail
    message: str


# ──────────────────────────────────────────
#  Endpoints
# ──────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "message": "Stress Level Prediction API",
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "preprocessor_loaded": preprocessor is not None
    }

@app.post("/predict", response_model=StressOutput, tags=["Prediction"])
def predict(data: StressInput):
    if model is None or preprocessor is None:
        raise HTTPException(status_code=503, detail="Model belum siap, coba beberapa saat lagi")

    try:
        # 1. Buat DataFrame dengan nama kolom sesuai training
        df = pd.DataFrame([{
            "Gender"                  : data.Gender,
            "Age"                     : data.Age,
            "Occupation"              : data.Occupation,
            "Sleep Duration"          : data.Sleep_Duration,
            "Quality of Sleep"        : data.Quality_of_Sleep,
            "Physical Activity Level" : data.Physical_Activity_Level,
            "BMI Category"            : data.BMI_Category,
            "Heart Rate"              : data.Heart_Rate,
            "Daily Steps"             : data.Daily_Steps,
            "Sleep Disorder"          : data.Sleep_Disorder,
            "BP_Systolic"             : data.BP_Systolic,
            "BP_Diastolic"            : data.BP_Diastolic,
        }])

        # 2. Transform: 12 kolom → 27 fitur
        X = preprocessor.transform(df)

        # 3. Prediksi
        probs       = model.predict(X)[0]
        class_index = int(np.argmax(probs))
        label       = LABEL_MAP[class_index]

        # 4. Pesan rekomendasi
        messages = {
            "Rendah" : "Tingkat stres Anda rendah. Pertahankan gaya hidup sehat Anda!",
            "Sedang" : "Tingkat stres Anda sedang. Perhatikan pola tidur dan olahraga rutin.",
            "Tinggi" : "Tingkat stres Anda tinggi. Disarankan untuk berkonsultasi dengan profesional."
        }

        return StressOutput(
            label       = label,
            class_index = class_index,
            probabilities = ProbabilityDetail(
                Rendah=round(float(probs[0]), 4),
                Sedang=round(float(probs[1]), 4),
                Tinggi=round(float(probs[2]), 4),
            ),
            message=messages[label]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan: {str(e)}")