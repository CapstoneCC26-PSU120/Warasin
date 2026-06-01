import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import plotly.express as px
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from loader import load_dataset1, load_dataset2

st.set_page_config(page_title="Business Questions", page_icon="❓", layout="wide")

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
    font-size: 25px;
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
    <p style="font-size:2.5rem;font-weight:800;color:#0E8CD3;margin:0;">❓ Business Questions</p>
    <p style="color:#64748B;font-size:1rem;margin:4px 0 0;">Jawaban atas pertanyaan bisnis dari kedua dataset.</p>
""", unsafe_allow_html=True)
st.markdown('<hr class="divider">', unsafe_allow_html=True)

bq_tab1, bq_tab2 = st.tabs(["📊 Dataset 1 – Sleep Health & Lifestyle", "🖼️ Dataset 2 – Facial Expression"])

with bq_tab1:
    bq1_choice = st.selectbox("Pilih Business Question:", [
        "BQ1 – Faktor apa yang paling berpengaruh terhadap tingkat stres?",
        "BQ2 – Pengaruh Pekerjaan & Durasi Tidur terhadap Stres",
        "BQ3 – Distribusi Tingkat Stres Pengguna",
        "BQ4 – Pengaruh Aktivitas Fisik terhadap Stres & Kualitas Tidur",
        "BQ5 – Pengaruh Gangguan Tidur terhadap Tingkat Stres",
    ], key="bq1_sel")

    if "BQ1" in bq1_choice:
        st.markdown("#### BQ1: Faktor Apa yang Paling Berpengaruh terhadap Tingkat Stres?")
        num_cols = ['Age', 'Sleep Duration', 'Quality of Sleep',
                    'Physical Activity Level', 'Heart Rate', 'Daily Steps',
                    'BP_Systolic', 'BP_Diastolic']
        corr = df1[num_cols + ['Stress Level']].corr()['Stress Level'].drop('Stress Level').sort_values()
        fig = px.bar(x=corr.values, y=corr.index, orientation='h',
                     color=corr.values, color_continuous_scale='RdBu_r',
                     template='plotly_white',
                     labels={'x': 'Nilai Korelasi', 'y': ''},
                     title='Korelasi Fitur terhadap Stress Level')
        fig.update_layout(coloraxis_showscale=False, height=400)
        st.plotly_chart(fig, use_container_width=True, key="bq1_corr")
        st.markdown("""
            <div class='insight-box'>
            📌 <b>Insight BQ1:</b> Quality of Sleep (-0.69) dan Sleep Duration (-0.42) memiliki
            korelasi negatif terkuat — semakin baik tidur, semakin rendah stres. Sebaliknya,
            BP_Systolic (0.81) menunjukkan tekanan darah tinggi berkaitan dengan stres tinggi.
            </div>
        """, unsafe_allow_html=True)

    elif "BQ2" in bq1_choice:
        st.markdown("#### BQ2: Pengaruh Pekerjaan & Durasi Tidur terhadap Stres")
        col1, col2 = st.columns(2)
        with col1:
            avg_stress_occ = df1.groupby('Occupation')['Stress Level'].mean().sort_values()
            colors_occ = ['#52B788' if v < 5 else '#FFD166' if v < 6.5 else '#E63946'
                          for v in avg_stress_occ.values]
            fig1, ax1 = plt.subplots(figsize=(7, 5))
            bars = ax1.barh(avg_stress_occ.index, avg_stress_occ.values,
                            color=colors_occ, edgecolor='white')
            ax1.set_title('Rata-rata Stress Level per Profesi', fontsize=11, fontweight='bold')
            ax1.set_xlabel('Rata-rata Stress Level')
            for bar, val in zip(bars, avg_stress_occ.values):
                ax1.text(val + 0.05, bar.get_y() + bar.get_height()/2,
                         f'{val:.1f}', va='center', fontsize=9, fontweight='bold')
            plt.tight_layout()
            st.pyplot(fig1)
            plt.close()
        with col2:
            bins = [5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0]
            labels_b = ['5.5-6', '6-6.5', '6.5-7', '7-7.5', '7.5-8', '8-8.5', '8.5-9']
            df1['Sleep Bin'] = pd.cut(df1['Sleep Duration'], bins=bins, labels=labels_b)
            avg_stress_sleep = df1.groupby('Sleep Bin', observed=True)['Stress Level'].mean()
            colors_sleep = ['#E63946' if v > 6.5 else '#FFD166' if v > 5 else '#52B788'
                            for v in avg_stress_sleep.values]
            fig2, ax2 = plt.subplots(figsize=(7, 5))
            bars2 = ax2.bar(avg_stress_sleep.index.astype(str), avg_stress_sleep.values,
                            color=colors_sleep, edgecolor='white')
            ax2.set_title('Rata-rata Stress Level\nper Durasi Tidur', fontsize=11, fontweight='bold')
            ax2.set_xlabel('Durasi Tidur (jam)')
            ax2.set_ylabel('Rata-rata Stress Level')
            for bar, val in zip(bars2, avg_stress_sleep.values):
                ax2.text(bar.get_x() + bar.get_width()/2, val + 0.05,
                         f'{val:.1f}', ha='center', fontsize=9, fontweight='bold')
            plt.tight_layout()
            st.pyplot(fig2)
            plt.close()
        st.markdown("""
            <div class='insight-box'>
            📌 <b>Insight BQ2:</b> Profesi dengan beban kerja tinggi seperti Sales Representative
            dan Nurse memiliki rata-rata stres lebih tinggi. Individu yang tidur ≥ 7 jam
            cenderung memiliki stress level lebih rendah secara konsisten.
            </div>
        """, unsafe_allow_html=True)

    elif "BQ3" in bq1_choice:
        st.markdown("#### BQ3: Bagaimana Distribusi Tingkat Stres Pengguna?")
        col1, col2 = st.columns(2)
        with col1:
            stress_counts_df = df1.groupby('Stress Level').size().reset_index(name='Count')
            color_map = {3: '#52B788', 4: '#52B788', 5: '#FFD166',
                         6: '#FFD166', 7: '#E63946', 8: '#E63946'}
            colors_bar = [color_map[s] for s in stress_counts_df['Stress Level']]
            fig1, ax1 = plt.subplots(figsize=(7, 5))
            bars = ax1.bar(stress_counts_df['Stress Level'].astype(str),
                           stress_counts_df['Count'], color=colors_bar, edgecolor='white')
            ax1.set_title('Distribusi Stress Level (Skala 3-8) – Pola Bimodal',
                          fontsize=11, fontweight='bold')
            ax1.set_xlabel('Stress Level'); ax1.set_ylabel('Jumlah Individu')
            for bar, val in zip(bars, stress_counts_df['Count']):
                ax1.text(bar.get_x() + bar.get_width()/2, val + 10,
                         str(val), ha='center', fontsize=9, fontweight='bold')
            rendah = mpatches.Patch(color='#52B788', label='Rendah (3-4)')
            sedang = mpatches.Patch(color='#FFD166', label='Sedang (5-6)')
            tinggi = mpatches.Patch(color='#E63946', label='Tinggi (7-8)')
            ax1.legend(handles=[rendah, sedang, tinggi], fontsize=9)
            plt.tight_layout()
            st.pyplot(fig1)
            plt.close()
        with col2:
            cat_counts = df1['Stress Category'].value_counts()
            order = ['Rendah', 'Sedang', 'Tinggi']
            cat_counts = cat_counts.reindex(order)
            colors_pie = ['#52B788', '#FFD166', '#E63946']
            fig2, ax2 = plt.subplots(figsize=(7, 5))
            wedges, texts, autotexts = ax2.pie(
                cat_counts.values,
                labels=cat_counts.index,
                colors=colors_pie,
                autopct='%1.1f%%',
                wedgeprops={'edgecolor': 'white', 'linewidth': 2},
                textprops={'fontsize': 11, 'fontweight': 'bold'})
            ax2.set_title('Persentase Kategori Stres', fontsize=11, fontweight='bold')
            plt.tight_layout()
            st.pyplot(fig2)
            plt.close()
        st.markdown("""
            <div class='insight-box'>
            📌 <b>Insight BQ3:</b> Distribusi Stress Level bersifat <b>bimodal</b> dengan puncak
            di level 3-4 (Rendah) dan 7-8 (Tinggi). Individu cenderung berada di kondisi ekstrem,
            menunjukkan bahwa faktor risiko stres bersifat kumulatif.
            </div>
        """, unsafe_allow_html=True)

    elif "BQ4" in bq1_choice:
        st.markdown("#### BQ4: Pengaruh Aktivitas Fisik terhadap Stres & Kualitas Tidur")
        col1, col2 = st.columns(2)
        with col1:
            bins_act = [30, 45, 60, 75, 90]
            labels_act = ['Kurang Aktif\n(30-45)', 'Cukup Aktif\n(45-60)',
                          'Aktif\n(60-75)', 'Sangat Aktif\n(75-90)']
            df1['Activity Bin'] = pd.cut(df1['Physical Activity Level'],
                                          bins=bins_act, labels=labels_act)
            avg_stress_act = df1.groupby('Activity Bin', observed=True)['Stress Level'].mean()
            colors_act = ['#E63946', '#FFD166', '#52B788', '#52B788']
            fig1, ax1 = plt.subplots(figsize=(7, 5))
            bars = ax1.bar(avg_stress_act.index.astype(str), avg_stress_act.values,
                           color=colors_act, edgecolor='white')
            ax1.set_title('Makin Aktif = Stres Lebih Rendah! 💪',
                          fontsize=11, fontweight='bold')
            ax1.set_ylabel('Rata-rata Stress Level')
            for bar, val in zip(bars, avg_stress_act.values):
                ax1.text(bar.get_x() + bar.get_width()/2, val + 0.05,
                         f'{val:.1f}', ha='center', fontsize=10, fontweight='bold')
            plt.tight_layout()
            st.pyplot(fig1)
            plt.close()
        with col2:
            avg_sleep_act = df1.groupby('Activity Bin', observed=True)['Quality of Sleep'].mean()
            fig2, ax2 = plt.subplots(figsize=(7, 5))
            bars2 = ax2.bar(avg_sleep_act.index.astype(str), avg_sleep_act.values,
                            color=colors_act, edgecolor='white')
            ax2.set_title('Makin Aktif = Tidur Lebih Nyenyak! 😴',
                          fontsize=11, fontweight='bold')
            ax2.set_ylabel('Rata-rata Quality of Sleep')
            for bar, val in zip(bars2, avg_sleep_act.values):
                ax2.text(bar.get_x() + bar.get_width()/2, val + 0.05,
                         f'{val:.1f}', ha='center', fontsize=10, fontweight='bold')
            plt.tight_layout()
            st.pyplot(fig2)
            plt.close()
        st.markdown("""
            <div class='insight-box'>
            📌 <b>Insight BQ4:</b> Aktivitas fisik ≥ 60 menit/hari berkaitan dengan stress level
            lebih rendah dan kualitas tidur lebih baik. Individu yang sangat aktif (75-90 menit)
            memiliki rata-rata stress level paling rendah dan kualitas tidur terbaik.
            </div>
        """, unsafe_allow_html=True)

    elif "BQ5" in bq1_choice:
        st.markdown("#### BQ5: Pengaruh Gangguan Tidur terhadap Tingkat Stres")
        df1['Sleep Disorder'] = df1['Sleep Disorder'].fillna('None')
        col1, col2 = st.columns(2)
        with col1:
            fig1, ax1 = plt.subplots(figsize=(7, 5))
            order_sd = ['None', 'Sleep Apnea', 'Insomnia']
            colors_sd = ['#52B788', '#FFD166', '#E63946']
            for i, (sd, color) in enumerate(zip(order_sd, colors_sd)):
                data = df1[df1['Sleep Disorder'] == sd]['Stress Level']
                ax1.violinplot(data, positions=[i], showmedians=True)
            ax1.set_xticks([0, 1, 2])
            ax1.set_xticklabels(order_sd)
            ax1.set_title('Distribusi Stress Level\nper Jenis Gangguan Tidur',
                          fontsize=11, fontweight='bold')
            ax1.set_ylabel('Stress Level')
            plt.tight_layout()
            st.pyplot(fig1)
            plt.close()
        with col2:
            avg_stress_sd = df1.groupby('Sleep Disorder')['Stress Level'].mean()
            avg_stress_sd = avg_stress_sd.reindex(order_sd)
            fig2, ax2 = plt.subplots(figsize=(7, 5))
            bars = ax2.bar(avg_stress_sd.index, avg_stress_sd.values,
                           color=colors_sd, edgecolor='white')
            ax2.set_title('Rata-rata Stress Level\nper Gangguan Tidur',
                          fontsize=11, fontweight='bold')
            ax2.set_ylabel('Rata-rata Stress Level')
            for bar, val in zip(bars, avg_stress_sd.values):
                ax2.text(bar.get_x() + bar.get_width()/2, val + 0.05,
                         f'{val:.2f}', ha='center', fontsize=10, fontweight='bold')
            plt.tight_layout()
            st.pyplot(fig2)
            plt.close()

        st.markdown("""
            <div class='insight-box'>
            📌 <b>Insight BQ5:</b> Insomnia memiliki rata-rata stress level tertinggi (6.76),
            diikuti Sleep Apnea (5.82). Individu tanpa gangguan tidur memiliki stres paling
            rendah (4.74). Sleep disorder bukan hanya gejala stres, tapi juga memperparahnya.
            </div>
        """, unsafe_allow_html=True)

with bq_tab2:
    bq2_choice = st.selectbox("Pilih Business Question:", [
        "BQ1 – Distribusi jumlah gambar per kategori emosi",
        "BQ2 – Apakah dataset seimbang atau tidak (imbalanced)?",
        "BQ3 – Kategori emosi paling dominan",
        "BQ4 – Perbandingan jumlah data train dan test",
    ], key="bq2_sel")

    cats_list = sorted(train_counts.keys())
    colors7 = ['#E63946', '#0E8CD3', '#FFD166', '#52B788', '#64748B', '#0E8CD3', '#E0E7F1']
    tv = [train_counts[k] for k in cats_list]
    testv = [test_counts[k] for k in cats_list]
    total_all = sum(train_counts.values()) + sum(test_counts.values())

    if "BQ1" in bq2_choice:
        st.markdown("#### BQ1: Bagaimana Distribusi Jumlah Gambar per Kategori Emosi?")
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))
        axes[0].bar(cats_list, tv, color=colors7, edgecolor='white')
        axes[0].set_title('Train Set – Distribusi per Kategori', fontsize=12, fontweight='bold')
        axes[0].set_xlabel('Kategori Emosi'); axes[0].set_ylabel('Jumlah Gambar')
        axes[0].tick_params(axis='x', rotation=30)
        for i, v in enumerate(tv):
            axes[0].text(i, v+50, str(v), ha='center', fontsize=9, fontweight='bold')
        axes[1].bar(cats_list, testv, color=colors7, edgecolor='white', alpha=0.75)
        axes[1].set_title('Test Set – Distribusi per Kategori', fontsize=12, fontweight='bold')
        axes[1].set_xlabel('Kategori Emosi'); axes[1].set_ylabel('Jumlah Gambar')
        axes[1].tick_params(axis='x', rotation=30)
        for i, v in enumerate(testv):
            axes[1].text(i, v+20, str(v), ha='center', fontsize=9, fontweight='bold')
        plt.suptitle('BQ1 – Distribusi Gambar per Kategori Emosi', fontsize=13, fontweight='bold')
        plt.tight_layout(); st.pyplot(fig); plt.close()
        st.markdown("""
            <div class='insight-box'>
            📌 <b>Insight BQ1:</b> Kategori <b>Happy</b> memiliki gambar terbanyak (7.215 train),
            diikuti <b>Neutral</b> dan <b>Sad</b>. Sebaliknya, <b>Disgust</b> hanya memiliki
            436 gambar training – jauh di bawah kategori lainnya.
            </div>
        """, unsafe_allow_html=True)

    elif "BQ2" in bq2_choice:
        st.markdown("#### BQ2: Apakah Dataset Seimbang atau Tidak Seimbang (Imbalanced)?")
        kat_terbanyak = max(train_counts, key=train_counts.get)
        kat_tersedikit = min(train_counts, key=train_counts.get)
        rasio_imbalance = round(train_counts[kat_terbanyak] / train_counts[kat_tersedikit], 1)
        c1, c2, c3 = st.columns(3)
        c1.metric("Kategori Terbanyak", kat_terbanyak.capitalize(),
                  f"{train_counts[kat_terbanyak]:,} gambar")
        c2.metric("Kategori Tersedikit", kat_tersedikit.capitalize(),
                  f"{train_counts[kat_tersedikit]:,} gambar")
        c3.metric("Rasio Imbalance", f"{rasio_imbalance}:1", "⚠️ Sangat Tidak Seimbang")
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))
        sorted_k = sorted(train_counts, key=train_counts.get, reverse=True)
        sorted_v = [train_counts[k] for k in sorted_k]
        sorted_c = [colors7[cats_list.index(k)] for k in sorted_k]
        axes[0].bar([k.capitalize() for k in sorted_k], sorted_v, color=sorted_c, edgecolor='white')
        axes[0].set_title('Perbandingan Jumlah Gambar – Train Set', fontsize=11, fontweight='bold')
        axes[0].tick_params(axis='x', rotation=30)
        for i, v in enumerate(sorted_v):
            axes[0].text(i, v+50, str(v), ha='center', fontsize=9, fontweight='bold')
        axes[1].pie(sorted_v, labels=[k.capitalize() for k in sorted_k],
                    colors=sorted_c, autopct='%1.1f%%',
                    wedgeprops={'edgecolor': 'white', 'linewidth': 1.5},
                    textprops={'fontsize': 8.5})
        axes[1].set_title('Proporsi Tiap Kategori (Train Set)', fontsize=11, fontweight='bold')
        plt.suptitle(f'BQ2 – Imbalanced Dataset (Rasio {rasio_imbalance}:1)', fontsize=13, fontweight='bold')
        plt.tight_layout(); st.pyplot(fig); plt.close()
        st.markdown(f"""
            <div class='insight-box'>
            📌 <b>Insight BQ2:</b> Dataset bersifat <b>TIDAK SEIMBANG</b> dengan rasio {rasio_imbalance}:1
            antara <b>Happy</b> ({train_counts['happy']:,}) vs <b>Disgust</b> ({train_counts['disgust']:,}).
            Rekomendasi: Data Augmentation + Class Weighting saat training model.
            </div>
        """, unsafe_allow_html=True)

    elif "BQ3" in bq2_choice:
        st.markdown("#### BQ3: Kategori Emosi Apa yang Paling Dominan?")
        total_per_cat = {k: train_counts[k]+test_counts[k] for k in cats_list}
        sorted_cats3 = sorted(cats_list, key=lambda k: total_per_cat[k], reverse=True)
        totals3 = [total_per_cat[k] for k in sorted_cats3]
        pcts3 = [t/total_all*100 for t in totals3]
        colors3 = [colors7[cats_list.index(k)] for k in sorted_cats3]
        ideal_pct = 100/len(cats_list)
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))
        train_s = [train_counts[k] for k in sorted_cats3]
        test_s = [test_counts[k] for k in sorted_cats3]
        x = np.arange(len(sorted_cats3))
        axes[0].bar(x, train_s, color=colors3, alpha=0.9, label='Train', edgecolor='white')
        axes[0].bar(x, test_s, bottom=train_s, color=colors3, alpha=0.4, label='Test', edgecolor='white')
        axes[0].set_xticks(x)
        axes[0].set_xticklabels([k.capitalize() for k in sorted_cats3], rotation=30)
        axes[0].set_title('Total Gambar per Kategori (Train + Test)', fontsize=11, fontweight='bold')
        axes[0].legend(fontsize=9)
        bars_p = axes[1].barh([k.capitalize() for k in sorted_cats3], pcts3,
                               color=colors3, edgecolor='white', alpha=0.85)
        axes[1].axvline(ideal_pct, color='gray', ls='--', lw=1.5,
                        label=f'Rata-rata ideal ({ideal_pct:.1f}%)')
        axes[1].set_title('Persentase Kontribusi per Kategori', fontsize=11, fontweight='bold')
        axes[1].legend(fontsize=9); axes[1].invert_yaxis()
        plt.suptitle('BQ3 – Kategori Emosi Paling Dominan', fontsize=13, fontweight='bold')
        plt.tight_layout(); st.pyplot(fig); plt.close()
        st.markdown(f"""
            <div class='insight-box'>
            📌 <b>Insight BQ3:</b> Kategori <b>Happy</b> mendominasi dataset dengan {pcts3[0]:.1f}%
            dari total gambar – melebihi rata-rata ideal {ideal_pct:.1f}%.
            </div>
        """, unsafe_allow_html=True)

    elif "BQ4" in bq2_choice:
        st.markdown("#### BQ4: Bagaimana Perbandingan Jumlah Data Train dan Test?")
        total_tr = sum(train_counts.values())
        total_te = sum(test_counts.values())
        rasio_tr = total_tr/total_all*100
        rasio_te = total_te/total_all*100
        c1, c2, c3 = st.columns(3)
        c1.metric("Train Set", f"{total_tr:,} gambar", f"{rasio_tr:.1f}%")
        c2.metric("Test Set", f"{total_te:,} gambar", f"{rasio_te:.1f}%")
        c3.metric("Rasio", "80:20", "✅ Ideal")
        fig, axes = plt.subplots(1, 2, figsize=(12, 5))
        axes[0].pie([total_tr, total_te],
                    labels=[f'Train\n{total_tr:,}', f'Test\n{total_te:,}'],
                    colors=['#0E8CD3', '#E63946'],
                    autopct='%1.1f%%',
                    wedgeprops={'width': 0.6, 'edgecolor': 'white', 'linewidth': 2},
                    textprops={'fontsize': 10, 'fontweight': 'bold'})
        axes[0].set_title('Rasio Train vs Test', fontsize=11, fontweight='bold')
        axes[0].text(0, 0, '80:20', ha='center', va='center',
                     fontsize=16, fontweight='bold', color='#0E8CD3')
        x = np.arange(len(cats_list)); w = 0.35
        axes[1].bar(x-w/2, tv, w, color='#0E8CD3', alpha=0.85, label='Train')
        axes[1].bar(x+w/2, testv, w, color='#E63946', alpha=0.85, label='Test')
        axes[1].set_title('Train & Test per Kategori', fontsize=11, fontweight='bold')
        axes[1].set_xticks(x)
        axes[1].set_xticklabels([k.capitalize() for k in cats_list], rotation=30, fontsize=8)
        axes[1].legend(fontsize=9)
        plt.suptitle('BQ4 – Perbandingan Data Train dan Test (Rasio 80:20)', fontsize=13, fontweight='bold')
        plt.tight_layout(); st.pyplot(fig); plt.close()
        st.markdown("""
            <div class='insight-box'>
            📌 <b>Insight BQ4:</b> Rasio Train:Test = <b>80:20</b> merupakan standar ideal.
            Pembagian ini konsisten di semua 7 kategori emosi sehingga evaluasi model
            dapat dilakukan secara objektif dan representatif.
            </div>
        """, unsafe_allow_html=True)