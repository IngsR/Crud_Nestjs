# 🐳 Docker Deployment Guide

Panduan lengkap untuk deploy NestJS CRUD API menggunakan Docker dan Docker Compose.

## Prerequisites

- Docker Engine >= 20.10
- Docker Compose >= 2.0

## Quick Start

### 1. Clone & Setup Environment

```bash
# Clone repository
git clone <repository-url>
cd crud-app

# Copy environment file
cp .env.example .env
```

### 2. Edit Environment Variables

Edit `.env` sesuai kebutuhan:

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password_here
DB_DATABASE=crud_db

# Application
PORT=3000
```

### 3. Build & Run

```bash
# Build dan start semua services
docker-compose up -d

# Lihat logs
docker-compose logs -f

# Lihat status containers
docker-compose ps
```

### 4. Verify Deployment

```bash
# Check API health
curl http://localhost:3000/api

# Access Swagger documentation
open http://localhost:3000/api/docs
```

## Docker Commands

### Services Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Stop and remove volumes (⚠️ DATA WILL BE LOST)
docker-compose down -v
```

### Logs & Debugging

```bash
# View all logs
docker-compose logs -f

# View API logs only
docker-compose logs -f api

# View database logs
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 api
```

### Database Operations

```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d crud_db

# Run seeder (populate sample data)
docker-compose exec api npm run seed

# Backup database
docker-compose exec postgres pg_dump -U postgres crud_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres crud_db < backup.sql
```

### Container Management

```bash
# Execute command in API container
docker-compose exec api npm run build

# Access API container shell
docker-compose exec api sh

# View container resource usage
docker stats
```

## Production Deployment

### 1. Security Hardening

Edit `docker-compose.yml` untuk production:

```yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD} # Use strong password
    ports:
      - '127.0.0.1:5432:5432' # Bind to localhost only
```

### 2. Disable Synchronize

Edit `src/app.module.ts`:

```typescript
TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    // ...
    synchronize: false,  // ⚠️ IMPORTANT: Disable in production!
    // Use migrations instead
  }),
}),
```

### 3. Use Docker Secrets

Instead of `.env`, use Docker secrets for sensitive data:

```bash
echo "my_secure_password" | docker secret create db_password -
```

### 4. Health Monitoring

Check container health:

```bash
# View health status
docker-compose ps

# Detailed health check logs
docker inspect --format='{{json .State.Health}}' crud-app-api | jq
```

## Architecture

```
┌─────────────────────────────────────┐
│         Nginx (Optional)            │
│    Reverse Proxy / Load Balancer    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│        NestJS API Container         │
│    Port: 3000 (Internal: 3000)      │
│    - Health Check: /api             │
│    - Non-root User: nestjs (1001)   │
│    - Alpine Linux (Minimal)         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│     PostgreSQL 16 Container         │
│    Port: 5432 (Internal: 5432)      │
│    - Persistent Volume: postgres_data│
│    - Health Check: pg_isready       │
└─────────────────────────────────────┘
```

## Multi-Stage Build Optimization

Dockerfile menggunakan multi-stage build untuk:

1. **Builder Stage**
   - Install all dependencies
   - Build TypeScript ke JavaScript
   - Size: ~500MB

2. **Production Stage**
   - Copy hanya production dependencies
   - Copy built files dari builder
   - Run sebagai non-root user (security)
   - Final size: ~200MB

## Environment Variables

| Variable      | Description       | Default      |
| ------------- | ----------------- | ------------ |
| `NODE_ENV`    | Environment mode  | `production` |
| `PORT`        | API server port   | `3000`       |
| `DB_HOST`     | Database host     | `postgres`   |
| `DB_PORT`     | Database port     | `5432`       |
| `DB_USERNAME` | Database user     | `postgres`   |
| `DB_PASSWORD` | Database password | -            |
| `DB_DATABASE` | Database name     | `crud_db`    |

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Or change port in .env
PORT=3001
```

### Database Connection Failed

```bash
# Check if postgres is healthy
docker-compose ps postgres

# View postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Container Won't Start

```bash
# View detailed logs
docker-compose logs api

# Check container status
docker-compose ps

# Rebuild without cache
docker-compose build --no-cache api
docker-compose up -d
```

### Permission Issues

```bash
# Fix ownership of volumes
docker-compose down
sudo chown -R $USER:$USER .
docker-compose up -d
```

## Performance Tuning

### Database Connection Pooling

Edit TypeORM configuration:

```typescript
{
  extra: {
    max: 20,  // Maximum pool size
    min: 5,   // Minimum pool size
    idle: 10000  // Idle timeout (ms)
  }
}
```

### API Container Resources

Limit resources in `docker-compose.yml`:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Backup & Restore

### Automated Backup Script

Create `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T postgres pg_dump -U postgres crud_db > backup_$DATE.sql
echo "Backup created: backup_$DATE.sql"
```

### Restore from Backup

```bash
docker-compose exec -T postgres psql -U postgres crud_db < backup_20251202.sql
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker Image
        run: docker build -t myapp:latest .
      - name: Deploy
        run: docker-compose up -d
```

## Monitoring

### Container Logs

```bash
# Stream logs
docker-compose logs -f --tail=100

# Export logs
docker-compose logs > app.log
```

### Resource Monitoring

```bash
# Real-time stats
docker stats

# cAdvisor (Optional)
docker run -d -p 8080:8080 google/cadvisor
```

## Scaling

### Horizontal Scaling

```bash
# Scale API to 3 instances
docker-compose up -d --scale api=3

# Use load balancer (Nginx/HAProxy) in front
```

## Security Checklist

- ✅ Use non-root user in container
- ✅ Minimal base image (Alpine)
- ✅ No hardcoded secrets
- ✅ Health checks enabled
- ✅ Network isolation
- ✅ Volume permissions
- ⚠️ Disable synchronize in production
- ⚠️ Use HTTPS (Nginx reverse proxy)
- ⚠️ Implement rate limiting
- ⚠️ Regular security updates

---

**Happy Deploying! 🚀**
