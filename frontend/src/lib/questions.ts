export const questions = [
  {
    field: "gender",
    question: "Jenis kelamin kamu?",
    options: [
      { label: "Laki-laki", value: "Male" },
      { label: "Perempuan", value: "Female" },
    ],
  },
  {
    field: "age",
    question: "Berapa usia kamu?",
    options: [
      { label: "18–25", value: 22 },
      { label: "26–35", value: 30 },
      { label: "36–45", value: 40 },
      { label: "46+", value: 50 },
    ],
  },
  {
    field: "occupation",
    question: "Pekerjaan kamu?",
    options: [
      { label: "Pelajar/Mahasiswa", value: "Student" },
      { label: "Karyawan Kantoran", value: "Office Worker" },
      { label: "Tenaga Medis", value: "Doctor" },
      { label: "Sales / Marketing", value: "Sales" },
      { label: "Lainnya", value: "Other" },
    ],
  },
  {
    field: "sleep_duration",
    question: "Berapa lama kamu tidur per hari?",
    options: [
      { label: "<5 jam", value: 4.5 },
      { label: "5–6 jam", value: 5.5 },
      { label: "6–7 jam", value: 6.5 },
      { label: ">7 jam", value: 7.5 },
    ],
  },
  {
    field: "sleep_quality",
    question: "Bagaimana kualitas tidur kamu?",
    options: [
      { label: "Buruk", value: 3 },
      { label: "Cukup", value: 6 },
      { label: "Baik", value: 8 },
      { label: "Sangat Baik", value: 9 },
    ],
  },
  {
    field: "physical_activity",
    question: "Seberapa aktif kamu secara fisik?",
    options: [
      { label: "Rendah", value: 30 },
      { label: "Sedang", value: 50 },
      { label: "Tinggi", value: 70 },
    ],
  },
  {
    field: "daily_steps",
    question: "Berapa rata-rata langkah harian kamu?",
    options: [
      { label: "<3000 langkah", value: 2000 },
      { label: "3000–7000 langkah", value: 5000 },
      { label: ">7000 langkah", value: 9000 },
    ],
  },
  {
    field: "bmi",
    question: "Bagaimana kondisi berat badan kamu?",
    options: [
      { label: "Normal", value: "Normal" },
      { label: "Overweight", value: "Overweight" },
      { label: "Obese", value: "Obese" },
    ],
  },
  {
    field: "heart_rate",
    question: "Berapa kisaran detak jantung kamu?",
    options: [
      { label: "<70 bpm", value: 65 },
      { label: "70–90 bpm", value: 80 },
      { label: ">90 bpm", value: 95 },
    ],
  },
  {
    field: "sleep_disorder",
    question: "Apakah kamu mengalami gangguan tidur?",
    options: [
      { label: "Tidak", value: "None" },
      { label: "Insomnia", value: "Insomnia" },
      { label: "Sleep Apnea", value: "Sleep Apnea" },
    ],
  },
  {
    field: "bp_systolic",
    question: "Tekanan darah (sistolik)?",
    options: [
      { label: "Normal (120)", value: 120 },
      { label: "Sedikit tinggi (130)", value: 130 },
      { label: "Tinggi (140)", value: 140 },
    ],
  },
  {
    field: "bp_diastolic",
    question: "Tekanan darah (diastolik)?",
    options: [
      { label: "Normal (80)", value: 80 },
      { label: "Sedikit tinggi (85)", value: 85 },
      { label: "Tinggi (90)", value: 90 },
    ],
  },
];
