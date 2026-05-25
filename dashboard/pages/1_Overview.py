import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Overview", page_icon="📊", layout="wide")

st.markdown("""
    <style>
    .main { background-color: #f0f2f6; }
    .card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        margin-bottom: 16px;
    }
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
    .insight-box {
        background: #f8f9ff;
        border-left: 4px solid #667eea;
        border-radius: 0 8px 8px 0;
        padding: 12px 16px;
        margin: 12px 0;
    }
    .insight-box p { margin: 0; color: #444; font-size: 0.9rem; }
    .section-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #1a1a2e;
        margin-bottom: 16px;
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

@st.cache_data
def load_data():
    return pd.read_csv('data/sleep_health_cleaned.csv')

df = load_data()

# ── Header ──────────────────────────────────────────────────────
st.markdown("## 📊 Overview Dataset")
st.markdown('<p style="color:#888;">Ringkasan umum dataset Sleep Health & Lifestyle.</p>', unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Metrics ─────────────────────────────────────────────────────
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.markdown(f"""
        <div class="metric-card">
            <div class="metric-icon">📋</div>
            <div>
                <p class="metric-value">{len(df):,}</p>
                <p class="metric-label">Total Data</p>
            </div>
        </div>
    """, unsafe_allow_html=True)
with col2:
    st.markdown(f"""
        <div class="metric-card">
            <div class="metric-icon">🧩</div>
            <div>
                <p class="metric-value">{df.shape[1]}</p>
                <p class="metric-label">Jumlah Fitur</p>
            </div>
        </div>
    """, unsafe_allow_html=True)
with col3:
    st.markdown(f"""
        <div class="metric-card">
            <div class="metric-icon">😰</div>
            <div>
                <p class="metric-value">{df['Stress Level'].mean():.2f}</p>
                <p class="metric-label">Rata-rata Stress Level</p>
            </div>
        </div>
    """, unsafe_allow_html=True)
with col4:
    st.markdown(f"""
        <div class="metric-card">
            <div class="metric-icon">😴</div>
            <div>
                <p class="metric-value">{df['Sleep Duration'].mean():.1f} jam</p>
                <p class="metric-label">Rata-rata Durasi Tidur</p>
            </div>
        </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Preview Data ─────────────────────────────────────────────────
st.markdown('<p class="section-title">🔎 Preview Data</p>', unsafe_allow_html=True)
st.dataframe(df.head(10), use_container_width=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Distribusi Stress Level ──────────────────────────────────────
st.markdown('<p class="section-title">📈 Distribusi Stress Level</p>', unsafe_allow_html=True)
stress_counts = df.groupby('Stress Level').size().reset_index(name='Count')
color_map = {
    '3': '#2ecc71', '4': '#27ae60', '5': '#f39c12',
    '6': '#e67e22', '7': '#e74c3c', '8': '#c0392b'
}
stress_counts['Stress Level'] = stress_counts['Stress Level'].astype(str)
fig = px.bar(stress_counts, x='Stress Level', y='Count',
             color='Stress Level',
             color_discrete_map=color_map,
             template='plotly_white',
             text='Count')
fig.update_traces(textposition='outside')
fig.update_layout(showlegend=False, bargap=0.2,
                  plot_bgcolor='white', paper_bgcolor='white')
st.plotly_chart(fig, use_container_width=True, key="stress_dist")

st.markdown("""
    <div class="insight-box">
        <p>💡 Distribusi bersifat bimodal — puncak di stress level 3 (rendah) dan 8 (tinggi). 
        Individu cenderung berada di kondisi ekstrem.</p>
    </div>
""", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Distribusi Gender ────────────────────────────────────────────
st.markdown('<p class="section-title">👥 Distribusi Gender & Pekerjaan</p>', unsafe_allow_html=True)
col1, col2 = st.columns(2)
with col1:
    fig2 = px.pie(df, names='Gender',
                  color_discrete_sequence=['#667eea', '#f5576c'],
                  template='plotly_white',
                  hole=0.5)
    fig2.update_traces(textposition='inside', textinfo='percent+label')
    fig2.update_layout(plot_bgcolor='white', paper_bgcolor='white',
                       showlegend=False)
    st.plotly_chart(fig2, use_container_width=True, key="gender_pie")
with col2:
    fig3 = px.histogram(df, x='Occupation', color='Gender',
                        barmode='group',
                        color_discrete_sequence=['#667eea', '#f5576c'],
                        template='plotly_white')
    fig3.update_xaxes(tickangle=45)
    fig3.update_layout(plot_bgcolor='white', paper_bgcolor='white',
                       legend_title='Gender')
    st.plotly_chart(fig3, use_container_width=True, key="occupation_bar")

st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── BMI Category ────────────────────────────────────────────────
st.markdown('<p class="section-title">⚖️ Distribusi BMI Category</p>', unsafe_allow_html=True)
bmi_counts = df['BMI Category'].value_counts().reset_index()
bmi_counts.columns = ['BMI Category', 'Count']
fig4 = px.bar(bmi_counts, x='BMI Category', y='Count',
              color='BMI Category',
              color_discrete_sequence=['#2ecc71', '#667eea', '#f5576c'],
              template='plotly_white',
              text='Count')
fig4.update_traces(textposition='outside')
fig4.update_layout(showlegend=False,
                   plot_bgcolor='white', paper_bgcolor='white')
st.plotly_chart(fig4, use_container_width=True, key="bmi_bar")