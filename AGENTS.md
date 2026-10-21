# Notes for agents working on this repository

## Running the app in the Base44 sandbox

The sandbox runs the full stack from the cloned source with Docker Compose
(`docker-compose.base44.yml`). Do not build the app with its own production
tooling here — the compose file bind-mounts `backend/` and `frontend/` and runs
the development servers with live reload.

```bash
docker compose -f docker-compose.base44.yml up -d --build
docker compose -f docker-compose.base44.yml --profile setup run --rm seed   # demo data
```

| Service | Purpose | Host port |
| --- | --- | --- |
| `web` | Vite dev server — preview entry point | 3000 |
| `api` | Express + Socket.IO via nodemon | 8000 (container `PORT=5000`) |
| `mongo` | MongoDB 7 (`mongodb://mongo:27017/barber-management`) | internal |
| `redis` | Redis 7 (Bull queues) | internal |
| `seed` | One-shot demo-data job, behind the `setup` profile | – |

### Demo data is required to sign in

Nothing seeds users automatically, so a fresh database has no accounts and the
login screen cannot be used. Run the seed job once after the first boot:

```bash
docker compose -f docker-compose.base44.yml --profile setup run --rm seed
```

`src/seed/index.js` **deletes all users, branches, barber profiles, services and
chairs** before inserting its fixtures, so it sits behind the `setup` profile and
a plain `up` never starts it. Seeded accounts: `admin@barber.com` / `admin123`,
`barber@barber.com` / `barber123`, `customer@barber.com` / `customer123`.

The seed hands those passwords to the model in plain text: `User` has a
`pre`-`save` hook that hashes the password, so hashing it inside the seed too
produced double-hashed values that could never match at login. Every code path
that creates users must pass a plain password.

### Configuration quirks worth knowing

- **The API cannot boot without `STRIPE_SECRET_KEY`.** `src/config/stripe.js` and
  `payment.webhook.service.js` construct a `Stripe` client at import time and the
  SDK throws on a missing key. `.env.base44-defaults` supplies a non-functional
  placeholder so the service starts; real credentials can be added as secrets and
  override it (that file is the _first_ `env_file`, `/run/base44/app.env` is last).
- **Frontend API/socket URLs are absolute and come from the environment.**
  Compose sets `VITE_API_BASE_URL` and `VITE_SOCKET_URL` to the public API host
  (`https://8000-$BASE44_PUBLIC_HOST_SUFFIX/api/v1`), matching the two-origin
  layout documented in `frontend/.env.example`. Vite exposes `VITE_*` variables
  from `process.env`, so no `.env` file is needed inside `frontend/`.
- **CORS allowlist.** `backend/src/app.js` always allows `http://localhost:5173`
  and additionally allows the preview origin (`https://3000-$BASE44_PUBLIC_HOST_SUFFIX`)
  only when `BASE44_PREVIEW_MODE === "1"`, which the platform sets for sandbox
  commands. With the flag unset the original single-origin behaviour is intact.
- **Vite host check.** The `web` service receives the platform's
  `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` so the proxied preview host is accepted.
- `npm run dev` in `backend/` passes `--experimental-json-modules`; Node 22 (used
  by the compose file) still accepts the flag.
- Socket.IO's CORS default (`origin` unset, i.e. `*`) is what the app relies on;
  `FRONTEND_URL` is intentionally not set.
- Optional integrations degrade instead of failing: unset Cloudinary credentials
  make image upload return 503, and unset SMTP makes notification emails fail at
  send time (the transporter is created lazily). Without
  `VITE_STRIPE_PUBLISHABLE_KEY` the payments screen still renders, but Stripe.js
  logs `Expected publishable key to be of type string, got type undefined` and no
  card element can mount, so pass the user's Stripe keys through secrets before
  exercising payments.

### How to verify the stack

```bash
curl -fsS http://localhost:8000/health                   # API liveness
curl -sS -o /dev/null -w '%{http_code}\n' \
  http://localhost:8000/api/v1/dashboard/admin           # protected: expects 401 without a token
curl -fsS http://localhost:3000/ | head                  # Vite serves the SPA shell
```

For a real end-to-end check, sign in at `/login` with `admin@barber.com` /
`admin123` and load an admin route such as `/admin/dashboard`. API requests from
the browser go to the public API origin on port 8000, so a successful login also
proves the CORS allowlist and the database are wired correctly.
