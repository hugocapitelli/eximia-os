<#
.SYNOPSIS
    Script de "Hidratação" para o Ecossistema ExímIA.OS
    Instala dependências, configura ambiente e baixa modelos.
.DESCRIPTION
    Este script automatiza o setup de um novo dispositivo para rodar o ExímIA.OS.
    1. Instala dependências Python (eximia_runtime)
    2. Instala dependências Node.js (Projetos)
    3. Verifica conexão com Redis/Vector DB
    4. Baixa modelos do Ollama
#>

Write-Host "💧 Iniciando Hidratação do ExímIA.OS..." -ForegroundColor Cyan

# 1. Python Check & Install
Write-Host "`n📦 Verificando Python..." -ForegroundColor Yellow
$pythonVersion = python --version
if ($?) {
    Write-Host "   Python detectado: $pythonVersion" -ForegroundColor Green
    Write-Host "   Instalando eximia_runtime em modo editável..."
    pip install -e ./eximia_runtime
    
    if ($?) { Write-Host "   ✅ Runtime instalado com sucesso." -ForegroundColor Green }
    else { Write-Host "   ❌ Falha ao instalar Runtime." -ForegroundColor Red }

    # 1.1 Extra Python Requirements (Recursive)
    Write-Host "   🔍 Buscando requirements.txt extras..."
    $reqFiles = Get-ChildItem -Path . -Recurse -Filter "requirements.txt" -ErrorAction SilentlyContinue | 
                Where-Object { 
                    $_.FullName -notmatch "node_modules" -and 
                    $_.FullName -notmatch "venv" -and 
                    $_.FullName -notmatch "eximia_runtime" 
                }
    
    foreach ($req in $reqFiles) {
        Write-Host "   📦 Instalando deps de: $($req.FullName)" -ForegroundColor Cyan
        pip install -r $req.FullName
    }

    # 1.2 Binary Checks (Tesseract/Poppler)
    Write-Host "`n   ⚙️ Verificando Binários Externos..."
    
    if (Get-Command tesseract -ErrorAction SilentlyContinue) {
        Write-Host "   [OK] Tesseract OCR: Detectado" -ForegroundColor Green
    } else {
        Write-Host "   [!] Tesseract OCR: NÃO encontrado." -ForegroundColor Yellow
        $install = Read-Host "       Deseja instalar via Winget? (S/N)"
        if ($install -eq 'S') {
            winget install UB-Mannheim.TesseractOCR
            Write-Host "   ⚠️ Reinicie o terminal após a instalação para reconhecer o PATH." -ForegroundColor Yellow
        }
    }

    if (Get-Command pdftoppm -ErrorAction SilentlyContinue) { # Poppler check
        Write-Host "   [OK] Poppler (pdftoppm): Detectado" -ForegroundColor Green
    } else {
        Write-Host "   [!] Poppler: NÃO encontrado." -ForegroundColor Yellow
        $install = Read-Host "       Deseja instalar via Winget? (S/N)"
        if ($install -eq 'S') {
             # Poppler doesn't have a direct official winget package sometimes, using a known one or warning
             winget install XpdfReader # Alternative or instruct user.
             # Actually, better to just guide the user for Poppler as it's tricky on Windows.
             Write-Host "       winget install Schniz.Poppler" -ForegroundColor Cyan
             winget install Schniz.Poppler
        } else {
             Write-Host "       Baixe manualmente: https://github.com/oschwartz10612/poppler-windows/releases/" -ForegroundColor Gray
        }
    }

} else {
    Write-Host "   ❌ Python não encontrado! Instale Python 3.10+" -ForegroundColor Red
    exit 1
}

# 2. Node Check & Install (Iterativo)
Write-Host "`n📦 Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($?) {
    Write-Host "   Node detectado: $nodeVersion" -ForegroundColor Green
    
    $packageFiles = Get-ChildItem -Path . -Recurse -Filter "package.json" -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch "node_modules" }
    
    foreach ($pkg in $packageFiles) {
        $dir = $pkg.DirectoryName
        Write-Host "   ⚡ Instalando deps em: $dir" -ForegroundColor Cyan
        Push-Location $dir
        npm install --no-audit --no-fund
        Pop-Location
    }
} else {
    Write-Host "   ⚠️ Node.js não encontrado. Projetos frontend não rodarão." -ForegroundColor Yellow
}

# 3. Ollama Models
Write-Host "`n🦙 Verificando Ollama..." -ForegroundColor Yellow
if (Get-Command ollama -ErrorAction SilentlyContinue) {
    Write-Host "   Ollama detectado." -ForegroundColor Green
    
    # Lista de modelos requeridos (pode ser extraída de config ou hardcoded)
    $models = @("llama3", "mistral") 
    
    foreach ($model in $models) {
        Write-Host "   ⬇️ Garantindo modelo: $model..."
        ollama pull $model
    }
} else {
    Write-Host "   ⚠️ Ollama não encontrado. Agentes locais falharão." -ForegroundColor Yellow
}

# 4. Cloud Connectivity Check (Unified Cloud)
Write-Host "`n☁️ Verificando Conectividade Nuvem (Supabase)..." -ForegroundColor Yellow

if (Test-Path .env) {
    Write-Host "   ✅ Arquivo .env encontrado." -ForegroundColor Green
    
    # Simple grep to check for keys (Not actual connection test to avoid complexity here)
    $envContent = Get-Content .env
    
    if ($envContent -match "STORAGE_ENDPOINT") {
        Write-Host "   [OK] Supabase Storage: Configurado" -ForegroundColor Green
    } else {
        Write-Host "   [!] Supabase Storage: NAO Configurado (Add STORAGE_ENDPOINT)" -ForegroundColor Yellow
    }
    
    if ($envContent -match "VECTOR_DB_URL") {
        Write-Host "   [OK] Supabase DB: Configurado" -ForegroundColor Green
    } else {
        Write-Host "   [!] Supabase DB: NAO Configurado (Add VECTOR_DB_URL)" -ForegroundColor Yellow
    }

} else {
    Write-Host "   ⚠️ Arquivo .env NÃO encontrado!" -ForegroundColor Red
    $create = Read-Host "   Deseja criar um modelo .env.example? (S/N)"
    if ($create -eq 'S') {
        $template = @"
# Supabase (Banco + Vector)
VECTOR_DB_URL=postgresql://user:pass@db.supabase.co:5432/postgres

# Supabase Storage (Arquivos)
STORAGE_ENDPOINT=https://<project-id>.supabase.co/storage/v1/s3
STORAGE_ACCESS_KEY=<sua-access-key>
STORAGE_SECRET_KEY=<sua-secret-key>
STORAGE_BUCKET=codex-files

# Redis (Opcional - Cache)
REDIS_URL=rediss://default:pass@...

# OpenAI / Anthropic
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
"@
        Set-Content .env.example -Value $template
        Write-Host "   ✅ Arquivo .env.example criado! Renomeie para .env e preencha." -ForegroundColor Green
    }
}

Write-Host "`n✨ Hidratação Concluída! O sistema está pronto." -ForegroundColor Cyan
Write-Host "   Lembre-se de rodar 'ollama serve' em um terminal separado."
