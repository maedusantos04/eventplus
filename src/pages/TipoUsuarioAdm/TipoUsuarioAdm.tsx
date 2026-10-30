import { useState, useEffect, useCallback, type FormEvent } from "react";
import "./TipoUsuarioAdm.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ilustracaoAdmin from "../../assets/admin-illustration.png";
import lixeira from "../../assets/lixeira.svg";
import { tipoUsuarioService } from "../../services/eventPlusservice";
import { getApiErrorMessage } from "../../services/api";
import type { TipoUsuario } from "../../types/api";

function TipoUsuarioAdm() {
    const [titulo, setTitulo] = useState("");
    const [tipos, setTipos] = useState<TipoUsuario[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    const carregarTipos = useCallback(async () => {
        setCarregando(true);
        setErro("");

        try {
            const dados = await tipoUsuarioService.listar();
            setTipos(dados);
        } catch (error) {
            console.error("Erro ao carregar tipos de usuário:", error);
            setErro(getApiErrorMessage(error));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            void carregarTipos();
        }, 0);
        return () => window.clearTimeout(timeout);
    }, [carregarTipos]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!titulo.trim()) return;

        try {
            setCarregando(true);
            setErro("");

            await tipoUsuarioService.cadastrar({
                titulo: titulo.trim(),
                tituloTipoUsuario: titulo.trim()
            });

            setTitulo("");
            await carregarTipos();
        } catch (error) {
            console.error("Erro ao cadastrar tipo de usuário:", error);
            setErro(getApiErrorMessage(error));
        } finally {
            setCarregando(false);
        }
    }

    async function handleExcluir(id?: string) {
        if (!id) return;

        if (!window.confirm("Deseja realmente excluir este tipo de usuário?")) {
            return;
        }

        try {
            setErro("");
            await tipoUsuarioService.excluir(id);
            await carregarTipos();
        } catch (error) {
            console.error("Erro ao excluir tipo de usuário:", error);
            setErro(getApiErrorMessage(error));
        }
    }

    return (
        <>
            <Header />

            <div className="admin-container">
                <main className="admin-main">
                    <h2>ADMINISTRAÇÃO TIPO DE USUÁRIOS</h2>

                    <div className="admin-form-section">
                        <div className="admin-illustration">
                            <img
                                src={ilustracaoAdmin}
                                alt="Ilustração de administração de tipos de usuário"
                            />
                        </div>

                        <form onSubmit={handleSubmit} className="admin-form">
                            <input
                                type="text"
                                placeholder="Título do Tipo de Usuário"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />

                            <button
                                type="submit"
                                className="btn-cadastrar"
                                disabled={carregando}
                            >
                                {carregando ? "Salvando..." : "Cadastrar"}
                            </button>
                        </form>
                    </div>
                </main>

                <section className="admin-list-section">
                    <h2>LISTA TIPOS DE USUÁRIOS</h2>

                    {erro && <p className="admin-erro">{erro}</p>}

                    {carregando && tipos.length === 0 && !erro && (
                        <p>Carregando tipos de usuários...</p>
                    )}

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Deletar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tipos.length === 0 && !carregando && !erro && (
                                <tr>
                                    <td colSpan={2}>
                                        Nenhum tipo de usuário cadastrado.
                                    </td>
                                </tr>
                            )}

                            {tipos.map((item) => (
                                <tr key={item.idTipoUsuario}>
                                    <td>
                                        {item.titulo ??
                                            item.tituloTipoUsuario ??
                                            "Sem título"}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn-icon"
                                            title="Deletar"
                                            aria-label={`Deletar ${
                                                item.titulo ??
                                                item.tituloTipoUsuario ??
                                                "tipo de usuário"
                                            }`}
                                            onClick={() =>
                                                handleExcluir(item.idTipoUsuario)
                                            }
                                        >
                                            <img src={lixeira} alt="Excluir" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            <Footer />
        </>
    );
}

export default TipoUsuarioAdm;
