FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
RUN npm install --workspace=packages/backend

COPY packages/backend/prisma ./packages/backend/prisma
COPY packages/backend/tsconfig*.json ./packages/backend/
COPY packages/backend/nest-cli.json ./packages/backend/
COPY packages/backend/src ./packages/backend/src

WORKDIR /app/packages/backend
RUN npx prisma generate
RUN npx tsc -p tsconfig.build.json

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
RUN npm install --omit=dev --workspace=packages/backend

COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/node_modules/.prisma ./packages/backend/node_modules/.prisma
COPY --from=builder /app/packages/backend/node_modules/@prisma ./packages/backend/node_modules/@prisma
COPY packages/backend/prisma ./packages/backend/prisma

WORKDIR /app/packages/backend

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
