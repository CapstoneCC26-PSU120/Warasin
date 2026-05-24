import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Overview", page_icon="📊", layout="wide")

# ── Custom CSS ──────────────────────────────────────────────────
st.markdown("""
    <style>
    .metric-card {
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        color: white;
        box-shadow: 0 4px 15px rgba(102,126,234,0.4);
    }
    .metric-card-green {
        background: linear-gradient(135deg, #11998e, #38ef7d);
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        color: white;
        box-shadow: 0 4px 15px rgba(17,153,142,0.4);
    }
    .metric-card-red {
        background: linear-gradient(135deg, #f093fb, #f5576c);
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        color: white;
        box-shadow: 0 4px 15px rgba(245,87,108,0.4);
    }
    .metric-card-orange {
        background: linear-gradient(135deg, #f7971e, #ffd200);
        border-radius: 16px;
        padding: 20px;
        text-align: center;
        color: white;
        box-shadow: 0 4px 15px rgba(247,151,30,0.4);
    }
    .metric-value {
        font-size: 2rem;
        font-weight: 800;
        margin: 0;
    }
    .metric-label {
        font-size: 0.9rem;
        opacity: 0.9;
        margin: 0;
    }
    </style>
""", unsafe_allow_html=True)

# ── Load Data ───────────────────────────────────────────────────
@st.cache_data
def load_data():
    return pd.read_csv('data/sleep_health_cleaned.csv')

df = load_data()

# ── Header ──────────────────────────────────────────────────────
st.markdown("# 📊 Overview Dataset")
st.markdown("Ringkasan umum dataset **Sleep Health & Lifestyle** yang digunakan dalam analisis.")
st.markdown("---")

# ── Metrics ─────────────────────────────────────────────────────
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.markdown(f"""
        <div class="metric-card">
            <p class="metric-label">📋 Total Data</p>
            <p class="metric-value">{len(df):,}</p>
            <p class="metric-label">baris</p>
        </div>
    """, unsafe_allow_html=True)
with col2:
    st.markdown(f"""
        <div class="metric-card-green">
            <p class="metric-label">🧩 Jumlah Fitur</p>
            <p class="metric-value">{df.shape[1]}</p>
            <p class="metric-label">kolom</p>
        </div>
    """, unsafe_allow_html=True)
with col3:
    st.markdown(f"""
        <div class="metric-card-red">
            <p class="metric-label">😰 Rata-rata Stres</p>
            <p class="metric-value">{df['Stress Level'].mean():.2f}</p>
            <p class="metric-label">dari skala 8</p>
        </div>
    """, unsafe_allow_html=True)
with col4:
    st.markdown(f"""
        <div class="metric-card-orange">
            <p class="metric-label">😴 Rata-rata Tidur</p>
            <p class="metric-value">{df['Sleep Duration'].mean():.1f}</p>
            <p class="metric-label">jam per malam</p>
        </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)
st.markdown("---")

# ── Preview Data ─────────────────────────────────────────────────
st.markdown("### 🔎 Preview Data")
st.dataframe(df.head(10), use_container_width=True)
st.markdown("---")

# ── Distribusi Stress Level ──────────────────────────────────────
st.markdown("### 📈 Distribusi Stress Level")
stress_counts = df.groupby('Stress Level').size().reset_index(name='Count')
color_map = {
    '3': '#2ecc71',
    '4': '#27ae60', 
    '5': '#f39c12',
    '6': '#e67e22',
    '7': '#e74c3c',
    '8': '#c0392b'
}
stress_counts['Stress Level'] = stress_counts['Stress Level'].astype(str)
fig = px.bar(stress_counts, x='Stress Level', y='Count',
             color='Stress Level',
             color_discrete_map=color_map,
             title='Distribusi Stress Level (Hijau = Rendah, Merah = Tinggi)',
             template='plotly_white',
             text='Count')
fig.update_traces(textposition='outside')
fig.update_layout(showlegend=False, bargap=0.2, title_font_size=16)

fig = px.bar(stress_counts, x='Stress Level', y='Count',
             color='Stress Level',
             color_discrete_map=color_map,
             title='Distribusi Stress Level (Hijau = Rendah, Merah = Tinggi)',
             template='plotly_white',
             text='Count')
fig.update_traces(textposition='outside')
fig.update_layout(showlegend=False, bargap=0.2, title_font_size=16)
st.plotly_chart(fig, use_container_width=True, key="stress_dist")
st.markdown("---")

# ── Distribusi Gender ────────────────────────────────────────────
st.markdown("### 👥 Distribusi Gender & Pekerjaan")
col1, col2 = st.columns(2)
with col1:
    fig2 = px.pie(df, names='Gender',
                  title='Proporsi Gender',
                  color_discrete_sequence=['#667eea', '#f5576c'],
                  template='plotly_white',
                  hole=0.4)
    fig2.update_traces(textposition='inside', textinfo='percent+label')
    st.plotly_chart(fig2, use_container_width=True, key="gender_pie")
with col2:
    fig3 = px.histogram(df, x='Occupation', color='Gender',
                        title='Distribusi Pekerjaan per Gender',
                        barmode='group',
                        color_discrete_sequence=['#667eea', '#f5576c'],
                        template='plotly_white')
    fig3.update_xaxes(tickangle=45)
    st.plotly_chart(fig3, use_container_width=True, key="occupation_bar")

st.markdown("---")

# ── BMI Category ────────────────────────────────────────────────
st.markdown("### ⚖️ Distribusi BMI Category")
bmi_counts = df['BMI Category'].value_counts().reset_index()
bmi_counts.columns = ['BMI Category', 'Count']
fig4 = px.bar(bmi_counts, x='BMI Category', y='Count',
              color='BMI Category',
              title='Jumlah per Kategori BMI',
              color_discrete_sequence=['#11998e', '#667eea', '#f5576c'],
              template='plotly_white')
fig4.update_layout(showlegend=False)
st.plotly_chart(fig4, use_container_width=True, key="bmi_bar")