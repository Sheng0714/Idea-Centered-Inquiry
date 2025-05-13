FROM node:18-alpine

# Create app directory
WORKDIR /app

# Env
RUN export NODE_OPTIONS=--openssl-legacy-provider


# Installing dependency
COPY package.json .

RUN npm install

# Copying source files
COPY . .


# Building app
RUN npm run build

RUN npm install -g serve

# Application server port
EXPOSE 3000

# Running the app
CMD ["serve", "-s", "./build", "-l", "3000"]
