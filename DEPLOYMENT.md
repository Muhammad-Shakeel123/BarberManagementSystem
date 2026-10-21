# Deployment

The Base44 sandbox (`docker-compose.base44.yml`) is a development environment.
For a permanent, shareable URL the app ships with a production stack:

| File | Purpose |
| --- | --- |
| `backend/Dockerfile` | API image (`node:22`, production deps only) |
| `frontend/Dockerfile` | Multi-stage build: Vite build, then nginx |
| `frontend/nginx.conf` | Serves the SPA and proxies `/api` and `/socket.io` to the API |
| `docker-compose.prod.yml` | Single-origin stack: `web`, `api`, `mongo`, `redis` |
| `.env.prod.example` | Template for the production environment file |

Everything is served from one origin, so there is no CORS setup and cookies stay
first-party.

## Deploy on a Docker host (VPS, ~5 minutes)

On the server, with Docker and the Docker Compose plugin installed:

```bash
git clone <this repository> barber && cd barber
git checkout main

cp .env.prod.example .env.prod
openssl rand -hex 48            # put the output in JWT_SECRET
$EDITOR .env.prod               # Stripe / SMTP / Cloudinary keys, WEB_PORT

docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

Open `http://<server-ip>:${WEB_PORT}/` — the site is live.

Optional demo data (this **wipes every collection**, so skip it on a real
deployment and create accounts through the app instead):

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml \
  --profile setup run --rm seed
```

### Domain and HTTPS

Put any TLS terminator in front of the `web` service: Caddy (`caddy reverse_proxy
:80`), Traefik, or host nginx with certbot. Point it at `web:80` (host port
`WEB_PORT`). Stripe webhooks go to `https://<domain>/api/v1/payments/webhook` —
add that URL in the Stripe dashboard and copy the signing secret into
`STRIPE_WEBHOOK_SECRET`.

## Deploy on a managed platform (Railway, Render, Fly.io)

Those platforms run one container per service:

- **API service** — root directory `backend/`, Dockerfile `backend/Dockerfile`,
  public port 5000. Set every variable from `.env.prod.example` in the
  dashboard, plus `MONGODB_URI` (MongoDB Atlas) and `REDIS_HOST`/`REDIS_PORT`
  (managed Redis).
- **Web service** — root directory `frontend/`, Dockerfile `frontend/Dockerfile`,
  public port 80. Build args: `VITE_API_BASE_URL=https://<api-domain>/api/v1` and
  `VITE_SOCKET_URL=https://<api-domain>` (the API is a separate origin there, so
  nginx's proxy is not used), plus `VITE_STRIPE_PUBLISHABLE_KEY`.
- Run `npm run seed` once on the API service if you want the demo dataset.

With two origins the API must allow the web origin: `backend/src/app.js` allows
`http://localhost:5173` plus the sandbox preview host only. Add your production
web origin to that allowlist before going live this way, or keep the
single-origin compose layout described above.

## What this stack does not include

- **TLS certificates** — terminate HTTPS in front of `web`.
- **Backups** — `mongo_data` is a Docker volume; snapshot it on a schedule
  (`mongodump` on a cron job) or use Atlas for managed backups.
- **Scaling** — one API container; Socket.IO and Bull queues assume a single
  instance unless you add a Redis adapter and separate workers.

## Verifying a deployment

```bash
curl -fsS https://<domain>/                       # SPA shell
curl -fsS https://<domain>/api/v1/health 2>/dev/null || true
curl -sS -o /dev/null -w '%{http_code}\n' \
  https://<domain>/api/v1/dashboard/admin         # 401 without a token
```

Then sign in at `/login` and load an admin screen: a successful login proves
nginx proxying, the database and the JWT wiring.
