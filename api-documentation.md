# Warasin API Documentation

Base URL:

```bash
http://localhost:3000/api
```

---

# Authentication API

## 1. Register

### Endpoint

```bash
POST /auth/register
```

### Description

Digunakan untuk membuat akun baru.

### Request Body

```json
{
  "name": "Isma",
  "email": "isma@gmail.com",
  "password": "12345678"
}
```

### Response

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "25d57e46-f489-4efa-bbb8-5408d4bd5eeb",
    "name": "Isma",
    "email": "isma@gmail.com",
    "createdAt": "2026-05-07T12:17:13.542Z"
  }
}
```

---

## 2. Login

### Endpoint

```bash
POST /auth/login
```

### Description

Digunakan untuk login user dan menyimpan token authentication dalam cookie.

### Request Body

```json
{
  "email": "isma@gmail.com",
  "password": "12345678"
}
```

### Response

```json
{
  "message": "Login success",
  "user": {
    "id": "25d57e46-f489-4efa-bbb8-5408d4bd5eeb",
    "name": "Isma",
    "email": "isma@gmail.com"
  }
}
```

---

## 3. Get Profile

### Endpoint

```bash
GET /auth/me
```

### Description

Mengambil data profile user yang sedang login.

### Response

```json
{
  "user": {
    "id": "25d57e46-f489-4efa-bbb8-5408d4bd5eeb",
    "name": "Isma",
    "email": "isma@gmail.com",
    "birthDate": "2005-04-18T00:00:00.000Z"
  }
}
```

---

## 4. Update Profile

### Endpoint

```bash
PUT /auth/profile
```

### Description

Mengubah data profile user.

### Request Body

```json
{
  "name": "Isma Nur",
  "birthDate": "2005-04-18"
}
```

### Response

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "25d57e46-f489-4efa-bbb8-5408d4bd5eeb",
    "name": "Isma Nur",
    "email": "isma@gmail.com",
    "birthDate": "2005-04-18T00:00:00.000Z"
  }
}
```

---

## 5. Logout

### Endpoint

```bash
POST /auth/logout
```

### Description

Menghapus token login user.

### Response

```json
{
  "message": "Logged out"
}
```

---

## 6. Login with Google

### Endpoint

```bash
GET /auth/google
```

### Description

Digunakan untuk login menggunakan akun Google melalui Passport.js OAuth2.

User akan diarahkan ke halaman login Google.

### Flow

1. User membuka endpoint `/auth/google`
2. User login menggunakan akun Google
3. Google redirect ke `/auth/google/callback`
4. Backend membuat JWT token
5. Token disimpan dalam cookie
6. User diarahkan ke frontend

---

## 7. Google Callback

### Endpoint

```bash
GET /auth/google/callback
```

### Description

Endpoint callback dari Google OAuth.

Endpoint ini dipanggil otomatis oleh Google setelah user berhasil login.

### Response

Tidak mengembalikan JSON karena user langsung di-redirect ke frontend:

```bash
http://localhost:4000/measurement
```

### Cookie

Backend otomatis menyimpan token authentication ke cookie:

```bash
token
```

---

# Chatbot API

## Authentication

Semua endpoint chatbot membutuhkan user login terlebih dahulu.

---

## 1. Submit Answers

### Endpoint

```bash
POST /chatbot/answer
```

### Description

Menyimpan jawaban user ke database, mengirim data ke AI service, menerima hasil analisis AI, lalu otomatis menyimpan ke history.

### Request Body

```json
{
  "Gender": "Female",
  "Age": 28,
  "Occupation": "Nurse",
  "Sleep Duration": 6.5,
  "Quality of Sleep": 5,
  "Physical Activity Level": 30,
  "BMI Category": "Normal",
  "Heart Rate": 80,
  "Daily Steps": 4000,
  "Sleep Disorder": null,
  "BP_Systolic": 125,
  "BP_Diastolic": 82
}
```

### Response

```json
{
  "message": "Analysis completed successfully",
  "data": {
    "id": "4d9ea875-a5db-4a1b-b243-6488b544f197",
    "answers": {
      "Age": 28,
      "Gender": "Female",
      "Heart Rate": 80,
      "Occupation": "Nurse",
      "BP_Systolic": 125,
      "Daily Steps": 4000,
      "BMI Category": "Normal",
      "BP_Diastolic": 82,
      "Sleep Disorder": null,
      "Sleep Duration": 6.5,
      "Quality of Sleep": 5,
      "Physical Activity Level": 30
    },
    "score": 72,
    "category": "Medium Stress",
    "advice": "Try improving sleep quality and reduce stress level.",
    "createdAt": "2026-05-07T12:17:13.542Z"
  }
}
```

---

## 2. Get History

### Endpoint

```bash
GET /chatbot/history
```

### Description

Mengambil semua riwayat hasil chatbot milik user.

### Response

```json
{
  "userId": "25d57e46-f489-4efa-bbb8-5408d4bd5eeb",
  "data": [
    {
      "id": "4d9ea875-a5db-4a1b-b243-6488b544f197",
      "answers": {
        "Age": 28,
        "Gender": "Female",
        "Heart Rate": 80,
        "Occupation": "Nurse",
        "BP_Systolic": 125,
        "Daily Steps": 4000,
        "BMI Category": "Normal",
        "BP_Diastolic": 82,
        "Sleep Disorder": null,
        "Sleep Duration": 6.5,
        "Quality of Sleep": 5,
        "Physical Activity Level": 30
      },
      "score": 72,
      "category": "Medium Stress",
      "advice": "Try improving sleep quality and reduce stress level.",
      "createdAt": "2026-05-07T12:17:13.542Z"
    }
  ]
}
```

---

## 3. Delete History

### Endpoint

```bash
DELETE /chatbot/history/:id
```

### Description

Menghapus history chatbot berdasarkan id.

### Response

```json
{
  "message": "History deleted successfully"
}
```

---

# Possible Errors

## Unauthorized

```json
{
  "message": "Unauthorized"
}
```

---

## Invalid Input

```json
{
  "message": "Invalid request body"
}
```

---

## History Not Found

```json
{
  "message": "History not found"
}
```

---

# Chatbot Flow

1. User login
2. Frontend mengirim jawaban questionnaire ke `/chatbot/answer`
3. Backend menyimpan jawaban ke database
4. Backend mengirim data ke AI service
5. Backend menerima hasil analisis AI
6. Hasil disimpan ke history
7. Frontend mengambil history dari `/chatbot/history`

---

# Endpoint Summary

| Endpoint              | Method | Description                |
| --------------------- | ------ | -------------------------- |
| /auth/register        | POST   | Register user              |
| /auth/login           | POST   | Login user                 |
| /auth/me              | GET    | Get current user profile   |
| /auth/profile         | PUT    | Update user profile        |
| /auth/logout          | POST   | Logout user                |
| /auth/google           | GET    | Login with Google OAuth    |
| /auth/google/callback  | GET    | Google OAuth callback      |
| /chatbot/answer       | POST   | Submit questionnaire       |
| /chatbot/history      | GET    | Get chatbot history        |
| /chatbot/history/:id  | DELETE | Delete chatbot history     |