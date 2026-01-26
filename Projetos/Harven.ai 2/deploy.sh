#!/bin/bash
# ============================================
# HARVEN.AI - SCRIPT DE DEPLOY RÁPIDO
# ============================================

set -e  # Exit on error

echo "🚀 Iniciando deploy da Harven.AI..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para printar mensagens
print_step() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 1. Verificar pré-requisitos
print_step "Verificando pré-requisitos..."

if ! command -v docker &> /dev/null; then
    print_error "Docker não encontrado. Instale: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose não encontrado. Instale: https://docs.docker.com/compose/install/"
    exit 1
fi

# 2. Verificar variáveis de ambiente
print_step "Verificando configurações..."

if [ ! -f "backend/.env" ]; then
    print_warning "Arquivo backend/.env não encontrado!"
    echo "Copiando .env.example..."
    cp backend/.env.example backend/.env
    print_error "AÇÃO NECESSÁRIA: Edite backend/.env com suas credenciais!"
    echo "Principalmente:"
    echo "  - SUPABASE_URL"
    echo "  - SUPABASE_KEY"
    echo "  - OPENAI_API_KEY"
    exit 1
fi

# 3. Build do frontend
print_step "Building frontend..."
cd harven.ai-platform-mockup

if [ ! -d "node_modules" ]; then
    print_step "Instalando dependências do frontend..."
    npm install
fi

print_step "Compilando frontend para produção..."
npm run build

cd ..

# 4. Parar containers antigos
print_step "Parando containers antigos..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# 5. Build e start dos containers
print_step "Buildando e iniciando containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# 6. Aguardar backend ficar pronto
print_step "Aguardando backend inicializar..."
sleep 10

# 7. Health check
print_step "Verificando saúde do sistema..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    print_step "Backend está saudável!"
else
    print_warning "Backend pode não estar respondendo corretamente."
fi

# 8. Mostrar status
print_step "Status dos containers:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "============================================"
print_step "Deploy concluído com sucesso!"
echo "============================================"
echo ""
echo "Frontend: http://localhost"
echo "Backend API: http://localhost/api"
echo "API Docs: http://localhost/api/docs (se configurado)"
echo ""
echo "Para ver logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "Para parar:"
echo "  docker-compose -f docker-compose.prod.yml down"
echo ""
