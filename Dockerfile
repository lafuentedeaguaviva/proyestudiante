# Build stage
FROM node:20-alpine as build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Pass environment variables for build time (e.g., Supabase, Deepseek API keys)
# Note: You should pass these as build args during `docker build`
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_DEEPSEEK_API_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_DEEPSEEK_API_KEY=$VITE_DEEPSEEK_API_KEY

# Build the Vite application
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
