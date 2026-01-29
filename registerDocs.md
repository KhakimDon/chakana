# MobilPay Identity API — Web Authorization (NO SDK)

> 📌 **Только WEB (Nuxt / Browser)**
> ❌ **Без Mobile SDK**
> ✅ Идентификация через **MyID API**

Документ оптимизирован для **Cursor AI** и разработки web-приложения.

---

## 1. Общий Web Auth Flow

```text
Browser (Nuxt)
  │
  ├─ HEAD /api/v1/auth                 → check user exists
  │
  ├─ POST /users/register              → register user
  │    └─ OTP via SMS
  │
  ├─ PUT /users/verify/verify_otp      → confirm phone
  │    └─ limited JWT
  │
  ├─ POST /myid/getAccessToken         → MyID temp token
  │
  ├─ POST /myid/perform                → MyID verification (API)
  │
  └─ POST /auth/refresh-token          → full JWT (login complete)
```

---

## 2. User Statuses

| id | status   | description        |
| -- | -------- | ------------------ |
| 1  | Active   | active user        |
| 2  | Inactive | phone not verified |
| 3  | Deleted  | deleted            |
| 4  | Blocked  | blocked            |

---

## 3. Password Rules

* minimum **8 characters**
* **1 uppercase** latin letter
* **1 lowercase** latin letter
* **1 digit**
* **1 special symbol**

Example:

```text
12345Aa!
```

---

## 4. Phone Format

```text
998XXXXXXXXX
```

* exactly 12 digits
* no `+`, spaces, symbols

---

## 5. Required Headers

```http
apiKey: <PARTNER_API_KEY>
Accept-Language: ru | uz | en
Authorization: Bearer <JWT>
session: <SESSION_ID>
```

---

## 6. Check User Exists

```http
HEAD /api/v1/auth
```

Used **before registration**.

---

## 7. Register User (WEB)

```http
POST /identity-api/v1.0/users/register
```

### Body

```json
{
  "userName": "998901234567",
  "password": "12345Aa!",
  "languageId": "ru"
}
```

### Result

* `201 Created`
* OTP sent via SMS
* user `statusId = 2`

---

## 8. Verify Phone (OTP)

```http
PUT /identity-api/v1.0/users/verify/verify_otp
```

### Body

```json
{
  "username": "998901234567",
  "password": "12345Aa!",
  "code": "123456"
}
```

### Response

```json
{
  "token": "LIMITED_JWT"
}
```

⚠️ Token has **limited permissions**.

---

## 9. MyID Identification (API ONLY)

### 9.1 Get MyID Access Token

```http
POST /identity-api/v1.0/users/myid/getAccessToken
```

```json
{
  "purpose": 0
}
```

Response:

```json
{ "token": "MYID_TOKEN" }
```

---

### 9.2 Perform MyID Verification (WEB API)

> Используется **API метод**, а не SDK

```http
POST /identity-api/v1.0/users/myid/perform
```

### Body

```json
{
  "passportNumber": "AA1234567",
  "birthDate": "YYYY-MM-DD",
  "image": "<BASE64_IMAGE>",
  "token": "MYID_TOKEN"
}
```

Response:

```text
200 OK
```

После этого пользователь считается **биометрически подтверждённым**.

---

## 10. Refresh Token (FINAL LOGIN)

```http
POST /identity-api/v1.0/auth/refresh-token
```

### Body

```json
{
  "accessToken": "LIMITED_JWT",
  "refreshToken": "REFRESH_TOKEN",
  "checkTwoFactor": false
}
```

### Response

```json
{
  "authToken": "FULL_ACCESS_JWT"
}
```

✅ Используется как **основной токен в Nuxt**

---

## 11. Nuxt Web Logic (Pseudo Code)

```ts
if (!userExists) {
  await register()
  await verifyOtp()
}

if (!myIdVerified) {
  await myIdPerform()
}

await refreshToken()
setAuthCookie()
navigateTo('/dashboard')
```

---

## 12. Security Notes (WEB)

* ❌ Не хранить JWT в localStorage
* ✅ Использовать httpOnly cookies
* ✅ SSR-safe token handling
* ✅ CORS allow credentials

---

## 13. Notes for Cursor AI

* NO SDK usage
* Only HTTP APIs
* MyID via `/perform`
* Token lifecycle: **limited → full**

---

## 14. Result

* ✅ Web only (Nuxt)
* ✅ SDK free
* ✅ Regulator compliant
* ✅ Cursor friendly

---

**Document version:** 1.1 (WEB ONLY)
