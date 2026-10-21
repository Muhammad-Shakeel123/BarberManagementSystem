# Production image for the React SPA: built with Vite, served by nginx,
# which also proxies /api and /socket.io to the API service so the whole app
# lives on a single origin.
# Build context: ./frontend
FROM node:22 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Vite inlines these at build time. Defaults target the single-origin layout
# (nginx proxies /api and /socket.io to the API container).
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_SOCKET_URL=/
ARG VITE_STRIPE_PUBLISHABLE_KEY=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_SOCKET_URL=$VITE_SOCKET_URL \
    VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
