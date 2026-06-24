import requests
import time
import sys

BASE_URL = "http://localhost:5000/api"

if len(sys.argv) > 1:
    BASE_URL = sys.argv[1].rstrip('/')
    if not BASE_URL.endswith('/api'):
        BASE_URL = f"{BASE_URL}/api"

print("=" * 60)
print(" SIMULADOR DE ATAQUES DE SEGURIDAD (ENTORNO CONTROLADO)")
print(f" Destino: {BASE_URL}")
print("=" * 60)

# =====================================================================
# ATAQUE 1: Fuerza Bruta en Login (Falta de Rate Limiting / WAF)
# =====================================================================
print("\n[ATAQUE 1] Simulando ataque de Fuerza Bruta (50 intentos rápidos)...")
print("Este ataque automatiza peticiones de login para adivinar la clave de 'admin'.")
print("Si el sistema tuviera Rate Limiting o WAF, nos bloquearía tras 5 o 10 intentos.")

inicio = time.time()
exito_bloqueo = False
intentos = 1000  # Haremos 30 intentos rápidos para demostrarlo

for i in range(1, intentos + 1):
    password_intento = f"clave_falsa_{i}"
    payload = {
        "username": "admin",
        "password": password_intento
    }
    
    try:
        res = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=2)
        # Si el servidor responde 429 Too Many Requests, significa que fuimos bloqueados
        if res.status_code == 429:
            print(f"-> Intento {i:02d}: ¡BLOQUEADO POR EL SERVIDOR! (HTTP 429 - Too Many Requests)")
            exito_bloqueo = True
            break
        else:
            print(f"-> Intento {i:02d}: Clave '{password_intento}' rechazada (HTTP {res.status_code})")
    except Exception as e:
        print(f"-> Intento {i:02d}: Error de red / tiempo de espera ({e})")
        break

fin = time.time()
print(f"\nTiempo total de la simulación: {fin - inicio:.2f} segundos.")
if exito_bloqueo:
    print("RESULTADO: El servidor está PROTEGIDO contra Fuerza Bruta (WAF/Rate Limiting activo).")
else:
    print("WARNING: El servidor procesó todos los intentos sin bloquearnos.")
    print("RESULTADO: Vulnerable a Fuerza Bruta / Denegación de Servicio (DoS).")


# =====================================================================
# ATAQUE 2: Escalada de Privilegios / BFLA (Broken Function Level Auth)
# =====================================================================
print("\n" + "="*60)
print("[ATAQUE 2] Simulando Escalada de Privilegios (Bypass de Rol)")
print("Objetivo: Iniciar sesión como usuario básico ('staff01') e intentar")
print("crear una cuenta de administrador ('hacker_admin') a través de la API.")
print("="*60)

# 1. Login como staff01 (Rol básico)
print("\nPaso 1: Obteniendo token de usuario de staff común ('staff01')...")
payload_staff = {
    "username": "staff01",
    "password": "staff123"
}

token_staff = None
try:
    res = requests.post(f"{BASE_URL}/auth/login", json=payload_staff, timeout=5)
    if res.status_code == 200:
        data = res.json()
        token_staff = data['token']
        print(f"-> Éxito: Logueado como '{data['usuario']['nombre_completo']}' (Rol: {data['usuario']['rol'].upper()})")
    else:
        print(f"-> Error: No se pudo iniciar sesión. {res.text}")
except Exception as e:
    print(f"-> Error de conexión: {e}")

# 2. Intentar crear un usuario Administrador usando el token de Staff
if token_staff:
    print("\nPaso 2: Intentando crear un nuevo usuario Admin usando el token de Staff...")
    headers = {
        "Authorization": f"Bearer {token_staff}"
    }
    # Datos del nuevo usuario que queremos crear con rol de administrador
    payload_nuevo_usuario = {
        "nombre_completo": "Hacker Malicioso Admin",
        "email": "hacker.admin@mezanine.pe",
        "username": "hacker_admin",
        "password": "hacker123_password",
        "rol": "admin"  # Escalada de privilegios
    }
    
    try:
        res = requests.post(f"{BASE_URL}/usuarios", json=payload_nuevo_usuario, headers=headers, timeout=5)
        print(f"Estado HTTP recibido: {res.status_code}")
        
        if res.status_code == 201:
            print("-> VULNERABILIDAD CONFIRMADA!")
            print("-> El servidor permitió a un usuario 'staff' crear un nuevo 'admin'.")
            print(f"-> Respuesta del servidor: {res.json()}")
        elif res.status_code == 403 or res.status_code == 401:
            print("-> ATAQUE BLOQUEADO!")
            print("-> El servidor rechazó la creación de usuarios para cuentas sin permisos de administrador.")
            print(f"-> Mensaje del servidor: {res.json()}")
        else:
            print(f"-> Respuesta inesperada: {res.text}")
    except Exception as e:
        print(f"-> Error: {e}")
else:
    print("\nOmitido: No se pudo obtener el token de staff para probar la escalada de privilegios.")

print("\n" + "=" * 60)
print("Simulación de ataques finalizada.")
print("=" * 60)
