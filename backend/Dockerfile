FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm config set fetch-retries 5
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Command: Tunggu DB siap -> Migrate -> Seed -> Start Server
CMD npx sequelize-cli db:migrate && \
    npx sequelize-cli db:seed:all && \
    npm start