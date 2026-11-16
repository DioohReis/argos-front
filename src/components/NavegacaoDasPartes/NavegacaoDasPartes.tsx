import { useEffect, useState } from 'react'

interface Parte {
    /** O `id` da seção na página. */
    id: string
    nome: string
}

interface NavegacaoDasPartesProps {
    partes: Parte[]
}

/**
 * Menu fixo na lateral direita, com uma bolinha para cada parte da página. A bolinha da parte que
 * está na tela fica maior e mostra o nome dela; as outras mostram o nome quando o mouse passa.
 * Um IntersectionObserver avisa qual parte está no meio da tela. Aparece só em telas largas.
 */
export default function NavegacaoDasPartes({ partes }: NavegacaoDasPartesProps) {
    const [atual, setAtual] = useState(partes[0].id)

    useEffect(() => {
        const observador = new IntersectionObserver(
            (entradas) => {
                for (const entrada of entradas) {
                    if (entrada.isIntersecting) setAtual(entrada.target.id)
                }
            },
            // Vale a parte que cruza a faixa do meio da tela.
            { rootMargin: '-45% 0px -45% 0px' },
        )
        for (const parte of partes) {
            const secao = document.getElementById(parte.id)
            if (secao) observador.observe(secao)
        }
        return () => observador.disconnect()
    }, [partes])

    return (
        <nav
            aria-label="Partes da página"
            // "difference" inverte a cor conforme o fundo: o menu aparece no vídeo, no mapa e nas partes claras.
            className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 text-white mix-blend-difference lg:flex"
        >
            {partes.map((parte, ordem) => {
                const ativa = parte.id === atual
                return (
                    <a
                        key={parte.id}
                        href={`#${parte.id}`}
                        aria-current={ativa ? 'true' : undefined}
                        className="group flex items-center gap-3 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                        <span
                            className={`font-condensed text-base font-semibold tracking-[0.14em] uppercase transition-[opacity,translate] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${
                                ativa ? 'opacity-100' : 'translate-x-2 opacity-0'
                            }`}
                        >
                            {String(ordem + 1).padStart(2, '0')} {parte.nome}
                        </span>
                        <span
                            aria-hidden="true"
                            className={`rounded-full bg-white transition-[width,height,opacity] duration-300 ${
                                ativa ? 'h-8 w-1' : 'size-1.5 opacity-60 group-hover:opacity-100'
                            }`}
                        />
                    </a>
                )
            })}
        </nav>
    )
}
