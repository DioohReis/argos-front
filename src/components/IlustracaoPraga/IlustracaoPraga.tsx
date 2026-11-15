import type { Praga } from '../../types/praga'

interface IlustracaoPragaProps {
    praga: Praga
    className?: string
}

const CONTORNO = '#1B241D'

/** Três pernas de cada lado do corpo, saindo dos pontos dados. */
function Pernas({ pontos }: { pontos: [number, number, number, number][] }) {
    return (
        <g stroke={CONTORNO} strokeWidth="1.6" strokeLinecap="round" fill="none">
            {pontos.map(([x1, y1, x2, y2]) => (
                <path key={`${x1}-${y1}`} d={`M${x1} ${y1} L${x2} ${y2}`} />
            ))}
        </g>
    )
}

/**
 * Desenho simples de uma praga, visto de cima (as lagartas, de lado). Não é uma foto: mostra o
 * formato do bicho, as cores e as marcas que ajudam a reconhecer (riscas, pintas, bico, espinhos).
 * As cores e as marcas vêm dos dados da praga.
 */
export default function IlustracaoPraga({ praga, className = '' }: IlustracaoPragaProps) {
    const { forma, marcas, cores } = praga
    const tem = (marca: Praga['marcas'][number]) => marcas.includes(marca)

    return (
        <svg
            role="img"
            aria-label={`Desenho de ${praga.nome}`}
            viewBox="0 0 160 100"
            strokeLinejoin="round"
            className={className}
        >
            {forma === 'lagarta' &&
                (() => {
                    // O corpo é um traço grosso; a falsa-medideira anda com o corpo em arco.
                    const corpo = tem('mede-palmo')
                        ? 'M26 76 C42 76 52 70 60 50 C68 26 92 26 100 50 C108 70 118 76 132 76'
                        : 'M22 60 C50 46 84 72 136 54'
                    const cabeca = tem('mede-palmo') ? { x: 134, y: 76 } : { x: 138, y: 53 }
                    return (
                        <>
                            <path d={corpo} fill="none" stroke={CONTORNO} strokeWidth="22" strokeLinecap="round" />
                            <path d={corpo} fill="none" stroke={cores.corpo} strokeWidth="19" strokeLinecap="round" />
                            {/* Os anéis do corpo. */}
                            <path
                                d={corpo}
                                fill="none"
                                stroke={CONTORNO}
                                strokeOpacity="0.22"
                                strokeWidth="19"
                                strokeDasharray="1.4 10.6"
                            />
                            {tem('listras') && (
                                <path
                                    d={corpo}
                                    fill="none"
                                    stroke={cores.detalhe}
                                    strokeWidth="2.6"
                                    strokeLinecap="round"
                                    transform="translate(0 -4.5)"
                                />
                            )}
                            {tem('pintas') && (
                                <path
                                    d={corpo}
                                    fill="none"
                                    stroke={tem('listras') ? CONTORNO : cores.detalhe}
                                    strokeWidth="3.4"
                                    strokeLinecap="round"
                                    strokeDasharray="0.1 11.9"
                                    transform="translate(0 2.5)"
                                />
                            )}
                            <circle cx={cabeca.x} cy={cabeca.y} r="10" fill={cores.cabeca} stroke={CONTORNO} strokeWidth="1.5" />
                            <circle cx={cabeca.x + 4} cy={cabeca.y - 3} r="1.4" fill={CONTORNO} />
                        </>
                    )
                })()}

            {forma === 'percevejo' && (
                <>
                    <Pernas
                        pontos={[
                            [58, 40, 36, 30],
                            [56, 54, 32, 58],
                            [62, 70, 42, 86],
                            [102, 40, 124, 30],
                            [104, 54, 128, 58],
                            [98, 70, 118, 86],
                        ]}
                    />
                    <path d="M74 14 L62 2 M86 14 L98 2" stroke={CONTORNO} strokeWidth="1.6" strokeLinecap="round" />
                    {/* O escudo: com espinhos, os "ombros" terminam em ponta. */}
                    <path
                        d={
                            tem('espinhos')
                                ? 'M80 12 L98 23 L114 19 L106 38 Q110 70 80 90 Q50 70 54 38 L46 19 L62 23 Z'
                                : 'M80 12 L100 23 L106 38 Q110 70 80 90 Q50 70 54 38 L60 23 Z'
                        }
                        fill={cores.corpo}
                        stroke={tem('meia-lua') ? CONTORNO : cores.detalhe}
                        strokeWidth={tem('meia-lua') ? 1.5 : 3}
                    />
                    <path d="M72 15 Q80 3 88 15 Z" fill={cores.cabeca} stroke={CONTORNO} strokeWidth="1.5" />
                    {/* O triângulo das costas e a ponta das asas. */}
                    <path d="M66 33 L94 33 L80 62 Z" fill={cores.cabeca} stroke={CONTORNO} strokeWidth="1.2" />
                    <path d="M66 68 Q80 92 94 68 Q80 76 66 68 Z" fill={CONTORNO} fillOpacity="0.45" />
                    {tem('meia-lua') && (
                        <path d="M73 55 Q80 64 87 55" fill="none" stroke={cores.detalhe} strokeWidth="3.2" strokeLinecap="round" />
                    )}
                </>
            )}

            {forma === 'besouro' && (
                <>
                    <Pernas
                        pontos={[
                            [58, 36, 46, 18],
                            [84, 32, 86, 12],
                            [106, 36, 120, 20],
                            [58, 68, 46, 86],
                            [84, 72, 86, 92],
                            [106, 68, 120, 84],
                        ]}
                    />
                    {tem('bico') && (
                        <>
                            <path d="M26 52 Q10 49 5 61" fill="none" stroke={CONTORNO} strokeWidth="6.5" strokeLinecap="round" />
                            <path d="M26 52 Q10 49 5 61" fill="none" stroke={cores.cabeca} strokeWidth="4" strokeLinecap="round" />
                            <path d="M14 51 L8 40 M12 52 L4 46" stroke={CONTORNO} strokeWidth="1.4" strokeLinecap="round" />
                        </>
                    )}
                    <circle cx="32" cy="52" r="9" fill={cores.cabeca} stroke={CONTORNO} strokeWidth="1.5" />
                    <ellipse cx="50" cy="52" rx="14" ry="17" fill={cores.detalhe} stroke={CONTORNO} strokeWidth="1.5" />
                    <ellipse cx="90" cy="52" rx="36" ry="23" fill={cores.corpo} stroke={CONTORNO} strokeWidth="1.5" />
                    {/* A linha do meio, onde as duas asas duras se encontram. */}
                    <path d="M56 52 H126" stroke={CONTORNO} strokeWidth="1.3" />
                    <path d="M66 42 H116 M66 62 H116" stroke={CONTORNO} strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 4" />
                </>
            )}

            {forma === 'mosca' && (
                <>
                    <ellipse cx="80" cy="54" rx="8" ry="20" fill={cores.corpo} stroke={CONTORNO} strokeWidth="1.5" />
                    <ellipse
                        cx="60"
                        cy="58"
                        rx="17"
                        ry="32"
                        transform="rotate(-20 60 58)"
                        fill={cores.detalhe}
                        fillOpacity="0.94"
                        stroke={CONTORNO}
                        strokeWidth="1.3"
                    />
                    <ellipse
                        cx="100"
                        cy="58"
                        rx="17"
                        ry="32"
                        transform="rotate(20 100 58)"
                        fill={cores.detalhe}
                        fillOpacity="0.94"
                        stroke={CONTORNO}
                        strokeWidth="1.3"
                    />
                    <circle cx="80" cy="28" r="7" fill={cores.cabeca} stroke={CONTORNO} strokeWidth="1.5" />
                    <circle cx="76.5" cy="26" r="1.6" fill="#8E2B1E" />
                    <circle cx="83.5" cy="26" r="1.6" fill="#8E2B1E" />
                    <path d="M77 22 L70 10 M83 22 L90 10" stroke={CONTORNO} strokeWidth="1.3" strokeLinecap="round" />
                </>
            )}

            {forma === 'pulgao' && (
                <>
                    <Pernas
                        pontos={[
                            [62, 38, 42, 28],
                            [57, 54, 34, 56],
                            [60, 70, 40, 84],
                            [98, 38, 118, 28],
                            [103, 54, 126, 56],
                            [100, 70, 120, 84],
                        ]}
                    />
                    <path d="M74 22 L54 6 M86 22 L106 6" stroke={CONTORNO} strokeWidth="1.5" strokeLinecap="round" />
                    {/* Os dois "canudinhos" na parte de trás, marca dos pulgões. */}
                    <path d="M68 78 L61 94 M92 78 L99 94" stroke={cores.detalhe} strokeWidth="3.2" strokeLinecap="round" />
                    <path
                        d="M80 18 Q104 28 104 58 Q104 84 80 88 Q56 84 56 58 Q56 28 80 18 Z"
                        fill={cores.corpo}
                        stroke={CONTORNO}
                        strokeWidth="1.5"
                    />
                    <path d="M80 30 V80" stroke={cores.detalhe} strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="73" cy="25" r="1.8" fill={CONTORNO} />
                    <circle cx="87" cy="25" r="1.8" fill={CONTORNO} />
                </>
            )}

            {forma === 'cigarrinha' && (
                <>
                    <Pernas
                        pontos={[
                            [64, 34, 44, 26],
                            [64, 52, 42, 56],
                            [67, 72, 46, 90],
                            [96, 34, 116, 26],
                            [96, 52, 118, 56],
                            [93, 72, 114, 90],
                        ]}
                    />
                    {/* O corpo em cunha, com as asas fechadas em telhado. */}
                    <path
                        d="M80 8 Q99 16 98 40 L92 88 Q80 96 68 88 L62 40 Q61 16 80 8 Z"
                        fill={cores.corpo}
                        stroke={CONTORNO}
                        strokeWidth="1.5"
                    />
                    <path d="M63 30 Q80 38 97 30" fill="none" stroke={CONTORNO} strokeWidth="1.2" />
                    <path d="M80 34 V92" stroke={CONTORNO} strokeWidth="1.2" />
                    <path d="M66 50 L72 86 M94 50 L88 86" stroke={cores.detalhe} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.8" />
                    {tem('pontos-na-cabeca') && (
                        <>
                            <circle cx="74" cy="18" r="2.6" fill={CONTORNO} />
                            <circle cx="86" cy="18" r="2.6" fill={CONTORNO} />
                        </>
                    )}
                </>
            )}

            {forma === 'mariposa' && (
                <>
                    <path d="M78 24 L66 8 M82 24 L94 8" stroke={CONTORNO} strokeWidth="1.3" strokeLinecap="round" />
                    {/* As asas de trás, menores, e as da frente por cima. */}
                    <path d="M80 54 Q52 62 44 84 Q68 86 80 66 Z" fill={cores.corpo} stroke={CONTORNO} strokeWidth="1.3" />
                    <path d="M80 54 Q108 62 116 84 Q92 86 80 66 Z" fill={cores.corpo} stroke={CONTORNO} strokeWidth="1.3" />
                    <path d="M80 34 Q42 16 20 42 Q46 66 80 54 Z" fill={cores.detalhe} stroke={CONTORNO} strokeWidth="1.3" />
                    <path d="M80 34 Q118 16 140 42 Q114 66 80 54 Z" fill={cores.detalhe} stroke={CONTORNO} strokeWidth="1.3" />
                    <circle cx="34" cy="42" r="3" fill={CONTORNO} fillOpacity="0.55" />
                    <circle cx="126" cy="42" r="3" fill={CONTORNO} fillOpacity="0.55" />
                    <ellipse cx="80" cy="50" rx="5" ry="24" fill={cores.cabeca} stroke={CONTORNO} strokeWidth="1.3" />
                </>
            )}

            {forma === 'acaro' && (
                <>
                    {/* Oito pernas: quatro de cada lado. É o que separa o ácaro dos insetos, que têm seis. */}
                    <g stroke={CONTORNO} strokeWidth="1.5" strokeLinecap="round" fill="none">
                        <path d="M62 34 L44 22 L36 10 M58 46 L36 42 L24 32 M58 60 L36 66 L26 80 M64 72 L48 86 L44 96" />
                        <path d="M98 34 L116 22 L124 10 M102 46 L124 42 L136 32 M102 60 L124 66 L134 80 M96 72 L112 86 L116 96" />
                    </g>
                    <ellipse cx="80" cy="54" rx="26" ry="30" fill={cores.corpo} stroke={CONTORNO} strokeWidth="1.5" />
                    <ellipse cx="68" cy="54" rx="7" ry="11" fill={cores.detalhe} fillOpacity="0.85" />
                    <ellipse cx="92" cy="54" rx="7" ry="11" fill={cores.detalhe} fillOpacity="0.85" />
                    <circle cx="75" cy="30" r="1.5" fill="#8E2B1E" />
                    <circle cx="85" cy="30" r="1.5" fill="#8E2B1E" />
                </>
            )}
        </svg>
    )
}
