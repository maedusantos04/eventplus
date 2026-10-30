import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import visaoImg from "../../assets/visao-img.png";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CardEvento from "../../components/cardEvento/CardEvento";
import Carrossel from "../../components/carrossel/Carrossel";

import "./Home.css";

import { getApiErrorMessage } from "../../services/api";
import type { Evento, TipoEvento } from "../../types/api";
import {
    eventoService,
    tipoEventoService
} from "../../services/eventPlusservice";

function Home() {
    const location = useLocation();
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [tiposEventos, setTiposEventos] = useState<TipoEvento[]>([]);

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro("");

        try {
            const [dados, tipos] = await Promise.all([
                eventoService.listarProximos(),
                tipoEventoService.listar()
            ]);

            const hoje = new Date();

            const eventosFuturos = dados.filter((item) => {
                if (!item.dataEvento) return true;
                return new Date(item.dataEvento) >= hoje;
            });

            setTiposEventos(tipos);
            setEventos(eventosFuturos.slice(0, 3));
        } catch (error) {
            setErro(getApiErrorMessage(error));
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            void carregar();
        }, 0);
        return () => window.clearTimeout(timeout);
    }, [carregar]);

    useEffect(() => {
        if (location.hash === "#contato" || window.location.hash === "#contato") {
            const timeout = window.setTimeout(() => {
                const elemento = document.getElementById("contato");
                elemento?.scrollIntoView({ behavior: "smooth" });
            }, 100);
            return () => window.clearTimeout(timeout);
        }
    }, [location.hash]);

    return (
        <>
            <Header />

            <main>
                <Carrossel />

                <section className="home-visao">
                    <div className="home-visao-container">
                        <img
                            src={visaoImg}
                            alt="Pessoas confraternizando"
                        />

                        <div className="home-visao-texto">
                            <h1>Visão</h1>
                            <p>
                                A EventPlus organiza eventos e informações
                                em uma interface direta, facilitando a
                                consulta da agenda e a participação dos
                                usuários.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="eventos" className="home-eventos">
                    <div className="home-eventos-titulo">
                        <h2>Próximos Eventos</h2>
                        <hr />
                    </div>

                    {carregando && (
                        <p style={{ textAlign: "center" }}>Carregando Próximos Eventos...</p>
                    )}

                    {erro && (
                        <p role="alert" style={{ textAlign: "center", color: "var(--vermelho)" }}>
                            {erro}
                        </p>
                    )}

                    {!carregando && !erro && eventos.length === 0 && (
                        <p style={{ textAlign: "center" }}>Nenhum próximo evento cadastrado.</p>
                    )}

                    <div className="home-eventos-lista">
                        {eventos.map((evento) => (
                            <CardEvento
                                key={evento.idEvento}
                                id={evento.idEvento}
                                titulo={evento.nome}
                                imagem={evento.imagemUrl}
                                descricao={evento.descricao}
                                categoria={
                                    tiposEventos.find(
                                        (tipo) => tipo.idTipoEvento === evento.idTipoEvento
                                    )?.titulo
                                    ?? tiposEventos.find(
                                        (tipo) => tipo.idTipoEvento === evento.idTipoEvento
                                    )?.tituloTipoEvento
                                    ?? evento.idTipoEventoNavigation?.titulo
                                    ?? evento.idTipoEventoNavigation?.tituloTipoEvento
                                    ?? evento.tipoEvento?.titulo
                                    ?? "Sem categoria"
                                }
                            />
                        ))}
                    </div>
                </section>

                <section id="contato" className="home-contato">
                    <div className="home-contato-container">
                        <div className="home-contato-titulo">
                            <h2>Contato</h2>
                            <hr />
                        </div>

                        <div className="home-contato-conteudo">
                            <div className="home-contato-texto">
                                <p>Rua Niterói, 180 - Centro</p>
                                <p>São Caetano do Sul - SP</p>
                            </div>

                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29245.591198054055!2d-46.60883312568361!3d-23.61512919999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5d11c031c57f%3A0x8f79f71018065a16!2sSENAI%20S%C3%A3o%20Caetano%20do%20Sul%20-%20Cyber%20e%20IA!5e0!3m2!1spt-BR!2sbr!4v1791222308450!5m2!1spt-BR!2sbr"
                                title="Localização da EventPlus"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Home;
