# Ubuntu Bounty Lead Management System - Dockerfile
# Multi-stage build for optimized production image

# Stage 1: Build the React application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Clean up devDependencies after build
RUN npm prune --production

# Stage 2: Production server with Nginx
FROM nginx:alpine AS production

# Install Node.js for potential server-side operations
RUN apk add --no-cache nodejs npm

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory for logs
RUN mkdir -p /var/log/nginx

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]