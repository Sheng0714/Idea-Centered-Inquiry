FROM node:18-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./  # 指向相同目錄
RUN npm install
COPY . .
EXPOSE 4000
CMD ["node", "server.js"]
