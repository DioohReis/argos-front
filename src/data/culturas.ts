import type { Cultura } from '../types/cultura'

/** De onde vêm os números de produção. Todo dado do Argos mostra a fonte. */
export const FONTE_DA_PRODUCAO = {
    nome: 'IBGE, Produção Agrícola Municipal',
    ano: 2025,
    url: 'https://sidra.ibge.gov.br/tabela/5457',
}

/** De onde vem a altitude de cada ponto (modelo de elevação Copernicus, de 90 metros). */
export const FONTE_DA_ALTITUDE = 'Open-Meteo (Copernicus DEM)'

/**
 * As seis lavouras do mapa. Cada uma aponta para o município que mais produziu
 * essa lavoura no Brasil, em toneladas, no ano da fonte. A posição é o centro do
 * município, segundo a malha territorial do IBGE.
 */
export const CULTURAS: Cultura[] = [
    {
        slug: 'soja',
        nome: 'Soja',
        cor: '#9CCC65',
        municipio: 'São Desidério',
        uf: 'BA',
        longitude: -45.4926,
        latitude: -12.8024,
        altitude: 732,
        toneladas: 2360926,
        ladoDaEtiqueta: 'direita',
    },
    {
        slug: 'milho',
        nome: 'Milho',
        cor: '#F2B705',
        municipio: 'Sorriso',
        uf: 'MT',
        longitude: -55.6814,
        latitude: -12.7373,
        altitude: 369,
        toneladas: 3780000,
        ladoDaEtiqueta: 'direita',
    },
    {
        slug: 'algodao',
        nome: 'Algodão',
        cor: '#F4F1E8',
        municipio: 'Sapezal',
        uf: 'MT',
        longitude: -58.6535,
        latitude: -13.1544,
        altitude: 520,
        toneladas: 1199771,
        ladoDaEtiqueta: 'esquerda',
    },
    {
        slug: 'cana',
        nome: 'Cana-de-açúcar',
        cor: '#6FCF97',
        municipio: 'Uberaba',
        uf: 'MG',
        longitude: -47.9772,
        latitude: -19.5809,
        altitude: 897,
        toneladas: 9000000,
        ladoDaEtiqueta: 'esquerda',
    },
    {
        slug: 'cafe',
        nome: 'Café',
        cor: '#C98B5A',
        municipio: 'Rio Bananal',
        uf: 'ES',
        longitude: -40.3082,
        latitude: -19.2305,
        altitude: 108,
        toneladas: 69219,
        ladoDaEtiqueta: 'direita',
    },
    {
        slug: 'trigo',
        nome: 'Trigo',
        cor: '#E9C46A',
        municipio: 'Palmeira das Missões',
        uf: 'RS',
        longitude: -53.3823,
        latitude: -27.94,
        altitude: 541,
        toneladas: 108000,
        ladoDaEtiqueta: 'direita',
    },
]

/** Acha a lavoura pelo trecho da rota. Devolve `undefined` se não existir. */
export function buscarCultura(slug: string | undefined) {
    return CULTURAS.find((cultura) => cultura.slug === slug)
}

/** Escreve a produção em linguagem simples: "9 milhões de toneladas", "108 mil toneladas". */
export function descreverProducao(toneladas: number) {
    if (toneladas >= 1_000_000) {
        const milhoes = (toneladas / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })
        return `${milhoes} ${toneladas >= 2_000_000 ? 'milhões' : 'milhão'} de toneladas`
    }
    return `${Math.round(toneladas / 1000).toLocaleString('pt-BR')} mil toneladas`
}
