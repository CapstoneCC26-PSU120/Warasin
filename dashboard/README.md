# 🧠 WarasIn — Dashboard Analisis Tingkat Stres

> **Coding Camp 2026 · CC26-PSU120**  
> Platform analisis tingkat stres berbasis Machine Learning menggunakan data Sleep Health & Facial Expression.

---

## 📌 Deskripsi Proyek

**WarasIn** adalah dashboard interaktif berbasis Streamlit yang dirancang untuk menganalisis dan memvisualisasikan tingkat stres pengguna. Proyek ini membangun sistem klasifikasi stres ke dalam tiga kategori — **Rendah**, **Sedang**, dan **Tinggi** — dengan memanfaatkan dua sumber data utama:

1. **Sleep Health & Lifestyle Dataset** — data kuesioner tentang pola tidur dan gaya hidup
2. **Facial Expression Dataset (FER-2013)** — data gambar ekspresi wajah dari 7 kategori emosi

---

## 🗂️ Struktur Proyek

```
dashboard/
├── app.py                      # Halaman utama (Home / Landing Page)
├── loader.py                   # Fungsi loading & caching data
├── requirements.txt            # Daftar dependensi Python
├── data/
│   ├── sleep_health_cleaned.csv    # Dataset 1 (Sleep Health)
│   └── metadata.csv                # Metadata distribusi Dataset 2
└── pages/
    ├── 1_ProblemDiscovery.py       # Latar belakang & business questions
    ├── 2_Overview.py               # Preview & statistik deskriptif dataset
    ├── 3_BusinessQuestion.py       # Visualisasi jawaban business questions
    └── 4_EDA.py                    # Exploratory Data Analysis mendalam
```

---

## 📊 Dataset

### Dataset 1 — Sleep Health & Lifestyle
| Atribut | Detail |
|---|---|
| **Sumber** | Kaggle |
| **Jumlah Responden** | 374 baris |
| **Jumlah Fitur** | 13 variabel |
| **Target** | Stress Level (0–8) → Rendah / Sedang / Tinggi |
| **Fitur Utama** | Sleep Duration, Quality of Sleep, Physical Activity Level, BMI Category, Heart Rate, Daily Steps, Sleep Disorder |

### Dataset 2 — Facial Expression (FER-2013)
| Atribut | Detail |
|---|---|
| **Sumber** | Kaggle |
| **Total Gambar** | ~35.000+ gambar |
| **Kategori Emosi** | Angry, Disgust, Fear, Happy, Neutral, Sad, Surprise |
| **Split** | Train / Test |
| **Catatan** | Dataset bersifat **imbalanced** — Happy mendominasi, Disgust paling sedikit |
| **Penyimpanan Gambar** | Google Drive (cloud) |

---

## 🖥️ Halaman Dashboard

| Halaman | Deskripsi |
|---|---|
| 🏠 **Home** | Landing page dengan metric cards, insight awal, dan navigasi antar halaman |
| 🔍 **Problem Discovery** | Latar belakang masalah, solusi WarasIn, business questions, dan tujuan analisis |
| 📋 **Overview** | Preview dataset, struktur data, statistik deskriptif, dan distribusi nilai per fitur |
| ❓ **Business Questions** | Jawaban visual atas seluruh business questions menggunakan grafik interaktif Plotly |
| 🔬 **EDA** | Eksplorasi mendalam: korelasi antar fitur, distribusi emosi, pola tidur, dan outlier detection |

---

## ❓ Business Questions

**Dataset 1 — Sleep Health & Lifestyle:**
1. Faktor apa saja yang paling berpengaruh terhadap tingkat stres pengguna?
2. Sejauh mana beban kerja dan pola tidur dapat memengaruhi tingkat stres?
3. Bagaimana distribusi tingkat stres dalam dataset (rendah, sedang, tinggi)?
4. Bagaimana aktivitas fisik memengaruhi stres dan kualitas tidur?
5. Apakah terdapat pola antara sleep disorder dengan stress level?

**Dataset 2 — Facial Expression:**
1. Bagaimana distribusi jumlah gambar per kategori emosi?
2. Apakah dataset seimbang atau tidak seimbang (imbalanced)?
3. Kategori emosi apa yang paling dominan dalam dataset?
4. Bagaimana perbandingan jumlah data train dan test?

---

## 🚀 Cara Menjalankan

### 1. Clone Repository
```bash
git clone https://github.com/<username>/<repo-name>.git
cd <repo-name>/dashboard
```

### 2. Buat Virtual Environment (opsional tapi direkomendasikan)
```bash
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows
```

### 3. Install Dependensi
```bash
pip install -r requirements.txt
```

### 4. Jalankan Dashboard
```bash
streamlit run app.py
```

Dashboard akan otomatis terbuka di browser pada `http://localhost:8501`.

---

## 🛠️ Tech Stack

| Teknologi | Kegunaan |
|---|---|
| [Streamlit](https://streamlit.io/) | Framework web dashboard |
| [Pandas](https://pandas.pydata.org/) | Manipulasi & analisis data |
| [Plotly](https://plotly.com/python/) | Visualisasi interaktif |
| [Matplotlib](https://matplotlib.org/) | Visualisasi statis |
| [Seaborn](https://seaborn.pydata.org/) | Visualisasi statistik |
| [NumPy](https://numpy.org/) | Komputasi numerik |
| [Pillow](https://pillow.readthedocs.io/) | Pemrosesan gambar |
| Google Drive | Penyimpanan Dataset gambar FER-2013 |

---

## 📦 Requirements

```
streamlit
pandas
numpy
plotly
matplotlib
seaborn
pillow
pyarrow
altair

```
