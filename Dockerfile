# Build stage
FROM node:20-slim AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration for React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ============================================
# Optional: nginx.conf file
# Create this file in your project root if needed
# ============================================
# server {
#     listen 80;
#     server_name localhost;
#     
#     root /usr/share/nginx/html;
#     index index.html;
#     
#     # Handle React Router
#     location / {
#         try_files $uri $uri/ /index.html;
#     }
#     
#     # Cache static assets
#     location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
#         expires 1y;
#         add_header Cache-Control "public, immutable";
#     }
# }