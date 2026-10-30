export interface LoginPayload {
    email: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
    expiracao?: string;
    usuario: Usuario;
}

export interface AuthSession {
    token: string;
    expiracao?: string;
    usuario: Usuario;
}

export interface TipoEvento {
    idTipoEvento?: string;
    tituloTipoEvento?: string;
    titulo?: string;
}

export interface TipoUsuario {
    idTipoUsuario?: string;
    tituloTipoUsuario?: string;
    titulo?: string;
}

export interface Instituicao {
    idInstituicao: string;
    nomeFantasia?: string;
    cnpj?: string;
    endereco?: string;
}

export interface EventoPayload {
    nome: string;
    descricao: string;
    dataEvento: string;
    idTipoEvento?: string | null;
    idInstituicao?: string | null;
    arquivoImagem?: File | null;
    imagemUrl?: string | null;
}

export interface Evento {
    idEvento: string;
    nome: string;
    descricao: string;
    dataEvento: string;
    imagemUrl?: string | null;
    idTipoEvento?: string | null;
    idTipoEventoNavigation?: TipoEvento | null;
    tipoEvento?: TipoEvento | null;
    idInstituicao?: string | null;
    idInstituicaoNavigation?: Instituicao | null;
}

export interface Usuario {
    idUsuario: string;
    nome: string;
    email: string;
    idTipoUsuario?: string;
    idTipoUsuarioNavigation?: TipoUsuario | null;
}

export interface UsuarioPayload {
    nome: string;
    email: string;
    senha?: string;
    idTipoUsuario?: string | null;
}

export interface Comentario {
    idComentario: string;
    descricao: string;
    dataComentario: string;
    exibe?: boolean;
    idEvento: string;
    idUsuario?: string | null;
    idUsuarioNavigation?: Usuario | null;
    usuario?: Usuario;
    evento?: Evento;
}

export interface ComentarioPayload {
    descricao: string;
    idEvento: string;
    idUsuario?: string | null;
}

export interface MensagemModeracao {
    mensagem: string;
    motivo?: string;
}

export interface Presenca {
    idPresenca: string;
    situacao: boolean;
    idEvento: string;
    idUsuario?: string | null;
    idEventoNavigation?: Evento | null;
    evento?: Evento;
}

export interface PresencaPayload {
    situacao: boolean;
    idEvento: string;
    idUsuario?: string | null;
}
