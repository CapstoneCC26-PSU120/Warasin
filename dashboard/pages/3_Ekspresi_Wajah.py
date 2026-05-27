import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Ekspresi Wajah", page_icon="😊", layout="wide")

st.markdown("""
    <style>
    .main { background-color: #f0f2f6; }
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

# ── Header ──────────────────────────────────────────────────────
st.markdown("## 😊 Analisis Dataset Ekspresi Wajah")
st.markdown('<p style="color:#888;">Eksplorasi dataset Facial Expression untuk mendukung deteksi stres berbasis ekspresi wajah.</p>', unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Metrics ─────────────────────────────────────────────────────
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.markdown("""
        <div class="metric-card">
            <div class="metric-icon">🖼️</div>
            <div>
                <p class="metric-value">35.887</p>
                <p class="metric-label">Total Gambar</p>
            </div>
        </div>
    """, unsafe_allow_html=True)
with col2:
    st.markdown("""
        <div class="metric-card">
            <div class="metric-icon">🏋️</div>
            <div>
                <p class="metric-value">28.709</p>
                <p class="metric-label">Data Train (80%)</p>
            </div>
        </div>
    """, unsafe_allow_html=True)
with col3:
    st.markdown("""
        <div class="metric-card">
            <div class="metric-icon">🧪</div>
            <div>
                <p class="metric-value">7.178</p>
                <p class="metric-label">Data Test (20%)</p>
            </div>
        </div>
    """, unsafe_allow_html=True)
with col4:
    st.markdown("""
        <div class="metric-card">
            <div class="metric-icon">😶</div>
            <div>
                <p class="metric-value">7</p>
                <p class="metric-label">Kategori Emosi</p>
            </div>
        </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Data & Color Map ─────────────────────────────────────────────
data = {
    'Kategori': ['Happy', 'Neutral', 'Sad', 'Fear', 'Angry', 'Surprise', 'Disgust'],
    'Train': [7215, 4965, 4830, 4097, 3995, 3171, 436],
    'Test': [1774, 1233, 1247, 1024, 958, 831, 111]
}
df = pd.DataFrame(data)
df['Total'] = df['Train'] + df['Test']
df['Persentase'] = (df['Total'] / df['Total'].sum() * 100).round(1)

color_map = {
    'Happy': '#2ecc71',
    'Neutral': '#3498db',
    'Sad': '#9b59b6',
    'Fear': '#e74c3c',
    'Angry': '#e67e22',
    'Surprise': '#f1c40f',
    'Disgust': '#1abc9c'
}

# ── Distribusi per Kategori ──────────────────────────────────────
st.markdown('<p class="section-title">📊 Distribusi Gambar per Kategori Emosi</p>', unsafe_allow_html=True)
col1, col2 = st.columns(2)
with col1:
    fig1 = px.bar(df, x='Kategori', y='Train',
                  color='Kategori',
                  title='Jumlah Gambar Train per Kategori',
                  template='plotly_white',
                  text='Train',
                  color_discrete_map=color_map)
    fig1.update_traces(textposition='outside')
    fig1.update_layout(showlegend=False,
                       plot_bgcolor='white', paper_bgcolor='white')
    st.plotly_chart(fig1, use_container_width=True, key="train_dist")
with col2:
    fig2 = px.bar(df, x='Kategori', y='Test',
                  color='Kategori',
                  title='Jumlah Gambar Test per Kategori',
                  template='plotly_white',
                  text='Test',
                  color_discrete_map=color_map)
    fig2.update_traces(textposition='outside')
    fig2.update_layout(showlegend=False,
                       plot_bgcolor='white', paper_bgcolor='white')
    st.plotly_chart(fig2, use_container_width=True, key="test_dist")

st.markdown("""
    <div class="insight-box">
        <p>💡 <b>Insight BQ 1 & 2:</b> Dataset bersifat <b>imbalanced</b> — Happy mendominasi 
        dengan 7.215 gambar train, sedangkan Disgust hanya 436 gambar (16x lebih sedikit). 
        Tim AI Engineer perlu menangani ini dengan Data Augmentation.</p>
    </div>
""", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Proporsi Total ───────────────────────────────────────────────
st.markdown('<p class="section-title">🥧 Proporsi Kategori Emosi</p>', unsafe_allow_html=True)
col3, col4 = st.columns(2)
with col3:
    fig3 = px.pie(df, names='Kategori', values='Total',
                  title='Proporsi Total Gambar per Kategori',
                  template='plotly_white',
                  hole=0.5,
                  color='Kategori',
                  color_discrete_map=color_map)
    fig3.update_traces(textposition='inside', textinfo='percent+label')
    fig3.update_layout(plot_bgcolor='white', paper_bgcolor='white',
                       showlegend=False)
    st.plotly_chart(fig3, use_container_width=True, key="pie_chart")
with col4:
    fig4 = px.bar(df.sort_values('Total'), x='Total', y='Kategori',
                  orientation='h',
                  color='Kategori',
                  title='Ranking Kategori berdasarkan Total Gambar',
                  template='plotly_white',
                  text='Total',
                  color_discrete_map=color_map)
    fig4.update_traces(textposition='outside')
    fig4.update_layout(showlegend=False,
                       plot_bgcolor='white', paper_bgcolor='white')
    st.plotly_chart(fig4, use_container_width=True, key="ranking_bar")

st.markdown("""
    <div class="insight-box">
        <p>💡 <b>Insight BQ 3:</b> Happy mendominasi dengan 25,1% dari total dataset. 
        Disgust hanya 1,5% — paling sedikit dan berpotensi menyebabkan model bias.</p>
    </div>
""", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Train vs Test ────────────────────────────────────────────────
st.markdown('<p class="section-title">⚖️ Perbandingan Train vs Test</p>', unsafe_allow_html=True)
df_melt = df.melt(id_vars='Kategori', value_vars=['Train', 'Test'],
                   var_name='Split', value_name='Jumlah')
fig5 = px.bar(df_melt, x='Kategori', y='Jumlah',
              color='Split', barmode='group',
              title='Perbandingan Train vs Test per Kategori',
              template='plotly_white',
              color_discrete_sequence=['#667eea', '#f5576c'])
fig5.update_layout(plot_bgcolor='white', paper_bgcolor='white')
st.plotly_chart(fig5, use_container_width=True, key="train_test_compare")

st.markdown("""
    <div class="insight-box">
        <p>💡 <b>Insight BQ 4:</b> Rasio Train/Test <b>80:20</b> sudah ideal — 
        28.709 gambar train dan 7.178 gambar test. Proporsi ini konsisten 
        di semua kategori emosi.</p>
    </div>
""", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Brightness ───────────────────────────────────────────────────
st.markdown('<p class="section-title">💡 Rata-rata Brightness per Kategori</p>', unsafe_allow_html=True)
brightness_data = {
    'Kategori': ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'],
    'Brightness': [127.26, 136.77, 141.53, 133.10, 126.14, 122.01, 143.47]
}
df_bright = pd.DataFrame(brightness_data).sort_values('Brightness')
fig6 = px.bar(df_bright, x='Brightness', y='Kategori',
              orientation='h',
              color='Brightness',
              color_continuous_scale='YlOrRd',
              title='Rata-rata Brightness per Kategori Emosi',
              template='plotly_white',
              text='Brightness')
fig6.update_traces(texttemplate='%{text:.1f}', textposition='outside')
fig6.update_layout(coloraxis_showscale=False,
                   plot_bgcolor='white', paper_bgcolor='white')
st.plotly_chart(fig6, use_container_width=True, key="brightness_bar")

st.markdown("""
    <div class="insight-box">
        <p>💡 <b>Insight Brightness:</b> Surprise (143.5) & Fear (141.5) memiliki 
        brightness tertinggi — mata terbuka lebar membuat gambar lebih terang. 
        Sad (122.0) & Neutral (126.1) paling gelap karena ekspresi lebih datar.</p>
    </div>
""", unsafe_allow_html=True)