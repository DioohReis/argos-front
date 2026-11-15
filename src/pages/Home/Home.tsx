import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import CartaoCultura from '../../components/CartaoCultura/CartaoCultura'
import CartaoDoPonto from '../../components/CartaoDoPonto/CartaoDoPonto'
import CatalogoPragas from '../../components/CatalogoPragas/CatalogoPragas'
import NavegacaoDasPartes from '../../components/NavegacaoDasPartes/NavegacaoDasPartes'
import Nuvens from '../../components/Nuvens/Nuvens'
import PainelLavoura from '../../components/PainelLavoura/PainelLavoura'
import Revelar from '../../components/Revelar/Revelar'
import SeletorCultura from '../../components/SeletorCultura/SeletorCultura'
import { CULTURAS, FONTE_DA_PRODUCAO } from '../../data/culturas'
import { SOLOS } from '../../data/solos'
import { useCondicoes } from '../../hooks/useCondicoes'
import { useRolagemDireta } from '../../hooks/useRolagemDireta'
import type { Camada } from '../../types/condicoes'
import { descreverCamada } from '../../utils/descreverCamada'

// O mapa (e a biblioteca de mapas) chega num arquivo à parte: o texto da página aparece antes.
const MapaArgos = lazy(() => import('../../components/MapaArgos/MapaArgos'))

/** O vídeo da abertura: colheita de soja no Brasil, vista de drone. Uso livre, pela licença do Pexels. */
const VIDEO = {
    arquivo: '/videos/colheita-de-soja.mp4',
    capa: '/videos/colheita-de-soja.jpg',
    autor: 'Melquizedeque Almeida',
    pagina: 'https://www.pexels.com/video/aerial-view-of-soybean-harvest-in-brazil-32089142/',
}

/** As partes da página, na ordem em que aparecem: servem aos dois menus (o da abertura e o fixo, na lateral). */
const PARTES = [
    { id: 'inicio', nome: 'Início' },
    { id: 'mapa', nome: 'Mapa' },
    { id: 'lavouras', nome: 'Lavouras' },
    { id: 'pragas', nome: 'Pragas' },
]

/** As partes em que uma girada do mouse leva direto de uma para a outra: abertura, mapa e lavouras. */
const PARADAS = ['inicio', 'mapa', 'lavouras']

/** O título da abertura, uma linha por vez: em telas largas, cada linha começa mais à direita que a de cima. */
const TITULO = ['Aviso', 'antes do', 'problema']

const PILULA =
    'pointer-events-auto inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-[#FBF8F1]/60 px-7 text-lg font-semibold transition-colors hover:bg-[#FBF8F1] hover:text-[#14251A] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#F2B705]'

/** Três linhas finas de cima a baixo dividem a tela em colunas, como numa página de revista. */
function LinhasGuia() {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            <div className="linha-guia absolute inset-y-0 left-[16.66%] w-px bg-[#FBF8F1]/15" />
            <div className="linha-guia absolute inset-y-0 left-[54%] w-px bg-[#FBF8F1]/15 [animation-delay:150ms]" />
            <div className="linha-guia absolute inset-y-0 left-[91.66%] w-px bg-[#FBF8F1]/15 [animation-delay:300ms]" />
        </div>
    )
}

export default function Home() {
    // A lavoura em destaque no mapa. Os marcadores e o seletor mudam o mesmo estado.
    const [selecionada, setSelecionada] = useState(CULTURAS[0].slug)
    // A lavoura aberta: a câmera voa até ela e aparecem as camadas. Tudo aqui na Home.
    const [aberta, setAberta] = useState<string | null>(null)
    const [camada, setCamada] = useState<Camada>('cultura')
    // Sem internet as imagens não carregam: a página continua funcionando e avisa.
    const [semImagem, setSemImagem] = useState(false)
    // Quem pediu menos movimento no aparelho vê a foto da colheita no lugar do vídeo.
    const [semMovimento] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    // O mapa só é montado quando a pessoa chega perto dele na rolagem: a abertura carrega mais
    // leve, e a descida do planeta até o Brasil acontece na frente de quem está olhando.
    const secaoDoMapaRef = useRef<HTMLElement>(null)
    const [mapaPerto, setMapaPerto] = useState(false)
    useEffect(() => {
        const secao = secaoDoMapaRef.current
        if (!secao) return
        const observador = new IntersectionObserver(
            ([entrada]) => {
                if (!entrada.isIntersecting) return
                setMapaPerto(true)
                observador.disconnect()
            },
            { rootMargin: '0px 0px -25% 0px' },
        )
        observador.observe(secao)
        return () => observador.disconnect()
    }, [])

    useRolagemDireta(PARADAS)

    const culturaAberta = CULTURAS.find((cultura) => cultura.slug === aberta) ?? null
    const estado = useCondicoes(culturaAberta)
    const condicoes = estado.situacao === 'pronto' ? estado.condicoes : null
    const descricao = descreverCamada(
        camada,
        culturaAberta,
        condicoes,
        culturaAberta ? SOLOS[culturaAberta.slug] : undefined,
    )

    const abrir = useCallback((slug: string) => {
        setSelecionada(slug)
        setCamada('cultura')
        setAberta(slug)
    }, [])
    const voltar = useCallback(() => setAberta(null), [])
    const avisarSemImagem = useCallback(() => setSemImagem(true), [])
    const avisarComImagem = useCallback(() => setSemImagem(false), [])

    // A tecla Esc volta ao mapa do Brasil.
    useEffect(() => {
        if (!aberta) return
        const aoTeclar = (evento: KeyboardEvent) => {
            if (evento.key === 'Escape') voltar()
        }
        window.addEventListener('keydown', aoTeclar)
        return () => window.removeEventListener('keydown', aoTeclar)
    }, [aberta, voltar])

    return (
        <main className="bg-[#1B1408] font-sans text-[#1E1E1E]">
            <NavegacaoDasPartes partes={PARTES} />

            {/* Abertura em tela cheia: o vídeo da colheita ao fundo e o título grande por cima. Ela fica
                presa no alto da tela (sticky): ao rolar, as partes seguintes sobem por cima dela. */}
            <section
                id="inicio"
                className="sticky top-0 h-svh min-h-[44rem] overflow-hidden bg-[#1B1408] text-[#FBF8F1]"
            >
                {semMovimento ? (
                    <img src={VIDEO.capa} alt="" className="absolute inset-0 size-full object-cover" />
                ) : (
                    // O vídeo é só enfeite: sem som, em repetição, e escondido dos leitores de tela.
                    <video
                        aria-hidden="true"
                        src={VIDEO.arquivo}
                        poster={VIDEO.capa}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 size-full object-cover"
                    />
                )}

                {/* Escurece o vídeo por igual e mais à esquerda e embaixo, para os textos ficarem legíveis. */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#140E05]/45" />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-linear-to-r from-[#140E05]/60 to-transparent"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-[#140E05]/85 to-transparent"
                />
                <LinhasGuia />

                {/* Tudo o que está escrito na abertura fica nesta caixa: conforme a página rola, ela
                    sobe, encolhe um pouco e apaga (regra `.afasta-ao-rolar`, no CSS). */}
                <div className="afasta-ao-rolar absolute inset-0">
                {/* O alto da tela: a marca à esquerda e o lema na terceira coluna. */}
                <div className="absolute inset-x-0 top-0 flex items-start justify-between px-6 pt-8 md:px-12 md:pt-12">
                    <p className="entrada flex items-center gap-2.5 font-display text-2xl font-bold tracking-[0.08em] lowercase">
                        <span aria-hidden="true" className="grid size-6 grid-cols-2 gap-0.5">
                            <span className="rounded-tl-md bg-[#FBF8F1]" />
                            <span className="rounded-tr-md bg-[#F2B705]" />
                            <span className="col-span-2 rounded-b-md bg-[#FBF8F1]" />
                        </span>
                        Argos
                    </p>
                    <p
                        style={{ animationDelay: '200ms' }}
                        className="entrada text-right font-condensed text-xl leading-[1.05] font-semibold tracking-[0.04em] uppercase md:absolute md:left-[58%] md:text-left md:text-[2rem]"
                    >
                        De olho
                        <br />
                        na sua
                        <br />
                        roça
                    </p>
                </div>

                {/* O menu lateral: as partes da página, cada uma com o seu traço. */}
                <nav
                    aria-label="Partes da página"
                    className="absolute top-1/2 left-0 hidden -translate-y-1/2 flex-col gap-4 lg:flex"
                >
                    {PARTES.slice(1).map((parte, ordem) => (
                        <a
                            key={parte.id}
                            href={`#${parte.id}`}
                            style={{ animationDelay: `${500 + ordem * 90}ms` }}
                            className="entrada group flex items-center gap-5 text-lg font-semibold focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#F2B705]"
                        >
                            <span
                                aria-hidden="true"
                                className="ml-6 h-px w-8 bg-current opacity-70 transition-[width,margin,opacity] duration-300 group-hover:ml-0 group-hover:w-14 group-hover:opacity-100"
                            />
                            {parte.nome}
                        </a>
                    ))}
                </nav>

                {/* O título grande, em degraus, sobre o vídeo. */}
                <div className="absolute inset-x-6 top-[24%] md:inset-x-auto md:top-[23%] md:left-[19%]">
                    <h1
                        aria-label="Aviso antes do problema"
                        className="titulo-em-linhas font-display text-[3.4rem] leading-[0.95] font-bold uppercase md:text-[clamp(4rem,8.6vw,10.5rem)]"
                    >
                        {TITULO.map((linha, ordem) => (
                            <span
                                key={linha}
                                aria-hidden="true"
                                style={{ '--degrau': `${ordem * 7.5}vw` } as CSSProperties}
                                className="block overflow-hidden pb-[0.08em] md:ml-(--degrau)"
                            >
                                <span style={{ animationDelay: `${250 + ordem * 130}ms` }} className="block">
                                    {linha}
                                </span>
                            </span>
                        ))}
                    </h1>
                </div>

                {/* A base da tela: a frase e os botões na terceira coluna, o crédito do vídeo e o convite para rolar. */}
                <div className="absolute inset-x-6 bottom-10 md:inset-x-auto md:right-[10%] md:bottom-12 md:left-[58%]">
                    <p style={{ animationDelay: '750ms' }} className="entrada max-w-sm text-lg leading-snug md:text-xl">
                        Chuva, seca e praga, do jeito mais simples de entender.
                    </p>
                    <div style={{ animationDelay: '900ms' }} className="entrada mt-5 flex flex-wrap gap-3">
                        <Link to="/triagem" className={PILULA}>
                            Começar
                        </Link>
                        <a href="#mapa" className={PILULA}>
                            Ver o mapa
                        </a>
                    </div>
                </div>
                <p className="absolute bottom-3 left-6 text-xs opacity-70 md:bottom-5 md:left-12">
                    Vídeo:{' '}
                    <a href={VIDEO.pagina} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                        {VIDEO.autor}, Pexels
                    </a>
                </p>
                <a
                    href="#mapa"
                    aria-label="Ir para o mapa"
                    className="absolute right-[3.2%] bottom-12 hidden h-9 w-5.5 justify-center rounded-full border border-[#FBF8F1]/70 pt-1.5 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#F2B705] md:flex"
                >
                    <span aria-hidden="true" className="rodinha h-2 w-0.5 rounded-full bg-[#FBF8F1]" />
                </a>
                </div>
            </section>

            {/* As partes seguintes ficam numa folha de cantos arredondados, que sobe por cima da abertura. */}
            <div className="relative z-10 overflow-hidden rounded-t-[2.5rem] bg-[#FBF8F1] shadow-[0_-30px_70px_rgb(0_0_0/0.55)]">
            {/* O mapa: o Brasil em imagem de satélite, com as seis lavouras. */}
            <section
                id="mapa"
                ref={secaoDoMapaRef}
                aria-label="Mapa das lavouras"
                className="relative h-svh min-h-[50rem] overflow-hidden bg-[#01060C] text-[#FBF8F1]"
            >
                {mapaPerto && (
                    <Suspense fallback={null}>
                        <MapaArgos
                            culturas={CULTURAS}
                            selecionada={selecionada}
                            aberta={culturaAberta}
                            camada={camada}
                            filtro={culturaAberta ? descricao.filtro : null}
                            curvas={culturaAberta ? descricao.curvas : null}
                            zona={culturaAberta ? descricao.zona : null}
                            cartao={
                                culturaAberta && descricao.cartao.length > 0 ? (
                                    <CartaoDoPonto itens={descricao.cartao} />
                                ) : undefined
                            }
                            onSelecionar={setSelecionada}
                            onAbrir={abrir}
                            onCamada={setCamada}
                            onFalhou={avisarSemImagem}
                            onCarregou={avisarComImagem}
                        />
                    </Suspense>
                )}

                <Nuvens
                    visivel={culturaAberta !== null && camada === 'clima'}
                    chanceDeChuva={condicoes?.clima.chanceDeChuva ?? 0}
                />

                {/* Escurece o alto e a base da imagem, para os textos ficarem legíveis. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-linear-to-b from-[#01060C]/80 to-transparent"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-96 bg-linear-to-t from-[#01060C]/95 via-[#01060C]/60 to-transparent"
                />
                <LinhasGuia />

                {culturaAberta ? (
                    // Lavoura aberta: o nome dela, o lugar e a volta ao mapa.
                    <div
                        key={culturaAberta.slug}
                        className="pointer-events-none absolute top-8 left-6 z-20 md:top-12 md:left-12"
                    >
                        <h2 className="titulo-em-linhas font-display text-5xl leading-none font-bold uppercase sm:text-6xl">
                            <span className="block overflow-hidden pb-1">
                                <span className="block">{culturaAberta.nome}</span>
                            </span>
                        </h2>
                        <p
                            style={{ animationDelay: '250ms' }}
                            className="entrada mt-2 font-condensed text-xl font-semibold tracking-[0.12em] uppercase"
                        >
                            {culturaAberta.municipio}, {culturaAberta.uf}
                        </p>
                        <button
                            type="button"
                            onClick={voltar}
                            style={{ animationDelay: '400ms' }}
                            className={`entrada mt-5 ${PILULA}`}
                        >
                            <span aria-hidden="true">←</span> Voltar ao mapa
                        </button>
                    </div>
                ) : (
                    // Brasil inteiro: o que é este mapa e como usar.
                    <Revelar className="pointer-events-none absolute top-8 left-6 z-20 max-w-xs md:top-12 md:left-12 md:max-w-sm">
                        <p className="font-condensed text-lg font-semibold tracking-[0.16em] text-[#F2B705] uppercase">
                            02 · O mapa
                        </p>
                        <h2 className="mt-1 font-display text-4xl leading-[1.02] font-bold uppercase sm:text-5xl">
                            Escolha a lavoura
                        </h2>
                        <p className="mt-3 text-lg leading-snug">
                            Toque num ponto do mapa ou use as setas. Depois veja o clima, o ar, a umidade e o solo do
                            lugar.
                        </p>
                    </Revelar>
                )}

                {semImagem && !culturaAberta && (
                    <p className="absolute inset-x-8 top-1/2 text-center text-lg" role="status">
                        Sem internet para carregar o mapa. Escolha a lavoura pelas setas, aqui embaixo.
                    </p>
                )}

                {/* A base da tela: o painel da lavoura aberta ou o seletor de lavouras. */}
                <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-9 md:pb-11">
                    {culturaAberta ? (
                        <PainelLavoura
                            cultura={culturaAberta}
                            camada={camada}
                            descricao={descricao}
                            situacao={estado.situacao}
                            mensagemDeErro={estado.situacao === 'erro' ? estado.mensagem : ''}
                            semImagem={semImagem}
                            onCamada={setCamada}
                        />
                    ) : (
                        <SeletorCultura
                            culturas={CULTURAS}
                            selecionada={selecionada}
                            onSelecionar={setSelecionada}
                            onAbrir={abrir}
                        />
                    )}
                </div>
            </section>

            {/* As mesmas seis lavouras em lista: mais fácil de tocar no celular e de ler com leitor de tela. */}
            <section id="lavouras" className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
                <Revelar>
                    <p className="titulo-de-parte font-condensed text-lg font-semibold tracking-[0.16em] text-[#1F6B3A] uppercase">
                        03 · Lavouras
                    </p>
                    <h2 className="mt-2 font-display text-4xl leading-[1.02] font-bold text-[#14251A] uppercase sm:text-6xl">
                        Seis lavouras,
                        <br />
                        seis lugares do Brasil
                    </h2>
                    <p className="mt-5 max-w-2xl text-lg leading-relaxed sm:text-xl">
                        Cada ponto do mapa é a cidade que mais colhe aquela lavoura no país. Escolha uma para abrir o guia.
                    </p>
                </Revelar>
                <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {CULTURAS.map((cultura, ordem) => (
                        <li key={cultura.slug}>
                            <Revelar atraso={(ordem % 3) * 90}>
                                <CartaoCultura cultura={cultura} />
                            </Revelar>
                        </li>
                    ))}
                </ul>
                <p className="mt-6 text-base text-[#1E1E1E]/75">
                    Fonte:{' '}
                    <a
                        href={FONTE_DA_PRODUCAO.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-[#1565C0] underline underline-offset-4"
                    >
                        {FONTE_DA_PRODUCAO.nome}, {FONTE_DA_PRODUCAO.ano}
                    </a>
                    .
                </p>
            </section>

            {/* O catálogo de pragas: como é cada bicho, o estrago que deixa e onde procurar. */}
            <section id="pragas" className="rounded-t-[2.5rem] bg-[#0F2318] text-[#FBF8F1]">
                <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
                    <Revelar>
                        <p className="titulo-de-parte font-condensed text-lg font-semibold tracking-[0.16em] text-[#F2B705] uppercase">
                            04 · Catálogo de pragas
                        </p>
                        <h2 className="mt-2 font-display text-4xl leading-[1.02] font-bold uppercase sm:text-6xl">
                            Que bicho
                            <br />é esse?
                        </h2>
                        <p className="mt-5 max-w-2xl text-lg leading-relaxed sm:text-xl">
                            Veja como é cada praga, o estrago que ela deixa na planta e em que parte procurar. Escolha a
                            lavoura para ver só as pragas dela.
                        </p>
                    </Revelar>
                    <div className="mt-9">
                        <CatalogoPragas escuro />
                    </div>
                </div>
            </section>
            </div>
        </main>
    )
}
