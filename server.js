const express = require("express");
const { Pool } = require("pg");
const app = express();

app.use(express.json());
app.use(express.static("public"));  // Sirve archivos estáticos (index.html)

const pool = new Pool({
  user: "postgres",      // tu usuario
  host: "localhost",
  database: "DATABASE_NAME", // tu base de datos
  password: "PASSWORD",  // tu contraseña
  port: 5432,
});

app.post("/rpc", async (req, res) => {
  const { jsonrpc, method, params, id } = req.body;

  if (jsonrpc !== "2.0" || typeof method !== "string" || !("id" in req.body)) {
    return res.status(400).json({
      jsonrpc: "2.0",
      error: { code: -32600, message: "Invalid Request" },
      id: null,
    });
  }

  const methods = {
    crearUsuario: async ({ nombre, edad }) => {
      if (!nombre || typeof nombre !== "string" || !edad || typeof edad !== "number") {
        const error = new Error("Parámetros 'nombre' (string) y 'edad' (number) son obligatorios");
        error.code = -32602;
        throw error;
      }
      const insert = await pool.query(
        "INSERT INTO usuarios (nombre, edad) VALUES ($1, $2) RETURNING *",
        [nombre, edad]
      );
      return insert.rows[0];
    },

    calcularEdad: async ({ fechaNacimiento }) => {
      if (!fechaNacimiento) {
        const error = new Error("Parámetro 'fechaNacimiento' es requerido");
        error.code = -32602; // Invalid params
        throw error;
      }
      const nacimiento = new Date(fechaNacimiento);
      if (isNaN(nacimiento)) {
        const error = new Error("Fecha de nacimiento inválida");
        error.code = -32602;
        throw error;
      }
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();

      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }

      return { edad };
    },

    listarUsuarios: async () => {
      const select = await pool.query("SELECT * FROM usuarios ORDER BY id ASC");
      return select.rows;
    },

    eliminarUsuario: async ({ idUsuario }) => {
      if (!idUsuario) {
        const error = new Error("Parámetro 'idUsuario' es requerido para eliminar");
        error.code = -32602;
        throw error;
      }
      await pool.query("DELETE FROM usuarios WHERE id = $1", [idUsuario]);
      return { mensaje: "Usuario eliminado", id: idUsuario };
    },

    editarUsuario: async ({ idUsuario, nombre, edad }) => {
      if (!idUsuario) {
        const error = new Error("Parámetro 'idUsuario' es requerido para editar");
        error.code = -32602;
        throw error;
      }
      if (!nombre || typeof nombre !== "string" || !edad || typeof edad !== "number") {
        const error = new Error("Parámetros 'nombre' (string) y 'edad' (number) son obligatorios para editar");
        error.code = -32602;
        throw error;
      }
      await pool.query(
        "UPDATE usuarios SET nombre = $1, edad = $2 WHERE id = $3",
        [nombre, edad, idUsuario]
      );
      return { mensaje: "Usuario actualizado", id: idUsuario };
    }
  };

  const handler = methods[method];

  if (!handler) {
    return res.status(404).json({
      jsonrpc: "2.0",
      error: { code: -32601, message: "Method not found" },
      id,
    });
  }

  try {
    const result = await handler(params || {});
    res.json({ jsonrpc: "2.0", result, id });
  } catch (err) {
    console.error("Error en método:", method, err.message);

    const code = err.code || -32000;
    const message = err.message || "Server error";

    res.status(500).json({
      jsonrpc: "2.0",
      error: { code, message },
      id,
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor JSON-RPC escuchando en http://localhost:3000");
});
