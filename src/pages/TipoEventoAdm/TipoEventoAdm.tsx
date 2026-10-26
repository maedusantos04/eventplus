
import { useState, useEffect, useCallback } from "react";
import "./TipoEventoAdm.css";
import ilustracaoTipoEvento from "../../assets/adm-tipo-evento.svg";
import lixeira from "../../assets/lixeira.svg";
import { tipoEventoService } from "../../services/eventPlusservice";
import { getApiErrorMessage } from "../../services/api";
import type { TipoEvento } from "../../types/api";

function TipoEventoAdm() {
    const [titulo, setTitulo] = useState("");
    const [tipos, setTipos] = useState<TipoEvento[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    const carregarTipos = useCallback(async () => {
        setCarregando(true);
        setErro("");

        try {
            const dados = await tipoEventoService.listar();
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
            setErro("");

            await tipoEventoService.cadastrar({
                tituloTipoEvento: titulo.trim()
            });

            setTitulo("");
            await carregarTipos();
        } catch (error) {
            console.error("Erro ao cadastrar tipo de evento:", error);
            setErro(getApiErrorMessage(error));
        } finally {
            setCarregando(false);
        }
    }

    async function handleExcluir(id?: string) {
        if (!id) return;

        if (!window.confirm("Deseja realmente excluir este tipo de evento?")) {
            return;
        }

        try {
            setErro("");
            await tipoEventoService.excluir(id);
            await carregarTipos();
        } catch (error) {
            console.error("Erro ao excluir tipo de evento:", error);
            setErro(getApiErrorMessage(error));
        }
    }

    return (
        <div className="admin-container">
            <main className="admin-main">
                <h2>ADMINISTRAÇÃO TIPO DE EVENTOS</h2>

                <div className="admin-form-section">
                    <div className="admin-illustration">
                        <img
                            src={ilustracaoTipoEvento}
                            alt="Ilustração Tipo de Eventos"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="admin-form">
                        <input
                            type="text"
                            placeholder="Título"
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
                <h2>LISTA TIPO DE EVENTOS</h2>

                {erro && <p className="admin-erro">{erro}</p>}

                {carregando && tipos.length === 0 && !erro && (
                    <p>Carregando tipos de eventos...</p>
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
                                    Nenhum tipo de evento cadastrado.
                                </td>
                            </tr>
                        )}

                        {tipos.map((item) => (
                            <tr key={item.idTipoEvento}>
                                <td>
                                    {item.tituloTipoEvento ||
                                        item.titulo ||
                                        "Sem título"}
                                </td>

                                <td>
                                    <button
                                        type="button"
                                        className="btn-icon"
                                        title="Deletar"
                                        aria-label={`Deletar ${item.tituloTipoEvento ||
                                            item.titulo ||
                                            "tipo de evento"
                                            }`}
                                        onClick={() =>
                                            handleExcluir(item.idTipoEvento)
                                        }
                                    >
                                        <img src={lixeira} alt="" />
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

export default TipoEventoAdm;
