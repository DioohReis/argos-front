/** O formato do bicho: escolhe o desenho do catálogo. */
export type FormaDaPraga =
    | 'lagarta'
    | 'percevejo'
    | 'besouro'
    | 'mosca'
    | 'pulgao'
    | 'cigarrinha'
    | 'mariposa'
    | 'acaro'

/** Detalhes do desenho que ajudam a reconhecer o bicho. */
export type MarcaDaPraga =
    /** Riscas claras ao comprido do corpo (lagartas). */
    | 'listras'
    /** Pintas escuras pelo corpo (lagartas). */
    | 'pintas'
    /** Anda arqueando o corpo, como quem mede palmo (lagartas). */
    | 'mede-palmo'
    /** Um espinho de cada lado, na altura do "ombro" (percevejos). */
    | 'espinhos'
    /** Uma meia-lua clara no meio das costas (percevejos). */
    | 'meia-lua'
    /** Um bico comprido na frente da cabeça (besouros). */
    | 'bico'
    /** Dois pontos pretos na cabeça (cigarrinhas). */
    | 'pontos-na-cabeca'

/** Uma praga do catálogo, com o que a pessoa precisa para reconhecer o bicho na lavoura. */
export interface Praga {
    slug: string
    nome: string
    nomeCientifico: string
    /** O tipo de bicho em uma palavra: "Lagarta", "Percevejo", "Besouro"... */
    tipo: string
    /** O grupo do bicho na pergunta "Que bicho você viu?" do catálogo (o `slug` do grupo). */
    grupo: string
    forma: FormaDaPraga
    marcas: MarcaDaPraga[]
    /** Cores do desenho: o corpo, um detalhe (riscas, asas, contorno) e a cabeça. */
    cores: { corpo: string; detalhe: string; cabeca: string }
    /** Tamanho do bicho adulto ou da lagarta crescida, em palavras: "até 4 cm". */
    tamanho: string
    /** Algo do dia a dia com tamanho parecido: "um palito de fósforo". */
    comparacao: string
    /** Os `slug` das lavouras em que ela mais aparece. */
    culturas: string[]
    /** Como é o bicho. */
    aparencia: string
    /** O que ele deixa na planta. */
    sinais: string
    /** Em que parte da planta procurar, e em que hora. */
    ondeProcurar: string
    /** Endereço da foto do bicho, quando houver. Sem foto, o catálogo mostra o desenho. */
    foto?: string
    /** Endereço da foto do estrago na planta, quando houver. */
    fotoDoEstrago?: string
}
