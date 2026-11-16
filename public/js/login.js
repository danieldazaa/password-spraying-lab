
const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    message.textContent = "Verificando credenciales...";
    message.style.color = "#94a3b8";

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        message.textContent = result.message;
        message.style.color = result.success ? "#4ade80" : "#f87171";

    } catch (error) {
        message.textContent = "No se pudo conectar con el servidor.";
        message.style.color = "#f87171";
    }
});
