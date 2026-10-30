import {
    useEffect,
    useRef,
    useState,
    type PropsWithChildren
} from "react";

import type { AuthSession, LoginPayload } from "../types/api";

import {
    SESSION_STORAGE_KEY,
    UNAUTHORIZED_EVENT
} from "../services/api";

import {
    authService,
    usuarioService
} from "../services/eventPlusservice";

import { AuthContext } from "./auth";

function readSession(): AuthSession | null {
    try {
        const value = localStorage.getItem(SESSION_STORAGE_KEY);
        if (!value) return null;

        const session = JSON.parse(value) as AuthSession;

        if (!session.token || !session.usuario?.idUsuario) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            return null;
        }

        if (session.expiracao && new Date(session.expiracao).getTime() <= Date.now()) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            return null;
        }

        return session;
    } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
    }
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<AuthSession | null>(() => readSession());
    const initialSession = useRef(session);
    const [carregandoSessao, setCarregandoSessao] = useState(Boolean(session));

    function persist(next: AuthSession | null) {
        setSession(next);

        if (next) {
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
        } else {
            localStorage.removeItem(SESSION_STORAGE_KEY);
        }
    }

    async function atualizarUsuario() {
        if (!session?.usuario?.idUsuario) {
            return;
        }

        try {
            const usuarioAtualizado = await usuarioService.buscar(
                session.usuario.idUsuario
            );

            persist({
                ...session,
                usuario: {
                    ...usuarioAtualizado,
                    idTipoUsuarioNavigation:
                        usuarioAtualizado.idTipoUsuarioNavigation ??
                        session.usuario.idTipoUsuarioNavigation
                }
            });
        } catch {
            // Silencia erro se não for possível atualizar dados secundários
        }
    }

    async function login(payload: LoginPayload) {
        const loginResponse = await authService.login(payload);
        const baseSession: AuthSession = loginResponse;

        persist(baseSession);

        if (loginResponse.usuario?.idUsuario) {
            try {
                const usuarioAtualizado = await usuarioService.buscar(
                    loginResponse.usuario.idUsuario
                );

                persist({
                    ...baseSession,
                    usuario: {
                        ...usuarioAtualizado,
                        idTipoUsuarioNavigation:
                            usuarioAtualizado.idTipoUsuarioNavigation ??
                            baseSession.usuario.idTipoUsuarioNavigation
                    }
                });
            } catch {
                // Mantém baseSession se busca detalhada falhar
            }
        }
    }

    function logout() {
        persist(null);
    }

    useEffect(() => {
        const handleUnauthorized = () => {
            setSession(null);
        };

        window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
        return () => {
            window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
        };
    }, []);

    useEffect(() => {
        const restored = initialSession.current;

        if (!restored?.usuario?.idUsuario) {
            setCarregandoSessao(false);
            return;
        }

        usuarioService
            .buscar(restored.usuario.idUsuario)
            .then((usuarioAtualizado) => {
                const next: AuthSession = {
                    ...restored,
                    usuario: {
                        ...usuarioAtualizado,
                        idTipoUsuarioNavigation:
                            usuarioAtualizado.idTipoUsuarioNavigation ??
                            restored.usuario.idTipoUsuarioNavigation
                    }
                };

                persist(next);
            })
            .catch(() => undefined)
            .finally(() => {
                setCarregandoSessao(false);
            });
    }, []);

    const perfil = (
        session?.usuario?.idTipoUsuarioNavigation?.tituloTipoUsuario ??
        session?.usuario?.idTipoUsuarioNavigation?.titulo ??
        ""
    )
        .trim()
        .toLowerCase();

    return (
        <AuthContext.Provider
            value={{
                session,
                usuario: session?.usuario ?? null,
                perfil,
                autenticado: Boolean(session),
                carregandoSessao,
                login,
                logout,
                atualizarUsuario
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
