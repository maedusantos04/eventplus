import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Presenca, Evento, Comentario, MensagemModeracao } from "../../types/api";

import imagemPadrao from "../../assets/banner-1.png";
import relogio from "../../assets/relogio.svg";
import predio from "../../assets/predio.svg";
import filtro from "../../assets/filtro.svg";
import enviar from "../../assets/enviar.svg";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Botao from "../../components/botao/Botao";
import Campo from "../../components/campo/Campo";
import ModalConfirmacao from "../../components/modalConfirmacao/ModalConfirmacao";

import { comentarioService, eventoService, presencaService } from "../../services/eventPlusservice";
import { useAuth } from "../../context/auth";
import { getApiErrorMessage } from "../../services/api";

import "./DetalhesEvento.css";

function formatarData(value: string): string {
    const data = new Date(value);
    return Number.isNaN(data.getTime())
        ? "Data não informada"
        : new Intl.DateTimeFormat("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric"
          }).format(data);
}

function formatarHora(value: string): string {
    const data = new Date(value);
    return Number.isNaN(data.getTime())
        ? "Horário não informado"
        : new Intl.DateTimeFormat("pt-BR", {
              hour: "2-digit",
              minute: "2-digit"
          }).format(data);
}

function DetalhesEvento() {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const { autenticado, usuario } = useAuth();

    const [evento, setEvento] = useState<Evento | null>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [secaoComentarios, setSecaoComentarios] = useState<boolean>(false);
    const [presenca, setPresenca] = useState<Presenca | null>(null);
    const [presencaCarregada, setPresencaCarregada] = useState("");
    const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false);
    const [enviandoInscricao, setEnviandoInscricao] = useState(false);
    const [mensagemInscricao, setMensagemInscricao] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [novoComentario, setNovoComentario] = useState("");
    const [mensagemComentario, setMensagemComentario] = useState("");
    const [enviandoComentario, setEnviandoComentario] = useState(false);
    const [erro, setErro] = useState("");

    const carregar = useCallback(async () => {
        if (!id) return;
        setCarregando(true);
        setErro("");

        try {
            const [eventoAtual, comentariosAtuais] = await Promise.all([
                eventoService.buscar(id),
                comentarioService.listarPorEvento(id)
            ]);
            setEvento(eventoAtual);
            setComentarios(Array.isArray(comentariosAtuais) ? comentariosAtuais : []);
        } catch (error) {
            setErro(getApiErrorMessage(error));
        } finally {
            setCarregando(false);
        }
    }, [id]);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            void carregar();
        }, 0);
        return () => window.clearTimeout(timeout);
    }, [carregar]);

    useEffect(() => {
        if (!usuario?.idUsuario || !id) {
            const timeout = window.setTimeout(() => {
                setPresenca(null);
                setPresencaCarregada("");
            }, 0);
            return () => window.clearTimeout(timeout);
        }

        const chaveAtual = `${usuario.idUsuario}:${id}`;
        let ativo = true;

        presencaService
            .listarPorUsuario(usuario.idUsuario)
            .then((lista) => {
                if (!ativo) return;
                const encontrada = lista.find((item) => item.idEvento === id);
                setPresenca(encontrada || null);
                setPresencaCarregada(chaveAtual);
            })
            .catch(() => {
                if (!ativo) return;
                setPresenca(null);
                setPresencaCarregada(chaveAtual);
            });

        return () => {
            ativo = false;
        };
    }, [usuario?.idUsuario, id]);

    function exigirLogin(): boolean {
        if (!autenticado) {
            navigate("/login", { state: { from: `/eventos/${id}` } });
            return true;
        }
        return false;
    }

    async function inscrever() {
        if (exigirLogin() || !usuario || enviandoInscricao || !id) return;

        setEnviandoInscricao(true);
        setMensagemInscricao("");

        try {
            const novaPresenca = await presencaService.cadastrar({
                situacao: true,
                idEvento: id,
                idUsuario: usuario.idUsuario
            });
            setPresenca(novaPresenca);
            setMensagemInscricao("Inscrição realizada com sucesso.");
        } catch (error) {
            setMensagemInscricao(getApiErrorMessage(error));
        } finally {
            setEnviandoInscricao(false);
        }
    }

    async function cancelarInscricao() {
        if (!presenca || enviandoInscricao) return;

        setEnviandoInscricao(true);
        setMensagemInscricao("");

        try {
            await presencaService.excluir(presenca.idPresenca);
            setPresenca(null);
            setMensagemInscricao("Inscrição cancelada com sucesso.");
        } catch (error) {
            setMensagemInscricao(getApiErrorMessage(error));
        } finally {
            setConfirmandoCancelamento(false);
            setEnviandoInscricao(false);
        }
    }

    async function comentar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (exigirLogin() || !usuario || !novoComentario.trim()) return;

        setEnviandoComentario(true);
        setMensagemComentario("");

        try {
            const response = await comentarioService.cadastrar({
                descricao: novoComentario.trim(),
                idEvento: evento?.idEvento || id,
                idUsuario: usuario.idUsuario
            });

            setNovoComentario("");

            if ("mensagem" in response && !("idComentario" in response)) {
                setMensagemComentario((response as MensagemModeracao).mensagem);
            } else {
                const comentarioCriado = response as Comentario;
                setComentarios((items) => [...items, comentarioCriado]);
                setMensagemComentario("Comentário publicado.");
            }
        } catch (error) {
            setMensagemComentario(getApiErrorMessage(error));
        } finally {
            setEnviandoComentario(false);
        }
    }

    const chavePresenca = usuario && id ? `${usuario.idUsuario}:${id}` : "";
    const checandoPresenca = Boolean(chavePresenca && presencaCarregada !== chavePresenca);

    return (
        <>
            <Header />

            <main className="detalhes-evento-pagina">
                <div className="detalhes-evento-container">
                    <Link to="/eventos" className="detalhes-evento-voltar">
                        &larr; Voltar para eventos
                    </Link>

                    {carregando ? (
                        <p className="detalhes-evento-aviso">Carregando detalhes do evento...</p>
                    ) : null}

                    {erro ? (
                        <p className="detalhes-evento-erro" role="alert">
                            {erro}
                        </p>
                    ) : null}

                    {evento ? (
                        <div className="detalhes-evento-grid">
                            <div className="detalhes-evento-principal">
                                <img
                                    src={evento.imagemUrl || imagemPadrao}
                                    alt={`Banner do evento ${evento.nome}`}
                                    className="detalhes-evento-imagem"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = imagemPadrao;
                                    }}
                                />

                                <h1 className="detalhes-evento-titulo">{evento.nome}</h1>

                                <div className="detalhes-evento-abas">
                                    <button
                                        type="button"
                                        className={!secaoComentarios ? "ativo" : ""}
                                        onClick={() => setSecaoComentarios(false)}
                                    >
                                        Sobre o Evento
                                    </button>
                                    <button
                                        type="button"
                                        className={secaoComentarios ? "ativo" : ""}
                                        onClick={() => setSecaoComentarios(true)}
                                    >
                                        Comentários ({comentarios.length})
                                    </button>
                                </div>

                                {!secaoComentarios ? (
                                    <section className="detalhes-evento-descricao">
                                        <h2>Descrição</h2>
                                        <p>{evento.descricao}</p>
                                    </section>
                                ) : (
                                    <section className="detalhes-evento-comentarios" role="tabpanel">
                                        <form onSubmit={comentar} className="detalhes-evento-comentario-form">
                                            <label className="visually-hidden" htmlFor="novo-comentario">
                                                Comentar
                                            </label>
                                            <Campo
                                                id="novo-comentario"
                                                value={novoComentario}
                                                maxLength={250}
                                                placeholder={
                                                    autenticado
                                                        ? "Escreva um comentário sobre o evento..."
                                                        : "Faça login para comentar..."
                                                }
                                                onChange={(event) =>
                                                    setNovoComentario(event.target.value)
                                                }
                                            />
                                            <button
                                                type="submit"
                                                className="detalhes-evento-btn-enviar"
                                                aria-label="Enviar comentário"
                                                disabled={enviandoComentario || !novoComentario.trim()}
                                            >
                                                <img src={enviar} alt="Ícone de enviar" />
                                            </button>
                                        </form>

                                        {mensagemComentario ? (
                                            <p className="detalhes-evento-mensagem" role="status">
                                                {mensagemComentario}
                                            </p>
                                        ) : null}

                                        <div className="detalhes-evento-comentarios-lista">
                                            {comentarios.length === 0 ? (
                                                <p className="detalhes-evento-comentario-vazio">
                                                    Nenhum comentário publicado ainda. Seja o primeiro a comentar!
                                                </p>
                                            ) : (
                                                comentarios.map((comentario) => (
                                                    <article
                                                        key={comentario.idComentario}
                                                        className="detalhes-evento-comentario-card"
                                                    >
                                                        <div className="detalhes-evento-comentario-topo">
                                                            <strong>
                                                                {comentario.idUsuarioNavigation?.nome ||
                                                                    comentario.usuario?.nome ||
                                                                    "Usuário"}
                                                            </strong>
                                                            {comentario.dataComentario ? (
                                                                <time>
                                                                    {new Date(
                                                                        comentario.dataComentario
                                                                    ).toLocaleString("pt-BR", {
                                                                        day: "2-digit",
                                                                        month: "2-digit",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit"
                                                                    })}
                                                                </time>
                                                            ) : null}
                                                        </div>
                                                        <p>{comentario.descricao}</p>
                                                    </article>
                                                ))
                                            )}
                                        </div>
                                    </section>
                                )}
                            </div>

                            <aside className="detalhes-evento-sidebar">
                                <h2>Informações principais</h2>
                                <hr />

                                <div className="detalhes-evento-info-item">
                                    <img src={relogio} alt="Horário" />
                                    <span>
                                        {formatarData(evento.dataEvento)} às{" "}
                                        {formatarHora(evento.dataEvento)}
                                    </span>
                                </div>

                                <div className="detalhes-evento-info-item">
                                    <img src={predio} alt="Instituição" />
                                    <span>
                                        {evento.idInstituicaoNavigation?.nomeFantasia ||
                                            "Instituição não informada"}
                                    </span>
                                </div>

                                <div className="detalhes-evento-info-item">
                                    <img src={filtro} alt="Tipo de evento" />
                                    <span>
                                        {evento.idTipoEventoNavigation?.titulo ||
                                            evento.idTipoEventoNavigation?.tituloTipoEvento ||
                                            evento.tipoEvento?.titulo ||
                                            "Categoria geral"}
                                    </span>
                                </div>

                                <div className="detalhes-evento-acao-wrapper">
                                    <Botao
                                        className={
                                            presenca ? "detalhes-evento-btn-cancelar" : ""
                                        }
                                        texto={
                                            checandoPresenca
                                                ? "Verificando inscrição..."
                                                : presenca
                                                ? "Cancelar Inscrição"
                                                : enviandoInscricao
                                                ? "Inscrevendo..."
                                                : "Se inscrever"
                                        }
                                        type="button"
                                        disabled={checandoPresenca || enviandoInscricao}
                                        onClick={() =>
                                            presenca
                                                ? setConfirmandoCancelamento(true)
                                                : void inscrever()
                                        }
                                    />
                                    {mensagemInscricao ? (
                                        <p
                                            className="detalhes-evento-mensagem-inscricao"
                                            role="status"
                                        >
                                            {mensagemInscricao}
                                        </p>
                                    ) : null}
                                </div>
                            </aside>
                        </div>
                    ) : null}
                </div>

                <ModalConfirmacao
                    show={confirmandoCancelamento}
                    titulo="Cancelar inscrição"
                    mensagem={`Deseja realmente cancelar sua inscrição no evento "${
                        evento?.nome || "este evento"
                    }"?`}
                    textoConfirmar={enviandoInscricao ? "Cancelando..." : "Cancelar Inscrição"}
                    textoCancelar="Manter inscrição"
                    onClose={() => {
                        if (!enviandoInscricao) setConfirmandoCancelamento(false);
                    }}
                    onConfirm={() => void cancelarInscricao()}
                />
            </main>

            <Footer />
        </>
    );
}

export default DetalhesEvento;
