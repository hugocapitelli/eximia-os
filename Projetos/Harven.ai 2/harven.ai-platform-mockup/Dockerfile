# Harven.AI Frontend - Dockerfile
# Build de producao com Nginx

# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json primeiro (cache)
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar codigo fonte
COPY . .

# Build de producao
RUN npm run build

# Etapa 2: Producao com Nginx
FROM nginx:alpine

# Copiar configuracao customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build do React
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 3000

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
