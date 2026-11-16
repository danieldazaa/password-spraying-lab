const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const users = [
    { username: "admin", password: "AdminLab2026!" },
    { username: "analista", password: "AnalistaLab2026!" },
    { username: "soporte", password: "SoporteLab2026!" },
    { username: "desarrollador", password: "DevLab2026!" },
    { username: "operador", password: "OperadorLab2026!" }
];

async function generateUsers() {
    const usersWithHashes = await Promise.all(
        users.map(async user => ({
            username: user.username,
            passwordHash: await bcrypt.hash(user.password, 10)
        }))
    );

    const output = path.join(__dirname, "..", "data", "users.json");

    fs.writeFileSync(
        output,
        JSON.stringify(usersWithHashes, null, 2),
        "utf8"
    );

    console.log("Usuarios ficticios generados correctamente.");
}

generateUsers().catch(console.error);
