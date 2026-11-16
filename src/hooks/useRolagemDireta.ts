import { useEffect } from 'react'

/** Quanto tempo a página fica "viajando" de uma parte à outra, em milissegundos. */
const TEMPO_DA_VIAGEM = 900
/** Folga, em pixels, para considerar que a página está parada no começo de uma parte. */
const FOLGA = 6

/**
 * Rolagem direta entre as primeiras partes da página. Uma girada da rodinha do mouse leva a
 * página inteira para a parte de baixo (ou de cima), sem parar no meio do caminho. Vale do começo
 * da página até a última parte da lista; dali para baixo, a rolagem volta a ser livre.
 *
 * `ids` são os `id` das seções, na ordem em que aparecem. A primeira começa no alto da página.
 * No celular não há rodinha: o dedo rola a página do jeito de sempre.
 */
export function useRolagemDireta(ids: string[]) {
    useEffect(() => {
        let viajandoAte = 0

        /** Onde começa cada parte, em pixels a partir do alto da página. */
        const paradas = () =>
            ids.map((id, ordem) => {
                if (ordem === 0) return 0
                const secao = document.getElementById(id)
                return secao ? Math.round(secao.getBoundingClientRect().top + window.scrollY) : 0
            })

        const aoGirar = (evento: WheelEvent) => {
            // Com Ctrl é zoom da página, e giro de lado não troca de parte.
            if (evento.ctrlKey || Math.abs(evento.deltaY) < Math.abs(evento.deltaX)) return
            // Enquanto a página viaja, as giradas seguintes não fazem nada.
            if (Date.now() < viajandoAte) {
                evento.preventDefault()
                return
            }
            const pontos = paradas()
            const ultima = pontos[pontos.length - 1]
            const agora = window.scrollY
            const descendo = evento.deltaY > 0

            let destino: number | undefined
            if (descendo) {
                // A primeira parada que fica abaixo de onde a página está.
                destino = pontos.find((ponto) => ponto > agora + FOLGA)
            } else if (agora <= ultima + FOLGA) {
                // A última parada que fica acima de onde a página está.
                destino = pontos.findLast((ponto) => ponto < agora - FOLGA)
            }
            // Abaixo da última parada, ou sem para onde ir: a rolagem é a normal do navegador.
            if (destino === undefined) return

            evento.preventDefault()
            const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            viajandoAte = Date.now() + (semMovimento ? 150 : TEMPO_DA_VIAGEM)
            window.scrollTo({ top: destino, behavior: semMovimento ? 'auto' : 'smooth' })
        }

        // `passive: false` deixa o `preventDefault` cancelar a rolagem normal da rodinha.
        window.addEventListener('wheel', aoGirar, { passive: false })
        return () => window.removeEventListener('wheel', aoGirar)
    }, [ids])
}
