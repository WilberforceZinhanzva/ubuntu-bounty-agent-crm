#!/bin/bash

# Ubuntu Bounty Lead Management System - Docker Build Script
# This script builds and runs the Docker container for the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="ubuntu-bounty-app"
CONTAINER_NAME="ubuntu-bounty-lead-management"
PORT="3000"

echo -e "${BLUE}🏢 Ubuntu Bounty Lead Management System - Docker Build${NC}"
echo -e "${BLUE}=================================================${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

print_status "Docker is installed"

# Check if Docker is running
if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

print_status "Docker is running"

# Stop and remove existing container if it exists
if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    print_warning "Stopping existing container..."
    docker stop ${CONTAINER_NAME} || true
    docker rm ${CONTAINER_NAME} || true
fi

# Remove existing image if it exists
if docker images --format 'table {{.Repository}}' | grep -q "^${IMAGE_NAME}$"; then
    print_warning "Removing existing image..."
    docker rmi ${IMAGE_NAME} || true
fi

# Build the Docker image
print_status "Building Docker image..."
docker build -t ${IMAGE_NAME} .

if [ $? -eq 0 ]; then
    print_status "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi

# Run the container
print_status "Starting container..."
docker run -d \
    --name ${CONTAINER_NAME} \
    -p ${PORT}:80 \
    --restart unless-stopped \
    ${IMAGE_NAME}

if [ $? -eq 0 ]; then
    print_status "Container started successfully"
    echo -e "${GREEN}🚀 Application is running at: http://localhost:${PORT}${NC}"
    echo -e "${GREEN}📊 Health check: http://localhost:${PORT}/health${NC}"
    echo -e "${BLUE}📋 Container logs: docker logs ${CONTAINER_NAME}${NC}"
    echo -e "${BLUE}🛑 Stop container: docker stop ${CONTAINER_NAME}${NC}"
else
    print_error "Failed to start container"
    exit 1
fi

# Show container status
echo -e "\n${BLUE}Container Status:${NC}"
docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n${GREEN}✅ Ubuntu Bounty Lead Management System is ready!${NC}"
echo -e "${YELLOW}💡 Default login PIN: 2025${NC}"