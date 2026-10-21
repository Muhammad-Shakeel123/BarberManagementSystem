# Production image for the Express + Socket.IO API.
# Build context: ./backend
FROM node:22

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY . .

EXPOSE 5000
CMD ["node", "src/index.js"]
