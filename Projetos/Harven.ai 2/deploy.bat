@echo off
REM ============================================
REM HARVEN.AI - SCRIPT DE DEPLOY WINDOWS
REM ============================================

echo.
echo ========================================
echo   HARVEN.AI - Deploy em Producao
echo ========================================
echo.

REM Verificar Docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao encontrado!
    echo Instale: https://docs.docker.com/desktop/install/windows-install/
    pause
    exit /b 1
)

REM Verificar Docker Compose
where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Docker Compose nao encontrado!
    echo Instale junto com Docker Desktop
    pause
    exit /b 1
)

echo [OK] Docker encontrado
echo.

REM Verificar arquivo .env
if not exist "backend\.env" (
    echo [AVISO] Arquivo backend\.env nao encontrado!
    echo Copiando .env.example...
    copy "backend\.env.example" "backend\.env"
    echo.
    echo [ACAO NECESSARIA]
    echo Edite backend\.env com suas credenciais:
    echo   - SUPABASE_URL
    echo   - SUPABASE_KEY
    echo   - OPENAI_API_KEY
    echo.
    echo Apos editar, execute este script novamente.
    pause
    exit /b 1
)

echo [OK] Arquivo .env encontrado
echo.

REM Build do Frontend
echo [INFO] Building frontend...
cd harven.ai-platform-mockup

if not exist "node_modules" (
    echo [INFO] Instalando dependencias do frontend...
    call npm install
)

echo [INFO] Compilando frontend para producao...
call npm run build

if %errorlevel% neq 0 (
    echo [ERRO] Build do frontend falhou!
    cd ..
    pause
    exit /b 1
)

cd ..

echo [OK] Frontend compilado
echo.

REM Parar containers antigos
echo [INFO] Parando containers antigos...
docker-compose -f docker-compose.prod.yml down 2>nul

REM Build e start dos containers
echo [INFO] Buildando e iniciando containers...
docker-compose -f docker-compose.prod.yml up -d --build

if %errorlevel% neq 0 (
    echo [ERRO] Deploy falhou!
    echo Verifique os logs: docker-compose -f docker-compose.prod.yml logs
    pause
    exit /b 1
)

echo [OK] Containers iniciados
echo.

REM Aguardar backend
echo [INFO] Aguardando backend inicializar (10s)...
timeout /t 10 /nobreak >nul

REM Verificar status
echo [INFO] Status dos containers:
docker-compose -f docker-compose.prod.yml ps

echo.
echo ========================================
echo   Deploy Concluido com Sucesso!
echo ========================================
echo.
echo Frontend: http://localhost
echo Backend:  http://localhost/api
echo.
echo Para ver logs:
echo   docker-compose -f docker-compose.prod.yml logs -f
echo.
echo Para parar:
echo   docker-compose -f docker-compose.prod.yml down
echo.
pause
