import streamlit as st
import sys
import pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from loader import load_dataset1, load_dataset2, gdrive_folder_url

st.set_page_config(page_title="Problem Discovery", page_icon="🔍", layout="wide")

st.markdown("""
<style>
.main {
    background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 40%, rgba(255,251,235,0.6) 100%);
}
[data-testid="stSidebar"] { background-color: #FFFFFF; box-shadow: 2px 0 8px rgba(0,0,0,0.05); }
.info-box {
    background: #E0E7F1;
    border-left: 6px solid #0E8CD3;
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 16px;
    font-size: 15px;
    line-height: 1.6;
    color: #2B3A55;
}
.bq-card {
    background: white;
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    margin-bottom: 10px;
    border-left: 4px solid #0E8CD3;
}
.bq-card p { margin: 0; color: #2B3A55; }
.section-header {
    background: linear-gradient(90deg, #0E8CD3, #0E8CD3);
    color: white !important;
    padding: 10px 20px;
    border-radius: 10px;
    margin: 20px 0 14px 0;
    font-size: 18px;
    font-weight: 600;
}
.divider { border: none; border-top: 1px solid #E2E8F0; margin: 20px 0; }
</style>
""", unsafe_allow_html=True)

# ── Header ──────────────────────────────────────────────────────
st.markdown("""
    <p style="font-size:2.5rem;font-weight:800;color:#0E8CD3;margin:0;">🔍 Problem Discovery</p>
    <p style="color:#64748B;font-size:1rem;margin:4px 0 0;">Latar belakang, solusi, dan business questions proyek WarasIn.</p>
""", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Latar Belakang ───────────────────────────────────────────────
st.markdown('<div class="section-header">📌 Latar Belakang</div>', unsafe_allow_html=True)
st.markdown("""
    <div class="info-box">
    Stres merupakan salah satu masalah kesehatan mental yang semakin meningkat, 
    terutama di kalangan pelajar dan pekerja. Banyak individu tidak menyadari 
    tingkat stres yang mereka alami hingga berdampak pada kesehatan fisik maupun 
    psikologis. Selain itu, keterbatasan akses terhadap layanan profesional 
    membuat deteksi dini menjadi sulit.
    </div>
""", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Solusi ───────────────────────────────────────────────────────
st.markdown('<div class="section-header">💡 Solusi yang Dikembangkan</div>', unsafe_allow_html=True)
st.markdown("""
    <div class="info-box">
    Proyek WarasIn membangun sistem klasifikasi tingkat stres berbasis 
    Machine Learning yang mampu mengelompokkan pengguna ke dalam kategori 
    <b>Rendah, Sedang, dan Tinggi</b> dengan memanfaatkan:<br><br>
    1. Data kuisioner standarisasi — <b>Sleep Health & Lifestyle Dataset</b><br>
    2. Data ekspresi wajah — <b>Facial Expression Dataset</b>
    </div>
""", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Business Questions ────────────────────────────────────────────
st.markdown('<div class="section-header">❓ Business Questions</div>', unsafe_allow_html=True)

col1, col2 = st.columns(2)
with col1:
    st.markdown("**📊 Dataset 1 — Sleep Health & Lifestyle**")
    bqs1 = [
        "Faktor apa saja yang paling berpengaruh terhadap tingkat stres pengguna?",
        "Sejauh mana beban kerja dan pola tidur dapat memengaruhi tingkat stres?",
        "Bagaimana distribusi tingkat stres dalam dataset (rendah, sedang, tinggi)?",
        "Bagaimana aktivitas fisik memengaruhi stres dan kualitas tidur?",
        "Apakah terdapat pola antara sleep disorder dengan stress level?"
    ]
    for i, bq in enumerate(bqs1, 1):
        st.markdown(f"""
            <div class="bq-card">
                <p><b>BQ {i}:</b> {bq}</p>
            </div>
        """, unsafe_allow_html=True)

with col2:
    st.markdown("**😊 Dataset 2 — Facial Expression**")
    bqs2 = [
        "Bagaimana distribusi jumlah gambar per kategori emosi?",
        "Apakah dataset seimbang atau tidak seimbang (imbalanced)?",
        "Kategori emosi apa yang paling dominan dalam dataset?",
        "Bagaimana perbandingan jumlah data train dan test?"
    ]
    for i, bq in enumerate(bqs2, 1):
        st.markdown(f"""
            <div class="bq-card" style="border-left-color:#52B788;">
                <p><b>BQ {i}:</b> {bq}</p>
            </div>
        """, unsafe_allow_html=True)

st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Tujuan Analisis ───────────────────────────────────────────────
st.markdown('<div class="section-header">🎯 Tujuan Analisis</div>', unsafe_allow_html=True)
tujuan = [
    "Menganalisis karakteristik data untuk memahami pola tingkat stres pengguna.",
    "Mengidentifikasi fitur-fitur yang paling berpengaruh terhadap tingkat stres sebagai dasar pengambilan keputusan.",
    "Mendukung pengembangan sistem prediksi stres melalui analisis berbasis data."
]
for i, t in enumerate(tujuan, 1):
    st.markdown(f"""
        <div class="bq-card" style="border-left-color:#FFD166;">
            <p><b>{i}.</b> {t}</p>
        </div>
    """, unsafe_allow_html=True)