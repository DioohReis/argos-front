import { FONTE_DA_ALTITUDE, FONTE_DA_PRODUCAO, descreverProducao } from '../data/culturas'
import { FONTE_DO_SOLO } from '../data/solos'
import type { Avaliacao, Camada, CondicoesDaLavoura, PaletaDeCurvas, SoloDaLavoura } from '../types/condicoes'
import type { Cultura } from '../types/cultura'
import {
    AZUL_DA_AREA,
    IRRIGACAO,
    VERDE_DO_TERRENO,
    VERDES_DO_SOLO,
    avaliarAr,
    avaliarChuva,
    avaliarFertilidade,
    avaliarUmidade,
    indiceDeFertilidade,
} from './avaliar'

/** A ordem das camadas no seletor da lavoura aberta. */
export const CAMADAS: Camada[] = ['cultura', 'clima', 'ar', 'umidade', 'solo']

/** Tudo o que a tela mostra de uma camada: textos, o cartão do marcador e as cores do mapa. */
export interface DescricaoDaCamada {
    titulo: string
    /** A leitura em uma palavra ("Solo úmido"), com nível e cor. Falta quando não há dado. */
    avaliacao: Avaliacao | null
    frase: string
    detalhe: string
    cartao: { rotulo: string; valor: string }[]
    /** Névoa de cor por cima da imagem de satélite (qualidade do ar). */
    filtro: { cor: string; forca: number } | null
    /** Curvas de nível coloridas no lugar da imagem de satélite (umidade e solo). */
    curvas: PaletaDeCurvas | null
    /** Cor que pinta só a área plantada, por cima das curvas (umidade). */
    zona: string | null
    fonte: string
    /** Esta camada depende de dado buscado na internet (clima, ar e umidade). */
    aoVivo: boolean
}

const numero = (valor: number, casas = 0) =>
    valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })

/** Monta os textos e as cores de uma camada, a partir dos dados da lavoura. */
export function descreverCamada(
    camada: Camada,
    cultura: Cultura | null,
    condicoes: CondicoesDaLavoura | null,
    solo: SoloDaLavoura | undefined,
): DescricaoDaCamada {
    const vazia = (titulo: string, fonte = 'Open-Meteo', aoVivo = true): DescricaoDaCamada => ({
        titulo,
        avaliacao: null,
        frase: '',
        detalhe: '',
        cartao: [],
        filtro: null,
        curvas: null,
        zona: null,
        fonte,
        aoVivo,
    })

    if (camada === 'cultura') {
        const base = vazia('Lavoura predominante', `${FONTE_DA_PRODUCAO.nome}, ${FONTE_DA_PRODUCAO.ano}`, false)
        if (!cultura) return base
        return {
            ...base,
            frase: `${descreverProducao(cultura.toneladas)} em ${FONTE_DA_PRODUCAO.ano}`,
            detalhe: `${cultura.municipio} é a cidade que mais colhe ${cultura.nome.toLowerCase()} no Brasil.`,
            cartao: [{ rotulo: 'Lavoura', valor: cultura.nome }],
        }
    }

    if (camada === 'solo') {
        const base = vazia('Fertilidade do solo', FONTE_DO_SOLO.nome, false)
        if (!solo) return { ...base, frase: 'Sem dados do solo neste lugar.' }
        const indice = indiceDeFertilidade(solo)
        const avaliacao = avaliarFertilidade(indice)
        return {
            ...base,
            avaliacao,
            frase: `Índice ${indice} de 100`,
            detalhe: `pH ${numero(solo.ph, 1)} · matéria orgânica ${numero(solo.carbonoOrganico)} g/kg · nitrogênio ${numero(solo.nitrogenio, 1)} g/kg`,
            cartao: [{ rotulo: 'Fertilidade', valor: `${indice}/100` }],
            curvas: VERDES_DO_SOLO[avaliacao.nivel],
            fonte: `Estimativa do Argos com dados do ${FONTE_DO_SOLO.nome}. Não substitui a análise de solo`,
        }
    }

    if (camada === 'clima') {
        if (!condicoes) return vazia('Clima')
        const { clima } = condicoes
        return {
            ...vazia('Clima'),
            avaliacao: avaliarChuva(clima.chanceDeChuva),
            frase: `${numero(clima.chanceDeChuva)}% de chance de chuva hoje`,
            detalhe: `Agora faz ${numero(clima.temperaturaAgora)}°C. Chuva esperada: ${numero(clima.chuvaMm, 1)} mm.`,
            cartao: [
                { rotulo: 'Mín.', valor: `${numero(clima.minima)}°C` },
                { rotulo: 'Máx.', valor: `${numero(clima.maxima)}°C` },
            ],
        }
    }

    if (camada === 'ar') {
        // A altitude não depende da internet: aparece mesmo se a medição do ar faltar.
        const altitude = cultura ? [{ rotulo: 'Altitude', valor: `${numero(cultura.altitude)} m` }] : []
        const base = { ...vazia('Ar e altitude', `Open-Meteo. Altitude: ${FONTE_DA_ALTITUDE}`), cartao: altitude }
        if (!condicoes) return base
        if (!condicoes.ar) return { ...base, frase: 'Sem medição do ar neste lugar.' }
        const { ar } = condicoes
        const avaliacao = avaliarAr(ar.indice)
        return {
            ...base,
            avaliacao,
            frase: `Índice do ar ${numero(ar.indice)}: quanto menor, melhor`,
            detalhe: `Poeira fina no ar: ${numero(ar.pm25, 1)} µg/m³.`,
            cartao: [{ rotulo: 'Índice do ar', valor: numero(ar.indice) }, ...altitude],
            // Ar bom quase não muda a imagem; ar ruim cobre o terreno com uma névoa.
            filtro: { cor: avaliacao.cor, forca: [0.12, 0.4, 0.62][avaliacao.nivel - 1] },
        }
    }

    if (!condicoes) return vazia('Umidade do solo')
    const volume = condicoes.clima.umidadeDoSolo
    if (volume === null) return { ...vazia('Umidade do solo'), frase: 'Sem medição da umidade neste lugar.' }
    const avaliacao = avaliarUmidade(volume)
    return {
        ...vazia('Umidade do solo'),
        avaliacao,
        frase: `${numero(volume * 100)}% de água no solo`,
        detalhe: `${IRRIGACAO[avaliacao.nivel]} A cor marca a área da lavoura: quanto mais azul, mais água no solo.`,
        cartao: [{ rotulo: 'Água no solo', valor: `${numero(volume * 100)}%` }],
        curvas: VERDE_DO_TERRENO,
        zona: AZUL_DA_AREA[avaliacao.nivel],
        fonte: 'Open-Meteo, de 3 a 9 cm de fundura. A área pintada é aproximada',
    }
}
