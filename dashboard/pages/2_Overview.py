import streamlit as st
import pandas as pd
import plotly.express as px
import sys
import pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from loader import load_dataset1, load_dataset2

st.set_page_config(page_title="Overview", page_icon="📊", layout="wide")

st.markdown("""
<style>
.main { background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 40%, rgba(255,251,235,0.6) 100%); }
[data-testid="stSidebar"] { background-color: #FFFFFF; box-shadow: 2px 0 8px rgba(0,0,0,0.05); }
.metric-card {
    background: #FFFFFF;
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    border-top: 4px solid #0E8CD3;
}
.metric-card .label { font-size: 13px; color: #64748B; margin-bottom: 4px; }
.metric-card .value { font-size: 32px; font-weight: 700; color: #0E8CD3; }
.metric-card-green  { border-top-color: #52B788 !important; }
.metric-card-orange { border-top-color: #FFD166 !important; }
.metric-card-red    { border-top-color: #E63946 !important; }
.section-header {
    background: linear-gradient(90deg, #0E8CD3, #0E8CD3);
    color: white !important;
    padding: 10px 20px;
    border-radius: 10px;
    margin: 20px 0 14px 0;
    font-size: 18px;
    font-weight: 600;
}
.insight-box {
    background: #FFFBEB;
    border-left: 6px solid #FFD166;
    border-radius: 8px;
    padding: 16px 20px;
    margin: 16px 0;
    font-size: 20px;
    line-height: 1.6;
    color: #2B3A55;
}
.divider { border: none; border-top: 1px solid #E2E8F0; margin: 20px 0; }
</style>
""", unsafe_allow_html=True)

df1 = load_dataset1()
df2, train_counts, test_counts = load_dataset2()

# ── Header ──────────────────────────────────────────────────────
st.markdown("""
    <p style="font-size:2.5rem;font-weight:800;color:#0E8CD3;margin:0;">📊 Overview Dataset</p>
    <p style="color:#64748B;font-size:1rem;margin:4px 0 0;">Ringkasan umum kedua dataset yang digunakan dalam analisis.</p>
""", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Tab Dataset 1 & 2 ────────────────────────────────────────────
tab1, tab2 = st.tabs(["📋 Dataset 1 — Sleep Health", "🖼️ Dataset 2 — Facial Expression"])

with tab1:
    st.markdown('<div class="section-header">📋 Dataset 1 — Sleep Health & Lifestyle</div>', unsafe_allow_html=True)

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f"""
            <div class="metric-card">
                <div class="label">📋 Total Data</div>
                <div class="value">{len(df1):,}</div>
            </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown(f"""
            <div class="metric-card metric-card-green">
                <div class="label">🧩 Jumlah Fitur</div>
                <div class="value">{df1.shape[1] - 1}</div>
            </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown(f"""
            <div class="metric-card metric-card-orange">
                <div class="label">😰 Rata-rata Stres</div>
                <div class="value">{df1['Stress Level'].mean():.2f}</div>
            </div>
        """, unsafe_allow_html=True)
    with col4:
        st.markdown(f"""
            <div class="metric-card metric-card-red">
                <div class="label">😴 Rata-rata Tidur</div>
                <div class="value">{df1['Sleep Duration'].mean():.1f} jam</div>
            </div>
        """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("#### 🔎 Preview Data")
    st.dataframe(df1.head(10), use_container_width=True)
    st.markdown('<hr class="divider">', unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    with col1:
        fig1 = px.pie(df1, names='Gender',
                      color_discrete_sequence=['#0E8CD3', '#E63946'],
                      title='Proporsi Gender',
                      hole=0.5,
                      template='plotly_white')
        fig1.update_traces(textposition='inside', textinfo='percent+label')
        fig1.update_layout(showlegend=False)
        st.plotly_chart(fig1, use_container_width=True, key="gender_pie")
    with col2:
        fig2 = px.histogram(df1, x='Occupation', color='Gender',
                            barmode='group',
                            color_discrete_sequence=['#0E8CD3', '#E63946'],
                            title='Distribusi Pekerjaan per Gender',
                            template='plotly_white')
        fig2.update_xaxes(tickangle=45)
        st.plotly_chart(fig2, use_container_width=True, key="occ_bar")

    stress_counts_df = df1.groupby('Stress Level').size().reset_index(name='Count')
    color_map = {'3': '#2ecc71', '4': '#27ae60', '5': '#f39c12',
                 '6': '#e67e22', '7': '#e74c3c', '8': '#c0392b'}
    stress_counts_df['Stress Level'] = stress_counts_df['Stress Level'].astype(str)
    fig3 = px.bar(stress_counts_df, x='Stress Level', y='Count',
                  color='Stress Level',
                  color_discrete_map=color_map,
                  title='Distribusi Stress Level',
                  template='plotly_white',
                  text='Count')
    fig3.update_traces(textposition='outside')
    fig3.update_layout(showlegend=False, bargap=0.2)
    st.plotly_chart(fig3, use_container_width=True, key="stress_dist")

    st.markdown("""
        <div class="insight-box">
        📌 <b>Insight:</b> Distribusi bersifat bimodal — puncak di stress level 3 (rendah) 
        dan 8 (tinggi). Individu cenderung berada di kondisi ekstrem.
        </div>
    """, unsafe_allow_html=True)

with tab2:
    st.markdown('<div class="section-header">🖼️ Dataset 2 — Facial Expression</div>', unsafe_allow_html=True)

    total_all = sum(train_counts.values()) + sum(test_counts.values())
    total_train = sum(train_counts.values())
    total_test = sum(test_counts.values())

    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f"""
            <div class="metric-card">
                <div class="label">🖼️ Total Gambar</div>
                <div class="value">{total_all:,}</div>
            </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown(f"""
            <div class="metric-card metric-card-green">
                <div class="label">🏋️ Data Train</div>
                <div class="value">{total_train:,}</div>
            </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown(f"""
            <div class="metric-card metric-card-orange">
                <div class="label">🧪 Data Test</div>
                <div class="value">{total_test:,}</div>
            </div>
        """, unsafe_allow_html=True)
    with col4:
        st.markdown(f"""
            <div class="metric-card metric-card-red">
                <div class="label">😶 Kategori Emosi</div>
                <div class="value">{len(train_counts)}</div>
            </div>
        """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    cats = list(train_counts.keys())
    color_map2 = {
        'happy': '#2ecc71', 'neutral': '#3498db', 'sad': '#9b59b6',
        'fear': '#e74c3c', 'angry': '#e67e22', 'surprise': '#f1c40f',
        'disgust': '#1abc9c'
    }

    df_dist = pd.DataFrame({
        'Kategori': [k.capitalize() for k in cats],
        'Train': [train_counts[k] for k in cats],
        'Test': [test_counts[k] for k in cats]
    })
    df_dist['Total'] = df_dist['Train'] + df_dist['Test']
    color_list = [color_map2[k] for k in cats]

    col1, col2 = st.columns(2)
    with col1:
        fig4 = px.bar(df_dist, x='Kategori', y='Train',
                      color='Kategori',
                      title='Jumlah Gambar Train per Kategori',
                      template='plotly_white',
                      text='Train',
                      color_discrete_sequence=color_list)
        fig4.update_traces(textposition='outside')
        fig4.update_layout(showlegend=False)
        st.plotly_chart(fig4, use_container_width=True, key="train_dist")
    with col2:
        fig5 = px.pie(df_dist, names='Kategori', values='Total',
                      title='Proporsi Total Gambar per Kategori',
                      template='plotly_white',
                      hole=0.5,
                      color_discrete_sequence=color_list)
        fig5.update_traces(textposition='inside', textinfo='percent+label')
        fig5.update_layout(showlegend=False)
        st.plotly_chart(fig5, use_container_width=True, key="facial_pie")

    st.markdown("""
        <div class="insight-box">
        📌 <b>Insight:</b> Dataset bersifat <b>imbalanced</b> — Happy mendominasi dengan 
        7.215 gambar train, sedangkan Disgust hanya 436 gambar (16x lebih sedikit).
        </div>
    """, unsafe_allow_html=True)