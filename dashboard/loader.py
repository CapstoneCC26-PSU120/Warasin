"""
src/loader.py
=============
Semua fungsi loading data untuk dashboard WarasIn.

Dataset 1 : Kuesioner Sleep & Lifestyle  → di-generate via numpy (no file)
Dataset 2 : Facial Expression            → metadata dari data/metadata.csv
                                           gambar aktual di Google Drive (cloud)
"""

import numpy as np
import pandas as pd
import streamlit as st
from pathlib import Path

# ── Path root project (satu level di atas src/) ──────────────────────────────
ROOT = Path(__file__).resolve().parent
METADATA_PATH = ROOT / "data" / "metadata.csv"

# ── Google Drive folder (images ada di sini) ──────────────────────────────────
GDRIVE_FOLDER_URL = (
    "https://drive.google.com/drive/folders/"
    "10MsfkFqChHEkiWhqL-Wg7W0CojBazAi-?usp=drive_link"
)
GDRIVE_FOLDER_ID = "10MsfkFqChHEkiWhqL-Wg7W0CojBazAi-"


# ══════════════════════════════════════════════════════════════════════════════
# DATASET 1 – Kuesioner (synthetic, reproducible)
# ══════════════════════════════════════════════════════════════════════════════

@st.cache_data
def load_dataset1() -> pd.DataFrame:
    """
    Load dataset Sleep Health & Lifestyle dari CSV asli hasil cleaning.
    """
    base_dir = Path(__file__).resolve().parent
    csv_path = base_dir / "data" / "sleep_health_cleaned.csv"
    df = pd.read_csv(csv_path)

    def cat_stress(s):
        if s <= 4:
            return "Rendah"
        elif s <= 6:
            return "Sedang"
        return "Tinggi"

    df["Stress Category"] = df["Stress Level"].apply(cat_stress)
    return df


# ══════════════════════════════════════════════════════════════════════════════
# DATASET 2 – Facial Expression (metadata dari CSV, gambar di cloud)
# ══════════════════════════════════════════════════════════════════════════════

@st.cache_data
def load_dataset2() -> tuple[pd.DataFrame, dict, dict]:
    """
    Baca metadata distribusi gambar dari data/metadata.csv.
    Gambar asli tersimpan di Google Drive (cloud) — tidak di-load ke memori.

    Returns
    -------
    df2          : DataFrame panjang (category, split, count)
    train_counts : dict  {category: jumlah_gambar_train}
    test_counts  : dict  {category: jumlah_gambar_test}
    """
    df_meta = pd.read_csv(METADATA_PATH)

    train_counts: dict[str, int] = (
        df_meta[df_meta["split"] == "train"]
        .set_index("category")["count"]
        .to_dict()
    )
    test_counts: dict[str, int] = (
        df_meta[df_meta["split"] == "test"]
        .set_index("category")["count"]
        .to_dict()
    )

    # DataFrame format panjang untuk charting
    df2 = df_meta[["category", "split", "count"]].copy()
    df2["category"] = df2["category"].str.capitalize()
    df2["split"]    = df2["split"].str.capitalize()

    return df2, train_counts, test_counts


# ══════════════════════════════════════════════════════════════════════════════
# HELPER – URL gambar dari Google Drive (opsional, jika ingin embed sample)
# ══════════════════════════════════════════════════════════════════════════════

def gdrive_image_url(file_id: str) -> str:
    """Konversi Google Drive file ID ke URL preview langsung."""
    return f"https://drive.google.com/uc?export=view&id={file_id}"


def gdrive_folder_url() -> str:
    """Return URL folder Google Drive tempat semua gambar disimpan."""
    return GDRIVE_FOLDER_URL
