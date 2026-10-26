import { useState } from "react";
import "./TipoUsuarioAdm.css";
import ilustracaoAdmin from "../../assets/admin-illustration.png";

function TipoUsuarioAdm() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("");
    const [senha, setSenha] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <div className="admin-container">
            {}
            <main className="admin-main">
                <h2>ADMINISTRAÇÃO USUÁRIO</h2>

                <div className="admin-form-section">
                    <div className="admin-illustration">
                        <img src={ilustracaoAdmin} alt="Ilustração de administração" />
                    </div>

                    <form onSubmit={handleSubmit} className="admin-form">
                        <input
                            type="text"
                            placeholder="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="form-group-row">
                            <select
                                value={tipoUsuario}
                                onChange={(e) => setTipoUsuario(e.target.value)}
                            >
                                <option value="" disabled hidden>Tipo de Usuário</option>
                                <option value="admin">Administrador</option>
                                <option value="comum">Comum</option>
                            </select>

                            <input
                                type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-cadastrar">Cadastrar</button>
                    </form>
                </div>
            </main>

            {}
            <section className="admin-list-section">
                <h2>LISTA USUÁRIOS</h2>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Tipo de Usuário</th>
                            <th>Editar</th>
                            <th>Deletar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {}
                        <tr>
                            <td>Marcos Santos</td>
                            <td>marcos@gmail.com</td>
                            <td>admin</td>
                            <td>
                                <button className="btn-icon" title="Editar">✏️</button>
                            </td>
                            <td>
                                <button className="btn-icon" title="Deletar">🗑️</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default TipoUsuarioAdm;