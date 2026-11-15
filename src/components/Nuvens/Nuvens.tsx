interface NuvensProps {
    /** As nuvens aparecem só na camada do clima. */
    visivel: boolean
    /** Chance de chuva, de 0 a 100: mais chance, mais nuvens e mais fechadas. */
    chanceDeChuva: number
}

/**
 * Desenha uma nuvem (ou a sombra dela) como uma imagem SVG. Um ruído (feTurbulence) entorta e fura
 * uma mancha arredondada, e ela fica com cara de nuvem vista de cima. Como é uma imagem, o navegador
 * faz esse desenho uma vez só; depois a animação apenas desloca a figura pronta, o que é leve.
 */
function desenharNuvem(semente: number, cor: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360">
<defs>
<radialGradient id="m" cx="50%" cy="55%" r="50%">
<stop offset="0" stop-color="${cor}" stop-opacity="1"/>
<stop offset="0.35" stop-color="${cor}" stop-opacity="0.85"/>
<stop offset="0.6" stop-color="${cor}" stop-opacity="0.35"/>
<stop offset="0.8" stop-color="${cor}" stop-opacity="0"/>
</radialGradient>
<filter id="f" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="0.008 0.013" numOctaves="5" seed="${semente}" result="r"/>
<feDisplacementMap in="SourceGraphic" in2="r" scale="110" xChannelSelector="R" yChannelSelector="G" result="t"/>
<feColorMatrix in="r" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 2.6 0 0 0 -0.75" result="a"/>
<feComposite in="t" in2="a" operator="in"/>
<feGaussianBlur stdDeviation="2"/>
</filter>
</defs>
<ellipse cx="300" cy="180" rx="230" ry="130" fill="url(#m)" filter="url(#f)"/>
</svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

/** Onde cada nuvem fica, o tamanho e quanto tempo ela leva para atravessar a tela. */
const NUVENS = [
    { topo: '4%', largura: 640, segundos: 90, atraso: -20, semente: 11 },
    { topo: '36%', largura: 780, segundos: 120, atraso: -75, semente: 4 },
    { topo: '18%', largura: 500, segundos: 105, atraso: -52, semente: 23 },
    { topo: '50%', largura: 580, segundos: 135, atraso: -110, semente: 8 },
    { topo: '-6%', largura: 720, segundos: 150, atraso: -128, semente: 17 },
].map((nuvem) => ({
    ...nuvem,
    imagem: desenharNuvem(nuvem.semente, '#ffffff'),
    sombra: desenharNuvem(nuvem.semente, '#000000'),
}))

/**
 * Nuvens passando devagar por cima da imagem de satélite, cada uma com a sua sombra no chão.
 * Quem pediu menos movimento no aparelho vê as nuvens paradas.
 */
export default function Nuvens({ visivel, chanceDeChuva }: NuvensProps) {
    // Com pouca chance de chuva, só duas nuvens ralas; com muita, as cinco, mais fechadas.
    const quantas = chanceDeChuva >= 60 ? 5 : chanceDeChuva >= 30 ? 4 : 2
    const opacidade = chanceDeChuva >= 60 ? 0.95 : chanceDeChuva >= 30 ? 0.85 : 0.7

    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-1000 ${
                visivel ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {NUVENS.slice(0, quantas).map((nuvem) => (
                <div
                    key={nuvem.topo}
                    style={{
                        top: nuvem.topo,
                        width: nuvem.largura,
                        opacity: opacidade,
                        animationDuration: `${nuvem.segundos}s`,
                        animationDelay: `${nuvem.atraso}s`,
                        // Fora da camada do clima, as nuvens ficam paradas: não gastam o aparelho à toa.
                        animationPlayState: visivel ? 'running' : 'paused',
                    }}
                    className="nuvem absolute left-0 aspect-[5/3] will-change-transform"
                >
                    {/* A sombra cai um pouco para baixo e para a direita, como sol de manhã. */}
                    <span
                        style={{ backgroundImage: nuvem.sombra }}
                        className="absolute inset-0 translate-x-[8%] translate-y-[20%] bg-contain bg-no-repeat opacity-35 blur-sm"
                    />
                    <span style={{ backgroundImage: nuvem.imagem }} className="absolute inset-0 bg-contain bg-no-repeat" />
                </div>
            ))}
        </div>
    )
}
