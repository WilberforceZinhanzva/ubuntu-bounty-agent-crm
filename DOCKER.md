# Docker Deployment Guide - Ubuntu Bounty Lead Management System

This guide explains how to build and deploy the Ubuntu Bounty Lead Management System using Docker.

## 📋 Prerequisites

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** (to clone the repository)

### Installing Docker

#### Windows
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Run the installer and follow the setup wizard
3. Restart your computer when prompted
4. Verify installation: `docker --version`

#### macOS
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Drag Docker to Applications folder
3. Launch Docker from Applications
4. Verify installation: `docker --version`

#### Linux (Ubuntu/Debian)
```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install docker.io docker-compose

# Add user to docker group
sudo usermod -aG docker $USER

# Restart session or run
newgrp docker

# Verify installation
docker --version
docker-compose --version
```

## 🚀 Quick Start

### Method 1: Using Docker Compose (Recommended)

1. **Clone or navigate to the project directory**
   ```bash
   cd "Ubuntu Bounty"
   ```

2. **Run the application**
   ```bash
   # Make script executable (Linux/macOS)
   chmod +x docker-run.sh
   
   # Run the application
   ./docker-run.sh
   ```
   
   Or manually:
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application**
   - Open your browser and go to: `http://localhost:3000`
   - Login with PIN: `2025`

### Method 2: Using Docker Build Script

1. **Make the build script executable** (Linux/macOS)
   ```bash
   chmod +x docker-build.sh
   ```

2. **Run the build script**
   ```bash
   ./docker-build.sh
   ```

3. **Access the application**
   - Open your browser and go to: `http://localhost:3000`
   - Login with PIN: `2025`

### Method 3: Manual Docker Commands

1. **Build the Docker image**
   ```bash
   docker build -t ubuntu-bounty-app .
   ```

2. **Run the container**
   ```bash
   docker run -d \
     --name ubuntu-bounty-lead-management \
     -p 3000:80 \
     --restart unless-stopped \
     ubuntu-bounty-app
   ```

3. **Access the application**
   - Open your browser and go to: `http://localhost:3000`
   - Login with PIN: `2025`

## 🔧 Configuration Options

### Environment Variables

You can customize the application using environment variables:

```bash
# Custom port
docker run -d -p 8080:80 --name ubuntu-bounty ubuntu-bounty-app

# With environment variables
docker run -d \
  -p 3000:80 \
  -e NODE_ENV=production \
  --name ubuntu-bounty \
  ubuntu-bounty-app
```

### Docker Compose Configuration

Edit `docker-compose.yml` to customize:

```yaml
services:
  ubuntu-bounty-app:
    build: .
    ports:
      - "8080:80"  # Change port here
    environment:
      - NODE_ENV=production
      - CUSTOM_VAR=value
```

## 📊 Monitoring and Management

### View Application Logs
```bash
# Using Docker Compose
docker-compose logs -f

# Using Docker directly
docker logs ubuntu-bounty-lead-management -f
```

### Check Container Status
```bash
# List running containers
docker ps

# Check specific container
docker ps --filter "name=ubuntu-bounty"
```

### Health Check
```bash
# Check application health
curl http://localhost:3000/health

# Or visit in browser
http://localhost:3000/health
```

### Container Management
```bash
# Stop the application
docker-compose down

# Or stop container directly
docker stop ubuntu-bounty-lead-management

# Restart the application
docker-compose restart

# View container stats
docker stats ubuntu-bounty-lead-management
```

## 🔒 Production Deployment

### Using Reverse Proxy (Nginx)

For production deployment with SSL:

1. **Enable production profile**
   ```bash
   docker-compose --profile production up -d
   ```

2. **Configure SSL certificates**
   - Place SSL certificates in `./ssl/` directory
   - Update `proxy.conf` with your domain settings

### Security Considerations

1. **Change default PIN**: Update the application to use secure authentication
2. **Use HTTPS**: Configure SSL certificates for production
3. **Network Security**: Use Docker networks to isolate containers
4. **Regular Updates**: Keep Docker images updated

### Scaling

For high-traffic scenarios:

```bash
# Scale the application
docker-compose up -d --scale ubuntu-bounty-app=3

# Use load balancer
docker-compose --profile production up -d
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000
   
   # Use different port
   docker run -p 8080:80 ubuntu-bounty-app
   ```

2. **Docker daemon not running**
   ```bash
   # Start Docker service (Linux)
   sudo systemctl start docker
   
   # Start Docker Desktop (Windows/macOS)
   # Launch Docker Desktop application
   ```

3. **Permission denied**
   ```bash
   # Add user to docker group (Linux)
   sudo usermod -aG docker $USER
   newgrp docker
   ```

4. **Build failures**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker build --no-cache -t ubuntu-bounty-app .
   ```

### Debug Mode

Run container in debug mode:

```bash
# Interactive mode
docker run -it --rm ubuntu-bounty-app /bin/sh

# Debug logs
docker-compose logs --tail=100 -f ubuntu-bounty-app
```

## 📁 File Structure

```
Ubuntu Bounty/
├── Dockerfile              # Main Docker configuration
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf              # Nginx server configuration
├── .dockerignore           # Files to ignore in Docker build
├── docker-build.sh         # Build script
├── docker-run.sh           # Quick run script
├── DOCKER.md               # This documentation
├── src/                    # React application source
├── public/                 # Static assets
└── package.json            # Node.js dependencies
```

## 🔄 Updates and Maintenance

### Updating the Application

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Rebuild and restart**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

### Backup Data

Since the application uses localStorage, data is stored in the browser. For production:

1. **Export data regularly** using the application's export features
2. **Consider external database** for persistent storage
3. **Backup container volumes** if using persistent storage

### Performance Optimization

1. **Multi-stage builds**: Already implemented in Dockerfile
2. **Nginx caching**: Configured in nginx.conf
3. **Gzip compression**: Enabled for static assets
4. **Health checks**: Implemented for monitoring

## 📞 Support

For issues related to Docker deployment:

1. Check the troubleshooting section above
2. Review Docker logs: `docker-compose logs`
3. Verify system requirements
4. Check Docker documentation: [docs.docker.com](https://docs.docker.com)

---

**Ubuntu Bounty Lead Management System v1.0.0**  
*Containerized with Docker for easy deployment*