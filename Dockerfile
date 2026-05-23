FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npx tsc

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
EXPOSE 4000
CMD ["node", "dist/server.js"]
