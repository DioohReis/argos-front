import type { SoloDaLavoura } from '../types/condicoes'

/**
 * De onde vêm os dados do solo. Eles mudam muito devagar, então ficam guardados aqui em vez de
 * serem pedidos a cada visita (o serviço é lento). Clima, ar e umidade continuam ao vivo.
 */
export const FONTE_DO_SOLO = {
    nome: 'SoilGrids 2.0, ISRIC',
    consultadoEm: '13/11/2026',
    url: 'https://soilgrids.org',
}

/** Solo da camada de cima (0 a 5 cm), no ponto de cada lavoura do mapa. A chave é o `slug` da lavoura. */
export const SOLOS: Record<string, SoloDaLavoura> = {
    soja: { ph: 5.8, carbonoOrganico: 19, nitrogenio: 1.22, ctc: 9.3, argila: 19.2 },
    milho: { ph: 4.9, carbonoOrganico: 19.7, nitrogenio: 1.23, ctc: 12.4, argila: 22.9 },
    algodao: { ph: 5.2, carbonoOrganico: 27.9, nitrogenio: 1.68, ctc: 20.1, argila: 28.6 },
    cana: { ph: 5.2, carbonoOrganico: 27.2, nitrogenio: 1.74, ctc: 8.2, argila: 37.5 },
    cafe: { ph: 5.5, carbonoOrganico: 35, nitrogenio: 3.14, ctc: 12.2, argila: 33.4 },
    trigo: { ph: 5.2, carbonoOrganico: 48, nitrogenio: 4.17, ctc: 24.8, argila: 42.7 },
}
