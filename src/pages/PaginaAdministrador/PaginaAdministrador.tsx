import { useState, useEffect, useCallback } from "react";
import "./PaginaAdministrador.css";
import ilustracaoTipoEvento from "../../assets/adm-tipo-evento.svg";
import { tipoEventoService } from "../../services/eventPlusservice";
import { getApiErrorMessage } from "../../services/api";
import type { TipoEvento } from "../../types/api";

function PaginaAdministrador() {
    const [titulo, setTitulo] = useState("");
    const [tipos, setTipos] = useState<TipoEvento[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    const carregarTipos = useCallback(async () => {
        setCarregando(true);
        setErro("");
        try {
            const dados = await tipoEventoService.listar();
            console.log("Tipos de evento recebidos:", dados);
            setTipos(dados);
        } catch (error) {
            console.error("Erro ao carregar tipos de evento:", error);
            setErro(getApiErrorMessage(error));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        void carregarTipos();
    }, [carregarTipos]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!titulo.trim()) return;

        try {
            setCarregando(true);
            await tipoEventoService.cadastrar({ tituloTipoEvento: titulo });
            setTitulo("");
            await carregarTipos();
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            alert("Não foi possível cadastrar o tipo de evento.");
        } finally {
            setCarregando(false);
        }
    }

    async function handleExcluir(id?: string) {
        if (!id) return;
        if (!confirm("Deseja realmente excluir este tipo de evento?")) return;

        try {
            await tipoEventoService.excluir(id);
            await carregarTipos();
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Não foi possível excluir o tipo de evento.");
        }
    }

    return (
        <div className="admin-container">
            <main className="admin-main">
                <h2>ADMINISTRAÇÃO TIPO DE EVENTOS</h2>

                <div className="admin-form-section">
                    <div className="admin-illustration">
                        <img src={ilustracaoTipoEvento} alt="Ilustração Tipo de Eventos" />
                    </div>

                    <form onSubmit={handleSubmit} className="admin-form">
                        <input
                            type="text"
                            placeholder="Título"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />

                        <button type="submit" className="btn-cadastrar" disabled={carregando}>
                            {carregando ? "Salvando..." : "Cadastrar"}
                        </button>
                    </form>
                </div>
            </main>

            <section className="admin-list-section">
                <h2>LISTA TIPO DE EVENTOS</h2>

                {erro && <p style={{ color: "#fff", textAlign: "center", marginBottom: "1rem" }}>{erro}</p>}

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
                                <td colSpan={2} style={{ textAlign: "center" }}>
                                    Nenhum tipo de evento cadastrado.
                                </td>
                            </tr>
                        )}
                        {tipos.map((item) => (
                            <tr key={item.idTipoEvento}>
                                <td>{item.tituloTipoEvento || item.titulo || "Sem título"}</td>
                                <td>
                                    <button
                                        className="btn-icon"
                                        title="Deletar"
                                        onClick={() => handleExcluir(item.idTipoEvento)}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default PaginaAdministrador;