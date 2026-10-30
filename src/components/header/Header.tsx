import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

import logoEvent from "../../assets/logo1.svg";
import "./Header.css";
import { perfilEhAdministrador, perfilEhOrganizador, useAuth } from "../../context/auth";

function Header() {
    const { autenticado, perfil, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const administrador = perfilEhAdministrador(perfil);
    const organizador = perfilEhOrganizador(perfil);

    function sair() {
        logout();
        navigate("/login");
    }

    function irParaContato(e: React.MouseEvent) {
        if (location.pathname === "/home" || location.pathname === "/") {
            e.preventDefault();
            const el = document.getElementById("contato");
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                window.history.pushState(null, "", "#contato");
            }
        }
    }

    return (
        <header className="header">
            <div className="header-conteudo">
                <Link to="/home" className="header-logo-link">
                    <img src={logoEvent} alt="Logo Event+" />
                </Link>

                <nav className="header-nav">
                    <NavLink
                        to="/home"
                        className={({ isActive }) => (isActive ? "header-link-ativo" : "")}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/eventos"
                        className={({ isActive }) => (isActive ? "header-link-ativo" : "")}
                    >
                        Eventos
                    </NavLink>

                    {organizador && (
                        <NavLink
                            to="/cadastroEvento"
                            className={({ isActive }) => (isActive ? "header-link-ativo" : "")}
                        >
                            Cadastro de Eventos
                        </NavLink>
                    )}

                    {administrador && (
                        <>
                            <NavLink
                                to="/tipoevento"
                                className={({ isActive }) => (isActive ? "header-link-ativo" : "")}
                            >
                                Tipos de Evento
                            </NavLink>
                            <NavLink
                                to="/tipousuario"
                                className={({ isActive }) => (isActive ? "header-link-ativo" : "")}
                            >
                                Tipos de Usuário
                            </NavLink>
                            <NavLink
                                to="/usuarios"
                                className={({ isActive }) => (isActive ? "header-link-ativo" : "")}
                            >
                                Usuários
                            </NavLink>
                        </>
                    )}

                    <Link to="/home#contato" onClick={irParaContato}>
                        Contatos
                    </Link>
                </nav>

                <div className="header-auth">
                    {autenticado ? (
                        <button
                            type="button"
                            onClick={sair}
                            className="header-btn-sair"
                            aria-label="Sair da conta"
                        >
                            Sair
                        </button>
                    ) : (
                        <Link to="/login" className="header-btn-entrar">
                            Entrar
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
