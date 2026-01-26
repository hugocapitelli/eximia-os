# Harven.AI Frontend - Dockerfile
# Build de producao com Nginx

# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json primeiro (cache)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar codigo fonte
COPY . .

# Build argument para URL da API (injetado no build)
ARG VITE_API_URL=https://api.harven.eximiaventures.com.br
ENV VITE_API_URL=${VITE_API_URL}

# Build de producao
RUN npm run build

# Etapa 2: Producao com Nginx
FROM nginx:alpine

# Copiar configuracao customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build do React
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta 80 (padrao web)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
