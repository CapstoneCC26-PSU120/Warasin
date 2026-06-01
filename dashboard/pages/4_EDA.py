import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.figure_factory as ff
import sys
import pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from loader import load_dataset1, load_dataset2

st.set_page_config(page_title="EDA", page_icon="📈", layout="wide")

st.markdown("""
<style>
.main { background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 40%, rgba(255,251,235,0.6) 100%); }
[data-testid="stSidebar"] { background-color: #FFFFFF; box-shadow: 2px 0 8px rgba(0,0,0,0.05); }
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

st.markdown("""
    <p style="font-size:2.5rem;font-weight:800;color:#0E8CD3;margin:0;">📈 Exploratory Data Analysis</p>
    <p style="color:#64748B;font-size:1rem;margin:4px 0 0;">Analisis Distribusi & Korelasi</p>
""", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

tab1, tab2 = st.tabs(["📊 Dataset 1 — Sleep Health", "😊 Dataset 2 — Facial Expression"])

with tab1:
    # Distribusi Variabel Numerik
    st.markdown('<div class="section-header">📊 Distribusi Variabel Numerik</div>', unsafe_allow_html=True)
    num_cols = ['Sleep Duration', 'Quality of Sleep', 'Physical Activity Level',
                'Stress Level', 'Heart Rate', 'Daily Steps']
    cols = st.columns(3)
    for i, col in enumerate(num_cols):
        with cols[i % 3]:
            fig = px.histogram(df1, x=col, template='plotly_white',
                               color_discrete_sequence=['#0E8CD3'],
                               title=col)
            fig.update_layout(showlegend=False, height=250,
                              margin=dict(t=40, b=20, l=20, r=20))
            st.plotly_chart(fig, use_container_width=True, key=f"dist_{i}")
    st.markdown('<hr class="divider">', unsafe_allow_html=True)

    # Boxplot Outlier
    st.markdown('<div class="section-header">📦 Boxplot — Deteksi Outlier</div>', unsafe_allow_html=True)
    cols2 = st.columns(3)
    for i, col in enumerate(num_cols):
        with cols2[i % 3]:
            fig = px.box(df1, y=col, template='plotly_white',
                         color_discrete_sequence=['#0E8CD3'],
                         title=col)
            fig.update_layout(height=250,
                              margin=dict(t=40, b=20, l=20, r=20))
            st.plotly_chart(fig, use_container_width=True, key=f"box_{i}")
    st.markdown('<hr class="divider">', unsafe_allow_html=True)

    # Heatmap Korelasi
    st.markdown('<div class="section-header">🔥 Heatmap Korelasi Antar Fitur Numerik</div>', unsafe_allow_html=True)
    corr_cols = ['Age', 'Sleep Duration', 'Quality of Sleep',
                 'Physical Activity Level', 'Stress Level',
                 'Heart Rate', 'Daily Steps', 'BP_Systolic', 'BP_Diastolic']
    corr_matrix = df1[corr_cols].corr().round(2)
    fig_heatmap = px.imshow(corr_matrix,
                            color_continuous_scale='RdBu_r',
                            zmin=-1, zmax=1,
                            template='plotly_white',
                            text_auto=True)
    fig_heatmap.update_layout(height=500)
    st.plotly_chart(fig_heatmap, use_container_width=True, key="heatmap")

    st.markdown("""
        <div class="insight-box">
        📌 <b>Insight:</b> Quality of Sleep memiliki korelasi negatif terkuat dengan 
        Stress Level (-0.69), diikuti Sleep Duration (-0.42). BP_Systolic memiliki 
        korelasi positif tertinggi (0.81) menunjukkan tekanan darah tinggi berkaitan 
        dengan stres tinggi.
        </div>
    """, unsafe_allow_html=True)

with tab2:
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

    # Distribusi Train & Test
    st.markdown('<div class="section-header">📊 Distribusi Dataset Facial Expression</div>', unsafe_allow_html=True)
    col1, col2 = st.columns(2)
    with col1:
        fig1 = px.bar(df_dist, x='Kategori', y='Train',
                      color='Kategori', title='Train Set',
                      template='plotly_white', text='Train',
                      color_discrete_sequence=color_list)
        fig1.update_traces(textposition='outside')
        fig1.update_layout(showlegend=False)
        st.plotly_chart(fig1, use_container_width=True, key="eda_train")
    with col2:
        fig2 = px.bar(df_dist, x='Kategori', y='Test',
                      color='Kategori', title='Test Set',
                      template='plotly_white', text='Test',
                      color_discrete_sequence=color_list)
        fig2.update_traces(textposition='outside')
        fig2.update_layout(showlegend=False)
        st.plotly_chart(fig2, use_container_width=True, key="eda_test")

    st.markdown('<hr class="divider">', unsafe_allow_html=True)

    # Rasio Train vs Test
    st.markdown('<div class="section-header">⚖️ Rasio Train vs Test (80:20)</div>', unsafe_allow_html=True)
    total_train = sum(train_counts.values())
    total_test = sum(test_counts.values())
    total_all = total_train + total_test

    col1, col2 = st.columns(2)
    with col1:
        fig3 = px.pie(values=[total_train, total_test],
                      names=['Train', 'Test'],
                      color_discrete_sequence=['#0E8CD3', '#E63946'],
                      hole=0.4,
                      template='plotly_white')
        fig3.update_traces(textposition='inside', textinfo='percent+label')
        st.plotly_chart(fig3, use_container_width=True, key="eda_ratio")
    with col2:
        st.markdown(f"""
            <div style="text-align:center;padding:40px;">
                <p style="font-size:4rem;font-weight:800;color:#0E8CD3;">80:20</p>
                <p style="font-size:1.2rem;color:#64748B;">Train: {total_train:,} gambar</p>
                <p style="font-size:1.2rem;color:#E63946;">Test: {total_test:,} gambar</p>
                <p style="font-size:1rem;color:#64748B;">Total: {total_all:,} gambar</p>
            </div>
        """, unsafe_allow_html=True)

    st.markdown("""
        <div class="insight-box">
        📌 <b>Insight:</b> Rasio Train/Test 80:20 sudah ideal untuk pengembangan model 
        — cukup data untuk training sekaligus evaluasi yang objektif.
        </div>
    """, unsafe_allow_html=True)