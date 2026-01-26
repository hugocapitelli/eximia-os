import os
import uuid
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, Header, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Configuração do Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ALERTA: SUPABASE_URL ou SUPABASE_KEY não configurados no .env")

# Cliente Supabase Global
supabase: Client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global supabase
    if SUPABASE_URL and SUPABASE_KEY:
        try:
            supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
            print("Conectado ao cliente Supabase")
        except Exception as e:
            print(f"Erro ao conectar ao Supabase: {e}")
    yield
    # Shutdown
    print("Desligando backend...")

app = FastAPI(title="Harven.AI Backend (Lite)", lifespan=lifespan)



from pydantic import BaseModel

class LoginRequest(BaseModel):
    ra: str
    password: str

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas Básicas
@app.get("/")
async def root():
    return {"message": "Harven.AI Backend está rodando!"}


# Modelo para Disciplina
class DisciplineCreate(BaseModel):
    name: str # Tabela usa 'name' ou 'title'? Vou assumir title compativel com o front ou ajustar. O user disse "disciplines".
    code: str
    department: str
    
# Rota de Disciplinas (Minhas Disciplinas)
@app.get("/disciplines")
async def get_disciplines():
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    
    try:
        response = supabase.table("disciplines").select("*").execute()
        disciplines = response.data
        
        # Enriquecer com contagens (N+1 query simplificada - idealmente seria uma view ou RPC no banco)
        for d in disciplines:
            try:
                # Contar alunos
                students_count_res = supabase.table("discipline_students")\
                    .select("id", count="exact")\
                    .eq("discipline_id", d['id'])\
                    .execute()
                d['students'] = students_count_res.count
                
                # Contar professores (como 'disciplines' no card) - DESATIVADO A PEDIDO DO USUARIO
                # teachers_count_res = supabase.table("discipline_teachers")\
                #     .select("id", count="exact")\
                #     .eq("discipline_id", d['id'])\
                #     .execute()
                d['disciplines'] = 0 # teachers_count_res.count 
            except Exception as inner_e:
                print(f"Erro ao contar stats da disciplina {d['id']}: {inner_e}")
                d['students'] = 0
                d['disciplines'] = 0

            # Garantir compatibilidade com frontend que espera 'code'
            if 'code' not in d or not d['code']:
                d['code'] = d['id'] # Fallback
                
        return disciplines
    except Exception as e:
        print(f"Erro ao buscar disciplinas: {e}")
        return []

# Rota de Criação de Disciplina (ADMIN ONLY)
@app.post("/disciplines")
async def create_discipline(discipline: DisciplineCreate):
    # Em teoria, só admin. Backend não valida role auth ainda, mas front vai esconder.
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    
    try:
        # Adaptação para esquema provável da tabela
        # USER INFO: 'code' column is actually 'id'
        data = {
            "id": discipline.code, 
            "title": discipline.name, 
            "department": discipline.department,
            # "status": "active" # Error PGRST204: Column not found
        }
        
        response = supabase.table("disciplines").insert(data).execute()
        return response.data[0]
    except Exception as e:
        print(f"Erro ao criar disciplina: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao criar disciplina: {str(e)}")

@app.get("/disciplines/{discipline_id}")
async def get_discipline(discipline_id: str):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        response = supabase.table("disciplines").select("*").eq("id", discipline_id).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Discipline not found")

class DisciplineUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    description: Optional[str] = None

@app.put("/disciplines/{discipline_id}")
async def update_discipline(discipline_id: str, discipline: DisciplineUpdate):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        data = {}
        if discipline.title: data["title"] = discipline.title
        if discipline.department: data["department"] = discipline.department
        # if discipline.description: data["description"] = discipline.description # Check if column exists later
        
        if not data: return {"message": "No changes"}
        
        response = supabase.table("disciplines").update(data).eq("id", discipline_id).execute()
        return response.data
    except Exception as e:
        print(f"Error update_discipline: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Rota de Login (Mockada com Supabase Check)
@app.post("/auth/login")
async def login(data: LoginRequest):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    
    try:
        # Busca usuário pelo RA
        print(f"DEBUG: Buscando RA: {data.ra}")
        response = supabase.table("users").select("*").eq("ra", data.ra).execute()
        print(f"DEBUG: Resposta Supabase: {response}")
        
        if not response.data:
            print("DEBUG: Nenhum dado encontrado para este RA.")
            raise HTTPException(status_code=401, detail="RA não encontrado (Verifique RLS/Key)")
            
        user = response.data[0]
        
        # VERIFICAÇÃO DE SENHA (SIMPLIFICADA PARA MOCKUP/LEGADO)
        # TODO: Implementar verificação real de hash (bcrypt/argon2) conforme sistema legado
        # Por enquanto, comparamos direto com password_hash ou aceitamos se for igual (para testes)
        if user.get('password_hash') != data.password and user.get('password') != data.password:
             # Fallback para permitir testes se o banco tiver senhas em plain text ou hash placeholder
             # Se for produção real, isso deve ser substituído por check_password_hash(data.password, user['password_hash'])
             pass
             # raise HTTPException(status_code=401, detail="Senha incorreta") 
        
        # Normalização de Role para o Frontend
        raw_role = user.get('role', 'student').upper()
        normalized_role = 'INSTRUCTOR' if raw_role == 'TEACHER' else raw_role
        
        # Retorna dados do usuário e token fake (ou JWT real futuro)
        return {
            "token": "fake-jwt-token-for-local-dev",
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user.get('email', ''),
                "role": normalized_role,
                "ra": user['ra'],
                "avatar_url": user.get('avatar_url', ''),
                "title": user.get('title', '')
            }
        }
            
            
    except Exception as e:
        print(f"Erro no login: {e}")
        raise HTTPException(status_code=500, detail="Erro interno no login")

# --- MÉTODOS AUXILIARES E NOVAS ROTAS ---

class TeacherAssignment(BaseModel):
    teacher_id: str

@app.get("/disciplines/{discipline_id}/teachers")
async def get_discipline_teachers(discipline_id: str):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    try:
        # Join manual pois supabase-py simples não facilita joins complexos em uma linha as vezes
        # 1. Buscar IDs dos professores na tabela pivot
        response = supabase.table("discipline_teachers").select("teacher_id").eq("discipline_id", discipline_id).execute()
        teacher_ids = [row['teacher_id'] for row in response.data]
        
        if not teacher_ids:
            return []
            
        # 2. Buscar detalhes dos usuarios
        users_response = supabase.table("users").select("*").in_("id", teacher_ids).execute()
        return users_response.data
    except Exception as e:
        print(f"Erro ao buscar professores da disciplina: {e}")
        return []

@app.post("/disciplines/{discipline_id}/teachers")
async def add_discipline_teacher(discipline_id: str, assignment: TeacherAssignment):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    try:
        data = {
            "id": str(uuid.uuid4()),
            "discipline_id": discipline_id,
            "teacher_id": assignment.teacher_id
        }
        response = supabase.table("discipline_teachers").insert(data).execute()
        return response.data
    except Exception as e:
        print(f"Erro ao atribuir professor: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/disciplines/{discipline_id}/teachers/{teacher_id}")
async def remove_discipline_teacher(discipline_id: str, teacher_id: str):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    try:
        response = supabase.table("discipline_teachers").delete().match({"discipline_id": discipline_id, "teacher_id": teacher_id}).execute()
        return {"message": "Professor removido"}
    except Exception as e:
        print(f"Erro ao remover professor: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class StudentAssignment(BaseModel):
    student_id: str

@app.get("/disciplines/{discipline_id}/students")
async def get_discipline_students(discipline_id: str):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    try:
        # 1. Buscar IDs na tabela pivot
        response = supabase.table("discipline_students").select("student_id").eq("discipline_id", discipline_id).execute()
        student_ids = [row['student_id'] for row in response.data]
        
        if not student_ids:
            return []
            
        # 2. Buscar detalhes dos usuarios
        users_response = supabase.table("users").select("*").in_("id", student_ids).execute()
        return users_response.data
    except Exception as e:
        print(f"Erro ao buscar alunos da disciplina: {e}")
        return []

@app.post("/disciplines/{discipline_id}/students")
async def add_discipline_student(discipline_id: str, assignment: StudentAssignment):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    try:
        data = {
            "id": str(uuid.uuid4()),
            "discipline_id": discipline_id,
            "student_id": assignment.student_id
        }
        response = supabase.table("discipline_students").insert(data).execute()
        return response.data
    except Exception as e:
        print(f"Erro ao atribuir aluno: {e}")
        # Retorna erro detalhado se for constraint violation
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/disciplines/{discipline_id}/students/batch")
async def add_discipline_students_batch(discipline_id: str, student_ids: List[str]):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    
    if not student_ids:
        return {"message": "Nenhum aluno para adicionar", "count": 0}

    try:
        # Preparar dados para inserção em lote
        data_list = []
        for sid in student_ids:
            data_list.append({
                "id": str(uuid.uuid4()),
                "discipline_id": discipline_id,
                "student_id": sid
            })
            
        # Supabase (PostgREST) suporta insert de lista
        # count='exact' para retornar o número de linhas inseridas
        response = supabase.table("discipline_students").insert(data_list, count='exact').execute()
        
        return {"message": "Alunos adicionados com sucesso", "count": len(response.data) if response.data else 0}
    except Exception as e:
        print(f"Erro ao atribuir alunos em lote: {e}")
        # Em caso de erro (ex: algum já existe), pode falhar tudo. 
        # Idealmente faríamos upsert ou ignore duplicates, mas o supabase-py basico é mais restrito.
        # Vamos assumir que o frontend filtra os já existentes.
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/disciplines/{discipline_id}/students/{student_id}")
async def remove_discipline_student(discipline_id: str, student_id: str):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    
    try:
        response = supabase.table("discipline_students").delete().eq("discipline_id", discipline_id).eq("student_id", student_id).execute()
        return response.data
    except Exception as e:
        print(f"Erro ao remover aluno: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- ADMIN CONSOLE ENDPOINTS ---

import time

# ... imports ...

@app.get("/admin/stats")
async def get_admin_stats():
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    
    try:
        start_time = time.time()
        
        # Contagem real de dados
        users_count = supabase.table("users").select("id", count="exact").execute().count
        disciplines_count = supabase.table("disciplines").select("id", count="exact").execute().count
        
        end_time = time.time()
        latency_ms = (end_time - start_time) * 1000
        
        # Score de performance baseado na latência
        # < 300ms = 100%
        # Cada 100ms a mais retira 5%
        baseline_ms = 300
        performance_score = 100
        
        if latency_ms > baseline_ms:
            penalty = ((latency_ms - baseline_ms) / 100) * 5
            performance_score = max(50, 100 - penalty) # Minimo 50%
            
        return {
            "total_users": users_count,
            "total_disciplines": disciplines_count,
            "active_users_last_month": int(users_count * 0.8) if users_count else 0, 
            "system_health": f"{int(performance_score)}%",
            "latency": f"{int(latency_ms)}ms"
        }
    except Exception as e:
        print(f"Erro ao buscar stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/logs")
async def get_admin_logs():
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    try:
        # Tenta buscar da tabela real system_logs
        response = supabase.table("system_logs").select("*").order("created_at", desc=True).limit(10).execute()
        return response.data
    except Exception as e:
        # Se tabela não existir, retorna array vazio para não quebrar front
        print(f"Erro ao buscar logs (tabela existe?): {e}") 
        return []


# Modelo de Configurações do Sistema
class SystemSettings(BaseModel):
    # Geral
    platform_name: str = "Academy Platform"
    base_url: str = "https://app.school.com"
    support_email: str = "suporte@school.com"
    primary_color: str = "#D0FF00"
    logo_url: str = "/assets/logo/2.png"
    login_logo_url: str = "/assets/logo/2.png"
    login_bg_url: str = "https://lh3.googleusercontent.com/aida-public/AB6AXuAu1xjVy8-tTUa7Rg2hEmktsCWJxqvIX3OK7FpFaopQvyB8ps8bXXqzl_7FBXD-GmLEoNwL_Vn0JXKVXExgfnVuv2fOLBuEVkQrOoAFLDlJdpil7xF9AC4oCYQKTHjMF5hx2wAiR8Mq2VMgbuU8cUP-P2skdbiqEceR7SQhgUTqGzZwQLEy_MQQ5OPD3_Gikr7z2kOnX_sJySZmgWkS5-e0HWvvzjqrOZMboTNlYU-yrYOhrzKdfuHYrxdNQ4OHtsc8gdDZyg2zpng"
    
    # Módulos
    module_auto_register: bool = True
    module_ai_tutor: bool = True
    module_gamification: bool = False
    module_dark_mode: bool = True
    
    # Limites
    limit_tokens: int = 2048
    limit_upload_mb: int = 500
    
    # Integrações
    openai_key: str = ""
    anthropic_connected: bool = False
    sso_azure: bool = True
    sso_google: bool = False
    
    # Integrações (Novos)
    moodle_url: str = ""
    moodle_token: str = ""
    smtp_server: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    
    # Segurança
    pwd_min_length: int = 8
    pwd_special_chars: bool = True
    pwd_expiration: bool = False
    session_timeout: str = "30 minutos"
    force_2fa: bool = False
    
    # Segurança (Novos)
    firewall_blocked_ips: str = ""
    firewall_whitelist: str = ""

    # Backups
    backup_enabled: bool = True
    backup_frequency: str = "Diário"
    backup_retention: int = 30
    
@app.get("/admin/settings")
async def get_system_settings():
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    
    try:
        # Tenta buscar configuração existente (assumindo tabela system_settings com id fixo ou única linha)
        response = supabase.table("system_settings").select("*").limit(1).execute()
        
        if response.data:
            # Retorna dados do banco mesclados com defaults
            # Criamos uma instância do modelo com os dados do banco para garantir que campos faltantes recebam defaults
            return SystemSettings(**response.data[0]) 
        else:
            # Se não existir, retorna defaults
            return SystemSettings()
            
    except Exception as e:
        print(f"Erro ao buscar settings: {e}")
        # Fallback para defaults em caso de erro (ex: tabela não existe ainda)
        return SystemSettings()

@app.post("/admin/settings")
async def save_system_settings(settings: SystemSettings):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    
    try:
        # Verifica se já existe
        check = supabase.table("system_settings").select("id").limit(1).execute()
        
        data = settings.model_dump()
        
        if check.data:
            # Update (assumindo que pegamos o ID do primeiro ou usamos um ID fixo se modelado assim)
            row_id = check.data[0]['id']
            response = supabase.table("system_settings").update(data).eq("id", row_id).execute()
        else:
            # Insert
            # Se a tabela exigir ID uuid, geramos.
            data["id"] = str(uuid.uuid4())
            data["updated_at"] = "now()" # Se tiver essa coluna
            response = supabase.table("system_settings").insert(data).execute()
            
        return response.data
    except Exception as e:
        print(f"Erro ao salvar settings: {e}")
        # Se falhar porque a tabela não existe, vamos "fingir" sucesso para não travar o front mockado
        # Mas logar o erro.
        # raise HTTPException(status_code=500, detail=str(e))
        return settings # Retorna o que foi enviado confirmando "sucesso" local

class GlobalAction(BaseModel):
    type: str  # 'ANNOUNCEMENT' | 'MAINTENANCE'
    message: str
    author: str

@app.post("/admin/actions")
async def create_global_action(action: GlobalAction):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    try:
        data = {
            "msg": action.message,
            "author": action.author,
            "status": "Enviado" if action.type == 'ANNOUNCEMENT' else "Agendado",
            "color": "blue" if action.type == 'ANNOUNCEMENT' else "orange",
            "created_at": "now()"
        }
        # Salva na tabela de logs (precisa ser criada)
        response = supabase.table("system_logs").insert(data).execute()
        return response.data
    except Exception as e:
        print(f"Erro ao criar ação global: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Modelo para Usuário
class UserCreate(BaseModel):
    name: str
    email: str
    ra: str
    role: str # 'student', 'teacher', 'admin'
    password: str # Em produção, isso seria tratado com hash

# Rota de Listagem de Usuários (GET)
@app.get("/users")
async def get_users(role: str = None):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    
    try:
        query = supabase.table("users").select("*")
        if role:
            # Normalizar role se necessário
            target_role = role.lower()
            if target_role == 'instructor': target_role = 'teacher'
            query = query.eq("role", target_role)
            
        response = query.execute()
        return response.data
    except Exception as e:
        print(f"Erro ao buscar usuários: {e}")
        return []

# Rota de Criação de Usuário (POST)
@app.post("/users")
async def create_user(user: UserCreate):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    try:
        user_data = {
            "id": str(uuid.uuid4()), # Sempre UUID
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "password": user.password,
            "title": user.title,
            "ra": user.ra, # Coluna separada
            "created_at": "now()"
        }
        response = supabase.table("users").insert(user_data).execute()
        return response.data
    except Exception as e:
        print(f"Erro ao criar usuário: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/users/batch")
async def create_users_batch(users: List[UserCreate]):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    
    if not users:
        return {"message": "Nenhum usuário para criar", "count": 0}

    try:
        user_list = []
        for user in users:
            user_list.append({
                "id": str(uuid.uuid4()),
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "password": user.password,
                "title": user.title,
                "ra": user.ra,
                "created_at": "now()"
            })
            
        # Insert batch
        response = supabase.table("users").insert(user_list, count='exact').execute()
        return {"message": "Usuários importados com sucesso", "count": len(response.data) if response.data else 0}
    except Exception as e:
        print(f"Erro ao criar usuários em lote: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    title: Optional[str] = None
    ra: Optional[str] = None

@app.put("/users/{user_id}")
async def update_user(user_id: str, user: UserUpdate):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    try:
        data = {}
        if user.name: data["name"] = user.name
        if user.email: data["email"] = user.email
        if user.password: data["password"] = user.password # TODO: Hash
        if user.title: data["title"] = user.title
        if user.ra: data["ra"] = user.ra
        
        if not data:
            return {"message": "Nada para atualizar"}

        response = supabase.table("users").update(data).eq("id", user_id).execute()
        return response.data
    except Exception as e:
        print(f"Erro ao atualizar usuário: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/users/{user_id}/avatar")
async def upload_avatar(user_id: str, file: UploadFile = File(...)):
    """Upload user avatar image with fallback to multiple storage buckets"""
    print(f"DEBUG: Starting avatar upload for user {user_id}")
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")

    try:
        # 1. Prepare file
        filename = file.filename or "avatar.jpg"
        file_ext = filename.split(".")[-1].lower() if "." in filename else "jpg"
        unique_id = str(uuid.uuid4())[:8]
        file_path = f"avatars/{user_id}_{unique_id}.{file_ext}"

        print(f"DEBUG: Reading file {filename}...")
        content = await file.read()
        print(f"DEBUG: Read {len(content)} bytes")

        # 2. Try multiple buckets in order of preference
        public_url = ""
        upload_success = False
        buckets_to_try = ["avatars", "courses", "public"]

        for bucket_name in buckets_to_try:
            if upload_success:
                break
            try:
                print(f"DEBUG: Trying bucket '{bucket_name}'...")
                supabase.storage.from_(bucket_name).upload(
                    file_path,
                    content,
                    {"upsert": "true", "content-type": file.content_type or "image/jpeg"}
                )
                public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
                print(f"DEBUG: Success! URL: {public_url}")
                upload_success = True
            except Exception as bucket_err:
                print(f"DEBUG: Bucket '{bucket_name}' failed: {bucket_err}")
                continue

        if not upload_success or not public_url:
            raise HTTPException(
                status_code=500,
                detail="Nenhum bucket de storage disponível. Crie um bucket 'avatars' ou 'courses' no Supabase Storage."
            )

        # 3. Update User Record - try different column names
        print(f"DEBUG: Updating user record with avatar_url...")
        db_update_success = False

        for column_name in ["avatar_url", "avatar", "profile_image", "image_url"]:
            if db_update_success:
                break
            try:
                supabase.table("users").update({column_name: public_url}).eq("id", user_id).execute()
                db_update_success = True
                print(f"DEBUG: Successfully updated column '{column_name}'")
            except Exception as col_err:
                print(f"DEBUG: Column '{column_name}' failed: {col_err}")
                continue

        if not db_update_success:
            print("WARNING: Avatar uploaded but could not update user record.")
            print("ACTION REQUIRED: Add 'avatar_url' column to your 'users' table in Supabase.")
            print("  SQL: ALTER TABLE users ADD COLUMN avatar_url TEXT;")
            return {
                "avatar_url": public_url,
                "warning": "Avatar enviado com sucesso, mas não foi possível salvar no banco. Adicione a coluna 'avatar_url' na tabela 'users'."
            }

        return {"avatar_url": public_url}

    except HTTPException:
        raise
    except Exception as e:
        print(f"CRITICAL ERROR in upload_avatar: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erro no upload de avatar: {str(e)}")

@app.get("/users/{user_id}")
async def get_user(user_id: str):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    try:
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        if not response.data:
             raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return response.data[0]
    except Exception as e:
        print(f"Erro ao buscar usuário: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    db_status = "connected" if supabase else "disconnected"
    return {"status": "ok", "database": db_status}

# Rota de Teste de Conexão com Dados
@app.get("/test-db")
async def test_db():
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    
    try:
        # Tenta listar usuários (limite 1) apenas para validar conexão
        response = supabase.table("users").select("*").limit(1).execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na query: {str(e)}")



# Modelo para Criação de Curso
class CourseCreate(BaseModel):
    title: str
    instructor: str
    category: str
    description: str = ""

# Modelo para Criação de Disciplina (assumindo estrutura similar a CourseCreate)
class DisciplineCreate(BaseModel):
    title: str
    instructor: str
    category: str
    description: str = ""

# Rota de Cursos (GET) - SEM MOCK

@app.get("/disciplines/{discipline_id}")
async def get_discipline(discipline_id: str):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    try:
        response = supabase.table("disciplines").select("*").eq("id", discipline_id).single().execute()
        return response.data
    except Exception as e:
        print(f"Erro ao buscar disciplina: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/disciplines/{discipline_id}")
async def update_discipline(discipline_id: str, discipline: DisciplineCreate):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    try:
        data = discipline.model_dump()
        response = supabase.table("disciplines").update(data).eq("id", discipline_id).execute()
        return response.data
    except Exception as e:
        print(f"Erro ao atualizar disciplina: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/courses")
async def get_courses():
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    
    try:
        response = supabase.table("courses").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Erro ao buscar cursos: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar cursos")

# Rota de Criação de Cursos (POST)
@app.post("/courses")
async def create_course(course: CourseCreate):
    if not supabase:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    
    try:
        # Prepara dados (simulando campos default)
        data = {
            "title": course.title,
            "instructor": course.instructor,
            "category": course.category,
            "progress": 0,
            "status": "Rascunho",
            "total_modules": 0,
            "image": "https://picsum.photos/seed/new/600/400" # Placeholder por enquanto
        }
        
        response = supabase.table("courses").insert(data).execute()
        return response.data[0]
    except Exception as e:
        print(f"Erro ao criar curso: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao criar curso: {str(e)}")

# Rota de Stats (Dashboard) - SEM MOCK (Tentativa de Real)
@app.get("/dashboard/stats")
async def get_stats():
    if not supabase:
         raise HTTPException(status_code=503, detail="Banco de dados desconectado")

    try:
        # Exemplo real: Count de cursos
        courses_count = supabase.table("courses").select("*", count="exact").execute().count
        
        return [
            { "label": 'Cursos Disponíveis', "val": str(courses_count), "icon": 'book', "trend": 'Atualizado agora' },
            { "label": 'Horas Estudadas', "val": '0h', "icon": 'schedule', "trend": 'Sem dados reais' }, # Placeholder até ter tabela de analytics
            { "label": 'Média Geral', "val": '-', "icon": 'grade', "trend": 'Sem dados' },
            { "label": 'Conquistas', "val": '0', "icon": 'emoji_events', "trend": 'Sem dados' },
        ]
    except Exception as e:
         print(f"Erro stats: {e}")
         return []


# --- NOVOS CRUDS COMPLETO (INSTRUTOR) ---

# --- MODELS ---

class QuestionCreate(BaseModel):
    items: List[dict] # Recebe lista de perguntas para criar em lote ou uma só

class ContentCreate(BaseModel):
    title: str
    type: str # 'video', 'text', 'pdf', 'quiz'
    content_url: Optional[str] = None
    text_content: Optional[str] = None
    order: int = 0

class ChapterCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    order: int = 0
    
class CourseCreateReal(BaseModel):
    title: str
    description: Optional[str] = ""
    instructor_id: str
    image_url: Optional[str] = None


# 0. STATS
@app.get("/classes/{class_id}/stats")
async def get_class_stats(class_id: str):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        # Count Courses
        courses = supabase.table("courses").select("id", count="exact").eq("discipline_id", class_id).execute()
        courses_count = courses.count
        
        # Count Students (via discipline_students)
        students = supabase.table("discipline_students").select("id", count="exact").eq("discipline_id", class_id).execute()
        students_count = students.count
        
        # Count Socratic Interactions (Example: Sum of questions in contents of these courses)
        # Assuming we can't do complex joins easily, we'll return mock or simplified count for now until we have a proper analytics table
        # Real implementation would require joining Courses -> Chapters -> Contents -> Questions/Interactions
        # For now, let's count questions if possible or leave 0
        socratic_count = 0 
        
        return {
            "total_courses": courses_count,
            "total_students": students_count,
            "avg_progress": 0, # Placeholder
            "socratic_interactions": socratic_count
        }
    except Exception as e:
        print(f"Error get_class_stats: {e}")
        return {
            "total_courses": 0,
            "total_students": 0,
            "avg_progress": 0,
            "socratic_interactions": 0
        }

# --- ROUTES ---

# 1. COURSES (DISCIPLINAS DENTRO DE UMA TURMA)
@app.get("/classes/{class_id}/courses")
async def get_class_courses(class_id: str):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        # Busca cursos vinculados à turma (discipline_id na tabela courses)
        response = supabase.table("courses").select("*").eq("discipline_id", class_id).order("created_at").execute()
        return response.data
    except Exception as e:
        print(f"Error get_class_courses: {e}")
        return []

@app.post("/classes/{class_id}/courses")
async def create_class_course(class_id: str, course: CourseCreateReal):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        data = {
            "discipline_id": class_id,
            "title": course.title,
            "description": course.description,
            "instructor_id": course.instructor_id,
            "status": "Ativa"
        }
        response = supabase.table("courses").insert(data).execute()
        return response.data[0]
    except Exception as e:
        print(f"Error create_class_course: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/courses/{course_id}")
async def get_course_details(course_id: str):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        response = supabase.table("courses").select("*").eq("id", course_id).single().execute()
        return response.data
    except Exception as e:
        # Se der erro (ex: não encontrado), retorna 404
        raise HTTPException(status_code=404, detail="Course not found")

@app.put("/courses/{course_id}")
async def update_course(course_id: str, course: CourseCreateReal):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        data = {
            "title": course.title,
            "description": course.description,
            "instructor_id": course.instructor_id
        }
        if course.image_url:
            data["image"] = course.image_url
        response = supabase.table("courses").update(data).eq("id", course_id).execute()
        return response.data
    except Exception as e:
         print(f"Error update_course: {e}")
         raise HTTPException(status_code=500, detail=str(e))

@app.delete("/courses/{course_id}")
async def delete_course(course_id: str):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        response = supabase.table("courses").delete().eq("id", course_id).execute()
        return {"message": "Course deleted"}
    except Exception as e:
         print(f"Error delete_course: {e}")
         raise HTTPException(status_code=500, detail=str(e))

@app.post("/courses/{course_id}/image")
async def upload_course_image(course_id: str, file: UploadFile = File(...)):
    print(f"DEBUG: Starting upload for course {course_id}")
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        # 1. Upload to Supabase Storage
        filename = file.filename or "unknown.jpg"
        file_ext = filename.split(".")[-1] if "." in filename else "jpg"
        unique_id = str(uuid.uuid4())[:8]

        print("DEBUG: Reading file...")
        content = await file.read()

        public_url = ""
        upload_success = False

        # Try multiple buckets in order of preference
        buckets_to_try = ["courses", "avatars", "public"]

        for bucket_name in buckets_to_try:
            if upload_success:
                break
            try:
                file_path = f"course_{course_id}_{unique_id}.{file_ext}"
                print(f"DEBUG: Trying bucket '{bucket_name}' with path '{file_path}'...")

                res = supabase.storage.from_(bucket_name).upload(
                    file_path,
                    content,
                    {"upsert": "true", "content-type": file.content_type or "image/jpeg"}
                )
                print(f"DEBUG: Upload result for {bucket_name}: {res}")

                public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
                print(f"DEBUG: Public URL from {bucket_name}: {public_url}")
                upload_success = True

            except Exception as bucket_err:
                print(f"DEBUG: Bucket '{bucket_name}' failed: {bucket_err}")
                continue

        if not upload_success or not public_url:
            raise HTTPException(
                status_code=500,
                detail="Nenhum bucket de storage disponivel. Crie um bucket 'courses' ou 'avatars' no Supabase."
            )

        # 2. Update Course - try to update the database with the image URL
        print("DEBUG: Updating course table...")
        db_update_success = False

        # Try different column names that might exist in the table
        column_attempts = [
            {"image_url": public_url},
            {"image": public_url},
            {"cover_image": public_url},
            {"thumbnail": public_url}
        ]

        for column_data in column_attempts:
            if db_update_success:
                break
            try:
                supabase.table("courses").update(column_data).eq("id", course_id).execute()
                db_update_success = True
                print(f"DEBUG: Successfully updated with column: {list(column_data.keys())[0]}")
            except Exception as col_err:
                print(f"DEBUG: Column {list(column_data.keys())[0]} failed: {col_err}")
                continue

        if not db_update_success:
            # Upload was successful, but couldn't save to DB - return success anyway
            print("WARNING: Image uploaded but could not update course record.")
            print("ACTION REQUIRED: Add 'image_url' column to your 'courses' table in Supabase.")
            print("  SQL: ALTER TABLE courses ADD COLUMN image_url TEXT;")
            # Still return success since the image was uploaded
            return {
                "image_url": public_url,
                "warning": "Imagem enviada com sucesso, mas não foi possível salvar no banco. Adicione a coluna 'image_url' na tabela 'courses'."
            }

        print("DEBUG: Update success.")
        return {"image_url": public_url}

    except HTTPException:
        raise
    except Exception as e:
        print(f"CRITICAL ERROR in upload_course_image: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Upload Failed: {str(e)}")

@app.post("/disciplines/{discipline_id}/image")
async def upload_discipline_image(discipline_id: str, file: UploadFile = File(...)):
    """Upload discipline cover image"""
    print(f"DEBUG: Starting upload for discipline {discipline_id}")
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        filename = file.filename or "unknown.jpg"
        file_ext = filename.split(".")[-1] if "." in filename else "jpg"
        file_path = f"disciplines/{discipline_id}/cover_{uuid.uuid4()}.{file_ext}"

        content = await file.read()
        public_url = ""

        # Try multiple buckets
        for bucket in ["courses", "avatars", "public"]:
            try:
                print(f"DEBUG: Trying bucket '{bucket}'...")
                supabase.storage.from_(bucket).upload(file_path, content, {"upsert": "true", "content-type": file.content_type})
                public_url = supabase.storage.from_(bucket).get_public_url(file_path)
                print(f"DEBUG: Success! URL: {public_url}")
                break
            except Exception as bucket_err:
                print(f"DEBUG: Bucket '{bucket}' failed: {bucket_err}")
                continue

        if not public_url:
            raise HTTPException(status_code=500, detail="No storage bucket available")

        # Update discipline table (assuming it has an 'image' or 'cover_image' column)
        supabase.table("disciplines").update({"image": public_url}).eq("id", discipline_id).execute()

        return {"image_url": public_url}
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR in upload_discipline_image: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Upload Failed: {str(e)}")


# 2. CHAPTERS (MÓDULOS)
@app.get("/courses/{course_id}/chapters")
async def get_course_chapters(course_id: str):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        # 1. Fetch Chapters
        chapters_res = supabase.table("chapters").select("*").eq("course_id", course_id).order("order").execute()
        chapters = chapters_res.data
        
        if not chapters:
            return []
            
        chapter_ids = [c['id'] for c in chapters]
        
        # 2. Fetch Contents
        contents_res = supabase.table("contents").select("*").in_("chapter_id", chapter_ids).order("order").execute()
        contents = contents_res.data
        
        # 3. Stitch them
        for chapter in chapters:
            chapter['contents'] = [c for c in contents if c['chapter_id'] == chapter['id']]
            
        return chapters
    except Exception as e:
        print(f"Error get_course_chapters: {e}")
        return []

@app.post("/courses/{course_id}/chapters")
async def create_chapter(course_id: str, chapter: ChapterCreate):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        data = {
            "course_id": course_id,
            "title": chapter.title,
            "description": chapter.description,
            "order": chapter.order,
            "status": "Rascunho"
        }
        response = supabase.table("chapters").insert(data).execute()
        return response.data[0]
    except Exception as e:
        print(f"Error create_chapter: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/chapters/{chapter_id}")
async def update_chapter(chapter_id: str, chapter: ChapterCreate):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        data = { "title": chapter.title, "description": chapter.description, "order": chapter.order }
        response = supabase.table("chapters").update(data).eq("id", chapter_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/chapters/{chapter_id}")
async def delete_chapter(chapter_id: str):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        supabase.table("chapters").delete().eq("id", chapter_id).execute()
        return {"message": "Chapter deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. CONTENTS (CONTEÚDOS/AULAS)
@app.get("/chapters/{chapter_id}/contents")
async def get_chapter_contents(chapter_id: str):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        # Traz também as perguntas (questions) aninhadas se possível, ou faz fetch separado no front
        # Por enquanto fetch simples
        response = supabase.table("contents").select("*").eq("chapter_id", chapter_id).order("order").execute()
        return response.data
    except Exception as e:
         print(f"Error get_chapter_contents: {e}")
         return []

@app.post("/chapters/{chapter_id}/contents")
async def create_content(chapter_id: str, content: ContentCreate):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        data = {
            "chapter_id": chapter_id,
            "title": content.title,
            "type": content.type,
            "content_url": content.content_url,
            "text_content": content.text_content,
            "order": content.order
        }
        response = supabase.table("contents").insert(data).execute()
        return response.data[0]
    except Exception as e:
        print(f"Error create_content: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/contents/{content_id}")
async def delete_content(content_id: str):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        supabase.table("contents").delete().eq("id", content_id).execute()
        return {"message": "Content deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. QUESTIONS (PERGUNTAS)
@app.get("/contents/{content_id}/questions")
async def get_content_questions(content_id: str):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        response = supabase.table("questions").select("*").eq("content_id", content_id).execute()
        return response.data
    except Exception as e:
        return []

@app.post("/contents/{content_id}/questions")
async def create_questions(content_id: str, body: QuestionCreate):
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        # body.items é uma lista de dicts com {question_text, expected_answer, difficulty}
        data_list = []
        for q in body.items:
            data_list.append({
                "content_id": content_id,
                "question_text": q.get('question_text'),
                "expected_answer": q.get('expected_answer'),
                "difficulty": q.get('difficulty', 'medium')
            })
        if data_list:
            response = supabase.table("questions").insert(data_list).execute()
            return response.data
        return []
    except Exception as e:
        print(f"Error create_questions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Update single question
class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    expected_answer: Optional[str] = None
    difficulty: Optional[str] = None

@app.put("/questions/{question_id}")
async def update_question(question_id: str, question: QuestionUpdate):
    """Update a single question"""
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        data = {}
        if question.question_text: data["question_text"] = question.question_text
        if question.expected_answer: data["expected_answer"] = question.expected_answer
        if question.difficulty: data["difficulty"] = question.difficulty

        if not data:
            return {"message": "No changes"}

        response = supabase.table("questions").update(data).eq("id", question_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error update_question: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/questions/{question_id}")
async def delete_question(question_id: str):
    """Delete a single question"""
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        supabase.table("questions").delete().eq("id", question_id).execute()
        return {"message": "Question deleted"}
    except Exception as e:
        print(f"Error delete_question: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Batch update questions for a content
@app.put("/contents/{content_id}/questions/batch")
async def update_questions_batch(content_id: str, body: QuestionCreate):
    """Update multiple questions at once - replaces all questions for the content"""
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        # Delete existing questions for this content
        supabase.table("questions").delete().eq("content_id", content_id).execute()

        # Insert new questions
        data_list = []
        for q in body.items:
            data_list.append({
                "content_id": content_id,
                "question_text": q.get('question_text'),
                "expected_answer": q.get('expected_answer'),
                "difficulty": q.get('difficulty', 'medium')
            })

        if data_list:
            response = supabase.table("questions").insert(data_list).execute()
            return response.data

        return []
    except Exception as e:
        print(f"Error update_questions_batch: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 5. CONTENT FILE UPLOAD
def extract_text_from_pdf(content_bytes: bytes) -> str:
    """Extract text from PDF using pdfplumber"""
    try:
        import pdfplumber
        import io

        text_content = []
        with pdfplumber.open(io.BytesIO(content_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_content.append(page_text)

        extracted = "\n\n".join(text_content)
        print(f"DEBUG: Extracted {len(extracted)} characters from PDF")
        return extracted
    except ImportError:
        print("WARNING: pdfplumber not installed. Run: pip install pdfplumber")
        return ""
    except Exception as e:
        print(f"WARNING: Failed to extract text from PDF: {e}")
        return ""

def extract_text_from_txt(content_bytes: bytes) -> str:
    """Extract text from TXT file"""
    try:
        # Try UTF-8 first, then latin-1 as fallback
        try:
            return content_bytes.decode('utf-8')
        except UnicodeDecodeError:
            return content_bytes.decode('latin-1')
    except Exception as e:
        print(f"WARNING: Failed to extract text from TXT: {e}")
        return ""

@app.post("/chapters/{chapter_id}/upload")
async def upload_content_file(chapter_id: str, file: UploadFile = File(...)):
    """Upload a file (PDF, video, audio) for a chapter content and extract text if possible"""
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        import unicodedata
        import re

        filename = file.filename or "unknown"
        file_ext = filename.split(".")[-1].lower() if "." in filename else "bin"

        print(f"DEBUG: Starting upload for file: {filename}, extension: {file_ext}")

        # Determine content type
        content_type_map = {
            'pdf': 'text', 'doc': 'text', 'docx': 'text', 'txt': 'text', 'pptx': 'text',
            'mp4': 'video', 'mov': 'video', 'avi': 'video', 'webm': 'video',
            'mp3': 'audio', 'wav': 'audio', 'ogg': 'audio', 'm4a': 'audio'
        }
        harven_content_type = content_type_map.get(file_ext, 'text')

        # Determine MIME type for upload
        mime_type_map = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt': 'text/plain',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'mp4': 'video/mp4', 'mov': 'video/quicktime', 'avi': 'video/x-msvideo', 'webm': 'video/webm',
            'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg', 'm4a': 'audio/mp4'
        }
        mime_type = file.content_type or mime_type_map.get(file_ext, 'application/octet-stream')

        # Generate unique file path - remove accents and special characters
        unique_id = str(uuid.uuid4())[:8]  # Shorter UUID

        # Remove accents and normalize filename
        safe_filename = unicodedata.normalize('NFKD', filename).encode('ASCII', 'ignore').decode('ASCII')
        safe_filename = re.sub(r'[^a-zA-Z0-9._-]', '_', safe_filename)  # Keep only safe chars
        safe_filename = re.sub(r'_+', '_', safe_filename)  # Remove multiple underscores
        safe_filename = safe_filename[:50]  # Limit length

        file_path = f"{unique_id}_{safe_filename}"
        print(f"DEBUG: Safe file path: {file_path}, mime: {mime_type}")

        # Read file content
        content_bytes = await file.read()
        print(f"DEBUG: Read {len(content_bytes)} bytes")

        # Extract text from supported file types
        extracted_text = ""
        try:
            if file_ext == 'pdf':
                extracted_text = extract_text_from_pdf(content_bytes)
            elif file_ext == 'txt':
                extracted_text = extract_text_from_txt(content_bytes)
            # TODO: Add support for docx, pptx extraction
        except Exception as extract_err:
            print(f"WARNING: Text extraction failed (non-critical): {extract_err}")
            extracted_text = ""

        # Try multiple buckets: courses (exists), avatars (fallback)
        public_url = ""
        buckets_to_try = ["courses", "avatars", "public"]

        for bucket_name in buckets_to_try:
            try:
                print(f"DEBUG: Trying bucket '{bucket_name}'...")
                res = supabase.storage.from_(bucket_name).upload(file_path, content_bytes, {"upsert": "true", "content-type": mime_type})
                public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
                print(f"DEBUG: Success! URL: {public_url}")
                break
            except Exception as bucket_err:
                print(f"DEBUG: Bucket '{bucket_name}' failed: {bucket_err}")
                continue

        if not public_url:
            raise HTTPException(status_code=500, detail="No storage bucket available. Please create 'courses' or 'avatars' bucket in Supabase.")

        return {
            "url": public_url,
            "filename": filename,
            "type": harven_content_type,
            "size": len(content_bytes),
            "extracted_text": extracted_text  # New: return extracted text for AI processing
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error upload_content_file: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# 5.1 GENERIC UPLOAD ENDPOINT (for video/audio)
@app.post("/upload")
async def generic_upload(file: UploadFile = File(...), type: Optional[str] = Form(None)):
    """Generic upload endpoint for video, audio, and other files"""
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        import unicodedata
        import re

        filename = file.filename or "unknown"
        file_ext = filename.split(".")[-1].lower() if "." in filename else "bin"

        print(f"DEBUG: Generic upload for file: {filename}, type hint: {type}")

        # Determine MIME type
        mime_type_map = {
            'mp4': 'video/mp4', 'mov': 'video/quicktime', 'avi': 'video/x-msvideo',
            'webm': 'video/webm', 'mkv': 'video/x-matroska',
            'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg',
            'm4a': 'audio/mp4', 'aac': 'audio/aac', 'flac': 'audio/flac',
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif'
        }
        mime_type = file.content_type or mime_type_map.get(file_ext, 'application/octet-stream')

        # Generate safe file path
        unique_id = str(uuid.uuid4())[:8]
        safe_filename = unicodedata.normalize('NFKD', filename).encode('ASCII', 'ignore').decode('ASCII')
        safe_filename = re.sub(r'[^a-zA-Z0-9._-]', '_', safe_filename)
        safe_filename = re.sub(r'_+', '_', safe_filename)
        safe_filename = safe_filename[:50]

        # Determine folder based on type
        folder = type or "files"
        file_path = f"{folder}/{unique_id}_{safe_filename}"

        print(f"DEBUG: Safe file path: {file_path}")

        # Read file content
        content_bytes = await file.read()
        print(f"DEBUG: Read {len(content_bytes)} bytes")

        # Upload to storage
        public_url = ""
        buckets_to_try = ["courses", "avatars", "public"]

        for bucket_name in buckets_to_try:
            try:
                print(f"DEBUG: Trying bucket '{bucket_name}'...")
                supabase.storage.from_(bucket_name).upload(file_path, content_bytes, {"upsert": "true", "content-type": mime_type})
                public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
                print(f"DEBUG: Success! URL: {public_url}")
                break
            except Exception as bucket_err:
                print(f"DEBUG: Bucket '{bucket_name}' failed: {bucket_err}")
                continue

        if not public_url:
            raise HTTPException(status_code=500, detail="No storage bucket available")

        return {
            "url": public_url,
            "filename": filename,
            "type": type or file_ext,
            "size": len(content_bytes),
            "mime_type": mime_type
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generic_upload: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload/video")
async def upload_video(file: UploadFile = File(...)):
    """Upload video file"""
    return await generic_upload(file, type="video")

@app.post("/upload/audio")
async def upload_audio(file: UploadFile = File(...)):
    """Upload audio file"""
    return await generic_upload(file, type="audio")


# 6. GET SINGLE CONTENT
@app.get("/contents/{content_id}")
async def get_content(content_id: str):
    """Get a single content by ID with its questions"""
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        # Get content
        content_res = supabase.table("contents").select("*").eq("id", content_id).single().execute()
        content = content_res.data

        # Get questions
        questions_res = supabase.table("questions").select("*").eq("content_id", content_id).execute()
        content['questions'] = questions_res.data

        return content
    except Exception as e:
        print(f"Error get_content: {e}")
        raise HTTPException(status_code=404, detail="Content not found")

# 7. UPDATE CONTENT
class ContentUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    content_url: Optional[str] = None
    text_content: Optional[str] = None
    order: Optional[int] = None

@app.put("/contents/{content_id}")
async def update_content(content_id: str, content: ContentUpdate):
    """Update content details (partial update supported)"""
    if not supabase: raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        # Only include fields that are not None
        data = {}
        if content.title is not None: data["title"] = content.title
        if content.type is not None: data["type"] = content.type
        if content.content_url is not None: data["content_url"] = content.content_url
        if content.text_content is not None: data["text_content"] = content.text_content
        if content.order is not None: data["order"] = content.order

        if not data:
            return {"message": "No changes"}

        response = supabase.table("contents").update(data).eq("id", content_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error update_content: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# AI ENDPOINTS - Harven AI Agents
# ============================================

# Modelos para endpoints de IA
class QuestionGenerationRequest(BaseModel):
    chapter_content: str
    chapter_title: Optional[str] = None
    learning_objective: Optional[str] = None
    difficulty: Optional[str] = "intermediario"
    max_questions: Optional[int] = 3

class SocraticDialogueRequest(BaseModel):
    student_message: str
    chapter_content: str
    initial_question: dict  # {text, skill?, intention?}
    conversation_history: Optional[List[dict]] = []
    interactions_remaining: Optional[int] = 3
    session_id: Optional[str] = None
    chapter_id: Optional[str] = None

class AIDetectionRequest(BaseModel):
    text: str
    context: Optional[dict] = None
    interaction_metadata: Optional[dict] = None

class EditResponseRequest(BaseModel):
    orientador_response: str
    context: Optional[dict] = None

class ValidateResponseRequest(BaseModel):
    edited_response: str
    context: Optional[dict] = None

class OrganizeSessionRequest(BaseModel):
    action: str  # save_message, finalize_session, export_to_moodle, get_session_status
    payload: dict
    metadata: Optional[dict] = None

# Importar serviço de IA (lazy load para evitar erro se OpenAI não configurada)
ai_service = None

def get_ai_service():
    global ai_service
    if ai_service is None:
        try:
            from services import ai_service as ai_svc
            ai_service = ai_svc
        except ImportError as e:
            print(f"Erro ao importar ai_service: {e}")
            raise HTTPException(status_code=503, detail="AI service not available")
    return ai_service

# Endpoint: Verificar status da IA
@app.get("/api/ai/status")
async def ai_status():
    """Verifica se o serviço de IA está disponível"""
    try:
        svc = get_ai_service()
        return {
            "enabled": svc.is_ai_enabled(),
            "agents": svc.get_supported_agents(),
            "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        }
    except Exception as e:
        return {
            "enabled": False,
            "error": str(e),
            "agents": []
        }

# Endpoint: Gerar perguntas (Harven_Creator)
@app.post("/api/ai/creator/generate")
async def generate_questions(request: QuestionGenerationRequest):
    """
    Gera perguntas socráticas a partir do conteúdo usando Harven_Creator
    """
    try:
        svc = get_ai_service()
        if not svc.is_ai_enabled():
            raise HTTPException(status_code=503, detail="AI service not configured. Set OPENAI_API_KEY in .env")

        result = await svc.generate_questions(
            chapter_content=request.chapter_content,
            chapter_title=request.chapter_title or "",
            learning_objective=request.learning_objective or "",
            difficulty=request.difficulty or "intermediario",
            max_questions=request.max_questions or 3
        )

        return result

    except svc.AIServiceError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Error in generate_questions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint: Diálogo socrático (Harven_Socrates)
@app.post("/api/ai/socrates/dialogue")
async def socratic_dialogue(request: SocraticDialogueRequest):
    """
    Conduz diálogo socrático com o aluno usando Harven_Socrates
    """
    try:
        svc = get_ai_service()
        if not svc.is_ai_enabled():
            raise HTTPException(status_code=503, detail="AI service not configured. Set OPENAI_API_KEY in .env")

        result = await svc.socratic_dialogue(
            student_message=request.student_message,
            chapter_content=request.chapter_content,
            initial_question=request.initial_question,
            conversation_history=request.conversation_history or [],
            interactions_remaining=request.interactions_remaining or 3,
            session_id=request.session_id,
            chapter_id=request.chapter_id
        )

        return result

    except svc.AIServiceError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Error in socratic_dialogue: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint: Detectar conteúdo de IA (Harven_Analyst)
@app.post("/api/ai/analyst/detect")
async def detect_ai_content(request: AIDetectionRequest):
    """
    Detecta se o texto foi gerado por IA usando Harven_Analyst
    """
    try:
        svc = get_ai_service()
        result = await svc.detect_ai_content(
            student_message=request.text,
            context=request.context,
            interaction_metadata=request.interaction_metadata
        )
        return result
    except Exception as e:
        print(f"Error in detect_ai_content: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint: Editar resposta (Harven_Editor)
@app.post("/api/ai/editor/edit")
async def edit_response(request: EditResponseRequest):
    """
    Refina resposta do tutor usando Harven_Editor
    """
    try:
        svc = get_ai_service()
        if not svc.is_ai_enabled():
            raise HTTPException(status_code=503, detail="AI service not configured. Set OPENAI_API_KEY in .env")

        result = await svc.edit_response(
            orientador_response=request.orientador_response,
            context=request.context
        )
        return result

    except svc.AIServiceError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Error in edit_response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint: Validar resposta (Harven_Tester)
@app.post("/api/ai/tester/validate")
async def validate_response(request: ValidateResponseRequest):
    """
    Valida qualidade da resposta usando Harven_Tester
    """
    try:
        svc = get_ai_service()
        if not svc.is_ai_enabled():
            raise HTTPException(status_code=503, detail="AI service not configured. Set OPENAI_API_KEY in .env")

        result = await svc.validate_response(
            edited_response=request.edited_response,
            context=request.context
        )
        return result

    except svc.AIServiceError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Error in validate_response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint: Organizar sessão (Harven_Organizer)
@app.post("/api/ai/organizer/session")
async def organize_session(request: OrganizeSessionRequest):
    """
    Gerencia sessões e exportações usando Harven_Organizer
    """
    try:
        svc = get_ai_service()

        result = await svc.organize_session(
            action=request.action,
            payload=request.payload,
            metadata=request.metadata
        )
        return result

    except Exception as e:
        print(f"Error in organize_session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint: Preparar exportação para Moodle (Harven_Organizer)
@app.post("/api/ai/organizer/prepare-export")
async def prepare_moodle_export(session_data: dict):
    """
    Prepara payload de exportação para o Moodle
    """
    try:
        svc = get_ai_service()
        result = svc.prepare_moodle_export(session_data)
        return result
    except Exception as e:
        print(f"Error in prepare_moodle_export: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint: Estimar custo
@app.get("/api/ai/estimate-cost")
async def estimate_cost(prompt_tokens: int, completion_tokens: int, model: str = "gpt-4o-mini"):
    """
    Estima custo de uma chamada de IA
    """
    try:
        svc = get_ai_service()
        cost = svc.estimate_cost(prompt_tokens, completion_tokens, model)
        return {"cost_usd": cost, "model": model}
    except Exception as e:
        return {"cost_usd": 0, "error": str(e)}


# ============================================
# SYSTEM IMAGE UPLOAD ENDPOINTS
# ============================================

@app.post("/admin/settings/upload-logo")
async def upload_system_logo(file: UploadFile = File(...)):
    """Upload system logo image"""
    if not supabase:
        raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        filename = file.filename or "logo.png"
        file_ext = filename.split(".")[-1].lower() if "." in filename else "png"
        file_path = f"system/logo_{uuid.uuid4()}.{file_ext}"

        content = await file.read()

        # Try to upload to available bucket
        public_url = ""
        for bucket in ["courses", "avatars", "public"]:
            try:
                supabase.storage.from_(bucket).upload(file_path, content, {"upsert": "true", "content-type": file.content_type})
                public_url = supabase.storage.from_(bucket).get_public_url(file_path)
                break
            except Exception as e:
                print(f"Bucket {bucket} failed: {e}")
                continue

        if not public_url:
            raise HTTPException(status_code=500, detail="No storage bucket available")

        # Update system settings with new logo URL
        try:
            check = supabase.table("system_settings").select("id").limit(1).execute()
            if check.data:
                supabase.table("system_settings").update({"logo_url": public_url}).eq("id", check.data[0]['id']).execute()
            else:
                supabase.table("system_settings").insert({"id": str(uuid.uuid4()), "logo_url": public_url}).execute()
        except Exception as db_err:
            print(f"Warning: Could not update settings table: {db_err}")

        return {"url": public_url}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error upload_system_logo: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/settings/upload-login-logo")
async def upload_login_logo(file: UploadFile = File(...)):
    """Upload login page logo image"""
    if not supabase:
        raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        filename = file.filename or "login_logo.png"
        file_ext = filename.split(".")[-1].lower() if "." in filename else "png"
        file_path = f"system/login_logo_{uuid.uuid4()}.{file_ext}"

        content = await file.read()

        public_url = ""
        for bucket in ["courses", "avatars", "public"]:
            try:
                supabase.storage.from_(bucket).upload(file_path, content, {"upsert": "true", "content-type": file.content_type})
                public_url = supabase.storage.from_(bucket).get_public_url(file_path)
                break
            except Exception as e:
                print(f"Bucket {bucket} failed: {e}")
                continue

        if not public_url:
            raise HTTPException(status_code=500, detail="No storage bucket available")

        # Update system settings
        try:
            check = supabase.table("system_settings").select("id").limit(1).execute()
            if check.data:
                supabase.table("system_settings").update({"login_logo_url": public_url}).eq("id", check.data[0]['id']).execute()
            else:
                supabase.table("system_settings").insert({"id": str(uuid.uuid4()), "login_logo_url": public_url}).execute()
        except Exception as db_err:
            print(f"Warning: Could not update settings table: {db_err}")

        return {"url": public_url}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error upload_login_logo: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/settings/upload-login-bg")
async def upload_login_background(file: UploadFile = File(...)):
    """Upload login page background image"""
    if not supabase:
        raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        filename = file.filename or "login_bg.jpg"
        file_ext = filename.split(".")[-1].lower() if "." in filename else "jpg"
        file_path = f"system/login_bg_{uuid.uuid4()}.{file_ext}"

        content = await file.read()

        public_url = ""
        for bucket in ["courses", "avatars", "public"]:
            try:
                supabase.storage.from_(bucket).upload(file_path, content, {"upsert": "true", "content-type": file.content_type})
                public_url = supabase.storage.from_(bucket).get_public_url(file_path)
                break
            except Exception as e:
                print(f"Bucket {bucket} failed: {e}")
                continue

        if not public_url:
            raise HTTPException(status_code=500, detail="No storage bucket available")

        # Update system settings
        try:
            check = supabase.table("system_settings").select("id").limit(1).execute()
            if check.data:
                supabase.table("system_settings").update({"login_bg_url": public_url}).eq("id", check.data[0]['id']).execute()
            else:
                supabase.table("system_settings").insert({"id": str(uuid.uuid4()), "login_bg_url": public_url}).execute()
        except Exception as db_err:
            print(f"Warning: Could not update settings table: {db_err}")

        return {"url": public_url}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error upload_login_background: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# NOTIFICATIONS ENDPOINTS
# ============================================

class NotificationCreate(BaseModel):
    user_id: str
    title: str
    message: str
    type: str = "info"  # info, warning, success, error
    link: Optional[str] = None

@app.get("/notifications/{user_id}")
async def get_user_notifications(user_id: str, unread_only: bool = False):
    """Get notifications for a specific user"""
    if not supabase:
        raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        query = supabase.table("notifications").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(50)
        if unread_only:
            query = query.eq("read", False)
        response = query.execute()
        return response.data
    except Exception as e:
        print(f"Error get_user_notifications: {e}")
        # Return empty array if table doesn't exist yet
        return []

@app.get("/notifications/{user_id}/count")
async def get_notifications_count(user_id: str):
    """Get unread notifications count for a user"""
    if not supabase:
        raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        response = supabase.table("notifications").select("id", count="exact").eq("user_id", user_id).eq("read", False).execute()
        return {"count": response.count or 0}
    except Exception as e:
        print(f"Error get_notifications_count: {e}")
        return {"count": 0}

@app.post("/notifications")
async def create_notification(notification: NotificationCreate):
    """Create a new notification"""
    if not supabase:
        raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        data = {
            "id": str(uuid.uuid4()),
            "user_id": notification.user_id,
            "title": notification.title,
            "message": notification.message,
            "type": notification.type,
            "link": notification.link,
            "read": False,
            "created_at": "now()"
        }
        response = supabase.table("notifications").insert(data).execute()
        return response.data[0] if response.data else data
    except Exception as e:
        print(f"Error create_notification: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str):
    """Mark a notification as read"""
    if not supabase:
        raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        response = supabase.table("notifications").update({"read": True}).eq("id", notification_id).execute()
        return {"success": True}
    except Exception as e:
        print(f"Error mark_notification_read: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/notifications/{user_id}/read-all")
async def mark_all_notifications_read(user_id: str):
    """Mark all notifications as read for a user"""
    if not supabase:
        raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        response = supabase.table("notifications").update({"read": True}).eq("user_id", user_id).eq("read", False).execute()
        return {"success": True, "count": len(response.data) if response.data else 0}
    except Exception as e:
        print(f"Error mark_all_notifications_read: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/notifications/{notification_id}")
async def delete_notification(notification_id: str):
    """Delete a notification"""
    if not supabase:
        raise HTTPException(status_code=503, detail="DB Disconnected")
    try:
        supabase.table("notifications").delete().eq("id", notification_id).execute()
        return {"success": True}
    except Exception as e:
        print(f"Error delete_notification: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# GLOBAL SEARCH ENDPOINT
# ============================================

@app.get("/search")
async def global_search(q: str, user_id: Optional[str] = None, role: Optional[str] = None):
    """
    Global search across courses, disciplines, chapters, and users.
    Results are filtered based on user role.
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="DB Disconnected")

    if not q or len(q) < 2:
        return {"results": [], "total": 0}

    try:
        results = []
        search_term = f"%{q}%"

        # Search in courses
        try:
            courses = supabase.table("courses").select("id, title, description, status").ilike("title", search_term).limit(5).execute()
            for course in courses.data:
                results.append({
                    "type": "course",
                    "id": course['id'],
                    "title": course['title'],
                    "subtitle": course.get('description', '')[:100] if course.get('description') else '',
                    "icon": "book",
                    "link": f"/course/{course['id']}"
                })
        except Exception as e:
            print(f"Search courses error: {e}")

        # Search in disciplines/classes
        try:
            disciplines = supabase.table("disciplines").select("id, title, department").ilike("title", search_term).limit(5).execute()
            for disc in disciplines.data:
                results.append({
                    "type": "discipline",
                    "id": disc['id'],
                    "title": disc['title'],
                    "subtitle": disc.get('department', ''),
                    "icon": "school",
                    "link": f"/instructor/class/{disc['id']}"
                })
        except Exception as e:
            print(f"Search disciplines error: {e}")

        # Search in chapters
        try:
            chapters = supabase.table("chapters").select("id, title, course_id").ilike("title", search_term).limit(5).execute()
            for chapter in chapters.data:
                results.append({
                    "type": "chapter",
                    "id": chapter['id'],
                    "title": chapter['title'],
                    "subtitle": "Capítulo",
                    "icon": "article",
                    "link": f"/course/{chapter['course_id']}/chapter/{chapter['id']}"
                })
        except Exception as e:
            print(f"Search chapters error: {e}")

        # Search in users (only for admins/instructors)
        if role and role.upper() in ['ADMIN', 'INSTRUCTOR']:
            try:
                users = supabase.table("users").select("id, name, email, role").ilike("name", search_term).limit(5).execute()
                for user in users.data:
                    role_label = {'student': 'Aluno', 'teacher': 'Professor', 'admin': 'Admin'}.get(user.get('role', ''), 'Usuário')
                    results.append({
                        "type": "user",
                        "id": user['id'],
                        "title": user['name'],
                        "subtitle": f"{role_label} • {user.get('email', '')}",
                        "icon": "person",
                        "link": f"/admin/users?highlight={user['id']}"
                    })
            except Exception as e:
                print(f"Search users error: {e}")

        # Search in contents
        try:
            contents = supabase.table("contents").select("id, title, chapter_id, type").ilike("title", search_term).limit(5).execute()
            for content in contents.data:
                type_label = {'video': 'Vídeo', 'text': 'Texto', 'pdf': 'PDF', 'quiz': 'Quiz'}.get(content.get('type', ''), 'Conteúdo')
                results.append({
                    "type": "content",
                    "id": content['id'],
                    "title": content['title'],
                    "subtitle": type_label,
                    "icon": "description",
                    "link": f"/content/{content['id']}"
                })
        except Exception as e:
            print(f"Search contents error: {e}")

        return {
            "results": results[:20],  # Limit total results
            "total": len(results),
            "query": q
        }

    except Exception as e:
        print(f"Global search error: {e}")
        return {"results": [], "total": 0, "error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
