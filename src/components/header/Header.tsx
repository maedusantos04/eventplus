
import { Link, NavLink, useNavigate } from "react-router-dom";

import logoEvent from "../../assets/logo1.svg";
import "./Header.css";

import { useAuth } from "../../context/auth";

function Header() {
    const { autenticado, perfil, logout } = useAuth();

    const navigate = useNavigate();

    const nomePerfil = String(perfil ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();

    const administrador =
        autenticado &&
        (nomePerfil.includes("admin") ||
            nomePerfil.includes("administrador"));

    const organizador =
        autenticado &&
        (nomePerfil.includes("organizador") ||
            administrador);

    function sair() {
        logout();
        navigate("/login");
    }

    return (
        <header className="header">
            <div className="header-conteudo">
                <Link to="/home">
                    <img src={logoEvent} alt="Logo Event+" />
                </Link>

                <nav>
                    <NavLink to="/home">Home</NavLink>

                    <NavLink to="/eventos">Eventos</NavLink>

                    {administrador && (
                        <>
                            <NavLink to="/usuarios">
                                Usuários
                            </NavLink>

                            <NavLink to="/tipoevento">
                                Tipo de Evento
                            </NavLink>

                            <NavLink to="/tipousuario">
                                Tipo Usuário
                            </NavLink>
                        </>
                    )}

                    <Link to="/home#contato">Contatos</Link>
                </nav>

                <div className="header-acoes">
                    {autenticado ? (
                        <>
                            {organizador && (
                                <Link to="/conta">
                                    Minha Conta
                                </Link>
                            )}

                            <button type="button" onClick={sair}>
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link to="/login">Entrar</Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
