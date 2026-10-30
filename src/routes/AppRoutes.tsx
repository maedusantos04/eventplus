import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home/Home";
import Eventos from "../pages/Eventos/Eventos";
import DetalhesEvento from "../pages/DetalhesEvento/DetalhesEvento";
import Login from "../pages/Login/Login";
import Usuarios from "../pages/Usuarios/Usuarios";
import CadastroEvento from "../pages/CadastroEvento/CadastroEvento";
import TipoEventoAdm from "../pages/TipoEventoAdm/TipoEventoAdm";
import TipoUsuarioAdm from "../pages/TipoUsuarioAdm/TipoUsuarioAdm";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/eventos/:id" element={<DetalhesEvento />} />
            <Route path="/login" element={<Login />} />

            <Route
                path="/cadastroEvento"
                element={
                    <ProtectedRoute role="organizador">
                        <CadastroEvento />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/usuarios"
                element={
                    <ProtectedRoute role="administrador">
                        <Usuarios />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tipoevento"
                element={
                    <ProtectedRoute role="administrador">
                        <TipoEventoAdm />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tipousuario"
                element={
                    <ProtectedRoute role="administrador">
                        <TipoUsuarioAdm />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}

export default AppRoutes;
