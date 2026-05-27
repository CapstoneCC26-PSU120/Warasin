import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Analisis Data", page_icon="🔍", layout="wide")

st.markdown("""
    <style>
    .main { background-color: #f0f2f6; }
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
df['Sleep Disorder'] = df['Sleep Disorder'].fillna('None')

# ── Header ──────────────────────────────────────────────────────
st.markdown("## 🔍 Analisis Data")
st.markdown('<p style="color:#888;">Eksplorasi mendalam fitur-fitur yang berpengaruh terhadap tingkat stres.</p>', unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Korelasi ─────────────────────────────────────────────────────
st.markdown('<p class="section-title">📌 Korelasi Fitur dengan Stress Level</p>', unsafe_allow_html=True)
num_cols = ['Sleep Duration', 'Quality of Sleep', 'Physical Activity Level',
            'Heart Rate', 'Daily Steps', 'BP_Systolic', 'BP_Diastolic', 'Age']
corr = df[num_cols + ['Stress Level']].corr()['Stress Level'].drop('Stress Level').sort_values()
fig1 = px.bar(x=corr.values, y=corr.index, orientation='h',
              color=corr.values,
              color_continuous_scale='RdBu_r',
              template='plotly_white',
              labels={'x': 'Korelasi', 'y': 'Fitur'})
fig1.update_layout(coloraxis_showscale=False,
                   plot_bgcolor='white', paper_bgcolor='white')
st.plotly_chart(fig1, use_container_width=True, key="corr_bar")

st.markdown("""
    <div class="insight-box">
        <p>💡 Quality of Sleep dan Sleep Duration memiliki korelasi negatif terkuat — 
        semakin baik tidur, semakin rendah stres.</p>
    </div>
""", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Sleep Duration vs Stress ──────────────────────────────────────
st.markdown('<p class="section-title">😴 Sleep Duration vs Stress Level</p>', unsafe_allow_html=True)
fig2 = px.scatter(df, x='Sleep Duration', y='Stress Level',
                  color='BMI Category',
                  size='Physical Activity Level',
                  color_discrete_sequence=['#2ecc71', '#667eea', '#f5576c'],
                  template='plotly_white',
                  hover_data=['Occupation', 'Sleep Disorder'])
fig2.update_layout(plot_bgcolor='white', paper_bgcolor='white')
st.plotly_chart(fig2, use_container_width=True, key="scatter")

st.markdown("""
    <div class="insight-box">
        <p>💡 Individu dengan durasi tidur &lt; 6 jam cenderung memiliki stress level 7–8. 
        Tidur ≥ 7 jam berkaitan dengan stress level lebih rendah.</p>
    </div>
""", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Sleep Disorder vs Stress ──────────────────────────────────────
st.markdown('<p class="section-title">🛌 Sleep Disorder vs Stress Level</p>', unsafe_allow_html=True)
order = ['None', 'Sleep Apnea', 'Insomnia']
avg_stress = df.groupby('Sleep Disorder')['Stress Level'].mean().reset_index()
avg_stress['Sleep Disorder'] = pd.Categorical(avg_stress['Sleep Disorder'],
                                               categories=order, ordered=True)
avg_stress = avg_stress.sort_values('Sleep Disorder')
fig3 = px.bar(avg_stress, x='Sleep Disorder', y='Stress Level',
              color='Sleep Disorder',
              color_discrete_sequence=['#2ecc71', '#f39c12', '#e74c3c'],
              template='plotly_white',
              text='Stress Level')
fig3.update_traces(texttemplate='%{text:.2f}', textposition='outside')
fig3.update_layout(showlegend=False,
                   plot_bgcolor='white', paper_bgcolor='white')
st.plotly_chart(fig3, use_container_width=True, key="disorder_bar")

st.markdown("""
    <div class="insight-box">
        <p>💡 Insomnia memiliki rata-rata stress level tertinggi, diikuti Sleep Apnea. 
        Individu tanpa gangguan tidur memiliki stres paling rendah.</p>
    </div>
""", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ── Filter Interaktif ─────────────────────────────────────────────
st.markdown('<p class="section-title">🎛️ Eksplorasi Data Interaktif</p>', unsafe_allow_html=True)
col1, col2 = st.columns(2)
with col1:
    gender = st.multiselect("Filter Gender",
                             df['Gender'].unique(),
                             default=df['Gender'].unique())
with col2:
    bmi = st.multiselect("Filter BMI Category",
                          df['BMI Category'].unique(),
                          default=df['BMI Category'].unique())

df_filtered = df[(df['Gender'].isin(gender)) & (df['BMI Category'].isin(bmi))]

col3, col4 = st.columns(2)
with col3:
    fig4 = px.box(df_filtered, x='Occupation', y='Stress Level',
                  color='Gender',
                  color_discrete_sequence=['#667eea', '#f5576c'],
                  template='plotly_white')
    fig4.update_xaxes(tickangle=45)
    fig4.update_layout(plot_bgcolor='white', paper_bgcolor='white')
    st.plotly_chart(fig4, use_container_width=True, key="box_plot")
with col4:
    fig5 = px.histogram(df_filtered, x='Physical Activity Level',
                        color='Gender',
                        barmode='overlay',
                        color_discrete_sequence=['#667eea', '#f5576c'],
                        template='plotly_white',
                        opacity=0.7)
    fig5.update_layout(plot_bgcolor='white', paper_bgcolor='white')
    st.plotly_chart(fig5, use_container_width=True, key="activity_hist")