import { Link } from "react-router-dom";
import imagemPadrao from "../../assets/banner-3.png";
import "./CardEvento.css";

interface CardEventoProps {
    id: string;
    imagem?: string | null;
    categoria?: string;
    titulo: string;
    descricao: string;
    emEdicao?: boolean;
    onEditar?: () => void;
    onExcluir?: () => void;
}

function CardEvento({
    id,
    imagem,
    categoria,
    titulo,
    descricao,
    emEdicao,
    onEditar,
    onExcluir
}: CardEventoProps) {
    const adminstravel = Boolean(onEditar || onExcluir);

    return (
        <article className={`home-evento-card ${emEdicao ? "home-evento-card-ativo" : ""}`}>
            <img
                src={imagem || imagemPadrao}
                alt={`Imagem do evento ${titulo}`}
                onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = imagemPadrao;
                }}
            />
            <span className="home-evento-card-categoria">{categoria || "Evento"}</span>

            <div className="home-evento-card-info">
                <h3>{titulo}</h3>
                <p>{descricao}</p>

                {adminstravel ? (
                    <div className="home-evento-card-acoes">
                        {emEdicao ? (
                            <span className="home-evento-card-editando">
                                Em edição
                            </span>
                        ) : null}
                        <Link to={`/eventos/${id}`} className="home-evento-card-btn-ver">
                            Ver
                        </Link>
                        {onEditar && (
                            <button
                                type="button"
                                className="home-evento-card-btn-editar"
                                onClick={onEditar}
                                aria-label={`Editar ${titulo}`}
                            >
                                Editar
                            </button>
                        )}
                        {onExcluir && (
                            <button
                                type="button"
                                className="home-evento-card-btn-excluir"
                                onClick={onExcluir}
                                aria-label={`Excluir ${titulo}`}
                            >
                                Excluir
                            </button>
                        )}
                    </div>
                ) : (
                    <Link to={`/eventos/${id}`} className="home-evento-card-link">
                        Ver evento
                    </Link>
                )}
            </div>
        </article>
    );
}

export default CardEvento;
