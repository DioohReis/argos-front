import { useEffect, useState } from 'react'
import { buscarAr, buscarClima } from '../services/condicoesService'
import type { CondicoesDaLavoura } from '../types/condicoes'
import type { Cultura } from '../types/cultura'

/** Como está a busca: ainda carregando, deu erro ou chegou. */
export type EstadoDasCondicoes =
    | { situacao: 'carregando' }
    | { situacao: 'erro'; mensagem: string }
    | { situacao: 'pronto'; condicoes: CondicoesDaLavoura }

/**
 * Busca o tempo e a qualidade do ar da lavoura aberta. Se a pessoa trocar de lavoura ou voltar ao
 * mapa antes da resposta, o pedido antigo é cancelado (AbortController).
 */
export function useCondicoes(cultura: Cultura | null) {
    const [estado, setEstado] = useState<EstadoDasCondicoes>({ situacao: 'carregando' })
    const [lavouraDoEstado, setLavouraDoEstado] = useState<string | null>(null)

    // Trocou de lavoura: a tela volta a mostrar "carregando" antes mesmo de o pedido sair.
    if (cultura && cultura.slug !== lavouraDoEstado) {
        setLavouraDoEstado(cultura.slug)
        setEstado({ situacao: 'carregando' })
    }

    useEffect(() => {
        if (!cultura) return
        const controle = new AbortController()
        // O ar é um extra: se ele falhar, o clima aparece mesmo assim.
        const ar = buscarAr(cultura.latitude, cultura.longitude, controle.signal).catch(() => null)
        Promise.all([buscarClima(cultura.latitude, cultura.longitude, controle.signal), ar])
            .then(([clima, arDaLavoura]) => setEstado({ situacao: 'pronto', condicoes: { clima, ar: arDaLavoura } }))
            .catch(() => {
                if (controle.signal.aborted) return
                setEstado({ situacao: 'erro', mensagem: 'Não deu para buscar o tempo agora. Veja se há internet.' })
            })
        return () => controle.abort()
    }, [cultura])

    return estado
}
