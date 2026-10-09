    import "./Eventos.css"

    import Header from "../../components/header/Header"
    import Footer from "../../components/footer/Footer"
    import type { Evento } from "../../types/api";
    import { useEffect, useState } from "react"
    import { eventoService } from "../../services/eventPlusservice";
    import CardEvento from "../../components/cardEvento/CardEvento";


    function Eventos() {
        const [eventos, setEventos] = useState<Evento[]>([])

        useEffect(() => {
            async function carregar() {
                const dados = await eventoService.listar();

                setEventos(dados);
            }
            void carregar();
        }, [])



        // const [data, setData] = useState<Date>(new Date()) // Relógio

        // useEffect(() => {
        //     const timerId = setInterval(() => {
        //         setData(new Date());
        //     }, 1000)

        //     return () => {
        //         clearInterval(timerId);
        //     };
        // }, [])

        return (
            <>
            <Header />
            <main className="catalogo-eventos">
                <h1>Catálogo de Eventos</h1>
                <div>
                    {eventos.map((evento) => (
                        <CardEvento
                        key={evento.idEvento}
                        id={evento.idEvento}
                        imagem={evento.imagemUrl}
                        categoria={evento.idTipoEventoNavigation?.titulo}
                        titulo={evento.nome}
                        descricao={evento.descricao}/>
                    ))}
                </div>
                
            </main>
            <Footer/>
            </>

            
        )
    }

    export default Eventos;