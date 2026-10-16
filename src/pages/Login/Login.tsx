import { useLocation, useNavigate } from "react-router-dom";
import logoEvent from "../../assets/logo1.svg"

import "./Login.css"
import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import { Botao } from "../../components/botao/Botao";

function Login() {

    const navigate = useNavigate();
    const location = useLocation();
    const { login, autenticado } = useAuth();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        if(autenticado) navigate("/home", {replace: true});
    }, [autenticado, navigate])

    return(
    <main>
        <img src={logoEvent} alt="EventPlus logo" />

        <div>
            <label htmlFor="">email</label>
            <input type="email" name="email" id="email" value={email} placeholder="digite seu email..." onChange={(event) => setEmail(event.target.value)}/>
        </div>
        <div>
            <label htmlFor="">senha</label>
            <input type="password" name="senha" id="senha" placeholder="digite sua senha..." />
        </div>
        <Botao texto={enviando ? "Entrando..." : "Entrar"} type="submit" disabled={enviando} />
    </main>
    )
}

export default Login;