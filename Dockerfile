FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY app.js ./
COPY bin/ ./bin/
COPY routes/ ./routes/
COPY public/ ./public/
COPY lib/ ./lib/

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

EXPOSE 3000

CMD ["npm", "start"]
