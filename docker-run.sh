#!/bin/bash

# Ubuntu Bounty Lead Management System - Docker Run Script
# Quick script to run the application using Docker Compose

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏢 Ubuntu Bounty Lead Management System${NC}"
echo -e "${BLUE}=====================================${NC}"

# Check if docker-compose is available
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo -e "${RED}❌ Docker Compose is not available${NC}"
    exit 1
fi

echo -e "${GREEN}🚀 Starting Ubuntu Bounty Lead Management System...${NC}"

# Start the application
$COMPOSE_CMD up -d --build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Application started successfully!${NC}"
    echo -e "${GREEN}🌐 Access the application at: http://localhost:3000${NC}"
    echo -e "${YELLOW}🔑 Default login PIN: 2025${NC}"
    echo -e "${BLUE}📋 View logs: $COMPOSE_CMD logs -f${NC}"
    echo -e "${BLUE}🛑 Stop application: $COMPOSE_CMD down${NC}"
else
    echo -e "${RED}❌ Failed to start application${NC}"
    exit 1
fi