# Stage 1: Build the Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install packages
RUN npm install

# Copy source files
COPY . .

# Compile application into static assets
RUN npm run build

# Stage 2: Serve the compiled files using Nginx
FROM nginx:alpine

# Copy custom build artifacts to nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose nginx default port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
