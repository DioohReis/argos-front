/** Para que lado o marcador se afasta no mapa, para dois lugares vizinhos não se cobrirem. */
export type LadoDaEtiqueta = 'esquerda' | 'direita'

/** Uma lavoura do guia e o município que mais produz essa lavoura no Brasil. */
export interface Cultura {
    /** Trecho da rota: /guia/:cultura */
    slug: string
    nome: string
    /** Cor do ponto no mapa e do detalhe do cartão. */
    cor: string
    municipio: string
    uf: string
    longitude: number
    latitude: number
    /** Altitude do ponto, em metros acima do nível do mar. */
    altitude: number
    /** Quantidade produzida no ano da fonte, em toneladas. */
    toneladas: number
    ladoDaEtiqueta: LadoDaEtiqueta
}
