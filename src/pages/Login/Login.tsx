import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, type FormEvent } from "react";

import logoEvent from "../../assets/logo1.svg";
import Botao from "../../components/botao/Botao";
import Campo from "../../components/campo/Campo";
import { useAuth } from "../../context/auth";
import { getApiErrorMessage } from "../../services/api";

import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, autenticado } = useAuth();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        if (autenticado) {
            const state = location.state as { from?: string } | null;
            navigate(state?.from || "/home", { replace: true });
        }
    }, [autenticado, navigate, location.state]);

    async function entrar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");

        if (!email.trim() || !senha) {
            setErro("Preencha todos os campos.");
            return;
        }

        setEnviando(true);

        try {
            await login({ email: email.trim(), senha });
            const state = location.state as { from?: string } | null;
            navigate(state?.from || "/home", { replace: true });
        } catch (error) {
            setErro(getApiErrorMessage(error));
        } finally {
            setEnviando(false);
        }
    }

    return (
        <main className="login-page">
            <div className="login-container">
                <img
                    src={logoEvent}
                    alt="Logo Event+"
                    className="login-logo"
                />

                <form className="login-form" onSubmit={entrar} noValidate>
                    <div className="login-campo-grupo">
                        <label htmlFor="login-email">E-mail</label>
                        <Campo
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Digite seu e-mail"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="login-campo-grupo">
                        <label htmlFor="login-senha">Senha</label>
                        <Campo
                            id="login-senha"
                            type="password"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            placeholder="Digite sua senha"
                            autoComplete="current-password"
                            minLength={6}
                            required
                        />
                    </div>

                    <Botao
                        texto={enviando ? "Entrando..." : "Entrar"}
                        type="submit"
                        disabled={enviando}
                    />

                    {erro ? (
                        <p className="login-erro" role="alert">
                            {erro}
                        </p>
                    ) : null}
                </form>
            </div>
        </main>
    );
}

export default Login;
