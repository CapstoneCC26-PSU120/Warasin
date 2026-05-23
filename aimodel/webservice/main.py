from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Optional
import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras import layers
from tensorflow.keras.applications import EfficientNetB0
import cv2
import io
import os
from datetime import datetime, timezone
from PIL import Image

# ══════════════════════════════════════════════════════════
#  Custom Layer (harus didefinisikan sebelum load model)
# ══════════════════════════════════════════════════════════
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
EMOTION_IMG_SIZE  = (96, 96)     # ukuran input sesuai training model
MAX_FILE_SIZE_MB  = 5
ALLOWED_TYPES     = {"image/jpeg", "image/jpg", "image/png"}


# ══════════════════════════════════════════════════════════
#  Load Model saat Server Start
# ══════════════════════════════════════════════════════════
# ── Stress model ──
try:
    preprocessor = joblib.load(os.path.join(MODELS_DIR, "prepocessor.save"))
    stress_model = load_model(
        os.path.join(MODELS_DIR, "stress_level_prediction_model.keras"),
        custom_objects={"CustomDense": CustomDense}
    )
    print("✅ Stress model & preprocessor berhasil dimuat")
except Exception as e:
    print(f"❌ Gagal memuat stress model: {e}")
    preprocessor = None
    stress_model = None

# ── Emotion model ──
try:
    emotion_model = load_model(os.path.join(MODELS_DIR, "emotion_model.keras"))
    print("✅ Emotion model berhasil dimuat")
except Exception as e:
    print(f"❌ Gagal memuat emotion model: {e}")
    emotion_model = None


# ══════════════════════════════════════════════════════════
#  Helper: Preprocessing Gambar
# ══════════════════════════════════════════════════════════
def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Konversi bytes gambar → tensor (1, 224, 224, 3) siap diinfer.

    Pipeline:
      1. Buka gambar apapun (RGB, RGBA, dsb.)
      2. Konversi ke Grayscale (L) → mensimulasikan kondisi training
      3. Konversi kembali ke RGB dengan menduplikat channel (R=G=B)
         sehingga model menerima input 3-channel tapi tanpa info warna
      4. Resize ke ukuran input EfficientNet (224x224)
      5. EfficientNet preprocessing: pixel / 127.5 - 1  →  range [-1, 1]
    """
    img = Image.open(io.BytesIO(image_bytes))

    # Tangani RGBA / palette (misal PNG transparan)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGBA")
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])   # tempel pakai alpha channel
        img = background

    # Grayscale → RGB (duplikat channel agar model tidak "kaget")
    img = img.convert("L").convert("RGB")

    img = img.resize(EMOTION_IMG_SIZE, Image.LANCZOS)
    arr = np.array(img, dtype=np.float32)
    arr = tf.keras.applications.efficientnet.preprocess_input(arr)
    return np.expand_dims(arr, axis=0)  # (1, 224, 224, 3)


def detect_face_opencv(image_bytes: bytes) -> bool:
    """
    Cek apakah ada wajah dalam gambar menggunakan Haar Cascade (opsional).
    Return True jika wajah terdeteksi, False jika tidak.
    """
    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    face_cascade = cv2.CascadeClassifier(cascade_path)

    nparr = np.frombuffer(image_bytes, np.uint8)
    img   = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    gray  = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    return len(faces) > 0


# ══════════════════════════════════════════════════════════
#  Schema: Stress Prediction
# ══════════════════════════════════════════════════════════
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


class ProbabilityStress(BaseModel):
    Rendah: float
    Sedang: float
    Tinggi: float

class StressOutput(BaseModel):
    success: bool
    timestamp: str
    data: dict


# ══════════════════════════════════════════════════════════
#  Schema: Emotion Output
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
    source: str   # "upload" | "camera"
    data: EmotionData


# ══════════════════════════════════════════════════════════
#  Endpoints: Health
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
#  Endpoint: Stress Prediction
# ══════════════════════════════════════════════════════════
@app.post(
    "/predict/stress",
    tags=["Stress Prediction"],
    summary="Prediksi tingkat stres dari data kesehatan",
    response_model=StressOutput
)
def predict_stress(data: StressInput):
    """
    Menerima data kesehatan (tidur, aktivitas, BMI, dll.) dan
    mengembalikan prediksi tingkat stres: **Rendah / Sedang / Tinggi**.
    """
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

        # ── Hitung stress score skala 0–100 ──────────────────
        # Setiap kelas dipetakan ke titik tengah rentangnya:
        #   Rendah  →  0–33   → titik tengah 16.5
        #   Sedang  → 34–66   → titik tengah 50.0
        #   Tinggi  → 67–100  → titik tengah 83.5
        # Skor akhir = weighted average probabilitas × titik tengah
        # Contoh: Rendah=0.18, Sedang=0.65, Tinggi=0.17
        #   → (0.18×16.5) + (0.65×50.0) + (0.17×83.5) = 49 (Sedang ✓)
        MIDPOINTS    = [16.5, 50.0, 83.5]
        stress_score = round(float(np.dot(probs, MIDPOINTS)), 1)

        # Probabilitas dikonversi ke persen (×100) agar FS tidak perlu konversi manual
        p_rendah = round(float(probs[0]) * 100, 1)
        p_sedang = round(float(probs[1]) * 100, 1)
        p_tinggi = round(float(probs[2]) * 100, 1)

        return StressOutput(
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
#  Helper: Jalankan inferensi emosi (dipakai oleh 2 endpoint)
# ══════════════════════════════════════════════════════════
def _run_emotion_inference(image_bytes: bytes, source: str) -> EmotionOutput:
    if emotion_model is None:
        raise HTTPException(status_code=503, detail="Emotion model belum siap, coba beberapa saat lagi.")

    # Cek wajah terdeteksi
    face_found = detect_face_opencv(image_bytes)
    if not face_found:
        raise HTTPException(
            status_code=422,
            detail="Wajah tidak terdeteksi dalam gambar. Pastikan wajah menghadap ke depan (frontal)."
        )

    try:
        tensor = preprocess_image(image_bytes)
        probs  = emotion_model.predict(tensor)[0]          # shape: (6,)

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

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan inferensi: {str(e)}")


# ══════════════════════════════════════════════════════════
#  Endpoint: Emotion dari Upload Gambar
# ══════════════════════════════════════════════════════════
@app.post(
    "/predict/emotion/upload",
    tags=["Emotion Classification"],
    summary="Klasifikasi emosi wajah dari file gambar",
    response_model=EmotionOutput
)
async def predict_emotion_upload(file: UploadFile = File(...)):
    """
    Upload file gambar (JPEG/JPG/PNG, maks 5 MB).
    Mengembalikan prediksi emosi: Angry, Disgust, Fear, Happy, Sad, Surprise.

    **Catatan:** Performa terbaik jika wajah menghadap ke depan (frontal).
    """
    # Validasi content-type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Format tidak didukung: {file.content_type}. Gunakan JPEG, JPG, atau PNG."
        )

    image_bytes = await file.read()

    # Validasi ukuran file
    if len(image_bytes) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail=f"Ukuran file melebihi batas {MAX_FILE_SIZE_MB} MB."
        )

    return _run_emotion_inference(image_bytes, source="upload")


# ══════════════════════════════════════════════════════════
#  Endpoint: Emotion dari Frame Kamera
# ══════════════════════════════════════════════════════════
@app.post(
    "/predict/emotion/camera",
    tags=["Emotion Classification"],
    summary="Klasifikasi emosi wajah dari frame kamera",
    response_model=EmotionOutput
)
async def predict_emotion_camera(file: UploadFile = File(...)):
    """
    Kirim satu frame dari kamera sebagai file gambar (JPEG/PNG).

    **Cara pakai dari frontend:**
    1. Ambil frame dari `<video>` menggunakan `canvas.toBlob()`.
    2. POST ke endpoint ini sebagai `multipart/form-data` dengan field `file`.
    3. Respons langsung berisi prediksi emosi real-time.

    **Catatan:** Endpoint ini identik dengan `/predict/emotion/upload`,
    dibedakan hanya pada field `source` di respons (`"camera"`) agar
    frontend bisa membedakan asal data.
    """
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Format tidak didukung: {file.content_type}. Gunakan JPEG atau PNG."
        )

    image_bytes = await file.read()

    if len(image_bytes) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail=f"Ukuran frame melebihi batas {MAX_FILE_SIZE_MB} MB."
        )

    return _run_emotion_inference(image_bytes, source="camera")