from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Optional
import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras import layers
import cv2
import io
import os
from datetime import datetime, timezone
from PIL import Image

# ══════════════════════════════════════════════════════════
#  Download Model dari Google Drive jika Tidak Ada / Pointer LFS
# ══════════════════════════════════════════════════════════
import gdown

# Ganti ID berikut dengan File ID asli dari Google Drive milikmu
# ID di bawah ini diambil dari link Google Drive yang kamu berikan
PREPROCESSOR_DRIVE_ID = "1m1S5tTwiBxhftqpq4HWI5KhLVYatRVwY" 
STRESS_DRIVE_ID       = "GANTI_DENGAN_ID_FILE_STRESS_MODEL_KAMU"
EMOTION_DRIVE_ID      = "GANTI_DENGAN_ID_FILE_EMOTION_MODEL_KAMU"

def download_from_drive_if_needed(file_id: str, filename: str):
    target_path = os.path.join(MODELS_DIR, filename)
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    # Cek apakah file tidak ada ATAU ukurannya sangat kecil (ciri-ciri file pointer Git LFS biasanya < 1 MB)
    if not os.path.exists(target_path) or os.path.getsize(target_path) < 1000000:
        print(f"📥 {filename} tidak ditemukan atau berupa pointer LFS. Mengunduh dari Google Drive...")
        url = f"https://drive.google.com/uc?id={file_id}"
        try:
            # Menggunakan gdown untuk handling file besar dari Drive
            gdown.download(url, target_path, quiet=False)
            print(f"✅ Berhasil mengunduh {filename}")
        except Exception as e:
            print(f"❌ Gagal mengunduh {filename} dari Google Drive: {e}")
    else:
        print(f"📦 {filename} sudah ada di lokal dan siap dimuat.")

# Eksekusi download otomatis sebelum load_model dijalankan
download_from_drive_if_needed(PREPROCESSOR_DRIVE_ID, "prepocessor.save")
download_from_drive_if_needed(STRESS_DRIVE_ID, "stress_level_prediction_model.keras")
download_from_drive_if_needed(EMOTION_DRIVE_ID, "emotion_model.keras")


# ══════════════════════════════════════════════════════════
#  Load Model saat Server Start
# ══════════════════════════════════════════════════════════
try:
    preprocessor = joblib.load(os.path.join(MODELS_DIR, "prepocessor.save"))
    stress_model = load_model(
        os.path.join(MODELS_DIR, "stress_level_prediction_model.keras"),
        custom_objects={"CustomDense": CustomDense},
        compile=False
    )
    stress_model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    print("✅ Stress model & preprocessor berhasil dimuat")
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"❌ Gagal memuat stress model: {e}")
    preprocessor = None
    stress_model = None

try:
    emotion_model = load_model(os.path.join(MODELS_DIR, "emotion_model.keras"))
    print("✅ Emotion model berhasil dimuat")
except Exception as e:
    print(f"❌ Gagal memuat emotion model: {e}")
    emotion_model = None

# ══════════════════════════════════════════════════════════
#  Custom Layer & Patches
# ══════════════════════════════════════════════════════════

@tf.keras.utils.register_keras_serializable()
class CustomDense(layers.Layer):
    def __init__(self, units, **kwargs):
        super(CustomDense, self).__init__(**kwargs)
        self.units = units
        self.w = None
        self.b = None

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


# Patch Dense layer agar kompatibel dengan model yang disimpan oleh versi Keras berbeda
_OriginalDenseInit = layers.Dense.__init__

def _patched_dense_init(self, *args, **kwargs):
    kwargs.pop('quantization_config', None)
    _OriginalDenseInit(self, *args, **kwargs)

layers.Dense.__init__ = _patched_dense_init


# ══════════════════════════════════════════════════════════
#  Inisialisasi Aplikasi
# ══════════════════════════════════════════════════════════
app = FastAPI(
    title="Stress & Emotion Detection API",
    description=(
        "REST API untuk prediksi tingkat stres (tabular) "
        "dan klasifikasi emosi wajah (gambar/kamera) menggunakan Deep Learning."
    ),
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ══════════════════════════════════════════════════════════
#  Konstanta & Konfigurasi
# ══════════════════════════════════════════════════════════
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# --- Stress ---
STRESS_LABEL_MAP = {0: "Rendah", 1: "Sedang", 2: "Tinggi"}

STRESS_MESSAGES = {
    "Rendah": "Tingkat stres Anda rendah. Pertahankan gaya hidup sehat Anda!",
    "Sedang": "Tingkat stres Anda sedang. Perhatikan pola tidur dan olahraga rutin.",
    "Tinggi": "Tingkat stres Anda tinggi. Disarankan untuk berkonsultasi dengan profesional."
}

VALID_GENDERS     = ["Male", "Female"]
VALID_OCCUPATIONS = [
    "Accountant", "Doctor", "Engineer", "Lawyer", "Manager",
    "Nurse", "Sales Representative", "Salesperson", "Scientist",
    "Software Engineer", "Teacher"
]
VALID_BMI         = ["Normal", "Obese", "Overweight"]
VALID_DISORDERS   = ["Insomnia", "Sleep Apnea", None]

# --- Emotion ---
EMOTION_CLASSES   = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise"]
EMOTION_IMG_SIZE  = (96, 96)     
MAX_FILE_SIZE_MB  = 5
ALLOWED_TYPES     = {"image/jpeg", "image/jpg", "image/png"}


# ══════════════════════════════════════════════════════════
#  Load Model saat Server Start
# ══════════════════════════════════════════════════════════
try:
    preprocessor = joblib.load(os.path.join(MODELS_DIR, "prepocessor.save"))
    stress_model = load_model(
        os.path.join(MODELS_DIR, "stress_level_prediction_model.keras"),
        custom_objects={"CustomDense": CustomDense},
        compile=False
    )
    stress_model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    print("✅ Stress model & preprocessor berhasil dimuat")
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"❌ Gagal memuat stress model: {e}")
    preprocessor = None
    stress_model = None

try:
    emotion_model = load_model(os.path.join(MODELS_DIR, "emotion_model.keras"))
    print("✅ Emotion model berhasil dimuat")
except Exception as e:
    print(f"❌ Gagal memuat emotion model: {e}")
    emotion_model = None


# ══════════════════════════════════════════════════════════
#  Schemas: Stress Prediction (Standard /predict)
# ══════════════════════════════════════════════════════════
class StressInput(BaseModel):
    Gender: str                   = Field(..., examples=["Female"])
    Age: int                      = Field(..., ge=18, le=100, examples=[28])
    Occupation: str               = Field(..., examples=["Nurse"])
    Sleep_Duration: float         = Field(..., ge=0, le=24, examples=[6.5], alias="Sleep Duration")
    Quality_of_Sleep: int         = Field(..., ge=1, le=10, examples=[5], alias="Quality of Sleep")
    Physical_Activity_Level: int  = Field(..., ge=0, le=180, examples=[30], alias="Physical Activity Level")
    BMI_Category: str             = Field(..., examples=["Normal"], alias="BMI Category")
    Heart_Rate: int               = Field(..., ge=40, le=200, examples=[80], alias="Heart Rate")
    Daily_Steps: int              = Field(..., ge=0, le=50000, examples=[4000], alias="Daily Steps")
    Sleep_Disorder: Optional[str] = Field(None, examples=[None], alias="Sleep Disorder")
    BP_Systolic: int              = Field(..., ge=80, le=200, examples=[125])
    BP_Diastolic: int             = Field(..., ge=50, le=130, examples=[82])

    model_config = {
        "populate_by_name": True
    }

    @field_validator("Gender")
    @classmethod
    def validate_gender(cls, v):
        if v not in VALID_GENDERS:
            raise ValueError(f"Gender harus salah satu dari: {VALID_GENDERS}")
        return v

    @field_validator("Occupation")
    @classmethod
    def validate_occupation(cls, v):
        if v not in VALID_OCCUPATIONS:
            raise ValueError(f"Occupation tidak valid. Pilihan: {VALID_OCCUPATIONS}")
        return v

    @field_validator("BMI_Category", mode="before")
    @classmethod
    def validate_bmi(cls, v):
        if v not in VALID_BMI:
            raise ValueError(f"BMI Category harus salah satu dari: {VALID_BMI}")
        return v

    @field_validator("Sleep_Disorder", mode="before")
    @classmethod
    def validate_disorder(cls, v):
        if v not in VALID_DISORDERS:
            raise ValueError(f"Sleep Disorder harus salah satu dari: {VALID_DISORDERS}")
        return v


class ProbabilityDetail(BaseModel):
    Rendah: float
    Sedang: float
    Tinggi: float

class StressOutput(BaseModel):
    label: str
    class_index: int
    probabilities: ProbabilityDetail
    message: str


# ══════════════════════════════════════════════════════════
#  Schemas: Stress Prediction V2 (/predict/stress)
# ══════════════════════════════════════════════════════════
class StressOutputV2(BaseModel):
    success: bool
    timestamp: str
    data: dict


# ══════════════════════════════════════════════════════════
#  Schemas: Emotion Detection
# ══════════════════════════════════════════════════════════
class EmotionProbability(BaseModel):
    Angry: float
    Disgust: float
    Fear: float
    Happy: float
    Sad: float
    Surprise: float

class EmotionData(BaseModel):
    predicted_class: str
    confidence: float
    predictions_probability: EmotionProbability

class EmotionOutput(BaseModel):
    success: bool
    timestamp: str
    source: str   
    data: EmotionData


# ══════════════════════════════════════════════════════════
#  Helper: Preprocessing Gambar & Inferensi
# ══════════════════════════════════════════════════════════
def preprocess_image(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes))

    if img.mode in ("RGBA", "P"):
        img = img.convert("RGBA")
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])   
        img = background

    img = img.convert("L").convert("RGB")
    img = img.resize(EMOTION_IMG_SIZE, Image.LANCZOS)
    arr = np.array(img, dtype=np.float32)
    arr = tf.keras.applications.efficientnet.preprocess_input(arr)
    return np.expand_dims(arr, axis=0)


def detect_face_opencv(image_bytes: bytes) -> bool:
    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    if not os.path.exists(cascade_path):
        # Fallback jika di environment tertentu path di atas tidak terbaca
        return True 
        
    face_cascade = cv2.CascadeClassifier(cascade_path)
    nparr = np.frombuffer(image_bytes, np.uint8)
    img   = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        return False
        
    gray  = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    return len(faces) > 0


def _run_emotion_inference(image_bytes: bytes, source: str) -> EmotionOutput:
    if emotion_model is None:
        raise HTTPException(status_code=503, detail="Emotion model belum siap, coba beberapa saat lagi.")

    face_found = detect_face_opencv(image_bytes)
    if not face_found:
        raise HTTPException(
            status_code=422,
            detail="Wajah tidak terdeteksi dalam gambar. Pastikan wajah menghadap ke depan (frontal)."
        )

    try:
        tensor = preprocess_image(image_bytes)
        probs  = emotion_model.predict(tensor)[0]          

        class_index    = int(np.argmax(probs))
        predicted_class = EMOTION_CLASSES[class_index]
        confidence      = round(float(probs[class_index]), 4)

        prob_dict = {cls: round(float(p), 4) for cls, p in zip(EMOTION_CLASSES, probs)}

        return EmotionOutput(
            success=True,
            timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            source=source,
            data=EmotionData(
                predicted_class=predicted_class,
                confidence=confidence,
                predictions_probability=EmotionProbability(**prob_dict)
            )
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan inferensi: {str(e)}")


# ══════════════════════════════════════════════════════════
#  Endpoints: Health & Docs
# ══════════════════════════════════════════════════════════
@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "message": "Stress & Emotion Detection API v2.0",
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "stress_model_loaded": stress_model is not None,
        "preprocessor_loaded": preprocessor is not None,
        "emotion_model_loaded": emotion_model is not None,
    }


# ══════════════════════════════════════════════════════════
#  Endpoint: Stress Prediction (Standard /predict)
# ══════════════════════════════════════════════════════════
@app.post(
    "/predict",
    response_model=StressOutput,
    tags=["Prediction"],
    summary="Prediksi tingkat stres dari data kesehatan (Standard)"
)
def predict(data: StressInput):
    if stress_model is None or preprocessor is None:
        raise HTTPException(status_code=503, detail="Model belum siap, coba beberapa saat lagi")

    try:
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

        X = preprocessor.transform(df)
        probs       = stress_model.predict(X)[0]
        class_index = int(np.argmax(probs))
        label       = STRESS_LABEL_MAP[class_index]

        return StressOutput(
            label       = label,
            class_index = class_index,
            probabilities = ProbabilityDetail(
                Rendah=round(float(probs[0]), 4),
                Sedang=round(float(probs[1]), 4),
                Tinggi=round(float(probs[2]), 4),
            ),
            message=STRESS_MESSAGES[label]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan: {str(e)}")


# ══════════════════════════════════════════════════════════
#  Endpoint: Stress Prediction V2 (/predict/stress)
# ══════════════════════════════════════════════════════════
@app.post(
    "/predict/stress",
    tags=["Stress Prediction"],
    summary="Prediksi tingkat stres dari data kesehatan (V2)",
    response_model=StressOutputV2
)
def predict_stress(data: StressInput):
    if stress_model is None or preprocessor is None:
        raise HTTPException(status_code=503, detail="Stress model belum siap, coba beberapa saat lagi.")

    try:
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

        X           = preprocessor.transform(df)
        probs       = stress_model.predict(X)[0]
        class_index = int(np.argmax(probs))
        label       = STRESS_LABEL_MAP[class_index]

        MIDPOINTS    = [16.5, 50.0, 83.5]
        stress_score = round(float(np.dot(probs, MIDPOINTS)), 1)

        p_rendah = round(float(probs[0]) * 100, 1)
        p_sedang = round(float(probs[1]) * 100, 1)
        p_tinggi = round(float(probs[2]) * 100, 1)

        return StressOutputV2(
            success=True,
            timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            data={
                "label"               : label,
                "class_index"         : class_index,
                "stress_score"        : stress_score,
                "stress_score_percent": f"{stress_score}%",
                "probabilities": {
                    "Rendah": p_rendah,
                    "Sedang": p_sedang,
                    "Tinggi": p_tinggi,
                },
                "message": STRESS_MESSAGES[label]
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan: {str(e)}")


# ══════════════════════════════════════════════════════════
#  Endpoint: Emotion (Menggunakan Sinkron 'def' untuk Menghindari Blocking)
# ══════════════════════════════════════════════════════════
@app.post(
    "/predict/emotion/upload",
    tags=["Emotion Classification"],
    summary="Klasifikasi emosi wajah dari file gambar",
    response_model=EmotionOutput
)
def predict_emotion_upload(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Format tidak didukung: {file.content_type}. Gunakan JPEG, JPG, atau PNG."
        )

    # Membaca file secara sinkron karena berada di dalam fungsi 'def' biasa
    image_bytes = file.file.read()

    if len(image_bytes) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail=f"Ukuran file melebihi batas {MAX_FILE_SIZE_MB} MB."
        )

    return _run_emotion_inference(image_bytes, source="upload")


@app.post(
    "/predict/emotion/camera",
    tags=["Emotion Classification"],
    summary="Klasifikasi emosi wajah dari frame kamera",
    response_model=EmotionOutput
)
def predict_emotion_camera(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Format tidak didukung: {file.content_type}. Gunakan JPEG atau PNG."
        )

    image_bytes = file.file.read()

    if len(image_bytes) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail=f"Ukuran frame melebihi batas {MAX_FILE_SIZE_MB} MB."
        )

    return _run_emotion_inference(image_bytes, source="camera")