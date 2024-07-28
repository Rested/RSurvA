# Stage 1: Build the project
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .


RUN rm .env .env.production && cp .env.docker .env && npm run build

CMD npm run preview