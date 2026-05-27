FROM node:20-alpine

WORKDIR /app

# Copy package descriptors first to leverage Docker cache
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate prisma client
RUN npm install
RUN npx prisma generate

# Copy application source code
COPY . .

# Expose backend port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
