import streamlit as st

st.set_page_config(
    page_title="WarasIn - Dashboard",
    page_icon="🧠",
    layout="wide"
)

st.markdown("""
    <style>
    /* Background */
    .main { background-color: #f0f2f6; }
    
    /* Card */
    .card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        margin-bottom: 16px;
    }
    
    /* Metric card */
    .metric-card {
        background: white;
        border-radius: 12px;
        padding: 20px 24px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        display: flex;
        align-items: center;
        gap: 16px;
    }
    .metric-icon {
        font-size: 2rem;
        background: #f0f4ff;
        border-radius: 10px;
        padding: 10px;
    }
    .metric-value {
        font-size: 1.6rem;
        font-weight: 800;
        color: #1a1a2e;
        margin: 0;
    }
    .metric-label {
        font-size: 0.85rem;
        color: #888;
        margin: 0;
    }

    /* Nav card */
    .nav-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        text-align: center;
        border-top: 4px solid #667eea;
    }
    .nav-card h3 { color: #1a1a2e; margin: 8px 0 4px; }
    .nav-card p { color: #888; font-size: 0.9rem; margin: 0; }

    /* Header */
    .header-title {
        font-size: 2.2rem;
        font-weight: 800;
        color: #1a1a2e;
        margin: 0;
    }
    .header-sub {
        color: #888;
        font-size: 1rem;
        margin: 4px 0 0;
    }
    .divider {
        border: none;
        border-top: 1px solid #e8e8e8;
        margin: 24px 0;
    }
    
    /* Sidebar styling */
    [data-testid="stSidebar"] {
    background-color: white;
    box-shadow: 2px 0 8px rgba(0,0,0,0.06);
    
    }
    
    [data-testid="stSidebar"] .stPageLink {
    border-radius: 8px;
    margin: 2px 8px;
    padding: 8px 12px;
    font-weight: 500;
    color: #444;
    }
            
    [data-testid="stSidebar"] .stPageLink:hover {
    background-color: #f0f4ff;
    color: #667eea;
    }
            
    [data-testid="stSidebar"] [aria-current="page"] {
    background-color: #f0f4ff;
    color: #667eea;
    font-weight: 700;
    border-left: 3px solid #667eea;
    }
    </style>
            
""", unsafe_allow_html=True)

# ── Header ──────────────────────────────────────────────────────
col_icon, col_title = st.columns([0.05, 0.95])
with col_icon:
    st.markdown("## 🧠")
with col_title:
    st.markdown("""
        <p class="header-title">WarasIn Dashboard</p>
        <p class="header-sub">Stress Level Analysis · Coding Camp 2026 · CC26-PSU120</p>
    """, unsafe_allow_html=True)

st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Metrics ─────────────────────────────────────────────────────
col1, col2, col3 = st.columns(3)
with col1:
    st.markdown("""
        <div class="metric-card">
            <div class="metric-icon">📋</div>
            <div>
                <p class="metric-value">4.762</p>
                <p class="metric-label">Total Data (baris)</p>
            </div>
        </div>
    """, unsafe_allow_html=True)
with col2:
    st.markdown("""
        <div class="metric-card">
            <div class="metric-icon">🧩</div>
            <div>
                <p class="metric-value">13</p>
                <p class="metric-label">Jumlah Fitur</p>
            </div>
        </div>
    """, unsafe_allow_html=True)
with col3:
    st.markdown("""
        <div class="metric-card">
            <div class="metric-icon">🎯</div>
            <div>
                <p class="metric-value">Stress Level</p>
                <p class="metric-label">Target Variable (skala 3–8)</p>
            </div>
        </div>
    """, unsafe_allow_html=True)

st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Navigasi ────────────────────────────────────────────────────
st.markdown("#### 🗂️ Navigasi Halaman")
st.markdown("<br>", unsafe_allow_html=True)

col1, col2, col3 = st.columns(3)
with col1:
    st.markdown("""
        <div class="nav-card">
            <div style="font-size:2rem">📊</div>
            <h3>Overview</h3>
            <p>Ringkasan dataset, statistik utama, dan distribusi data.</p>
        </div>
    """, unsafe_allow_html=True)
with col2:
    st.markdown("""
        <div class="nav-card" style="border-top-color: #11998e;">
            <div style="font-size:2rem">🔍</div>
            <h3>Analisis Data</h3>
            <p>EDA, korelasi fitur, dan eksplorasi interaktif.</p>
        </div>
    """, unsafe_allow_html=True)
with col3:
    st.markdown("""
        <div class="nav-card" style="border-top-color: #f5576c;">
            <div style="font-size:2rem">😊</div>
            <h3>Ekspresi Wajah</h3>
            <p>Analisis dataset facial expression untuk deteksi stres.</p>
        </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)
st.markdown('<p style="text-align:center;color:#bbb;font-size:0.85rem;">WarasIn · Coding Camp 2026 · CC26-PSU120</p>', unsafe_allow_html=True)
