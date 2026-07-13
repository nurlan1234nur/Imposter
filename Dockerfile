# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Serve stage ----
FROM node:20-alpine AS serve
WORKDIR /app
COPY server.js server-games.js ./
COPY --from=build /app/dist ./dist
EXPOSE 80
CMD ["node", "server.js"]
