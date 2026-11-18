import type { Avaliacao, PaletaDeCurvas, SoloDaLavoura } from '../types/condicoes'

/** Leva um valor para a faixa de 0 a 1: `zero` vale 0, `um` vale 1 e o resto fica no meio. */
function nota(valor: number, zero: number, um: number) {
    return Math.min(Math.max((valor - zero) / (um - zero), 0), 1)
}

/**
 * Índice de fertilidade do Argos, de 0 a 100. É uma estimativa simples, feita com quatro medidas do
 * solo que pesam igual: acidez (pH), matéria orgânica (carbono), nitrogênio e a capacidade de segurar
 * nutrientes (CTC). Não substitui a análise de solo de um laboratório.
 */
export function indiceDeFertilidade(solo: SoloDaLavoura) {
    // O pH bom para a maioria das lavouras fica entre 5,5 e 6,8. Fora disso, a nota cai.
    const acidez = solo.ph < 5.5 ? nota(solo.ph, 4.5, 5.5) : solo.ph > 6.8 ? nota(solo.ph, 8, 6.8) : 1
    const materiaOrganica = nota(solo.carbonoOrganico, 5, 30)
    const nitrogenio = nota(solo.nitrogenio, 0.5, 3)
    const nutrientes = nota(solo.ctc, 4, 20)
    return Math.round(((acidez + materiaOrganica + nitrogenio + nutrientes) / 4) * 100)
}

/** Solo fértil aparece num verde claro e vivo; quanto mais fraco o solo, mais escuro o verde. */
export function avaliarFertilidade(indice: number): Avaliacao {
    if (indice >= 66) return { rotulo: 'Solo fértil', nivel: 1, cor: '#8FD694' }
    if (indice >= 40) return { rotulo: 'Solo médio', nivel: 2, cor: '#4F9A5B' }
    return { rotulo: 'Solo fraco', nivel: 3, cor: '#2A5C36' }
}

/** As curvas do terreno na camada do solo: a mesma escala de verdes, do claro (fértil) ao escuro (fraco). */
export const VERDES_DO_SOLO: Record<Avaliacao['nivel'], PaletaDeCurvas> = {
    1: { escuro: '#2C7A3F', claro: '#A5E3A0', linha: '#0E3319' },
    2: { escuro: '#1A4A29', claro: '#5FA869', linha: '#082311' },
    3: { escuro: '#0B2113', claro: '#2F6139', linha: '#030D07' },
}

/** Água no solo, em m³ de água por m³ de solo. Quanto mais úmido, mais azul. */
export function avaliarUmidade(volume: number): Avaliacao {
    if (volume >= 0.25) return { rotulo: 'Solo úmido', nivel: 1, cor: '#4FA8F5' }
    if (volume >= 0.12) return { rotulo: 'Solo pouco úmido', nivel: 2, cor: '#7FA3BF' }
    return { rotulo: 'Solo seco', nivel: 3, cor: '#A9A294' }
}

/** O que a umidade quer dizer para a irrigação, em palavras simples. É um sinal, não uma ordem. */
export const IRRIGACAO: Record<Avaliacao['nivel'], string> = {
    1: 'Tem água no solo: não precisa irrigar agora.',
    2: 'Fique de olho: se não chover, pode precisar irrigar.',
    3: 'Pouca água no solo: sinal de que precisa irrigar.',
}

/**
 * As curvas do terreno na camada da umidade: o verde do Argos, igual para qualquer leitura.
 * Quem mostra a umidade é a mancha azul em cima da lavoura.
 */
export const VERDE_DO_TERRENO: PaletaDeCurvas = { escuro: '#12381F', claro: '#57A463', linha: '#061A0D' }

/** A cor que pinta a área plantada na camada da umidade: azul vivo no solo úmido, azul apagado no meio, cor de terra no seco. */
export const AZUL_DA_AREA: Record<Avaliacao['nivel'], string> = {
    1: '#1273FF',
    2: '#5C93C4',
    3: '#B39A6B',
}

/** Índice de qualidade do ar (padrão dos EUA): até 50 é bom, até 100 é moderado. */
export function avaliarAr(indice: number): Avaliacao {
    if (indice <= 50) return { rotulo: 'Ar bom', nivel: 1, cor: '#DCE9F2' }
    if (indice <= 100) return { rotulo: 'Ar moderado', nivel: 2, cor: '#C9B98A' }
    return { rotulo: 'Ar ruim', nivel: 3, cor: '#9A7B5C' }
}

/** Chance de chuva em palavras. */
export function avaliarChuva(chance: number): Avaliacao {
    if (chance >= 60) return { rotulo: 'Deve chover', nivel: 1, cor: '#1565C0' }
    if (chance >= 30) return { rotulo: 'Pode chover', nivel: 2, cor: '#5B8FC7' }
    return { rotulo: 'Sem chuva', nivel: 3, cor: '#F2B705' }
}
