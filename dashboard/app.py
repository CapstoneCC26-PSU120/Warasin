import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import sys
import pathlib

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from loader import load_dataset1, load_dataset2, gdrive_folder_url

# ── Page Config ─────────────────────────────────────────────────
st.set_page_config(
    page_title="WarasIn – Data Science Dashboard",
    page_icon="🧠",
    layout="wide",
)

# ── Global CSS ──────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

html, body, [class*="css"] {
    font-family: 'Plus Jakarta Sans', sans-serif;
}
.main {
    background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 40%, rgba(255,251,235,0.6) 100%);
}
[data-testid="stSidebar"] {
    background-color: #FFFFFF;
    box-shadow: 2px 0 8px rgba(0,0,0,0.05);
}

/* ── Hero ── */
.hero-wrap {
    background: linear-gradient(135deg, #0E8CD3 0%, #0a6fa8 50%, #065a8a 100%);
    border-radius: 20px;
    padding: 40px 48px;
    margin-bottom: 28px;
    position: relative;
    overflow: hidden;
}
.hero-wrap::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
}
.hero-wrap::after {
    content: '';
    position: absolute;
    bottom: -80px; left: 30%;
    width: 340px; height: 340px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
}
.hero-title {
    font-size: 3.2rem;
    font-weight: 800;
    color: #FFFFFF;
    margin: 0;
    line-height: 1.1;
}
.hero-sub {
    color: rgba(255,255,255,0.80);
    font-size: 1.05rem;
    margin: 10px 0 0;
}
.hero-badge {
    display: inline-block;
    background: rgba(255,255,255,0.18);
    color: #fff;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
    margin-bottom: 14px;
    letter-spacing: 0.5px;
}

/* ── Metric Cards ── */
.metric-card {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 22px 24px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    border-top: 4px solid #0E8CD3;
    height: 100%;
}
.metric-card .m-icon  { font-size: 1.6rem; margin-bottom: 8px; }
.metric-card .m-label { font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; }
.metric-card .m-value { font-size: 2.2rem; font-weight: 800; color: #0E8CD3; line-height: 1.1; }
.metric-card .m-note  { font-size: 12px; color: #94a3b8; margin-top: 4px; }
.mc-green  { border-top-color: #52B788 !important; }
.mc-green  .m-value { color: #52B788 !important; }
.mc-orange { border-top-color: #F59E0B !important; }
.mc-orange .m-value { color: #F59E0B !important; }
.mc-red    { border-top-color: #E63946 !important; }
.mc-red    .m-value { color: #E63946 !important; }
.mc-purple { border-top-color: #7C3AED !important; }
.mc-purple .m-value { color: #7C3AED !important; }

/* ── Section Header ── */
.sec-header {
    font-size: 1.15rem;
    font-weight: 700;
    color: #1e293b;
    margin: 32px 0 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.sec-header::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, #0E8CD3 0%, transparent 100%);
    border-radius: 2px;
}

/* ── Nav Cards ── */
.nav-card {
    background: white;
    border-radius: 16px;
    padding: 28px 24px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    text-align: center;
    border-top: 4px solid #0E8CD3;
    transition: transform 0.2s, box-shadow 0.2s;
    height: 100%;
}
.nav-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.nav-card .nc-icon  { font-size: 2.4rem; margin-bottom: 12px; }
.nav-card h3        { color: #1e293b; margin: 0 0 6px; font-size: 1.05rem; font-weight: 700; }
.nav-card p         { color: #94a3b8; font-size: 0.875rem; margin: 0; line-height: 1.5; }

/* ── Insight Cards ── */
.insight-card {
    background: white;
    border-radius: 14px;
    padding: 18px 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    border-left: 4px solid #0E8CD3;
    margin-bottom: 10px;
}
.insight-card p { margin: 0; color: #334155; font-size: 0.9rem; line-height: 1.6; }

/* ── Stress Badge ── */
.stress-badge {
    display: inline-block;
    border-radius: 8px;
    padding: 6px 16px;
    font-weight: 700;
    font-size: 0.9rem;
    margin: 4px;
}
.badge-rendah  { background: #dcfce7; color: #166534; }
.badge-sedang  { background: #fef9c3; color: #854d0e; }
.badge-tinggi  { background: #fee2e2; color: #991b1b; }

/* ── Dataset Info Box ── */
.ds-box {
    background: #F8FAFC;
    border-radius: 14px;
    padding: 20px 22px;
    border: 1px solid #E2E8F0;
}
.ds-box h4 { margin: 0 0 10px; color: #0E8CD3; font-size: 1rem; }
.ds-box p  { margin: 0; color: #475569; font-size: 0.875rem; line-height: 1.7; }

.divider { border: none; border-top: 1px solid #E2E8F0; margin: 24px 0; }
.footer  { text-align:center; color:#cbd5e1; font-size:0.82rem; padding: 16px 0 4px; }
</style>
""", unsafe_allow_html=True)

# ── Load Data ────────────────────────────────────────────────────
df1 = load_dataset1()
df2, train_counts, test_counts = load_dataset2()

# Pre-compute stats
stress_counts   = df1["Stress Category"].value_counts()
total_gambar    = sum(train_counts.values()) + sum(test_counts.values())
avg_sleep       = df1["Sleep Duration"].mean()
avg_steps       = int(df1["Daily Steps"].mean())
pct_rendah      = round(stress_counts.get("Rendah", 0) / len(df1) * 100, 1)
pct_tinggi      = round(stress_counts.get("Tinggi", 0) / len(df1) * 100, 1)

# ── HERO ────────────────────────────────────────────────────────
st.markdown(f"""
<div class="hero-wrap">
    <div class="hero-badge">🎓 Coding Camp 2026 · CC26-PSU120</div>
    <p class="hero-title">🧠 WarasIn</p>
    <p class="hero-sub">
        Platform analisis tingkat stres berbasis Machine Learning<br>
        menggunakan data Sleep Health &amp; Facial Expression
    </p>
</div>
""", unsafe_allow_html=True)

# ── METRIC CARDS ────────────────────────────────────────────────
c1, c2, c3, c4, c5 = st.columns(5)
cards = [
    (c1, "📋", "Total Responden", f"{len(df1):,}".replace(",", "."), "Sleep Health Dataset", ""),
    (c2, "🖼️", "Total Gambar", f"{total_gambar:,}".replace(",", "."), "Facial Expression Dataset", "mc-green"),
    (c3, "😴", "Rata-rata Tidur", f"{avg_sleep:.1f} jam", "Per malam", "mc-orange"),
    (c4, "👣", "Rata-rata Langkah", f"{avg_steps:,}".replace(",", "."), "Per hari", "mc-purple"),
    (c5, "🎯", "Fitur Input", "13", "Variabel dalam dataset", "mc-red"),
]
for col, icon, label, value, note, extra in cards:
    with col:
        st.markdown(f"""
        <div class="metric-card {extra}">
            <div class="m-icon">{icon}</div>
            <div class="m-label">{label}</div>
            <div class="m-value">{value}</div>
            <div class="m-note">{note}</div>
        </div>
        """, unsafe_allow_html=True)

st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── INSIGHT CEPAT ───────────────────────────────────────────────
st.markdown('<div class="sec-header">💡 Insight Awal Dataset</div>', unsafe_allow_html=True)

# Pre-compute Dataset 1 stats
top_occ  = df1["Occupation"].value_counts().idxmax()
top_bmi  = df1["BMI Category"].value_counts().idxmax()

# Pre-compute Dataset 2 stats
top_emotion    = df2.groupby("category")["count"].sum().idxmax()
least_emotion  = df2.groupby("category")["count"].sum().idxmin()
train_total    = sum(train_counts.values())
test_total     = sum(test_counts.values())
train_pct      = round(train_total / total_gambar * 100, 1)
top_emo_count  = df2.groupby("category")["count"].sum().max()
least_emo_count= df2.groupby("category")["count"].sum().min()
imbalance_ratio= round(top_emo_count / least_emo_count, 1)

tab1, tab2 = st.tabs(["📊 Dataset 1 — Sleep Health & Lifestyle", "😊 Dataset 2 — Facial Expression"])

with tab1:
    insights_ds1 = [
        (f"🧑‍💼 Pekerjaan paling banyak adalah <b>{top_occ}</b> — "
         f"menunjukkan profesi tertentu cenderung lebih rentan mengalami stres tinggi.", "#0E8CD3"),
        (f"😴 Rata-rata durasi tidur responden hanya <b>{avg_sleep:.1f} jam/malam</b>, "
         f"masih di bawah rekomendasi WHO sebesar 7–9 jam.", "#7C3AED"),
        (f"👣 Rata-rata langkah harian <b>{avg_steps:,} langkah</b> — "
         f"setara dengan aktivitas fisik ringan–sedang.", "#F59E0B"),
        (f"⚖️ BMI kategori terbanyak adalah <b>{top_bmi}</b>, berkorelasi dengan "
         f"pola gaya hidup dan tingkat stres responden.", "#52B788"),
        (f"😟 Sebesar <b>{pct_rendah}%</b> responden berada di level stres Rendah, "
         f"sementara <b>{pct_tinggi}%</b> berada di level Tinggi — menunjukkan "
         f"variasi distribusi yang perlu dianalisis lebih lanjut.", "#E63946"),
    ]
    col_i1, col_i2 = st.columns(2)
    for i, (text, color) in enumerate(insights_ds1):
        col = col_i1 if i % 2 == 0 else col_i2
        with col:
            st.markdown(f"""
            <div class="insight-card" style="border-left-color:{color}">
                <p>{text}</p>
            </div>
            """, unsafe_allow_html=True)

with tab2:
    insights_ds2 = [
        (f"😄 Emosi paling dominan adalah <b>{top_emotion}</b> dengan "
         f"<b>{top_emo_count:,} gambar</b> — mencerminkan distribusi yang tidak merata antar kelas.", "#F59E0B"),
        (f"😬 Emosi paling sedikit adalah <b>{least_emotion}</b> dengan hanya "
         f"<b>{least_emo_count:,} gambar</b> — jauh lebih kecil dibanding kelas lain.", "#E63946"),
        (f"⚖️ Rasio imbalance antara kelas terbanyak dan tersedikit mencapai <b>{imbalance_ratio}:1</b> — "
         f"perlu teknik seperti oversampling atau class weighting saat training model.", "#7C3AED"),
        (f"🗂️ Split data <b>Train : Test ≈ {train_pct:.0f}:{100-train_pct:.0f}</b> "
         f"({train_total:,} train · {test_total:,} test) — proporsi sudah cukup ideal untuk pelatihan model.", "#52B788"),
        (f"📦 Total <b>{total_gambar:,} gambar</b> dari 7 kategori emosi: "
         f"Angry, Disgust, Fear, Happy, Neutral, Sad, Surprise — "
         f"mencakup berbagai ekspresi wajah yang relevan dengan deteksi stres.", "#0E8CD3"),
    ]
    col_j1, col_j2 = st.columns(2)
    for i, (text, color) in enumerate(insights_ds2):
        col = col_j1 if i % 2 == 0 else col_j2
        with col:
            st.markdown(f"""
            <div class="insight-card" style="border-left-color:{color}">
                <p>{text}</p>
            </div>
            """, unsafe_allow_html=True)

st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── DATASET OVERVIEW ────────────────────────────────────────────
st.markdown('<div class="sec-header">🗄️ Dataset yang Digunakan</div>', unsafe_allow_html=True)

ds1_col, ds2_col = st.columns(2)
with ds1_col:
    st.markdown(f"""
    <div class="ds-box">
        <h4>📊 Dataset 1 — Sleep Health & Lifestyle</h4>
        <p>
            <b>Sumber:</b> Kaggle / Data survey standar<br>
            <b>Jumlah baris:</b> {len(df1):,} responden<br>
            <b>Jumlah fitur:</b> 13 variabel<br>
            <b>Target:</b> Stress Level (0–8) → Rendah / Sedang / Tinggi<br>
            <b>Fitur utama:</b> Sleep Duration, Quality of Sleep,
            Physical Activity Level, BMI Category, Heart Rate,
            Daily Steps, Sleep Disorder
        </p>
    </div>
    """, unsafe_allow_html=True)

with ds2_col:
    train_total = sum(train_counts.values())
    test_total  = sum(test_counts.values())
    st.markdown(f"""
    <div class="ds-box">
        <h4>😊 Dataset 2 — Facial Expression (FER-2013)</h4>
        <p>
            <b>Sumber:</b> Kaggle<br>
            <b>Total gambar:</b> {total_gambar:,} gambar<br>
            <b>Train / Test:</b> {train_total:,} / {test_total:,}<br>
            <b>Kategori emosi:</b> Angry, Disgust, Fear, Happy, Neutral, Sad, Surprise<br>
            <b>Catatan:</b> Dataset bersifat imbalanced
            — kategori <i>Happy</i> mendominasi, sedangkan <i>Disgust</i> paling sedikit.
        </p>
    </div>
    """, unsafe_allow_html=True)

st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── NAVIGASI ────────────────────────────────────────────────────
st.markdown('<div class="sec-header">🗂️ Jelajahi Halaman Dashboard</div>', unsafe_allow_html=True)
st.markdown("<br>", unsafe_allow_html=True)

nav_pages = [
    ("🔍", "Problem Discovery", "Latar belakang masalah, solusi WarasIn, dan daftar business questions dari kedua dataset.", "#0E8CD3", "/ProblemDiscovery"),
    ("📋", "Overview", "Preview dataset, info struktur data, statistik deskriptif, dan distribusi nilai per fitur.", "#52B788", "/Overview"),
    ("❓", "Business Questions", "Jawaban visual atas seluruh business questions menggunakan grafik interaktif Plotly.", "#F59E0B", "/BusinessQuestion"),
    ("🔬", "EDA", "Eksplorasi mendalam: korelasi antar fitur, distribusi emosi, pola tidur, dan outlier detection.", "#E63946", "/EDA"),
]

nav_cols = st.columns(4)
for col, (icon, title, desc, color, page_path) in zip(nav_cols, nav_pages):
    with col:
        st.markdown(f"""
        <a href="{page_path}" target="_self" style="text-decoration:none;">
            <div class="nav-card" style="border-top-color:{color}; cursor:pointer;">
                <div class="nc-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
            </div>
        </a>
        """, unsafe_allow_html=True)

# ── FOOTER ──────────────────────────────────────────────────────
st.markdown('<hr class="divider">', unsafe_allow_html=True)
st.markdown('<p class="footer">WarasIn · Coding Camp 2026 · CC26-PSU120</p>', unsafe_allow_html=True)
