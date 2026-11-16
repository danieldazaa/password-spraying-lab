const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { type } = require("os");

const app = express();
const PORT = 3000;

const USERS_FILE = path.join(__dirname, "data", "users.json");
const LOG_FILE = path.join(__dirname, "logs", "login.log");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Función para Obtener la IP del Atacante
function getClientIP(req) {
    return req.socket.remoteAddress?.replace(/^::ffff:/, "") || "unkown";
}

// Registrar Eventos de Autenticación
function writeLog(event) {
    fs.appendFileSync(
        LOG_FILE,
        JSON.stringify(event) + "\n",
        "utf8"
    );
}

// Endpoint de Autenticación
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const sourceIP = getClientIP(req);
    const timestamp = new Date().toISOString();

    if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        !username.trim() ||
        !password
    ) {
        return res.status(400).json({
            success: false,
            message: "Usuario y contraseña son obligatorios."
        });
    }

    try {
        const users = JSON.parse(
            fs.readFileSync(USERS_FILE, "utf8")
        );

        const user = users.find(
            item => item.username === username.trim()
        );

        const passwordMatches = user
            ? await bcrypt.compare(password, user.passwordHash)
            : false;

        const success = Boolean(user && passwordMatches);

        const event = {
            timestamp,
            source_ip: sourceIP,
            username: username.trim(),
            event_type: "authentication",
            outcome: success ? "success" : "failure",
            reason: success
                ? "valid_credentials"
                : user
                    ? "invalid_password"
                    : "unknown_user"
        };

        writeLog(event);

        if (!success) {
            return res.status(401).json({
                success: false,
                message: "Credenciales incorrectas."
            });
        
        }

        return res.status(200).json({
            success: true,
            message: "Inicio de sesión exitoso."
        });

    } catch (error) {
        console.error("Error de autenticación:", error);

        return res.status(500).json({
            success: false,
            message: "Error interno del servidor."
        });
    }
});

// Iniciar sesión
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor activo en https://localhost:${PORT}`);
});
