export interface LoginPayload {
    email?: string;
    senha?: string;
}

export interface LoginResponse {
    token: string;
    usuario?: Usuario;
}

export interface AuthSession {
    token: string;
    usuario?: Usuario;
}

export interface TipoEvento {
    idTipoEvento?: string;
    tituloTipoEvento?: string;
    titulo?: string; // Adicionado para resolver o erro no TypeScript
}

export interface TipoUsuario {
    idTipoUsuario?: string;
    tituloTipoUsuario?: string;
    titulo?: string;
}

export interface Evento {
    idEvento: string;
    nome: string;
    descricao: string;
    dataEvento: string;
    imagemUrl?: string;
    idTipoEvento?: string;
    idTipoEventoNavigation?: TipoEvento;
    tipoEvento?: TipoEvento;
}

export interface Usuario {
    idUsuario: string;
    nome: string;
    email: string;
    idTipoUsuario?: string;
    idTipoUsuarioNavigation?: TipoUsuario;
}

export interface UsuarioPayload {
    nome: string;
    email: string;
    senha?: string;
    idTipoUsuario: string;
}

export interface Comentario {
    idComentario: string;
    descricao: string;
    exibe?: boolean;
    idUsuario?: string;
    idEvento?: string;
    usuario?: Usuario;
    evento?: Evento;
}

export interface ComentarioPayload {
    descricao: string;
    idUsuario: string;
    idEvento: string;
}

export interface MensagemModeracao {
    mensagem?: string;
}

export interface Presenca {
    idPresenca: string;
    situacao: boolean;
    idUsuario: string;
    idEvento: string;
    evento?: Evento;
}

export interface PresencaPayload {
    situacao: boolean;
    idUsuario: string;
    idEvento: string;
}