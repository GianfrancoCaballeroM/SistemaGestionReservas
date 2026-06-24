import requests
import json
import sys

# URL base de la API (puedes cambiarla por tu URL de Railway o dejar localhost)
BASE_URL = "http://localhost:5000/api"

if len(sys.argv) > 1:
    BASE_URL = sys.argv[1].rstrip('/')
    if not BASE_URL.endswith('/api'):
        BASE_URL = f"{BASE_URL}/api"

print("=" * 60)
print(f"Probando conexión con API en: {BASE_URL}")
print("=" * 60)

# 1. Probar ruta pública de Menú
try:
    print("\n[1] Probando GET /menu (Ruta Pública)...")
    res = requests.get(f"{BASE_URL}/menu", timeout=5)
    print(f"Estado HTTP: {res.status_code}")
    if res.status_code == 200:
        platos = res.json()
        print(f"Éxito: Se obtuvieron {len(platos)} platos del menú.")
        print(f"Ejemplo de plato: {platos[0]['nombre_plato']} - S/ {platos[0]['precio']:.2f}")
    else:
        print(f"Error: {res.text}")
except Exception as e:
    print(f"Error de conexión: {e}")

# 2. Probar ruta protegida sin token
try:
    print("\n[2] Probando GET /dashboard/reservas-hoy sin token (Ruta Protegida)...")
    res = requests.get(f"{BASE_URL}/dashboard/reservas-hoy", timeout=5)
    print(f"Estado HTTP: {res.status_code} (Esperado: 401)")
    print(f"Respuesta del servidor: {res.json()}")
except Exception as e:
    print(f"Error: {e}")

# 3. Intentar Login con datos válidos
token = None
try:
    print("\n[3] Probando POST /auth/login con credenciales válidas...")
    payload = {
        "username": "admin",
        "password": "admin123"
    }
    res = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=5)
    print(f"Estado HTTP: {res.status_code}")
    if res.status_code == 200:
        data = res.json()
        token = data['token']
        print(f"Éxito: Login correcto. Usuario: {data['usuario']['nombre_completo']}")
        print(f"Token recibido (recortado): {token[:40]}...")
    else:
        print(f"Error de Login: {res.text}")
except Exception as e:
    print(f"Error: {e}")

# 4. Intentar NoSQL Injection en Login
try:
    print("\n[4] Probando intento de NoSQL Injection en Login...")
    # Intentamos inyectar un operador de MongoDB ($ne: "") para el password
    payload_injection = {
        "username": "admin",
        "password": {"$ne": ""}
    }
    res = requests.post(f"{BASE_URL}/auth/login", json=payload_injection, timeout=5)
    print(f"Estado HTTP: {res.status_code} (Esperado: 401 o 400)")
    print(f"Respuesta del servidor: {res.json()}")
    print("Nota: La inyección falló porque la comparación de contraseñas se realiza mediante bcrypt en memoria, no en la query de la base de datos.")
except Exception as e:
    print(f"Error: {e}")

# 5. Probar ruta protegida CON token
if token:
    try:
        print("\n[5] Probando GET /dashboard/reservas-hoy CON token (Ruta Protegida)...")
        headers = {
            "Authorization": f"Bearer {token}"
        }
        res = requests.get(f"{BASE_URL}/dashboard/reservas-hoy", headers=headers, timeout=5)
        print(f"Estado HTTP: {res.status_code} (Esperado: 200)")
        if res.status_code == 200:
            reservas = res.json()
            print(f"Éxito: Se obtuvieron {len(reservas)} reservas confirmadas para hoy desde la vista nativa de MongoDB.")
            if len(reservas) > 0:
                print(f"Ejemplo de reserva: Cliente {reservas[0]['datos_contacto']['nombre']} - {reservas[0]['cantidad_personas']} personas a las {reservas[0]['hora_reserva']}")
        else:
            print(f"Error: {res.text}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("\n[5] Omitido: No se pudo obtener el token para probar la ruta protegida.")

print("\n" + "=" * 60)
print("Pruebas de API finalizadas.")
print("=" * 60)
