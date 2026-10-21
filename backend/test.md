# Barber Management System — API Testing Guide (Postman)

Base URL: `http://localhost:3000/api/v1`

Auth: Use `Authorization: Bearer <ACCESS_TOKEN>` header for protected endpoints. Tokens are issued by the Auth endpoints. Roles used in examples: `Customer`, `Barber`, `Admin`.

---

## Quick notes

- Replace `<BASE_URL>` with `http://localhost:3000/api/v1` (or your environment).
- Replace `<ACCESS_TOKEN>` with a valid JWT returned from login/refresh endpoints.
- ID placeholders: `<USER_ID>`, `<BARBER_ID>`, `<BRANCH_ID>`, `<CHAIR_ID>`, `<SERVICE_ID>`, `<APPOINTMENT_ID>`, `<PAYMENT_ID>`.

---

**How to use in Postman**

- Set an environment variable `baseUrl` = `http://localhost:3000/api/v1`.
- Use `{{baseUrl}}/auth/login` etc.
- Add `Authorization` header to requests that require authentication: `Bearer {{accessToken}}`.

---

# Endpoints

For each endpoint: Method, URL, Auth requirement, Request (body / params), Test cases (Happy Path, Validation errors, Auth/Authorization, Not Found/Conflict) and sample responses.

---

## Auth

### POST /auth/register

- Method: POST
- URL: `{{baseUrl}}/auth/register`
- Auth: No

Request body (JSON):

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "P@ssw0rd!",
  "role": "Customer"
}
```

Test cases:

- Happy path: valid payload -> 201 Created
  - Sample response:
  ```json
  {
    "success": true,
    "data": {
      "id": "<USER_ID>",
      "email": "jane@example.com",
      "role": "Customer"
    }
  }
  ```
- Validation errors: missing email/password -> 400 Bad Request
  - Response contains validation messages.
- Conflict: email already exists -> 409 Conflict
- Auth: N/A

---

### POST /auth/login

- Method: POST
- URL: `{{baseUrl}}/auth/login`
- Auth: No

Request body (JSON):

```json
{
  "email": "jane@example.com",
  "password": "P@ssw0rd!"
}
```

Test cases:

- Happy path: correct credentials -> 200 OK
  - Response example:
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "ey...",
      "refreshToken": "rft...",
      "user": {
        "id": "<USER_ID>",
        "email": "jane@example.com",
        "role": "Customer"
      }
    }
  }
  ```
- Validation error: missing fields -> 400
- Unauthorized: wrong password or non-existent user -> 401 Unauthorized

---

### POST /auth/refresh

- Method: POST
- URL: `{{baseUrl}}/auth/refresh`
- Auth: No (accepts refresh token in body)

Request body:

```json
{ "refreshToken": "<REFRESH_TOKEN>" }
```

Test cases:

- Happy path: valid refresh -> 200 OK with new accessToken
- Invalid/expired refresh token -> 401 Unauthorized

---

### POST /auth/logout

- Method: POST
- URL: `{{baseUrl}}/auth/logout`
- Auth: Bearer token required (Customer/Barber/Admin)

Request body (optional):

```json
{ "refreshToken": "<REFRESH_TOKEN>" }
```

Test cases:

- Happy path: token revoked -> 200 OK
- Missing token -> 401 Unauthorized

---

## Users

### GET /users

- Method: GET
- URL: `{{baseUrl}}/users`
- Auth: Admin
- Query params: `page`, `limit`, `search`, `role`

Test cases:

- Happy path: Admin token -> 200 OK, list of users.
  - Response example:
  ```json
  {
    "success": true,
    "meta": { "page": 1, "limit": 20, "total": 3 },
    "data": [{ "id": "...", "email": "..." }]
  }
  ```
- Auth error: non-Admin token -> 403 Forbidden
- Missing token -> 401

---

### GET /users/:id

- Method: GET
- URL: `{{baseUrl}}/users/<USER_ID>`
- Auth: Admin or the user themself

Test cases:

- Happy path: Admin or owner -> 200 OK with user object
- Not found: unknown `<USER_ID>` -> 404 Not Found
- Unauthorized: other user without Admin role -> 403 Forbidden

---

### PUT /users/:id

- Method: PUT
- URL: `{{baseUrl}}/users/<USER_ID>`
- Auth: Admin or the user themself

Request body (JSON):

```json
{
  "name": "Jane D.",
  "phone": "+1234567890"
}
```

Test cases:

- Happy path: valid update -> 200 OK
- Validation errors: invalid phone -> 400
- Unauthorized: missing token or insufficient role -> 401/403
- Not found: 404

---

### DELETE /users/:id

- Method: DELETE
- URL: `{{baseUrl}}/users/<USER_ID>`
- Auth: Admin

Test cases:

- Happy path: Admin deletes user -> 200 OK or 204 No Content
- Not found: 404
- Unauthorized: non-Admin -> 403

---

## Barbers

### GET /barbers

- Method: GET
- URL: `{{baseUrl}}/barbers`
- Auth: Public (no token required)
- Query params: `branchId`, `available`, `search`, `page`, `limit`

Test cases:

- Happy path: returns list of barbers -> 200 OK
- Validation: invalid query -> 400

---

### GET /barbers/:id

- Method: GET
- URL: `{{baseUrl}}/barbers/<BARBER_ID>`
- Auth: Public

Test cases:

- Happy path: 200 OK with barber profile
- Not found -> 404

---

### POST /barbers

- Method: POST
- URL: `{{baseUrl}}/barbers`
- Auth: Admin

Request body:

```json
{
  "name": "John Smith",
  "email": "john.barber@example.com",
  "phone": "+18005551234",
  "branchId": "<BRANCH_ID>",
  "services": ["<SERVICE_ID>"]
}
```

Test cases:

- Happy path: 201 Created with barber data
- Validation errors: missing name/email -> 400
- Conflict: email already used -> 409
- Unauthorized: missing Admin token -> 403

---

### PUT /barbers/:id

- Method: PUT
- URL: `{{baseUrl}}/barbers/<BARBER_ID>`
- Auth: Admin

Request body (partial allowed):

```json
{ "phone": "+18001112222", "services": ["<SERVICE_ID>"] }
```

Test cases:

- Happy path: 200 OK
- Validation: invalid body -> 400
- Not found -> 404
- Unauthorized -> 403

---

### DELETE /barbers/:id

- Method: DELETE
- URL: `{{baseUrl}}/barbers/<BARBER_ID>`
- Auth: Admin

Test cases:

- Happy path: 200 OK or 204 No Content
- Not found -> 404
- Unauthorized -> 403

---

## Branches

### GET /branches

- Method: GET
- URL: `{{baseUrl}}/branches`
- Auth: Public

Test cases:

- Happy path -> 200 OK

---

### GET /branches/:id

- Method: GET
- URL: `{{baseUrl}}/branches/<BRANCH_ID>`
- Auth: Public

Test cases:

- Happy path -> 200
- Not found -> 404

---

### POST /branches

- Method: POST
- URL: `{{baseUrl}}/branches`
- Auth: Admin

Request body:

```json
{
  "name": "Downtown Branch",
  "address": "123 Main St",
  "phone": "+1234567890",
  "openingHours": "09:00-18:00"
}
```

Test cases:

- Happy path -> 201 Created
- Validation -> 400
- Conflict -> 409
- Unauthorized -> 403

---

### PUT /branches/:id

- Method: PUT
- URL: `{{baseUrl}}/branches/<BRANCH_ID>`
- Auth: Admin

Request body example:

```json
{ "phone": "+1112223333" }
```

Test cases: success 200, validation 400, not found 404, unauthorized 403

---

### DELETE /branches/:id

- Method: DELETE
- URL: `{{baseUrl}}/branches/<BRANCH_ID>`
- Auth: Admin

Test cases: success 200/204, not found 404, unauthorized 403

---

## Chairs

### GET /chairs

- Method: GET
- URL: `{{baseUrl}}/chairs`
- Auth: Public
- Query params: `branchId`, `available`

Test cases: success 200, validation 400

---

### POST /chairs

- Method: POST
- URL: `{{baseUrl}}/chairs`
- Auth: Admin

Request body:

```json
{
  "label": "Chair A1",
  "branchId": "<BRANCH_ID>",
  "isActive": true
}
```

Test cases: 201 created, validation 400, unauthorized 403

---

### PUT /chairs/:id

- Method: PUT
- URL: `{{baseUrl}}/chairs/<CHAIR_ID>`
- Auth: Admin

Request body (partial):

```json
{ "isActive": false }
```

Test cases: success 200, not found 404, unauthorized 403

---

### DELETE /chairs/:id

- Method: DELETE
- URL: `{{baseUrl}}/chairs/<CHAIR_ID>`
- Auth: Admin

Test cases: success 200/204, not found 404

---

## Services

### GET /services

- Method: GET
- URL: `{{baseUrl}}/services`
- Auth: Public

Test cases: 200 OK

---

### POST /services

- Method: POST
- URL: `{{baseUrl}}/services`
- Auth: Admin

Request body:

```json
{
  "name": "Haircut",
  "duration": 30,
  "price": 25.0
}
```

Test cases: 201 Created, validation 400, conflict 409, unauthorized 403

---

### PUT /services/:id

- Method: PUT
- URL: `{{baseUrl}}/services/<SERVICE_ID>`
- Auth: Admin

Request body sample:

```json
{ "price": 30.0 }
```

Test cases: 200, 400, 404, 403

---

### DELETE /services/:id

- Method: DELETE
- URL: `{{baseUrl}}/services/<SERVICE_ID>`
- Auth: Admin

Test cases: 200/204, 404, 403

---

## Appointments

### GET /appointments

- Method: GET
- URL: `{{baseUrl}}/appointments`
- Auth: Customer (returns own) or Admin (all) or Barber (assigned)
- Query params: `date`, `status`, `barberId`, `branchId`, `page`, `limit`

Test cases: 200 OK, auth errors 401/403

---

### GET /appointments/:id

- Method: GET
- URL: `{{baseUrl}}/appointments/<APPOINTMENT_ID>`
- Auth: Customer (owner), Barber (assigned), or Admin

Test cases: 200, 404, 403

---

### POST /appointments

- Method: POST
- URL: `{{baseUrl}}/appointments`
- Auth: Customer

Request body (JSON):

```json
{
  "customerId": "<USER_ID>",
  "barberId": "<BARBER_ID>",
  "serviceId": "<SERVICE_ID>",
  "branchId": "<BRANCH_ID>",
  "chairId": "<CHAIR_ID>",
  "startTime": "2026-08-20T10:30:00.000Z",
  "duration": 30,
  "notes": "Please be on time"
}
```

Test cases:

- Happy path: valid slot and barber available -> 201 Created
  - Sample response:
  ```json
  {
    "success": true,
    "data": { "id": "<APPOINTMENT_ID>", "status": "scheduled" }
  }
  ```
- Validation errors: missing startTime/service -> 400
- Conflict: overlapping appointment or slot unavailable -> 409 Conflict
- Unauthorized: missing/invalid token -> 401
- Not found: invalid barber/service/branch -> 404

---

### PUT /appointments/:id

- Method: PUT
- URL: `{{baseUrl}}/appointments/<APPOINTMENT_ID>`
- Auth: Customer (owner) or Admin; some actions reserved for Barber/Admin

Request body examples:

- Update time or notes:

```json
{ "startTime": "2026-08-20T11:00:00.000Z" }
```

- Change status (cancel/complete):

```json
{ "status": "cancelled" }
```

Test cases:

- Happy path: 200 OK
- Validation: 400
- Unauthorized: 401/403
- Conflict: new time overlaps -> 409
- Not found: 404

---

### DELETE /appointments/:id

- Method: DELETE
- URL: `{{baseUrl}}/appointments/<APPOINTMENT_ID>`
- Auth: Admin or owner (depending on app rules)

Test cases: success 200/204, 404, 403

---

## Queue

Assumed endpoints: queue operations per branch.

### GET /queue?branchId=<BRANCH_ID>

- Method: GET
- URL: `{{baseUrl}}/queue?branchId=<BRANCH_ID>`
- Auth: Public

Test cases: 200 returns queue list

---

### POST /queue/join

- Method: POST
- URL: `{{baseUrl}}/queue/join`
- Auth: Customer

Request body:

```json
{
  "customerId": "<USER_ID>",
  "branchId": "<BRANCH_ID>",
  "serviceId": "<SERVICE_ID>"
}
```

Test cases:

- Happy path: 201 Created with position in queue
- Validation error: 400
- Unauthorized: 401
- Conflict: already in queue -> 409

---

### POST /queue/leave

- Method: POST
- URL: `{{baseUrl}}/queue/leave`
- Auth: Customer

Request body:

```json
{ "customerId": "<USER_ID>", "branchId": "<BRANCH_ID>" }
```

Test cases: success 200, not in queue -> 404

---

### POST /queue/next (Barber/Admin to call next customer)

- Method: POST
- URL: `{{baseUrl}}/queue/next`
- Auth: Barber or Admin

Request body:

```json
{ "branchId": "<BRANCH_ID>", "barberId": "<BARBER_ID>" }
```

Test cases: 200 returns next customer or 204 if none

---

## Payments

### POST /payments

- Method: POST
- URL: `{{baseUrl}}/payments`
- Auth: Customer

Request body:

```json
{
  "appointmentId": "<APPOINTMENT_ID>",
  "amount": 25.0,
  "method": "card",
  "paymentDetails": { "cardLast4": "4242" }
}
```

Test cases:

- Happy path: 201 Created, returns `paymentId` and `status: paid`
- Validation: 400
- Unauthorized: 401
- Conflict: appointment already paid -> 409

---

### GET /payments/:id

- Method: GET
- URL: `{{baseUrl}}/payments/<PAYMENT_ID>`
- Auth: Admin or owner (Customer)

Test cases: 200, 404, 403

---

### Webhooks / payment callbacks

- If your app supports a webhook (e.g., `/payments/webhook`), test signature verification, invalid payloads (400), and success (200).

---

## Dashboard

### GET /dashboard/summary

- Method: GET
- URL: `{{baseUrl}}/dashboard/summary`
- Auth: Admin

Test cases:

- Happy path: 200 OK with stats
  - Sample response:
  ```json
  {
    "success": true,
    "data": {
      "totalAppointmentsToday": 12,
      "revenueToday": 450.5,
      "activeBarbers": 6
    }
  }
  ```
- Unauthorized: non-Admin -> 403
- Missing token -> 401

---

## Common Test Cases & Tips

- Authentication:
  - Test with missing `Authorization` header -> 401.
  - Test with invalid/expired token -> 401.
  - Test role-based access: use tokens for `Customer`, `Barber`, and `Admin`.

- Validation:
  - Send empty or malformed JSON body -> 400.
  - For Zod-based validation, include examples of invalid types (e.g., string instead of number) and check error details in response.

- Concurrency / Conflict:
  - For appointments, attempt to create overlapping appointments to confirm 409 behavior.
  - For queues, try joining twice to confirm 409 conflict.

- Not Found:
  - Request resources with a well-formed but non-existent ID (e.g., `000000000000000000000000`) -> 404.

- Rate limiting & Idempotency:
  - If present, test repeated identical requests (e.g., duplicate payment POST) and check idempotency middleware behavior.
  - If rate limiter middleware exists, trigger rate limits by repeated requests and expect `429 Too Many Requests`.

---

## Postman Examples (Quick snippets)

1.  Login (set environment `accessToken`):

Request:

```
POST {{baseUrl}}/auth/login
Content-Type: application/json

{ "email": "jane@example.com", "password": "P@ssw0rd!" }
```

2.  Create appointment (Customer):

```
POST {{baseUrl}}/appointments
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{ "customerId": "{{userId}}", "barberId": "{{barberId}}", "serviceId":"{{serviceId}}", "branchId":"{{branchId}}", "startTime":"2026-08-20T10:30:00.000Z", "duration":30 }
```

3.  Admin: create service

```
POST {{baseUrl}}/services
Authorization: Bearer {{adminAccessToken}}
Content-Type: application/json

{ "name":"Beard Trim", "duration":15, "price":10.0 }
```

---

## Troubleshooting

- If you encounter CORS errors in the frontend, ensure backend sets proper CORS headers in `app.js`.
- If tokens appear invalid, ensure system time is correct and token secret matches environment settings.
- For Redis/queue-related issues, verify Redis is running and the `config/redis.js` config matches your host/port.

---

If you want, I can now:

- Generate a Postman collection JSON from this guide, or
- Scan actual route files to precisely mirror the project's route paths and parameter names.
