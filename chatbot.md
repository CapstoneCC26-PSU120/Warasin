# Chatbot API Documentation

Base URL:

```
http://localhost:3000/api
```

---

## Authentication

Semua endpoint chatbot butuh login dulu.
Token disimpan dalam bentuk cookie, jadi pastikan sudah hit endpoint login:

```
POST /auth/login
```

---

## 1. Start Chat Session

**Endpoint**

```
POST /chatbot/start
```

**Deskripsi**
Dipakai saat user mulai chatbot. Endpoint ini akan membuat session baru dan otomatis jadi session yang aktif.

**Request**
Tidak perlu body.

**Response**

```json
{
  "message": "Session started successfully"
}
```

---

## 2. Submit Answers

**Endpoint**

```
POST /chatbot/answer
```

**Deskripsi**
Menyimpan semua jawaban user ke session yang sedang aktif.
Jawaban dikirim sekaligus dalam bentuk array (bukan satu-satu per pertanyaan).

**Request Body**

```json
{
  "answers": [1, 22, 2, 6.5, 8, 50, 5000, 0, 80, 0, 120, 80]
}
```

**Catatan**

- Harus berupa array
- Isinya angka (number)
- Urutan harus sesuai pertanyaan di frontend

**Response**

```json
{
  "message": "Answers saved successfully"
}
```

---

## 3. Get Chat History

**Endpoint**

```
GET /chatbot/history
```

**Deskripsi**
Mengambil semua riwayat hasil chatbot milik user.

**Response**

```json
[
  {
    "id": "abc123",
    "userId": "user123",
    "answers": [1, 22, 2, 6.5],
    "score": null,
    "category": null,
    "isActive": false,
    "createdAt": "2026-05-01T10:00:00Z"
  }
]
```

---

## Error yang Mungkin Muncul

**Unauthorized**

```json
{
  "message": "Unauthorized"
}
```

**Session belum dibuat**

```json
{
  "message": "Active session not found"
}
```

**Format input salah**

```json
{
  "message": "Answers must be an array"
}
```

---

## Alur Penggunaan

1. Login dulu
2. Hit `/chatbot/start`
3. User isi semua pertanyaan di frontend
4. Kirim ke `/chatbot/answer`
5. Cek hasil di `/chatbot/history`

---

## Catatan Tambahan

- Sistem pakai konsep session (pakai `isActive`)
- Dalam satu waktu, cuma ada 1 session aktif per user
- Frontend tidak perlu kirim `sessionId`
- Semua di-handle backend

---

## Ringkasan Endpoint

| Endpoint         | Method | Fungsi         |
| ---------------- | ------ | -------------- |
| /chatbot/start   | POST   | Mulai session  |
| /chatbot/answer  | POST   | Simpan jawaban |
| /chatbot/history | GET    | Ambil history  |

---
