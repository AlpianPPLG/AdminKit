# AdminKit Pro - Deployment Guide

This document provides detailed instructions for deploying the AdminKit Pro application to various hosting platforms.

## Deployment Prerequisites

Before deploying the application, ensure you have:

1. A production-ready build of the application
2. Access to a MySQL database
3. Domain name (optional but recommended)
4. SSL certificate (recommended for production)

## Environment Variables

The application requires the following environment variables to be set:

```env
# Database Configuration
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# JWT Authentication
JWT_SECRET=your_jwt_secret_key

# Base URL of your application
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional (for production)
NODE_ENV=production
```

## Deployment Options

### Vercel (Recommended)

Vercel is the recommended deployment platform as it's optimized for Next.js applications.

#### Steps:
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Sign up for a Vercel account at [vercel.com](https://vercel.com)
3. Create a new project and import your repository
4. Configure the environment variables in the Vercel dashboard:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
5. Deploy the project

#### Vercel Configuration
The application should work with Vercel's default settings. However, you can customize the build settings if needed:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Netlify

Netlify is another excellent option for deploying Next.js applications.

#### Steps:
1. Push your code to a Git repository
2. Sign up for a Netlify account at [netlify.com](https://netlify.com)
3. Create a new site and connect your repository
4. Configure the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next/standalone` (for standalone builds)
5. Set environment variables in the Netlify dashboard
6. Deploy the site

#### Netlify Configuration
For Next.js applications, you may need to enable the Next.js plugin in Netlify.

### Docker Deployment

You can containerize the application using Docker for more flexible deployment options.

#### Dockerfile
Create a [Dockerfile](file:///d:/Development/adminkit-dashboard/Dockerfile) in the root directory:

```dockerfile
# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

#### Docker Compose
Create a `docker-compose.yml` file for multi-container deployments:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      - DB_USER=root
      - DB_PASSWORD=password
      - DB_NAME=adminkit_pro_db
      - JWT_SECRET=your_jwt_secret
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=adminkit_pro_db
    volumes:
      - db_data:/var/lib/mysql
      - ./database-setup.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    restart: unless-stopped

volumes:
  db_data:
```

#### Deployment Steps:
1. Build the Docker image:
   ```bash
   docker build -t adminkit-pro .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 \
     -e DB_HOST=your_db_host \
     -e DB_USER=your_db_user \
     -e DB_PASSWORD=your_db_password \
     -e DB_NAME=your_db_name \
     -e JWT_SECRET=your_jwt_secret \
     -e NEXT_PUBLIC_APP_URL=https://yourdomain.com \
     adminkit-pro
   ```

3. Or use Docker Compose:
   ```bash
   docker-compose up -d
   ```

### Traditional Server Deployment

For deploying to traditional servers (VPS, dedicated servers), follow these steps:

#### Prerequisites:
- Node.js 18+ installed
- MySQL 8.0+ installed
- Nginx or Apache (for reverse proxy)
- PM2 (process manager for Node.js)

#### Steps:
1. Clone the repository to your server:
   ```bash
   git clone <repository-url>
   cd adminkit-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install --production
   ```

3. Set up environment variables:
   Create a `.env.production` file:
   ```env
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=adminkit_pro_db
   JWT_SECRET=your_jwt_secret
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   NODE_ENV=production
   ```

4. Build the application:
   ```bash
   npm run build
   ```

5. Set up the database:
   ```bash
   mysql -u root -p < database-setup.sql
   ```

6. Start the application with PM2:
   ```bash
   pm2 start npm --name "adminkit-pro" -- start
   pm2 startup
   pm2 save
   ```

7. Set up Nginx as a reverse proxy:
   Create `/etc/nginx/sites-available/adminkit-pro`:
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

8. Enable the site:
   ```bash
   ln -s /etc/nginx/sites-available/adminkit-pro /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

9. Set up SSL with Let's Encrypt (optional but recommended):
   ```bash
   certbot --nginx -d yourdomain.com
   ```

### Cloud Platforms

#### AWS Deployment
You can deploy the application to AWS using several services:

1. **Elastic Beanstalk**:
   - Package the application as a ZIP file
   - Upload to Elastic Beanstalk
   - Configure environment variables
   - Set up RDS for MySQL database

2. **EC2 with Docker**:
   - Launch an EC2 instance
   - Install Docker
   - Deploy using the Docker method above
   - Set up RDS for MySQL database

3. **ECS (Elastic Container Service)**:
   - Create ECS cluster
   - Deploy Docker container
   - Set up RDS for MySQL database

#### Google Cloud Platform
Deploy to Google Cloud using:

1. **Cloud Run**:
   - Containerize the application
   - Deploy to Cloud Run
   - Set up Cloud SQL for MySQL database

2. **App Engine**:
   - Create an [app.yaml](file:///d:/Development/adminkit-dashboard/app.yaml) file
   - Deploy using `gcloud app deploy`
   - Set up Cloud SQL for MySQL database

#### Microsoft Azure
Deploy to Azure using:

1. **Azure App Service**:
   - Create App Service
   - Deploy from Git repository
   - Configure application settings
   - Set up Azure Database for MySQL

2. **Azure Container Instances**:
   - Containerize the application
   - Deploy to Azure Container Instances
   - Set up Azure Database for MySQL

## Database Deployment

### MySQL Setup
Ensure your MySQL database is properly configured:

1. Create the database:
   ```sql
   CREATE DATABASE adminkit_pro_db;
   ```

2. Run the database setup script:
   ```bash
   mysql -u root -p adminkit_pro_db < database-setup.sql
   ```

3. Create a dedicated database user (recommended):
   ```sql
   CREATE USER 'adminkit_user'@'%' IDENTIFIED BY 'strong_password';
   GRANT ALL PRIVILEGES ON adminkit_pro_db.* TO 'adminkit_user'@'%';
   FLUSH PRIVILEGES;
   ```

### Database Connection Security
- Use SSL connections when possible
- Restrict database user permissions
- Use strong passwords
- Regular backups

## SSL/HTTPS Configuration

### Let's Encrypt (Recommended)
Use Let's Encrypt for free SSL certificates:

1. Install Certbot:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. Obtain SSL certificate:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. Auto-renewal:
   ```bash
   sudo crontab -e
   # Add this line:
   0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Other SSL Providers
If using other SSL providers, follow their specific installation instructions.

## Monitoring and Logging

### Application Monitoring
Set up monitoring for your deployed application:

1. **Log Management**:
   - Use PM2 logs for application logs
   - Set up log rotation
   - Consider using services like Loggly or Papertrail

2. **Performance Monitoring**:
   - Set up New Relic, DataDog, or similar services
   - Monitor response times
   - Track error rates

3. **Uptime Monitoring**:
   - Use services like UptimeRobot or Pingdom
   - Set up alerts for downtime

### Database Monitoring
- Monitor database performance
- Set up alerts for slow queries
- Monitor connection usage

## Backup and Recovery

### Application Backup
1. **Code Backup**:
   - Use Git for version control
   - Regular backups of the repository
   - Store backups in multiple locations

2. **Database Backup**:
   ```bash
   mysqldump -u root -p adminkit_pro_db > backup-$(date +%F).sql
   ```

3. **Automated Backups**:
   ```bash
   # Add to crontab for daily backups
   0 2 * * * mysqldump -u root -p adminkit_pro_db > /backups/backup-$(date +\%F).sql
   ```

### Disaster Recovery
1. **Recovery Plan**:
   - Document recovery procedures
   - Test recovery regularly
   - Keep backups in multiple locations

2. **Rollback Strategy**:
   - Use version control for easy rollbacks
   - Keep previous versions deployed
   - Use feature flags for gradual rollouts

## Scaling Considerations

### Horizontal Scaling
- Use load balancers
- Implement session storage (Redis)
- Use CDN for static assets

### Vertical Scaling
- Upgrade server resources
- Optimize database queries
- Implement caching strategies

### Database Scaling
- Use read replicas
- Implement database sharding
- Optimize queries and indexes

## Security Considerations

### Production Security
1. **Environment Variables**:
   - Never commit secrets to version control
   - Use secret management services
   - Rotate secrets regularly

2. **Network Security**:
   - Use firewalls
   - Restrict database access
   - Use private networks

3. **Application Security**:
   - Keep dependencies updated
   - Implement rate limiting
   - Use security headers

### Compliance
- Ensure compliance with relevant regulations (GDPR, HIPAA, etc.)
- Implement data encryption
- Regular security audits

## Troubleshooting Deployment Issues

### Common Issues

1. **Database Connection Errors**:
   - Verify database credentials
   - Check network connectivity
   - Ensure database is running

2. **Build Failures**:
   - Check Node.js version compatibility
   - Verify dependencies
   - Check for TypeScript errors

3. **Runtime Errors**:
   - Check application logs
   - Verify environment variables
   - Check resource limits

4. **Performance Issues**:
   - Monitor resource usage
   - Optimize database queries
   - Implement caching

### Debugging Steps
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Monitor resource usage
5. Check network configuration

## Maintenance

### Regular Maintenance Tasks
1. **Dependency Updates**:
   ```bash
   npm outdated
   npm update
   ```

2. **Security Updates**:
   ```bash
   npm audit
   npm audit fix
   ```

3. **Database Maintenance**:
   - Optimize tables
   - Update statistics
   - Check for corruption

4. **Backup Verification**:
   - Test backup restoration
   - Verify backup integrity
   - Update backup procedures

### Version Upgrades
1. **Application Upgrades**:
   - Test in staging environment
   - Backup before upgrading
   - Rollback plan

2. **Database Upgrades**:
   - Backup before upgrading
   - Test compatibility
   - Update connection parameters

## Support and Resources

### Documentation
- Refer to this documentation for deployment guidance
- Check Next.js documentation for framework-specific issues
- Review platform-specific documentation

### Community Support
- Next.js community
- Platform-specific communities
- Stack Overflow

### Professional Support
- Consider professional support for mission-critical applications
- Engage platform providers for infrastructure issues
- Consult with database administrators for complex database issues

---

This deployment guide should help you successfully deploy the AdminKit Pro application to various hosting platforms. Always test deployments in a staging environment before going live.