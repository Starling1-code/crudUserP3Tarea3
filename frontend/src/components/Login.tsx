import axios from "axios";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Por favor completa todos los campos");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await axios.post("http://localhost:3000/api/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            window.location.href = "/dashboard";
        } catch (err) {
            setError("Error en el login. Verifica tus credenciales.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Login</h1>
                {error && <p className="error-message">{error}</p>}
                <input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin} disabled={loading}>
                    {loading ? "Iniciando..." : "Login"}
                </button>
            </div>
        </div>
    );
}
