import { useState, useMemo } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";
import { type CardDuvidaProps } from "../../components/CardDuvida/CardDuvida";

//Duvidas
const faqData: (CardDuvidaProps & { id: string })[] = [
    {
        id: "o-que-e-argos",
        numero: "01",
        categoria: "Sobre o Argos",
        pergunta: "O que é o Argos e como ele funciona como meu copiloto?",
        resposta:
            "O Argos é um copiloto digital feito para quem lida com a terra. Ele acompanha o clima do seu município, as condições do seu solo e as necessidades da sua plantação (como milho e feijão).\n\nEm vez de tabelas e previsões difíceis de entender, o Argos entrega avisos diretos com figuras, cores e poucas palavras. Ele diz quando a chuva forte está vindo, quando a seca vai apertar ou quando há risco de pragas na vizinhança, para você agir antes de ter prejuízo.",
        destaque: true,
    },
    {
        id: "custo-produtor",
        numero: "02",
        categoria: "Custos & Acesso",
        pergunta: "Preciso pagar alguma mensalidade para usar o Argos na minha roça?",
        resposta:
            "Não, o Argos é totalmente gratuito para o pequeno e médio produtor rural.\n\nQuem financia a ferramenta são as cooperativas agrícolas, secretarias municipais de agricultura e órgãos de assistência técnica (ATER). Essas organizações contratam o Argos para proteger a produção dos seus cooperados e garantir que a assistência chegue mais rápido a quem mais precisa.",
        destaque: true,
    },
    {
        id: "internet-fraca-offline",
        numero: "03",
        categoria: "Celular & Conexão",
        pergunta: "O sistema funciona se a internet da minha região for fraca ou cair?",
        resposta:
            "Sim. Nós sabemos bem que na roça o sinal de celular oscila muito e que muitos vizinhos dividem a mesma conexão.\n\nPor isso, o Argos funciona como um aplicativo inteligente (PWA): assim que você abre o painel 'Hoje', as informações e os guias visuais ficam salvos no próprio aparelho. Você consegue consultar os alertas e as orientações da sua lavoura mesmo quando estiver sem internet no meio do campo.",
        destaque: true,
    },
    {
        id: "pouca-leitura-acessibilidade",
        numero: "04",
        categoria: "Uso no Campo",
        pergunta: "Tenho dificuldade para ler ou prefiro não digitar. Consigo usar?",
        resposta:
            "Sim! O Argos foi planejado desde o primeiro dia para quem lê pouco ou não tem familiaridade com celulares modernos.\n\nAs perguntas aparecem uma por tela, com figuras bem visíveis e botões grandes de toque fácil. Você também conta com o botão 'Ouvir' para escutar qualquer aviso falado em voz alta pelo próprio aparelho. Se preferir, um filho, neto ou técnico pode fazer seu cadastro em menos de 3 minutos.",
    },
    {
        id: "precisa-de-senha",
        numero: "05",
        categoria: "Custos & Acesso",
        pergunta: "Preciso criar conta, lembrar de senha ou guardar código de acesso?",
        resposta:
            "Não precisa decorar senha nem digitar PIN toda vez que for usar. O Argos guarda sua identificação com segurança no próprio celular.\n\nDepois que você responde a triagem inicial pela primeira vez, toda vez que abrir o Argos você já entra direto na tela 'Hoje', com os alertas da sua cidade e os cuidados da sua plantação.",
    },
    {
        id: "diferenca-chatbots",
        numero: "06",
        categoria: "Sobre o Argos",
        pergunta: "Qual é a diferença entre o Argos e outros assistentes de mensagem?",
        resposta:
            "A grande diferença é simples: outros assistentes no WhatsApp exigem que você saiba o que perguntar e gaste tempo digitando mensagens.\n\nO lema do Argos é: eles respondem quando você pergunta; o Argos avisa antes. Sabendo qual é a sua roça, nosso sistema monitora o tempo dia e noite e avisa você preventivamente sobre seca, excesso de chuva ou pragas antes que você sofra a perda.",
    },
    {
        id: "fontes-dos-dados",
        numero: "07",
        categoria: "Previsões & Dados",
        pergunta: "De onde vêm as previsões do tempo e os alertas da minha região?",
        resposta:
            "Todas as informações do Argos vêm de fontes públicas oficiais e pesquisas agronômicas comprovadas.\n\nNós monitoramos dados meteorológicos do Instituto Nacional de Meteorologia (INMET), avisos de emergência da Defesa Civil e estudos da Embrapa e do IBGE. Todo aviso que aparece na tela traz o nome do órgão responsável, garantindo total transparência e segurança para suas decisões.",
    },
    {
        id: "aviso-de-pragas-vizinhos",
        numero: "08",
        categoria: "Uso no Campo",
        pergunta: "Como funciona o aviso colaborativo de pragas com os vizinhos?",
        resposta:
            "Se você avistar lagartas, fungos ou insetos atacando suas plantas, você pode tocar no botão 'Vi essa praga aqui' e registrar a ocorrência em poucos segundos.\n\nO sistema reúne esses relatos de forma anônima e gera um alerta para os outros produtores cadastrados no mesmo município que também plantam a mesma cultura. Assim, toda a vizinhança ganha tempo para inspecionar as lavouras e aplicar o manejo correto.",
    },
    {
        id: "culturas-atendidas",
        numero: "09",
        categoria: "Sobre o Argos",
        pergunta: "Quais lavouras o Argos já acompanha atualmente?",
        resposta:
            "Hoje o foco principal do Argos é o milho e o feijão, duas das culturas mais importantes para a agricultura familiar brasileira.\n\nNosso guia visual mostra a comparação da planta sadia com a planta sofrendo por seca, excesso d'água ou praga. No nosso plano de expansão, novas culturas como mandioca, hortaliças e frutíferas serão integradas.",
    },
    {
        id: "como-comecar-agora",
        numero: "10",
        categoria: "Custos & Acesso",
        pergunta: "Como posso começar a usar o Argos na minha propriedade agora?",
        resposta:
            "Basta tocar no botão 'Começar' no topo desta página.\n\nVocê responde a 10 perguntas fáceis sobre o seu município, o que você planta e a área aproximada. Não pedimos documentos complicados nem dados de banco. Em instantes o Argos monta o perfil da sua roça e você passa a receber os alertas.",
    },
];

const categorias = [
    "Todas",
    "Sobre o Argos",
    "Custos & Acesso",
    "Celular & Conexão",
    "Uso no Campo",
    "Previsões & Dados",
];

export default function Faq() {
    const [busca, setBusca] = useState("");
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");

    const itensFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return faqData.filter((item) => {
            const matchCategoria =
                categoriaAtiva === "Todas" || item.categoria === categoriaAtiva;
            const matchBusca =
                !termo ||
                item.pergunta.toLowerCase().includes(termo) ||
                item.resposta.toLowerCase().includes(termo) ||
                item.categoria.toLowerCase().includes(termo);
            return matchCategoria && matchBusca;
        });
    }, [busca, categoriaAtiva]);

    return (
        <main className="w-full overflow-hidden bg-fundo font-corpo text-lg leading-relaxed text-bege">
            <ScrollReveal />

            {/* HERO */}
            <section
                id="inicio"
                className="relative overflow-x-clip overflow-y-visible bg-[radial-gradient(720px_440px_at_80%_35%,rgba(125,190,140,.18),transparent_70%),radial-gradient(540px_340px_at_10%_0%,rgba(217,166,80,.12),transparent_70%),#17110D]"
            >
                {/* Linhas de relevo como background sutil */}
                <svg
                    aria-hidden="true"
                    viewBox="0 0 1440 400"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
                >
                    <g
                        fill="none"
                        stroke="#3A2F27"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                    >
                        <path d="M-20 280 C 260 210 520 340 800 260 S 1250 210 1460 270" />
                        <path d="M-20 320 C 260 250 520 380 800 300 S 1250 250 1460 310" />
                        <path d="M-20 360 C 260 290 520 420 800 340 S 1250 290 1460 350" />
                    </g>
                </svg>

                <Navbar />

                <div
                    data-reveal
                    className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-7 pt-14 pb-20 sm:pb-24"
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-S uppercase tracking-wider text-salvia">Dúvidas Frequentes</span>
                    </div>

                    <h1 className="font-titulo text-[clamp(38px,5.8vw,76px)] font-extrabold uppercase leading-[1.05] text-bege">
                        Perguntas sobre <br />
                        <span className="text-salvia">o seu copiloto.</span>
                    </h1>

                    <p className="max-w-[640px] text-[clamp(18px,1.9vw,22px)] text-texto-2">
                        Tire suas dúvidas sobre o funcionamento do Argos na roça,
                        acessibilidade, conectividade e como ele protege sua colheita.
                    </p>

                    {/* cards de destaque */}
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-[880px]">
                        <div className="rounded-xl border border-linha bg-card/60 p-4 backdrop-blur-xs">
                            <div className="flex items-center gap-2.5 text-salvia">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span className="font-titulo text-sm font-bold uppercase tracking-wider">
                                    100% Gratuito
                                </span>
                            </div>
                            <p className="mt-1.5 text-sm text-texto-2">
                                Sem mensalidade para o produtor rural familiar.
                            </p>
                        </div>

                        <div className="rounded-xl border border-linha bg-card/60 p-4 backdrop-blur-xs">
                            <div className="flex items-center gap-2.5 text-ambar">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
                                </svg>
                                <span className="font-titulo text-sm font-bold uppercase tracking-wider">
                                    Guarda Offline
                                </span>
                            </div>
                            <p className="mt-1.5 text-sm text-texto-2">
                                Os últimos alertas ficam salvos no seu aparelho.
                            </p>
                        </div>

                        <div className="rounded-xl border border-linha bg-card/60 p-4 backdrop-blur-xs">
                            <div className="flex items-center gap-2.5 text-salvia">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                                <span className="font-titulo text-sm font-bold uppercase tracking-wider">
                                    Voz e Figuras
                                </span>
                            </div>
                            <p className="mt-1.5 text-sm text-texto-2">
                                Fácil para quem lê pouco ou prefere ouvir.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
