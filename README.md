# Proyecto JSON-RPC con Express y PostgreSQL

Este proyecto implementa un CRUD simple usando el protocolo **JSON-RPC 2.0**, con Node.js, Express y PostgreSQL.

## 🧱 Pasos para levantar el proyecto

### 1. Crear carpeta del proyecto

```bash
mkdir jsonrpc-project
cd jsonrpc-project
```


## 2. Inicializar proyecto Node.js
```bash
npm init -y
```


## 3. Instalar dependencias
```bash
npm install express
npm install pg
```


## 🗃️ Base de Datos (PostgreSQL)
1. Crear la tabla usuarios

Conéctate a tu base de datos PostgreSQL (por ejemplo con psql o pgAdmin) y ejecuta:
```bash
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  edad INTEGER
);
```

2. Consultar usuarios
```bash
SELECT * FROM usuarios;
```

## 🔌 EndPoint JSON-RPC

URL del servicio:
```bash
POST http://localhost:3000/rpc
```
## Verificar Credenciasles
Dentro de jsonrpc-project/server.js <br>
Se encentra las credenciales de acceso cambiar segun su conveniencia.<br>
![imagen](https://github.com/user-attachments/assets/e6a86336-00b7-4531-a835-1975f4007d00)

## 🚀 Levantar el servidor

Asegúrate de tener tu base de datos corriendo, luego lanza:

```bash
npm start
```

```bash
(http://localhost:3000)
```
## 🧪 Ejemplos de Peticiones JSON-RPC

DENTRO DE POSTMAN :
➕ Crear Usuario
```bash
{
  "jsonrpc": "2.0",
  "method": "crearUsuario",
  "params": {
    "nombre": "Juan Pérez",
    "edad": 30
  },
  "id": 1
}
```

📋 Listar Usuarios
```bash
{
  "jsonrpc": "2.0",
  "method": "listarUsuarios",
  "params": {},
  "id": 2
}
```

✏️ Editar Usuario
```bash
{
  "jsonrpc": "2.0",
  "method": "editarUsuario",
  "params": {
    "idUsuario": 1,
    "nombre": "Juan Editado",
    "edad": 35
  },
  "id": 3
}
```

❌ Eliminar Usuario
```bash
{
  "jsonrpc": "2.0",
  "method": "eliminarUsuario",
  "params": {
    "idUsuario": 1
  },
  "id": 4
}
```
🎂 Calcular Edad (sin guardar en la BD)
```bash
{
  "jsonrpc": "2.0",
  "method": "calcularEdad",
  "params": {
    "fechaNacimiento": "1995-06-10"
  },
  "id": 5
}
```
