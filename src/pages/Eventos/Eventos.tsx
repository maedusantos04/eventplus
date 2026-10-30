import { useEffect, useState } from "react";
import "./Eventos.css";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CardEvento from "../../components/cardEvento/CardEvento";
import type { Evento } from "../../types/api";
import { eventoService } from "../../services/eventPlusservice";
import { getApiErrorMessage } from "../../services/api";

function Eventos() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregar() {
            setCarregando(true);
            setErro("");
            try {
                const dados = await eventoService.listar();
                setEventos(dados);
            } catch (error) {
                setErro(getApiErrorMessage(error));
            } finally {
                setCarregando(false);
            }
        }

        void carregar();
    }, []);

    return (
        <>
            <Header />
            <main className="catalogo-eventos">
                <h1>Catálogo de Eventos</h1>

                {carregando && <p style={{ textAlign: "center" }}>Carregando eventos...</p>}
                {erro && <p style={{ textAlign: "center", color: "var(--vermelho)" }}>{erro}</p>}

                {!carregando && !erro && eventos.length === 0 && (
                    <p style={{ textAlign: "center" }}>Nenhum evento encontrado.</p>
                )}

                <div>
                    {eventos.map((evento) => (
                        <CardEvento
                            key={evento.idEvento}
                            id={evento.idEvento}
                            imagem={evento.imagemUrl}
                            categoria={
                                evento.idTipoEventoNavigation?.titulo ??
                                evento.idTipoEventoNavigation?.tituloTipoEvento ??
                                evento.tipoEvento?.titulo ??
                                "Evento"
                            }
                            titulo={evento.nome}
                            descricao={evento.descricao}
                        />
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Eventos;
