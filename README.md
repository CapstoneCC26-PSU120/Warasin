# Warasin - Stress & Emotion Detection Platform

Warasin adalah platform kesehatan mental yang menyediakan layanan prediksi tingkat stres (berdasarkan data kesehatan) dan klasifikasi emosi wajah (menggunakan kamera/gambar). Proyek ini merupakan gabungan dari sistem Backend (Express), Frontend (React), AI Web Service (FastAPI), dan Dashboard Analisis Data (Streamlit).

## 🚀 Fitur Utama

- **Stress Level Prediction**: Menentukan tingkat stres (Rendah, Sedang, Tinggi) berdasarkan pola tidur, aktivitas fisik, dan data kesehatan lainnya.
- **Facial Emotion Recognition**: Klasifikasi emosi wajah (Angry, Disgust, Fear, Happy, Sad, Surprise) secara real-time maupun unggahan gambar.
- **Chatbot**: Asisten kesehatan mental interaktif.
- **Dashboard**: Analisis statistik kesehatan pengguna.

## 📂 Link AI Model

Model AI yang digunakan dapat diunduh melalui link berikut (Webservice akan mencoba mengunduh secara otomatis jika tidak tersedia secara lokal):

- **Drive Folder AI Model**: [Google Drive](https://drive.google.com/drive/folders/11tQgFZuaQ7_KY-McqP7GYjOnjCuix6R3?usp=sharing)

---

Karena ini menggunakan gdown, pastikan ganti id nya sesuai dengan yang sudah di download.

## 🛠️ Panduan Setup

### 1. Backend (Express & Prisma)

1. Masuk ke direktori `backend/`.
2. Jalankan `npm install`.
3. Buat file `.env` dan isi variabel berikut:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/warasin"
   JWT_SECRET="your_jwt_secret"
   SESSION_SECRET="your_session_secret"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"
   ```
4. Jalankan migrasi database: `npx prisma migrate dev`.
5. Mulai server: `npm run dev`.

### 2. Frontend (React & Vite)

1. Masuk ke direktori `frontend/`.
2. Jalankan `npm install`.
3. Buat file `.env` dan isi:
   ```env
   VITE_BACKEND_URL="http://localhost:3000"
   ```
4. Jalankan aplikasi: `npm run dev`.

### 3. AI Web Service (FastAPI)

1. Masuk ke direktori `aimodel/webservice/`.
2. Buat Virtual Environment (opsional): `python -m venv venv` dan aktifkan.
3. Jalankan `pip install -r requirements.txt`.
4. Jalankan server: `uvicorn main:app --reload`.

### 4. Dashboard (Streamlit)

1. Masuk ke direktori `dashboard/`.
2. Jalankan `pip install -r requirements.txt`.
3. Jalankan dashboard: `streamlit run app.py`.

---

© 2026 Warasin Team
