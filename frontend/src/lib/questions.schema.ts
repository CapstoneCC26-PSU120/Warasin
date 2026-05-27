import { z } from "zod";

export const answerSchema = z.object({
  gender: z.enum(["Male", "Female"], {
    message: "Pilih jenis kelamin yang valid",
  }),
  age: z.coerce
    .number({ message: "Usia harus berupa angka" })
    .min(18, "Usia minimal 18 tahun")
    .max(100, "Usia maksimal 100"),
  occupation: z.enum(
    [
      "Accountant",
      "Doctor",
      "Engineer",
      "Lawyer",
      "Manager",
      "Nurse",
      "Salesperson",
      "Scientist",
      "Software Engineer",
      "Teacher",
      "Sales Representative",
    ],
    {
      message: "Pilih pekerjaan yang valid",
    },
  ),
  sleep_duration: z.coerce
    .number({ message: "Durasi tidur harus berupa angka" })
    .min(0, "Durasi tidur tidak boleh kurang dari 0")
    .max(24, "Durasi tidur tidak boleh lebih dari 24 jam"),
  sleep_quality: z.coerce.number(),
  physical_activity: z.coerce.number(),
  bmi: z.enum(["Normal", "Overweight", "Obese"]),
  heart_rate: z.coerce
    .number({ message: "Detak jantung harus berupa angka" })
    .min(40, "Detak jantung minimal 40")
    .max(120, "Detak jantung maksimal 120"),
  daily_steps: z.coerce
    .number({ message: "Langkah harian harus berupa angka" })
    .min(0, "Langkah harian tidak boleh kurang dari 0")
    .max(30000, "Langkah harian tidak masuk akal jika lebih dari 30000"),
  sleep_disorder: z.enum(["Insomnia", "Sleep Apnea"]).nullable(),
  bp_systolic: z.coerce
    .number({ message: "Sistolik harus berupa angka" })
    .min(80, "Sistolik minimal 80")
    .max(200, "Sistolik maksimal 200"),
  bp_diastolic: z.coerce
    .number({ message: "Diastolik harus berupa angka" })
    .min(50, "Diastolik minimal 50")
    .max(130, "Diastolik maksimal 130"),
});

export type AnswerSchema = z.infer<typeof answerSchema>;
