FROM nginx:alpine

# Copy custom nginx config template
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Copy frontend files
COPY public/ /usr/share/nginx/html/

# Set default backend URL
ENV API_BASE_URL=http://backend:8080/api/

# Expose port 80
EXPOSE 80

# Use envsubst to replace environment variables in nginx config and config.js, then start nginx
CMD ["/bin/sh", "-c", "envsubst '${API_BASE_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && envsubst '${API_BASE_URL}' < /usr/share/nginx/html/js/config.js.template > /usr/share/nginx/html/js/config.js && nginx -g 'daemon off;'"]
