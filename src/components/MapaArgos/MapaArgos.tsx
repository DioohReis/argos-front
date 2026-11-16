import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Map as MapaDeSatelite } from 'maplibre-gl'
import type { ExpressionSpecification, RasterDEMSourceSpecification, StyleSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { CONTORNO_DO_BRASIL, LIMITES_DO_BRASIL } from '../../data/contornoBrasil'
import type { Camada, PaletaDeCurvas } from '../../types/condicoes'
import type { Cultura } from '../../types/cultura'
import { CAMADAS } from '../../utils/descreverCamada'
import IconeCamada from '../IconeCamada/IconeCamada'
import IconeCultura from '../IconeCultura/IconeCultura'

interface MapaArgosProps {
    culturas: Cultura[]
    /** Lavoura em destaque (o `slug`). */
    selecionada: string
    /** Lavoura aberta: a câmera voa até ela. `null` mostra o Brasil inteiro. */
    aberta: Cultura | null
    /** Vista da lavoura aberta: muda o ângulo da câmera e as cores da imagem. */
    camada: Camada
    /** Névoa de cor por cima da imagem (qualidade do ar). */
    filtro: { cor: string; forca: number } | null
    /** Curvas de nível coloridas no lugar da imagem: o azul da umidade e o verde do solo. */
    curvas: PaletaDeCurvas | null
    /**
     * Cor da área plantada na camada de umidade. O terreno em volta continua verde; só a área da
     * lavoura ganha esta cor (azul no solo úmido), com as curvas e os detalhes aparecendo por baixo.
     */
    zona: string | null
    /** Cartão que aparece acima do marcador da lavoura aberta (a temperatura, por exemplo). */
    cartao?: ReactNode
    onSelecionar: (slug: string) => void
    onAbrir: (slug: string) => void
    /** Troca a camada: cada pino em volta da lavoura aberta é uma camada. */
    onCamada: (camada: Camada) => void
    /** Avisa que as imagens não carregaram (sem internet, por exemplo). */
    onFalhou: () => void
    /** Avisa que as imagens chegaram, mesmo que atrasadas (a aba estava em segundo plano, por exemplo). */
    onCarregou: () => void
}

/** Imagem real de satélite, gratuita e sem chave: o mosaico sem nuvens do Sentinel-2, do planeta inteiro. */
const SATELITE = 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg'
/** Altitudes do terreno (Terrain Tiles, dados abertos): dão o relevo em 3D, a sombra dos morros e as curvas. */
const ALTITUDES = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
const FONTE_DE_ALTITUDES: RasterDEMSourceSpecification = {
    type: 'raster-dem',
    tiles: [ALTITUDES],
    tileSize: 256,
    maxzoom: 12,
    encoding: 'terrarium',
}

const MUNDO: [number, number][] = [
    [-180, -85],
    [180, -85],
    [180, 85],
    [-180, 85],
    [-180, -85],
]
const ESPACO = '#17110D'

const ESTILO: StyleSpecification = {
    version: 8,
    // O planeta aparece redondo de longe e vira mapa plano sozinho quando a câmera chega perto.
    projection: { type: 'globe' },
    sky: { 'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 0.6, 7, 0] },
    sources: {
        satelite: { type: 'raster', tiles: [SATELITE], tileSize: 256, maxzoom: 14 },
        // Cada uso das altitudes tem a sua fonte: a biblioteca prepara os dados de um jeito para cada um.
        sombra: FONTE_DE_ALTITUDES,
        relevo: FONTE_DE_ALTITUDES,
        // As curvas usam altitudes menos detalhadas: o terreno fica mais liso e as linhas saem limpas, sem chuvisco.
        curvas: { ...FONTE_DE_ALTITUDES, maxzoom: 10 },
        brasil: {
            type: 'geojson',
            data: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [CONTORNO_DO_BRASIL] } },
        },
        // O mundo inteiro com um buraco no formato do Brasil: escurece os vizinhos e o mar.
        vizinhos: {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: { type: 'Polygon', coordinates: [MUNDO, CONTORNO_DO_BRASIL] },
            },
        },
    },
    layers: [
        { id: 'fundo', type: 'background', paint: { 'background-color': ESPACO } },
        {
            id: 'satelite',
            type: 'raster',
            source: 'satelite',
            // De longe a imagem ganha um pouco de cor e contraste; de perto fica como o satélite fotografou.
            paint: {
                'raster-saturation': ['interpolate', ['linear'], ['zoom'], 4, 0.25, 8, 0],
                'raster-contrast': ['interpolate', ['linear'], ['zoom'], 4, 0.15, 8, 0],
                'raster-fade-duration': 400,
            },
        },
        {
            // Curvas de nível: cada faixa de altitude ganha um tom, com uma linha escura entre elas.
            // Só existem de perto e começam invisíveis; a camada de umidade ou de solo é que as mostra.
            id: 'curvas',
            type: 'color-relief',
            source: 'curvas',
            minzoom: 9,
            paint: {
                'color-relief-opacity': 0,
                'color-relief-color': ['interpolate', ['linear'], ['elevation'], 0, ESPACO, 3000, ESPACO],
            },
        },
        {
            id: 'sombra',
            type: 'hillshade',
            source: 'sombra',
            minzoom: 8,
            paint: { 'hillshade-exaggeration': 0.4, 'hillshade-shadow-color': '#17110D' },
        },
        {
            id: 'vizinhos',
            type: 'fill',
            source: 'vizinhos',
            paint: {
                'fill-color': ESPACO,
                'fill-opacity': ['interpolate', ['linear'], ['zoom'], 4.5, 0.5, 7, 0],
            },
        },
        {
            id: 'contorno',
            type: 'line',
            source: 'brasil',
            paint: {
                'line-color': '#E6DAC6',
                'line-width': 1.3,
                'line-opacity': ['interpolate', ['linear'], ['zoom'], 4.5, 0.8, 8, 0],
            },
        },
    ],
}

/** Ponto de vista de cada camada: altura (zoom), inclinação e para onde a câmera olha. */
const CAMERAS: Record<Camada, { zoom: number; pitch: number; bearing: number }> = {
    // A lavoura vista de cima, como numa foto aérea.
    cultura: { zoom: 12, pitch: 0, bearing: 0 },
    clima: { zoom: 11.4, pitch: 45, bearing: 0 },
    ar: { zoom: 11.8, pitch: 62, bearing: -28 },
    // Umidade e solo usam o mesmo ponto de vista, em 3D: entre uma e outra a câmera não se mexe,
    // só a cor da área plantada muda.
    umidade: { zoom: 12.2, pitch: 58, bearing: 150 },
    solo: { zoom: 12.2, pitch: 58, bearing: 150 },
}

/** Quantos metros de altitude cada faixa das curvas cobre, e quantas faixas há acima e abaixo do lugar. */
const METROS_POR_FAIXA = 10
const FAIXAS_PARA_CADA_LADO = 16

/** Mistura duas cores escritas como "#RRGGBB": `quanto` vai de 0 (só a primeira) a 1 (só a segunda). */
function misturar(primeira: string, segunda: string, quanto: number) {
    const canal = (cor: string, inicio: number) => parseInt(cor.slice(inicio, inicio + 2), 16)
    const partes = [1, 3, 5].map((inicio) =>
        Math.round(canal(primeira, inicio) + (canal(segunda, inicio) - canal(primeira, inicio)) * quanto),
    )
    return `rgb(${partes.join(', ')})`
}

/**
 * Monta as cores das curvas de nível em volta da altitude do lugar. Os pontos baixos ficam no tom
 * escuro da paleta e os altos no tom claro; entre uma faixa e a seguinte entra uma linha fina e escura.
 */
function coresDasCurvas(altitude: number, paleta: PaletaDeCurvas): ExpressionSpecification {
    const base = Math.round(altitude / METROS_POR_FAIXA) * METROS_POR_FAIXA
    const primeira = base - FAIXAS_PARA_CADA_LADO * METROS_POR_FAIXA
    const total = FAIXAS_PARA_CADA_LADO * 2
    const paradas: (number | string)[] = []
    for (let faixa = 0; faixa < total; faixa++) {
        const inicio = primeira + faixa * METROS_POR_FAIXA
        const pe = misturar(paleta.escuro, paleta.claro, faixa / total)
        const topo = misturar(paleta.escuro, paleta.claro, (faixa + 0.85) / total)
        // A linha fica entre dois metros inteiros: as altitudes vêm em metros inteiros, e uma área
        // plana que caísse bem em cima da linha viraria uma mancha escura.
        paradas.push(inicio + 0.2, paleta.linha)
        paradas.push(inicio + 0.7, paleta.linha)
        paradas.push(inicio + 0.9, pe)
        paradas.push(inicio + METROS_POR_FAIXA + 0.1, topo)
    }
    paradas.push(primeira + total * METROS_POR_FAIXA + 0.15, paleta.claro)
    return ['interpolate', ['linear'], ['elevation'], ...paradas] as ExpressionSpecification
}

/** Na chegada, a câmera começa longe, com o planeta inteiro, e desce até o Brasil. */
const SEGUNDOS_DA_CHEGADA = 4.5
const ZOOM_DA_CHEGADA = 1.6
const SEGUNDOS_DO_VOO = 7
const SEGUNDOS_DA_VOLTA = 3.5
const SEGUNDOS_ENTRE_CAMADAS = 2.6
const ESPERA_PELAS_IMAGENS = 14000

/** Margens do Brasil inteiro: no celular, entre o texto de cima e o seletor; no desktop, no meio da tela. */
function margensDoBrasil(largura: number) {
    return largura < 768
        ? { top: 230, bottom: 240, left: 8, right: 8 }
        : { top: 70, bottom: 250, left: Math.round(largura * 0.2), right: Math.round(largura * 0.2) }
}
/** O nome de cada camada, para quem usa leitor de tela. */
const NOMES_DAS_CAMADAS: Record<Camada, string> = {
    cultura: 'Lavoura predominante',
    clima: 'Clima',
    ar: 'Ar e altitude',
    umidade: 'Umidade do solo',
    solo: 'Fertilidade do solo',
}

/**
 * Onde fica o pino de cada camada, em pixels a partir do centro da lavoura na tela (x para a
 * direita, y para baixo). O pino da lavoura marca o lugar; os outros quatro ficam em roda dele,
 * sempre à mesma distância na tela, perto ou longe que a câmera esteja.
 */
const PINOS: Record<Camada, { x: number; y: number }> = {
    cultura: { x: 0, y: 0 },
    clima: { x: 250, y: -90 },
    ar: { x: -250, y: -90 },
    umidade: { x: 340, y: 50 },
    solo: { x: -340, y: 50 },
}
/** O raio da área plantada que a camada de umidade pinta, em metros. É uma aproximação. */
const RAIO_DA_AREA_PLANTADA = 4500
/** Quantos metros de chão cabem num pixel da tela, nesta latitude e nesta altura da câmera. */
const metrosPorPixel = (latitude: number, zoom: number) =>
    (78271.52 * Math.cos((latitude * Math.PI) / 180)) / 2 ** zoom

/** No celular a roda de pinos encolhe, para caber na tela. */
const escalaDosPinos = (largura: number) => (largura < 768 ? 0.4 : 1)

/** Com a lavoura aberta, o painel ocupa a parte de baixo: o lugar fica no meio do que sobra. */
const margensDaLavoura = (largura: number) =>
    // No celular o nome da lavoura e o botão de voltar ocupam o alto: a margem de cima é maior, para
    // os pinos não baterem neles.
    largura < 768 ? { top: 250, left: 0, right: 0, bottom: 360 } : { top: 60, left: 0, right: 0, bottom: 300 }

/** Movimento que sai devagar, acelera no meio e chega devagar. */
const suave = (tempo: number) => (tempo < 0.5 ? 4 * tempo ** 3 : 1 - (-2 * tempo + 2) ** 3 / 2)

const semMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * O mapa do Argos: o Brasil em imagem real de satélite, com o mar em volta e um marcador para cada
 * lavoura. Ao abrir uma lavoura, a câmera voa até ela, o terreno ganha relevo em 3D e cada camada
 * (clima, ar, umidade, solo) muda o ângulo e as cores.
 */
export default function MapaArgos({
    culturas,
    selecionada,
    aberta,
    camada,
    filtro,
    curvas,
    zona,
    cartao,
    onSelecionar,
    onAbrir,
    onCamada,
    onFalhou,
    onCarregou,
}: MapaArgosProps) {
    const areaRef = useRef<HTMLDivElement>(null)
    const mapaRef = useRef<MapaDeSatelite | null>(null)
    const [pronto, setPronto] = useState(false)
    // Os marcadores só aparecem quando a câmera termina de descer até o Brasil.
    const [chegou, setChegou] = useState(false)
    const chegouRef = useRef(false)
    // A camada escolhida agora e se o voo de abertura ainda está no ar: quem troca de camada no
    // meio do voo vê a câmera terminar de chegar e só então ir para o ângulo da camada nova.
    const camadaRef = useRef(camada)
    const voandoRef = useRef(false)
    useEffect(() => {
        camadaRef.current = camada
    }, [camada])
    const [posicoes, setPosicoes] = useState<Record<string, { x: number; y: number }>>({})
    // Altura (zoom) e inclinação da câmera: dão o tamanho da área plantada na tela.
    const [camera, setCamera] = useState({ zoom: 0, inclinacao: 0 })
    // Os pinos das camadas, em volta da lavoura aberta.
    const [pinos, setPinos] = useState<Partial<Record<Camada, { x: number; y: number }>>>({})
    // A lavoura em que a câmera já pousou: os pinos só aparecem depois do voo.
    const [pousada, setPousada] = useState<string | null>(null)
    const abertaRef = useRef(aberta)
    const posicionarRef = useRef<() => void>(() => {})
    useEffect(() => {
        abertaRef.current = aberta
        posicionarRef.current()
    }, [aberta])

    // Cria o mapa uma vez, com o Brasil inteiro na tela.
    useEffect(() => {
        const area = areaRef.current
        if (!area) return
        const mapa = new MapaDeSatelite({
            container: area,
            style: ESTILO,
            bounds: LIMITES_DO_BRASIL,
            fitBoundsOptions: { padding: margensDoBrasil(area.clientWidth) },
            // É uma animação guiada, não um mapa para arrastar: a rolagem da página continua livre.
            interactive: false,
            attributionControl: false,
            maxPitch: 70,
        })
        mapaRef.current = mapa

        // Os marcadores são botões por cima do mapa: a cada movimento da câmera, eles acompanham.
        const posicionar = () => {
            const novas: Record<string, { x: number; y: number }> = {}
            for (const cultura of culturas) {
                const ponto = mapa.project([cultura.longitude, cultura.latitude])
                novas[cultura.slug] = { x: ponto.x, y: ponto.y }
            }
            setPosicoes(novas)
            setCamera({ zoom: mapa.getZoom(), inclinacao: mapa.getPitch() })

            const lavoura = abertaRef.current
            if (!lavoura) return
            const centro = mapa.project([lavoura.longitude, lavoura.latitude])
            const escala = escalaDosPinos(mapa.getContainer().clientWidth)
            const novos: Partial<Record<Camada, { x: number; y: number }>> = {}
            for (const umaCamada of CAMADAS) {
                novos[umaCamada] = {
                    x: centro.x + PINOS[umaCamada].x * escala,
                    y: centro.y + PINOS[umaCamada].y * escala,
                }
            }
            setPinos(novos)
        }
        posicionarRef.current = posicionar
        mapa.on('move', posicionar)
        mapa.on('resize', posicionar)

        // A chegada: o mapa nasce já enquadrado no Brasil, e a câmera recua até mostrar o planeta.
        // Quando as imagens carregam, ela desce de volta até o país (o efeito logo abaixo cuida disso).
        if (!semMovimento()) mapa.jumpTo({ zoom: Math.min(ZOOM_DA_CHEGADA, mapa.getZoom()) })

        const espera = window.setTimeout(onFalhou, ESPERA_PELAS_IMAGENS)
        mapa.once('idle', () => {
            window.clearTimeout(espera)
            onCarregou()
            posicionar()
            setPronto(true)
        })
        return () => {
            window.clearTimeout(espera)
            mapaRef.current = null
            mapa.remove()
        }
        // O mapa é criado uma vez só; as lavouras e os avisos não mudam depois.
        // oxlint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Abre a lavoura (voa até ela) ou volta ao Brasil inteiro.
    useEffect(() => {
        const mapa = mapaRef.current
        if (!mapa || !pronto) return
        const parado = semMovimento()
        // Para o movimento que estiver em curso antes de combinar o que fazer quando o novo terminar.
        mapa.stop()
        const mostrarMarcadores = () => {
            chegouRef.current = true
            setChegou(true)
        }
        if (aberta) {
            const destino = camada
            const aoPousar = () => {
                voandoRef.current = false
                mostrarMarcadores()
                setPousada(aberta.slug)
                if (camadaRef.current === destino) return
                mapa.easeTo({
                    ...CAMERAS[camadaRef.current],
                    duration: parado ? 0 : SEGUNDOS_ENTRE_CAMADAS * 1000,
                    easing: suave,
                    essential: true,
                })
            }
            voandoRef.current = true
            mapa.once('moveend', aoPousar)
            mapa.setTerrain({ source: 'relevo', exaggeration: 1.6 })
            mapa.flyTo({
                center: [aberta.longitude, aberta.latitude],
                ...CAMERAS[destino],
                padding: margensDaLavoura(mapa.getContainer().clientWidth),
                duration: parado ? 0 : SEGUNDOS_DO_VOO * 1000,
                curve: 1.25,
                essential: true,
            })
            return () => {
                mapa.off('moveend', aoPousar)
                voandoRef.current = false
            }
        }
        mapa.setTerrain(null)
        // Na primeira vez é a chegada, do planeta até o Brasil; depois, a volta de uma lavoura.
        // Os marcadores aparecem quando a câmera para.
        const segundos = chegouRef.current ? SEGUNDOS_DA_VOLTA : SEGUNDOS_DA_CHEGADA
        mapa.once('moveend', mostrarMarcadores)
        mapa.fitBounds(LIMITES_DO_BRASIL, {
            padding: margensDoBrasil(mapa.getContainer().clientWidth),
            pitch: 0,
            bearing: 0,
            duration: parado ? 0 : segundos * 1000,
            essential: true,
        })
        // A camada não entra aqui de propósito: ela só vale como ponto de chegada do voo.
        // oxlint-disable-next-line react-hooks/exhaustive-deps
    }, [aberta, pronto])

    // Umidade e solo: as curvas de nível cobrem a imagem, na cor da leitura (azul ou verde).
    useEffect(() => {
        const mapa = mapaRef.current
        if (!mapa || !pronto) return
        const mostrar = aberta !== null && curvas !== null
        if (mostrar) mapa.setPaintProperty('curvas', 'color-relief-color', coresDasCurvas(aberta.altitude, curvas))
        mapa.setPaintProperty('curvas', 'color-relief-opacity', mostrar ? 1 : 0)
        // Com as curvas, a sombra dos morros fica mais forte, para dar volume às faixas.
        mapa.setPaintProperty('sombra', 'hillshade-exaggeration', mostrar ? 0.65 : 0.4)
    }, [aberta, curvas, pronto])

    // Troca de camada: a câmera continua no centro da lavoura e muda de altura e de ângulo.
    useEffect(() => {
        const mapa = mapaRef.current
        if (!mapa || !pronto) return
        // Na abertura quem move a câmera é o voo; aqui é só a troca entre camadas, com a lavoura já aberta.
        if (!aberta || voandoRef.current) return
        mapa.easeTo({
            ...CAMERAS[camada],
            duration: semMovimento() ? 0 : SEGUNDOS_ENTRE_CAMADAS * 1000,
            easing: suave,
            essential: true,
        })
        // A lavoura aberta não entra aqui de propósito: quando ela muda, o voo acima cuida da câmera.
        // oxlint-disable-next-line react-hooks/exhaustive-deps
    }, [camada, pronto])

    // Com o Brasil inteiro na tela, o enquadramento acompanha o tamanho da janela.
    useEffect(() => {
        const mapa = mapaRef.current
        if (!mapa || !pronto || aberta) return
        const reenquadrar = () =>
            mapa.fitBounds(LIMITES_DO_BRASIL, { padding: margensDoBrasil(mapa.getContainer().clientWidth), duration: 0 })
        mapa.on('resize', reenquadrar)
        return () => {
            mapa.off('resize', reenquadrar)
        }
    }, [aberta, pronto])

    return (
        <div className="absolute inset-0">
            {/* A biblioteca de mapas troca a posição do próprio contêiner para `relative`; por isso ele
                ocupa o espaço com altura e largura, e quem fica `absolute` é a caixa de fora. */}
            <div
                className={`absolute inset-0 transition-opacity duration-1000 ${pronto ? 'opacity-100' : 'opacity-0'}`}
            >
                <div ref={areaRef} role="img" aria-label="Mapa do Brasil em imagem de satélite" className="size-full" />
            </div>

            {/* Filtro de cor: multiplica a imagem sem cor pelo azul da umidade ou pelo verde do solo. */}
            <div
                aria-hidden="true"
                style={{ backgroundColor: filtro?.cor ?? 'transparent', opacity: filtro ? filtro.forca : 0 }}
                className="pointer-events-none absolute inset-0 mix-blend-multiply transition-[opacity,background-color] duration-1000"
            />
            {/* Um brilho da mesma cor por cima devolve a luz que a multiplicação tira. */}
            <div
                aria-hidden="true"
                style={{ backgroundColor: filtro?.cor ?? 'transparent', opacity: filtro ? filtro.forca * 0.28 : 0 }}
                className="pointer-events-none absolute inset-0 mix-blend-screen transition-[opacity,background-color] duration-1000"
            />

            {/* A área plantada na camada de umidade. É uma elipse na cor da leitura, misturada com o mapa
                no modo "color": troca a cor do terreno (o verde vira azul) e deixa passar o claro e o
                escuro, então as curvas e o relevo continuam aparecendo dentro dela. A borda é esfumada.
                Ela surge depois que a câmera chega, crescendo a partir do centro da lavoura. */}
            {aberta &&
                posicoes[aberta.slug] &&
                (() => {
                    const raio = RAIO_DA_AREA_PLANTADA / metrosPorPixel(aberta.latitude, camera.zoom)
                    // Com a câmera inclinada, um círculo no chão aparece achatado na tela.
                    const achatado = Math.cos((camera.inclinacao * Math.PI) / 180)
                    const visivel = zona !== null && pousada === aberta.slug
                    return (
                        <div
                            aria-hidden="true"
                            style={{
                                left: posicoes[aberta.slug].x,
                                top: posicoes[aberta.slug].y,
                                width: raio * 2,
                                height: raio * 2 * achatado,
                                background: `radial-gradient(closest-side, ${zona ?? 'transparent'} 0%, ${zona ?? 'transparent'} 62%, transparent 100%)`,
                            }}
                            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 mix-blend-color transition-[opacity,scale] duration-[1600ms] ease-out ${
                                visivel ? 'scale-100 opacity-100 delay-700' : 'scale-50 opacity-0'
                            }`}
                        />
                    )
                })()}

            {chegou &&
                culturas.map((cultura) => {
                    const posicao = posicoes[cultura.slug]
                    if (!posicao) return null
                    const ativa = cultura.slug === selecionada
                    // Com uma lavoura aberta, os marcadores do Brasil saem e entram os pinos das camadas.
                    const escondida = aberta !== null
                    return (
                        <div
                            key={cultura.slug}
                            style={{ left: posicao.x, top: posicao.y }}
                            className={`absolute flex -translate-x-1/2 -translate-y-full flex-col items-center transition-opacity duration-500 ${
                                ativa ? 'z-10' : ''
                            } ${escondida ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
                        >
                            <button
                                type="button"
                                aria-pressed={ativa}
                                aria-label={`${cultura.nome}: ${cultura.municipio}, ${cultura.uf}`}
                                tabIndex={escondida ? -1 : 0}
                                onClick={() => (ativa ? onAbrir(cultura.slug) : onSelecionar(cultura.slug))}
                                className="group flex cursor-pointer flex-col items-center focus-visible:outline-none"
                            >
                                {/* Marcador: o círculo com o ícone, a ponta e o ponto exato do lugar. O círculo
                                    se afasta um pouco para o lado, para dois lugares vizinhos (Sapezal e Sorriso)
                                    não ficarem um em cima do outro; o ponto embaixo não sai do lugar. */}
                                <span
                                    className={`flex flex-col items-center ${
                                        cultura.ladoDaEtiqueta === 'esquerda' ? '-translate-x-2.5' : 'translate-x-2.5'
                                    }`}
                                >
                                    <span
                                        className={`flex size-11 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-[#7DBE8C] ${
                                            ativa ? 'scale-110 bg-[#7DBE8C] text-[#17110D]' : 'bg-[#E6DAC6] text-[#2E5A43]'
                                        }`}
                                    >
                                        <IconeCultura slug={cultura.slug} className="size-6" />
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className={`-mt-1.5 size-3 rotate-45 ${ativa ? 'bg-[#7DBE8C]' : 'bg-[#E6DAC6]'}`}
                                    />
                                </span>
                                <span
                                    aria-hidden="true"
                                    className={`mt-1.5 size-2 rounded-full ${
                                        ativa ? 'bg-[#7DBE8C] motion-safe:animate-ping' : 'bg-[#E6DAC6]'
                                    }`}
                                />
                            </button>
                        </div>
                    )
                })}
            {/* Os pinos das camadas, em volta da lavoura aberta: brancos, com um ícone de traço fino.
                O da camada escolhida fica no centro, com o cartão em cima. */}
            {aberta &&
                pousada === aberta.slug &&
                CAMADAS.map((umaCamada, ordem) => {
                    const posicao = pinos[umaCamada]
                    if (!posicao) return null
                    const ativa = umaCamada === camada
                    return (
                        <div
                            key={umaCamada}
                            style={{ left: posicao.x, top: posicao.y, animationDelay: `${ordem * 90}ms` }}
                            // Os pinos ficam por cima das nuvens e do escurecido da borda, que são desenhados depois do mapa.
                            className={`pino absolute flex -translate-x-1/2 -translate-y-full flex-col items-center ${ativa ? 'z-[11]' : 'z-10'}`}
                        >
                            {/* No celular não há espaço para o cartão entre o nome da lavoura e o painel:
                                os números ficam só no painel de baixo. */}
                            {ativa && <div className="hidden md:block">{cartao}</div>}
                            <button
                                type="button"
                                aria-pressed={ativa}
                                aria-label={NOMES_DAS_CAMADAS[umaCamada]}
                                title={NOMES_DAS_CAMADAS[umaCamada]}
                                onClick={() => onCamada(umaCamada)}
                                className="group flex cursor-pointer flex-col items-center focus-visible:outline-none"
                            >
                                <span
                                    className={`flex size-14 items-center justify-center rounded-full bg-white text-[#17110D] shadow-[0_6px_18px_rgb(0_0_0/0.35)] transition-transform duration-300 group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-[#7DBE8C] ${
                                        ativa ? 'scale-110' : ''
                                    }`}
                                >
                                    <IconeCamada camada={umaCamada} slugDaCultura={aberta.slug} className="size-7" />
                                </span>
                                <span aria-hidden="true" className="-mt-2 size-3.5 rotate-45 rounded-[2px] bg-white" />
                                <span
                                    aria-hidden="true"
                                    className={`mt-2 size-2.5 rounded-full bg-white shadow ${
                                        ativa ? 'motion-safe:animate-pulse' : ''
                                    }`}
                                />
                            </button>
                        </div>
                    )
                })}
        </div>
    )
}
