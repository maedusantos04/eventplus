
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

        if (!value) {
            return null;
        }

        const session = JSON.parse(value) as AuthSession;

        if (!session.token || !session.usuario?.idUsuario) {
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
    const [session, setSession] = useState<AuthSession | null>(
        () => readSession()
    );

    const initialSession = useRef(session);

    const [carregandoSessao, setCarregandoSessao] = useState(
        Boolean(session)
    );

    function persist(next: AuthSession | null) {
        setSession(next);

        if (next) {
            localStorage.setItem(
                SESSION_STORAGE_KEY,
                JSON.stringify(next)
            );
        } else {
            localStorage.removeItem(SESSION_STORAGE_KEY);
        }
    }

    async function atualizarUsuario() {
        if (!session) {
            return;
        }

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
    }

    async function login(payload: LoginPayload) {
        const loginResponse = await authService.login(payload);

        const baseSession: AuthSession = loginResponse;

        // Mantém os dados completos que vieram do login.
        persist(baseSession);

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
        } catch (error) {
            console.error(
                "Não foi possível atualizar os dados do usuário:",
                error
            );
        }
    }

    function logout() {
        persist(null);
    }

    useEffect(() => {
        const handleUnauthorized = () => {
            persist(null);
        };

        window.addEventListener(
            UNAUTHORIZED_EVENT,
            handleUnauthorized
        );

        return () => {
            window.removeEventListener(
                UNAUTHORIZED_EVENT,
                handleUnauthorized
            );
        };
    }, []);

    useEffect(() => {
        const restored = initialSession.current;

        if (!restored) {
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
            .catch((error) => {
                console.error(
                    "Não foi possível restaurar os dados do usuário:",
                    error
                );
            })
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
