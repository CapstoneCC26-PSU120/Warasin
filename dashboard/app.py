import streamlit as st

st.set_page_config(
    page_title="WarasIn - Dashboard",
    page_icon="🧠",
    layout="wide"
)

# ── Custom CSS ──────────────────────────────────────────────────
st.markdown("""
    <style>
    .main { background-color: #f8f9fa; }
    .hero-title {
        font-size: 3rem;
        font-weight: 800;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 0;
    }
    .hero-subtitle {
        font-size: 1.2rem;
        color: #7f8c8d;
        text-align: center;
        margin-bottom: 2rem;
    }
    .card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        text-align: center;
        border-left: 5px solid #3498db;
    }
    .card-title {
        font-size: 1rem;
        color: #7f8c8d;
        margin-bottom: 8px;
    }
    .card-value {
        font-size: 1.8rem;
        font-weight: 700;
        color: #2c3e50;
    }
    .nav-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        text-align: center;
        transition: 0.3s;
    }
    </style>
""", unsafe_allow_html=True)

# ── Hero Section ────────────────────────────────────────────────
st.markdown('<div class="hero-title">🧠 WarasIn</div>', unsafe_allow_html=True)
st.markdown('<div class="hero-subtitle">Stress Level Analysis Dashboard | Coding Camp 2026 · CC26-PSU120</div>', unsafe_allow_html=True)

st.markdown("---")

# ── Metrics ─────────────────────────────────────────────────────
col1, col2, col3 = st.columns(3)
with col1:
    st.markdown("""
        <div class="card">
            <div class="card-title">📊 Total Data</div>
            <div class="card-value">4.762 baris</div>
        </div>
    """, unsafe_allow_html=True)
with col2:
    st.markdown("""
        <div class="card" style="border-left-color: #2ecc71;">
            <div class="card-title">🧩 Jumlah Fitur</div>
            <div class="card-value">13 kolom</div>
        </div>
    """, unsafe_allow_html=True)
with col3:
    st.markdown("""
        <div class="card" style="border-left-color: #e74c3c;">
            <div class="card-title">🎯 Target Variable</div>
            <div class="card-value">Stress Level (3–8)</div>
        </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)
st.markdown("---")

# ── Navigasi ────────────────────────────────────────────────────
st.markdown("### 🗂️ Navigasi Halaman")
st.markdown("<br>", unsafe_allow_html=True)

col1, col2 = st.columns(2)
with col1:
    st.markdown("""
        <div class="nav-card">
            <h2>📊</h2>
            <h3>Overview</h3>
            <p style="color:#7f8c8d;">Ringkasan dataset, statistik utama, dan distribusi data.</p>
        </div>
    """, unsafe_allow_html=True)
with col2:
    st.markdown("""
        <div class="nav-card">
            <h2>🔍</h2>
            <h3>Analisis Data</h3>
            <p style="color:#7f8c8d;">EDA, korelasi fitur, dan eksplorasi interaktif.</p>
        </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)
st.markdown("---")
st.markdown('<p style="text-align:center; color:#bdc3c7;">WarasIn · Coding Camp 2026 · CC26-PSU120</p>', unsafe_allow_html=True)