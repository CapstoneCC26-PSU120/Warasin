import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="Analisis Data", page_icon="🔍", layout="wide")

st.markdown("""
    <style>
    .insight-box {
        background: linear-gradient(135deg, #667eea22, #764ba222);
        border-left: 5px solid #667eea;
        border-radius: 8px;
        padding: 16px 20px;
        margin: 10px 0;
    }
    .insight-box p { margin: 0; color: #2c3e50; }
    </style>
""", unsafe_allow_html=True)

@st.cache_data
def load_data():
    return pd.read_csv('data/sleep_health_cleaned.csv')

df = load_data()
df['Sleep Disorder'] = df['Sleep Disorder'].fillna('None')

st.markdown("# 🔍 Analisis Data")
st.markdown("Eksplorasi mendalam fitur-fitur yang berpengaruh terhadap tingkat stres.")
st.markdown("---")

# ── Korelasi ─────────────────────────────────────────────────────
st.markdown("### 📌 Korelasi Fitur dengan Stress Level")
num_cols = ['Sleep Duration', 'Quality of Sleep', 'Physical Activity Level',
            'Heart Rate', 'Daily Steps', 'BP_Systolic', 'BP_Diastolic', 'Age']
corr = df[num_cols + ['Stress Level']].corr()['Stress Level'].drop('Stress Level').sort_values()
fig1 = px.bar(x=corr.values, y=corr.index, orientation='h',
              color=corr.values,
              color_continuous_scale='RdBu_r',
              template='plotly_white',
              labels={'x': 'Korelasi', 'y': 'Fitur'},
              title='Korelasi Fitur dengan Stress Level')
fig1.update_layout(title_font_size=16, coloraxis_showscale=False)
st.plotly_chart(fig1, use_container_width=True)

st.markdown("""
    <div class="insight-box">
        <p>💡 <b>Insight:</b> Quality of Sleep dan Sleep Duration memiliki korelasi negatif terkuat 
        terhadap Stress Level — semakin baik tidur, semakin rendah stres.</p>
    </div>
""", unsafe_allow_html=True)
st.markdown("---")

# ── Sleep Duration vs Stress ──────────────────────────────────────
st.markdown("### 😴 Sleep Duration vs Stress Level")
fig2 = px.scatter(df, x='Sleep Duration', y='Stress Level',
                  color='BMI Category',
                  size='Physical Activity Level',
                  title='Hubungan Sleep Duration dan Stress Level',
                  color_discrete_sequence=['#11998e', '#667eea', '#f5576c'],
                  template='plotly_white',
                  hover_data=['Occupation', 'Sleep Disorder'])
fig2.update_layout(title_font_size=16)
st.plotly_chart(fig2, use_container_width=True)

st.markdown("""
    <div class="insight-box">
        <p>💡 <b>Insight:</b> Individu dengan durasi tidur &lt; 6 jam cenderung memiliki 
        stress level 7–8. Tidur ≥ 7 jam berkaitan dengan stress level lebih rendah.</p>
    </div>
""", unsafe_allow_html=True)
st.markdown("---")

# ── Sleep Disorder vs Stress ──────────────────────────────────────
st.markdown("### 🛌 Sleep Disorder vs Stress Level")
order = ['None', 'Sleep Apnea', 'Insomnia']
avg_stress = df.groupby('Sleep Disorder')['Stress Level'].mean().reset_index()
avg_stress['Sleep Disorder'] = pd.Categorical(avg_stress['Sleep Disorder'],
                                               categories=order, ordered=True)
avg_stress = avg_stress.sort_values('Sleep Disorder')
fig3 = px.bar(avg_stress, x='Sleep Disorder', y='Stress Level',
              color='Sleep Disorder',
              title='Rata-rata Stress Level per Gangguan Tidur',
              color_discrete_sequence=['#11998e', '#f7971e', '#f5576c'],
              template='plotly_white',
              text='Stress Level')
fig3.update_traces(texttemplate='%{text:.2f}', textposition='outside')
fig3.update_layout(showlegend=False, title_font_size=16)
st.plotly_chart(fig3, use_container_width=True)

st.markdown("""
    <div class="insight-box">
        <p>💡 <b>Insight:</b> Insomnia memiliki rata-rata stress level tertinggi, 
        diikuti Sleep Apnea. Individu tanpa gangguan tidur memiliki stres paling rendah.</p>
    </div>
""", unsafe_allow_html=True)
st.markdown("---")

# ── Filter Interaktif ─────────────────────────────────────────────
st.markdown("### 🎛️ Eksplorasi Data Interaktif")
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
                  title='Distribusi Stress Level per Pekerjaan',
                  color_discrete_sequence=['#667eea', '#f5576c'],
                  template='plotly_white')
    fig4.update_xaxes(tickangle=45)
    st.plotly_chart(fig4, use_container_width=True)
with col4:
    fig5 = px.histogram(df_filtered, x='Physical Activity Level',
                        color='Gender',
                        title='Distribusi Aktivitas Fisik per Gender',
                        barmode='overlay',
                        color_discrete_sequence=['#667eea', '#f5576c'],
                        template='plotly_white',
                        opacity=0.7)
    st.plotly_chart(fig5, use_container_width=True)