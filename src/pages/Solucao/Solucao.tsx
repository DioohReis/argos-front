import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";
import BadgeAlerta, { type NivelAlerta } from "../../components/BadgeAlerta/BadgeAlerta";

/*
  Solução !!
  Apresenta o problema agrário,
  a tese da solução, o funcionamento técnico e humano,
  e evidências oficiais (IBGE, CNM, INMET, OMM, OCB).
*/

type CenárioSimulado = "cida" | "valdir";

interface DetalhesCenario {
  id: CenárioSimulado;
  produtor: string;
  idade: number;
  localidade: string;
  culturas: string[];
  area: string;
  condicaoAcesso: string;
  desafioClima: string;
  alertaNivel: NivelAlerta;
  alertaTitulo: string;
  alertaMensagem: string;
  audioTexto: string;
  fonteOficial: string;
  acaoRecomendada: string;
  previsaoIA: {
    rendimentoEstimado: string;
    riscoQuebra: string;
    probabilidade: string;
  };
  impactoEvitado: string;
}

const CENARIOS: Record<CenárioSimulado, DetalhesCenario> = {
  cida: {
    id: "cida",
    produtor: "Dona Cida",
    idade: 58,
    localidade: "Petrolina / PE (Sertão do São Francisco)",
    culturas: ["Feijão-caupi", "Milho de sequeiro", "Mandioca"],
    area: "3,0 hectares",
    condicaoAcesso: "Letramento restrito (prefere áudio); celular compartilhado com sinal 3G fraco; sem assistência técnica prévia.",
    desafioClima: "Estiagem severa e ondas de calor aceleradas pelo El Niño de 2026, com escassez de água na cisterna.",
    alertaNivel: 3,
    alertaTitulo: "Perigo de Seca e Calor Extremo",
    alertaMensagem: "Sem previsão de chuva nos próximos 12 dias. Temperaturas acima de 36°C com baixa umidade do solo.",
    audioTexto: "Atenção Dona Cida. Perigo de seca em Petrolina. Não semeie milho nesta semana. Guarde a água da cisterna e cubra o solo com palha para reter a umidade.",
    fonteOficial: "INMET / CEMADEN (Monitor de Secas)",
    acaoRecomendada: "Suspender semeadura de sequeiro imediata, priorizar retenção de água em mulching/cobertura vegetal e vedar reservatórios comunitários.",
    previsaoIA: {
      rendimentoEstimado: "680 kg/ha (redução projetada de 42%)",
      riscoQuebra: "ALTO RISCO",
      probabilidade: "78% de chance de quebra se plantado agora",
    },
    impactoEvitado: "Economia de até R$ 4.200 em sementes e insumos que seriam calcinados pelo solo quente sem germinação.",
  },
  valdir: {
    id: "valdir",
    produtor: "Seu Valdir",
    idade: 46,
    localidade: "Bento Gonçalves / RS (Serra Gaúcha)",
    culturas: ["Milho", "Uva para cooperativa"],
    area: "18,0 hectares",
    condicaoAcesso: "Lê bem, mas com rotina diária densa no campo; internet oscilante nos vales da serra.",
    desafioClima: "Excesso de precipitação torrencial e alta umidade relativa contínua promovida pelo padrão El Niño no Sul.",
    alertaNivel: 2,
    alertaTitulo: "Atenção: Chuva Torrencial e Risco de Míldio",
    alertaMensagem: "Acumulado de 140 mm projetado para 48h. Risco alto de encharcamento e desenvolvimento fúngico foliar.",
    audioTexto: "Atenção Seu Valdir. Chuvas fortes nos próximos dois dias na Serra Gaúcha. Drene as linhas baixas da lavoura e aplique caldas de proteção antes do temporal.",
    fonteOficial: "Defesa Civil / CEMADEN / Embrapa Uva e Vinho",
    acaoRecomendada: "Desobstruir drenos de escoamento rápido na encosta e antecipar aplicação de fungicida protetor de contato antes da lâmina d'água.",
    previsaoIA: {
      rendimentoEstimado: "4.850 kg/ha no milho (dentro da média se drenado)",
      riscoQuebra: "MÉDIO RISCO FÚNGICO",
      probabilidade: "62% de incidência fúngica sem manejo preventivo",
    },
    impactoEvitado: "Preservação de até 35% dos cachos de uva que poderiam apodrecer na videira antes da maturação.",
  },
};

export default function Solucao() {
  const [cenarioAtivo, setCenarioAtivo] = useState<CenárioSimulado>("cida");
  const [estaOuvindo, setEstaOuvindo] = useState(false);
  const [etapaFluxoAtiva, setEtapaFluxoAtiva] = useState<number>(1);

  const cenario = CENARIOS[cenarioAtivo];

  const falarAlerta = (texto: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Seu navegador não suporta sintetizador de voz nativo.");
      return;
    }
    window.speechSynthesis.cancel();
    if (estaOuvindo) {
      setEstaOuvindo(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = "pt-BR";
    utter.rate = 0.95;
    utter.onend = () => setEstaOuvindo(false);
    utter.onerror = () => setEstaOuvindo(false);
    setEstaOuvindo(true);
    window.speechSynthesis.speak(utter);
  };

  return (
    <main className="w-full overflow-hidden bg-fundo font-corpo text-lg leading-relaxed text-bege selection:bg-salvia selection:text-fundo">
      <ScrollReveal />
      <Navbar />

      {/* Hero*/}
      <section className="relative overflow-hidden pt-8 pb-20 md:pt-14 md:pb-32">

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="h-full w-full">
            <g fill="none" stroke="#7DBE8C" strokeWidth="1.2" strokeDasharray="3 6">
              <path d="M-50,200 C300,120 700,280 1100,180 S1500,240 1600,180" />
              <path d="M-50,340 C350,220 650,420 1050,300 S1450,380 1600,320" />
              <path d="M-50,520 C250,440 750,620 1150,460 S1450,560 1600,480" />
              <path d="M-50,700 C400,600 600,780 1000,660 S1500,720 1600,650" />
            </g>
          </svg>
        </div>

        {/* Gradientes atmosféricos */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[950px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(125,190,140,0.15),rgba(217,166,80,0.08)_50%,transparent_75%)] blur-3xl"
        />

        <div className="relative mx-auto max-w-[1240px] px-6 lg:px-8">
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            <div data-reveal className="lg:col-span-7 flex flex-col gap-6">
              <h1 className="font-titulo text-[clamp(36px,5.2vw,72px)] font-extrabold uppercase leading-[1.04] tracking-tight text-bege">
                Onde a ciência climática encontra o{" "}
                <span className="text-transparent bg-clip-text bg-salvia">
                  chão da roça.
                </span>
              </h1>
              <p className="text-[clamp(18px,1.9vw,22px)] text-texto-2 leading-relaxed">
                O <strong className="text-bege">Argos</strong> é o copiloto digital feito para transformar alertas meteorológicos complexos e dispersos em avisos proativos, orientações de manejo e alertas comunitários para quem mais produz alimento e menos assistência técnica recebe.
              </p>

              {/* Destaques*/}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="rounded-2xl border border-linha/80 bg-card/60 p-4 backdrop-blur-sm">
                  <div className="text-salvia font-titulo text-lg font-bold">100% Gratuito</div>
                  <div className="text-xs text-texto-2 mt-1">O pequeno produtor não paga. Financiado por cooperativas e ATER (B2B2C).</div>
                </div>
                <div className="rounded-2xl border border-linha/80 bg-card/60 p-4 backdrop-blur-sm">
                  <div className="text-ambar font-titulo text-lg font-bold">Proativo & Áudio</div>
                  <div className="text-xs text-texto-2 mt-1">Avisa antes sem exigir digitação. Linguagem Simples (Lei 15.263/2025).</div>
                </div>
                <div className="rounded-2xl border border-linha/80 bg-card/60 p-4 backdrop-blur-sm">
                  <div className="text-bege font-titulo text-lg font-bold">Resiliente Offline</div>
                  <div className="text-xs text-texto-2 mt-1">Painel guardado no aparelho para funcionar sem sinal de operadora no pasto.</div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#demonstracao"
                  className="inline-flex min-h-14 items-center justify-center rounded-xl border-2 border-salvia bg-salvia px-7 font-titulo text-[16px] font-semibold uppercase tracking-wide text-fundo shadow-[0_12px_32px_rgba(125,190,140,0.25)] transition-transform duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
                >
                  Testar Simulação Interativa
                </a>
                <a
                  href="#problema"
                  className="inline-flex min-h-14 items-center justify-center rounded-xl border-2 border-linha bg-card/70 px-7 font-titulo text-[16px] font-semibold uppercase tracking-wide text-bege transition-all duration-200 hover:border-salvia hover:text-salvia active:scale-[0.98]"
                >
                  Entender o Diagnóstico
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. O PROBLEMA COLOCADO: A REALIDADE CRUCIAL DO CAMPO
          (Sem caixas convencionais: layout tipo dossiê cartográfico)
      ========================================================= */}
      <section id="problema" className="relative bg-[#1A130E] py-24 md:py-32 border-t border-b border-linha/70">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
          <div data-reveal className="max-w-[840px]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-terra-clara text-amber-500">O Diagnóstico da Realidade</p>
            <h2 className="font-titulo text-[clamp(32px,4vw,56px)] font-extrabold uppercase leading-[1.08] text-bege mt-2">
              Por que quem alimenta o país decide na escuridão?
            </h2>
            <p className="mt-5 text-[19px] text-texto-2 leading-relaxed">
              O agronegócio de grande escala dispõe de estações meteorológicas privativas, sensores de telemetria, consultoria agronômica diária e softwares de precisão. Já a agricultura familiar — que responde pela esmagadora maioria dos estabelecimentos rurais brasileiros — enfrenta um abismo triplo: <strong className="text-bege">falta de assistência</strong>, <strong className="text-bege">barreira de linguagem</strong> e <strong className="text-bege">volatilidade climática extrema</strong>.
            </p>
          </div>

          {/* Dossiê em mosaico assimétrico com dados empíricos certificados pelo documento */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bloco 01 - Assistência Técnica */}
            <div data-reveal className="relative rounded-3xl border border-linha bg-card/80 p-7 flex flex-col justify-between group hover:border-salvia/60 transition-colors">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="font-titulo text-5xl font-extrabold text-salvia">77%</span>
                  <span className="text-xs font-mono text-texto-2">Censo Agro / IBGE</span>
                </div>
                <h3 className="font-titulo text-xl font-bold uppercase text-bege mt-4">
                  Agricultura Familiar Abandonada
                </h3>
                <p className="mt-3 text-sm text-texto-2 leading-relaxed">
                  77% de todos os estabelecimentos rurais do Brasil são de base familiar (3,89 milhões de propriedades). No entanto, <strong className="text-bege">apenas cerca de 20% tinham acesso a assistência técnica contínua (ATER)</strong>. Os outros 80% tomam decisões cruciais de plantio e colheita inteiramente desamparados.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-linha/50 text-[11px] font-mono text-texto-2">
                Fonte: IBGE Censo Agropecuário 2017 [F1] / ENAP PNATER [F2]
              </div>
            </div>

            {/* Bloco 02 - Barreira de Escolaridade e Linguagem */}
            <div data-reveal className="relative rounded-3xl border border-linha bg-card/80 p-7 flex flex-col justify-between group hover:border-ambar/60 transition-colors">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="font-titulo text-5xl font-extrabold text-ambar">23%</span>
                  <span className="text-xs font-mono text-texto-2">Não Alfabetizados</span>
                </div>
                <h3 className="font-titulo text-xl font-bold uppercase text-bege mt-4">
                  O Abismo do Letramento
                </h3>
                <p className="mt-3 text-sm text-texto-2 leading-relaxed">
                  23% dos produtores rurais declararam não saber ler e escrever, e <strong className="text-bege">79,1% não concluíram o ensino fundamental</strong>. Portais oficiais como INMET e CEMADEN emitem relatórios em jargões técnicos herméticos (ex.: "isietas", "mm acumulado em 72h", "estresse hídrico") que ninguém na lavoura compreende.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-linha/50 text-[11px] font-mono text-texto-2">
                Fonte: IBGE Censo Agropecuário 2017 (Infográfico de Escolaridade) [F4]
              </div>
            </div>

            {/* Bloco 03 - Conectividade Rascunhada */}
            <div data-reveal className="relative rounded-3xl border border-linha bg-card/80 p-7 flex flex-col justify-between group hover:border-salvia/60 transition-colors">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="font-titulo text-5xl font-extrabold text-bege">26%</span>
                  <span className="text-xs font-mono text-texto-2">Sinal Dividido</span>
                </div>
                <h3 className="font-titulo text-xl font-bold uppercase text-bege mt-4">
                  Conexão Precária no Pasto
                </h3>
                <p className="mt-3 text-sm text-texto-2 leading-relaxed">
                  Embora 83% dos moradores do campo usem a internet em algum momento, <strong className="text-bege">26% dos domicílios rurais conectados dividem a senha do Wi-Fi com o vizinho</strong>. No meio do roçado, o sinal 3G oscila ou desaparece por completo, inviabilizando aplicações web comuns que exigem internet rápida e contínua.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-linha/50 text-[11px] font-mono text-texto-2">
                Fonte: Teletime PNAD TIC 2025 [F7] / Cetic.br TIC Domicílios 2025 [F9]
              </div>
            </div>

            {/* Bloco 04 - O Golpe do Clima Extremo */}
            <div data-reveal className="relative rounded-3xl border border-linha bg-card/80 p-7 flex flex-col justify-between group hover:border-red-400/60 transition-colors">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="font-titulo text-4xl sm:text-5xl font-extrabold text-nivel-4">R$ 5,6 bi</span>
                  <span className="text-xs font-mono text-texto-2">Prejuízo Agro</span>
                </div>
                <h3 className="font-titulo text-xl font-bold uppercase text-bege mt-4">
                  Desastres do El Niño 2026
                </h3>
                <p className="mt-3 text-sm text-texto-2 leading-relaxed">
                  Apenas no terceiro trimestre de 2026 (julho a setembro), desastres climáticos causaram <strong className="text-bege">R$ 12,6 bilhões em danos no Brasil</strong>. A agricultura liderou os prejuízos com mais de R$ 5,6 bi perdidos. O El Niño, com aquecimento do Pacífico e pico previsto até o fim do ano, castiga o Nordeste com seca extrema e o Sul com temporais.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-linha/50 text-[11px] font-mono text-texto-2">
                Fonte: CNM Boletim El Niño 2026/2027 [F14] / OMM & NOAA [F12][F13]
              </div>
            </div>
          </div>

          {/* Citação em destaque editorial com borda orgânica */}
          <div data-reveal className="mt-14 rounded-3xl border-2 border-linha/80 bg-fundo p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-salvia/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-[780px]">
                <p className="text-xs font-mono uppercase tracking-widest text-salvia">A Conclusão Inescapável</p>
                <h4 className="font-titulo text-2xl md:text-3xl font-bold uppercase text-bege mt-1">
                  "O celular já está no bolso do trabalhador rural; a falha é de entrega, linguagem e prontidão."
                </h4>
                <p className="mt-2 text-texto-2 text-base">
                  Não falta dado de satélite no Brasil; falta a tradução dessa inteligência para o momento exato em que a semente ainda pode ser poupada.
                </p>
              </div>
              <Link
                to="/triagem"
                className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-salvia bg-salvia/20 px-6 py-3.5 font-titulo text-sm font-semibold uppercase text-salvia hover:bg-salvia hover:text-fundo transition-all"
              >
                Ver Triagem em Ação →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. A SOLUÇÃO ARGOS: COMO ELA SE DIFERENCIA DO MERCADO
          (Por que não é apenas "mais um chatbot"?)
      ========================================================= */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
          <div data-reveal className="text-center max-w-[800px] mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-salvia">Proposta Única de Valor</span>
            <h2 className="font-titulo text-[clamp(32px,4vw,54px)] font-extrabold uppercase leading-[1.08] text-bege mt-2">
              Por que o Argos não é mais um chatbot de WhatsApp?
            </h2>
            <p className="mt-4 text-lg text-texto-2">
              A maioria das iniciativas recentes tentou forçar chatbots genéricos de mensagens ou ferramentas pesadas de diagnóstico pós-morte. O Argos opera em uma lógica oposta: <strong className="text-bege">proatividade preventiva, síntese sensorial e independência de rede</strong>.
            </p>
          </div>

          {/* Matriz Comparativa Estilizada em 3 Colunas Assimétricas */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Coluna 1: Chatbots Reativos */}
            <div data-reveal className="rounded-3xl border border-linha bg-card/60 p-8 flex flex-col justify-between">
              <div>
                <div className="inline-block rounded-full bg-red-950/40 border border-red-700/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-red-300">
                  Modelo Reativo
                </div>
                <h3 className="font-titulo text-2xl font-bold uppercase text-bege mt-4">
                  RAImundo & JoIA
                </h3>
                <p className="text-xs text-texto-2 font-mono mt-1">Embrapa [F22] · CNA / SENAR [F24]</p>
                <ul className="mt-6 space-y-4 text-sm text-texto-2">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span><strong>Exigem pergunta ativa:</strong> O produtor precisa saber exatamente o que perguntar, formular texto digitado e ter familiaridade com escrita.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span><strong>Dependem de internet estável:</strong> Funcionam confinados ao WhatsApp, sem qualquer tolerância a quedas de conexão ou trabalho offline na roça.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-400 font-bold shrink-0">✕</span>
                    <span><strong>Risco regulatório e de custos:</strong> Políticas da Meta baniram assistentes de IA de uso geral em contas empresariais de WhatsApp [F35].</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-linha/50 text-xs text-texto-2">
                Resultado: O produtor não pergunta o que não sabe que está por vir.
              </div>
            </div>

            {/* Coluna 2: Diagnóstico por Imagem Tardia */}
            <div data-reveal className="rounded-3xl border border-linha bg-card/60 p-8 flex flex-col justify-between">
              <div>
                <div className="inline-block rounded-full bg-amber-950/40 border border-amber-700/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Diagnóstico Tardio
                </div>
                <h3 className="font-titulo text-2xl font-bold uppercase text-bege mt-4">
                  Plantix & Visão Computacional
                </h3>
                <p className="text-xs text-texto-2 font-mono mt-1">ICRISAT / Plantix [F26]</p>
                <ul className="mt-6 space-y-4 text-sm text-texto-2">
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold shrink-0">✕</span>
                    <span><strong>Ação pós-dano:</strong> A planta já precisa estar amarelada, furada ou infestada para que a câmera consiga detectar a enfermidade.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold shrink-0">✕</span>
                    <span><strong>Hardware exigente:</strong> Exige smartphone moderno com câmera limpa e alta taxa de upload de imagens pesadas para nuvem.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-400 font-bold shrink-0">✕</span>
                    <span><strong>Não previne choques climáticos:</strong> Não calcula risco de quebra de safra por estiagem antes do plantio.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-linha/50 text-xs text-texto-2">
                Resultado: Trata a doença quando a perda econômica já se consolidou.
              </div>
            </div>

            {/* Coluna 3: O Modelo Argos (Destaque Central) */}
            <div data-reveal className="relative rounded-3xl border-2 border-salvia bg-gradient-to-b from-[#1C2C22] to-card p-8 flex flex-col justify-between shadow-[0_20px_60px_rgba(125,190,140,0.18)]">
              <div className="absolute -top-3.5 right-6 rounded-full bg-salvia px-3 py-1 font-titulo text-[11px] font-bold uppercase tracking-wider text-fundo">
                DIFERENCIAL ARGOS
              </div>
              <div>
                <div className="inline-block rounded-full bg-salvia/20 border border-salvia/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-salvia">
                  Inteligência Antecipada
                </div>
                <h3 className="font-titulo text-3xl font-extrabold uppercase text-bege mt-4">
                  Argos Panoptes do Campo
                </h3>
                <p className="text-xs text-salvia font-mono mt-1">CitizenTech Proativo · Offline First</p>
                <ul className="mt-6 space-y-4 text-sm text-bege">
                  <li className="flex items-start gap-2.5">
                    <span className="text-salvia font-bold shrink-0">✓</span>
                    <span><strong className="text-white">Avisa antes:</strong> Cruza a cultura cadastrada com modelos preditivos de ML para emitir alertas antes da semeadura.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-salvia font-bold shrink-0">✓</span>
                    <span><strong className="text-white">Figura + Áudio + Cor:</strong> Sistema de 4 níveis inspirado no INMET, botão "ouvir" e conformidade com a Lei da Linguagem Simples.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-salvia font-bold shrink-0">✓</span>
                    <span><strong className="text-white">Armazenamento Offline:</strong> O último painel e as recomendações ficam salvas no navegador (PWA / localStorage).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-salvia font-bold shrink-0">✓</span>
                    <span><strong className="text-white">Rede Comunitária de Pragas:</strong> Relatos do vizinho viram avisos no raio do município em tempo hábil.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-salvia/30 text-xs font-semibold text-salvia">
                Resultado: O produtor se prepara e poupa a safra antes que o desastre ocorra.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. O PÚBLICO-ALVO E AS PERSONAS DA VIDA REAL
          (Mostrando quem o sistema protege e como funciona na prática)
      ========================================================= */}
      <section className="relative bg-card/60 py-24 md:py-32 border-t border-b border-linha/80">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
          <div data-reveal className="max-w-[760px]">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-ambar">Para Quem É Feito</span>
            <h2 className="font-titulo text-[clamp(32px,4vw,52px)] font-extrabold uppercase leading-[1.08] text-bege mt-2">
              Três olhares sobre a mesma terra
            </h2>
            <p className="mt-4 text-lg text-texto-2">
              A arquitetura do Argos foi validada para atender tanto a realidade do semiárido nordestino quanto as serras do Sul, criando inclusive a figura indispensável do <strong className="text-bege">"Ajudante Digital"</strong> que auxilia a família.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Persona 1: Dona Cida */}
            <div data-reveal className="rounded-3xl border border-linha bg-fundo p-7 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-ambar/20 border border-ambar/40 flex items-center justify-center font-titulo text-xl font-bold text-ambar">
                    DC
                  </div>
                  <div>
                    <h3 className="font-titulo text-xl font-bold uppercase text-bege">Dona Cida, 58 anos</h3>
                    <p className="text-xs text-texto-2">Petrolina / PE · 3 hectares de sequeiro</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3 text-sm text-texto-2">
                  <p><strong className="text-bege">Culturas:</strong> Feijão, milho e mandioca.</p>
                  <p><strong className="text-bege">Comportamento:</strong> Lê com dificuldade, recorre a mensagens de voz no celular. Medo constante da perda de água na seca.</p>
                  <p><strong className="text-bege">Como o Argos atua:</strong> Dá avisos de escassez em voz alta, alerta sobre períodos críticos para não abrir covas e ensina a cobrir o solo.</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-linha/50 text-xs text-salvia font-semibold">
                Persona Central da Validação Acadêmica
              </div>
            </div>

            {/* Persona 2: Lucas */}
            <div data-reveal className="rounded-3xl border border-linha bg-fundo p-7 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-salvia/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-salvia/20 border border-salvia/40 flex items-center justify-center font-titulo text-xl font-bold text-salvia">
                    L
                  </div>
                  <div>
                    <h3 className="font-titulo text-xl font-bold uppercase text-bege">Lucas, 22 anos</h3>
                    <p className="text-xs text-texto-2">Filho da Dona Cida · O "Ajudante Digital"</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3 text-sm text-texto-2">
                  <p><strong className="text-bege">Papel:</strong> Ponte de inclusão geracional na família rural.</p>
                  <p><strong className="text-bege">Comportamento:</strong> Fluente no smartphone, é quem faz o cadastro e a triagem inicial das glebas da mãe sem atrito.</p>
                  <p><strong className="text-bege">Como o Argos atua:</strong> Formulário guiado com passos rápidos (10 perguntas), sem exigência de senhas complexas ou burocracia bancária.</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-linha/50 text-xs text-ambar font-semibold">
                Facilitador de Adoção Tecnológica
              </div>
            </div>

            {/* Persona 3: Seu Valdir */}
            <div data-reveal className="rounded-3xl border border-linha bg-fundo p-7 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center font-titulo text-xl font-bold text-blue-300">
                    SV
                  </div>
                  <div>
                    <h3 className="font-titulo text-xl font-bold uppercase text-bege">Seu Valdir, 46 anos</h3>
                    <p className="text-xs text-texto-2">Serra Gaúcha / RS · 18 hectares cooperados</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3 text-sm text-texto-2">
                  <p><strong className="text-bege">Culturas:</strong> Milho e uva vinífera.</p>
                  <p><strong className="text-bege">Comportamento:</strong> Lê bem, porém trabalha o dia inteiro no trator. Medo de chuvas em excesso, granizo e apodrecimento fúngico.</p>
                  <p><strong className="text-bege">Como o Argos atua:</strong> Notificações em nível de severidade para aplicação preventiva de calda e abertura de valas de escoamento.</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-linha/50 text-xs text-bege font-semibold">
                Perfil de Produtor Cooperado (B2B2C)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. SIMULADOR INTERATIVO: EXPERIMENTE O ARGOS EM TEMPO REAL
          (Permite à banca e ao usuário ver os dados oficiais e o áudio reagindo)
      ========================================================= */}
      <section id="demonstracao" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
          <div data-reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-salvia">Demonstração Interativa</span>
              <h2 className="font-titulo text-[clamp(32px,3.8vw,50px)] font-extrabold uppercase leading-[1.08] text-bege mt-2">
                Simule o copiloto em dois cenários reais
              </h2>
              <p className="mt-3 text-texto-2 text-base max-w-[680px]">
                Selecione abaixo o perfil para ver como o modelo de inteligência artificial, o algoritmo de triagem e o sintetizador de voz reagem aos dados meteorológicos oficiais.
              </p>
            </div>

            {/* Alternador de Cenários */}
            <div className="flex rounded-2xl border border-linha bg-card p-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCenarioAtivo("cida");
                  if (estaOuvindo) window.speechSynthesis.cancel();
                  setEstaOuvindo(false);
                }}
                className={`rounded-xl px-5 py-2.5 font-titulo text-sm font-semibold uppercase tracking-wider transition-all ${
                  cenarioAtivo === "cida"
                    ? "bg-salvia text-fundo shadow-md"
                    : "text-texto-2 hover:text-bege"
                }`}
              >
                Dona Cida (Sertão PE)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCenarioAtivo("valdir");
                  if (estaOuvindo) window.speechSynthesis.cancel();
                  setEstaOuvindo(false);
                }}
                className={`rounded-xl px-5 py-2.5 font-titulo text-sm font-semibold uppercase tracking-wider transition-all ${
                  cenarioAtivo === "valdir"
                    ? "bg-salvia text-fundo shadow-md"
                    : "text-texto-2 hover:text-bege"
                }`}
              >
                Seu Valdir (Serra RS)
              </button>
            </div>
          </div>

          {/* Painel do Simulador Dinâmico */}
          <div data-reveal className="mt-10 rounded-[32px] border-2 border-linha/90 bg-card p-6 md:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.55)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Esquerda: Informações do Contexto e da Roça */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-salvia" />
                    <span className="font-mono text-xs uppercase tracking-wider text-salvia">Perfil da Propriedade no Banco</span>
                  </div>
                  <h3 className="font-titulo text-2xl font-bold uppercase text-bege mt-2">
                    {cenario.produtor} ({cenario.idade} anos)
                  </h3>
                  <p className="text-sm text-texto-2 mt-1">{cenario.localidade}</p>
                </div>

                <div className="space-y-3 rounded-2xl border border-linha/80 bg-fundo/70 p-5 text-sm">
                  <div className="flex justify-between py-1 border-b border-linha/40">
                    <span className="text-texto-2">Área Declarada:</span>
                    <span className="font-semibold text-bege">{cenario.area}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-linha/40">
                    <span className="text-texto-2">Culturas:</span>
                    <span className="font-semibold text-bege">{cenario.culturas.join(", ")}</span>
                  </div>
                  <div className="flex flex-col py-1 border-b border-linha/40">
                    <span className="text-texto-2">Condição de Acesso:</span>
                    <span className="text-bege text-xs mt-1">{cenario.condicaoAcesso}</span>
                  </div>
                  <div className="flex flex-col py-1">
                    <span className="text-texto-2">Desafio Meteorológico:</span>
                    <span className="text-ambar text-xs mt-1 font-medium">{cenario.desafioClima}</span>
                  </div>
                </div>

                {/* Bloco de Predição de Machine Learning */}
                <div className="rounded-2xl border border-salvia/30 bg-mata/20 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-salvia">Módulo de IA Preditiva</span>
                    <span className="text-[10px] bg-salvia/30 text-salvia px-2 py-0.5 rounded font-mono">joblib / Scikit-Learn</span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="text-texto-2">Rendimento Esperado: </span>
                      <strong className="text-bege">{cenario.previsaoIA.rendimentoEstimado}</strong>
                    </div>
                    <div>
                      <span className="text-texto-2">Classificação de Quebra: </span>
                      <strong className="text-amber-400 font-bold">{cenario.previsaoIA.riscoQuebra}</strong>
                    </div>
                    <div>
                      <span className="text-texto-2">Probabilidade Estimada: </span>
                      <span className="text-bege">{cenario.previsaoIA.probabilidade}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direita: O Copiloto Digital em Ação (Tela "Hoje" gerada) */}
              <div className="lg:col-span-7 rounded-3xl border-2 border-linha/90 bg-fundo p-6 md:p-8 flex flex-col gap-6 shadow-inner">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linha/60 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-texto-2">Painel de Alerta Ativo</span>
                    <h4 className="font-titulo text-xl font-bold uppercase text-bege">Aviso em Linguagem Simples</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => falarAlerta(cenario.audioTexto)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                      estaOuvindo
                        ? "border-red-500 bg-red-950/40 text-red-300 animate-pulse"
                        : "border-salvia bg-salvia/20 text-salvia hover:bg-salvia hover:text-fundo"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                    {estaOuvindo ? "Parar Leitura" : "Ouvir em Voz Alta"}
                  </button>
                </div>

                {/* Badge Alerta Oficial */}
                <div>
                  <BadgeAlerta
                    nivel={cenario.alertaNivel}
                    titulo={cenario.alertaTitulo}
                    tamanho="grande"
                    className="w-full justify-start text-lg"
                  />
                  <p className="mt-3 text-base text-bege pl-2">
                    {cenario.alertaMensagem}
                  </p>
                </div>

                {/* Ação Prática Recomendada */}
                <div className="rounded-2xl border border-linha bg-card/80 p-5">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ambar">
                    <span>💡 Orientação Prática Imediata</span>
                  </div>
                  <p className="mt-2 text-sm text-bege font-medium leading-relaxed">
                    {cenario.acaoRecomendada}
                  </p>
                </div>

                {/* Impacto Financeiro Evitado & Fonte Oficial */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-xl border border-linha/60 bg-card/40 p-3.5">
                    <span className="text-[11px] text-texto-2 font-mono uppercase block">Impacto Econômico Evitado:</span>
                    <span className="text-xs font-semibold text-salvia mt-1 block">{cenario.impactoEvitado}</span>
                  </div>
                  <div className="rounded-xl border border-linha/60 bg-card/40 p-3.5">
                    <span className="text-[11px] text-texto-2 font-mono uppercase block">Fonte Oficial Auditada:</span>
                    <span className="text-xs font-semibold text-bege mt-1 block">{cenario.fonteOficial}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. COMO O ARGOS FUNCIONA: A JORNADA EM 5 PASSOS
          (Interativa, fluída e sem grades monótonas)
      ========================================================= */}
      <section className="relative bg-[#1A130E] py-24 md:py-32 border-t border-b border-linha/70">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
          <div data-reveal className="max-w-[800px]">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-salvia">Arquitetura de Experiência</span>
            <h2 className="font-titulo text-[clamp(32px,4vw,54px)] font-extrabold uppercase leading-[1.08] text-bege mt-2">
              A jornada do produtor em 5 passos descomplicados
            </h2>
            <p className="mt-4 text-lg text-texto-2">
              Desde o primeiro contato assistido no celular até o alerta emitido para a vizinhança: cada interação foi moldada para minimizar esforço cognitivo e barreiras de digitação.
            </p>
          </div>

          {/* Navegação de Etapas em Pílulas */}
          <div data-reveal className="mt-12 flex flex-wrap gap-2.5">
            {[
              { id: 1, rotulo: "1. Entrada & Consentimento" },
              { id: 2, rotulo: "2. Triagem Assistida" },
              { id: 3, rotulo: "3. Perfil & Modelos de IA" },
              { id: 4, rotulo: "4. Painel 'Hoje' Diário" },
              { id: 5, rotulo: "5. Guia Visual & Rede" },
            ].map((etapa) => (
              <button
                key={etapa.id}
                type="button"
                onClick={() => setEtapaFluxoAtiva(etapa.id)}
                className={`rounded-2xl px-5 py-3 font-titulo text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
                  etapaFluxoAtiva === etapa.id
                    ? "bg-salvia text-fundo shadow-lg scale-105"
                    : "border border-linha bg-card/80 text-texto-2 hover:border-salvia/50 hover:text-bege"
                }`}
              >
                {etapa.rotulo}
              </button>
            ))}
          </div>

          {/* Painel Descritivo da Etapa Selecionada */}
          <div data-reveal className="mt-8 rounded-3xl border border-linha bg-fundo p-8 md:p-12 relative overflow-hidden">
            {etapaFluxoAtiva === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4">
                  <div className="inline-block rounded-full bg-salvia/20 text-salvia px-3 py-1 font-mono text-xs uppercase font-bold">
                    Passo 01 · Acesso com Dignidade
                  </div>
                  <h3 className="font-titulo text-3xl font-extrabold uppercase text-bege">
                    Sem senhas complexas: nome, celular e consentimento
                  </h3>
                  <p className="text-base text-texto-2 leading-relaxed">
                    A primeira grande barreira dos sistemas tradicionais é o login com senhas cheias de caracteres especiais e e-mails que o produtor rural não utiliza. O Argos solicita apenas o nome, o celular com DDD e o município.
                  </p>
                  <p className="text-base text-texto-2 leading-relaxed">
                    O consentimento para uso exclusivo de proteção da lavoura é imperativo: <strong className="text-bege">sem consentimento, não há cadastro</strong> (RN03 do projeto, assegurando conformidade com a LGPD e ética CitizenTech).
                  </p>
                </div>
                <div className="md:col-span-5 rounded-2xl border border-linha/80 bg-card p-6 text-sm">
                  <div className="font-mono text-xs text-salvia uppercase">Regras Técnicas Envolvidas:</div>
                  <ul className="mt-3 space-y-2 text-texto-2">
                    <li>• <strong className="text-bege">RN02:</strong> Telefone único no banco Oracle com constraint UNIQUE.</li>
                    <li>• <strong className="text-bege">RN03:</strong> Validação com status HTTP 400 se não consentido.</li>
                    <li>• <strong className="text-bege">Armazenamento Local:</strong> Código do produtor retido no navegador (localStorage).</li>
                  </ul>
                </div>
              </div>
            )}

            {etapaFluxoAtiva === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4">
                  <div className="inline-block rounded-full bg-ambar/20 text-ambar px-3 py-1 font-mono text-xs uppercase font-bold">
                    Passo 02 · Inclusão de Baixo Letramento
                  </div>
                  <h3 className="font-titulo text-3xl font-extrabold uppercase text-bege">
                    Triagem visual com uma pergunta por tela e botão "ouvir"
                  </h3>
                  <p className="text-base text-texto-2 leading-relaxed">
                    Em vez de formulários extensos que causam desistência, a triagem apresenta de 10 a 12 perguntas objetivas, exibidas uma a uma.
                  </p>
                  <p className="text-base text-texto-2 leading-relaxed">
                    Cada opção vem com <strong className="text-bege">ícone ilustrado de grande dimensão (≥ 48px de área de toque)</strong>, permitindo que a seleção ocorra com facilidade mesmo em aparelhos antigos ou com as mãos calejadas da lida na terra.
                  </p>
                </div>
                <div className="md:col-span-5 rounded-2xl border border-linha/80 bg-card p-6 text-sm">
                  <div className="font-mono text-xs text-ambar uppercase">Acessibilidade WCAG AA:</div>
                  <ul className="mt-3 space-y-2 text-texto-2">
                    <li>• Contraste rigorosamente superior a 4,5:1 em todos os elementos.</li>
                    <li>• Fonte Lexend em títulos e Inter 18px no corpo para legibilidade máxima.</li>
                    <li>• Síntese de voz nativa via Web Speech API em português.</li>
                  </ul>
                </div>
              </div>
            )}

            {etapaFluxoAtiva === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4">
                  <div className="inline-block rounded-full bg-salvia/20 text-salvia px-3 py-1 font-mono text-xs uppercase font-bold">
                    Passo 03 · Ciência de Dados
                  </div>
                  <h3 className="font-titulo text-3xl font-extrabold uppercase text-bege">
                    Cruzamento do perfil com modelos de Machine Learning
                  </h3>
                  <p className="text-base text-texto-2 leading-relaxed">
                    A área da propriedade, as culturas plantadas (milho, feijão, uva) e a localização são cruzadas com o histórico histórico agronômico do IBGE SIDRA e medições diárias de chuva e temperatura da Open-Meteo.
                  </p>
                  <p className="text-base text-texto-2 leading-relaxed">
                    Dois modelos clássicos treinados em Python (Scikit-Learn) estimam: (1) <strong className="text-bege">Regressão Linear</strong> para prever o rendimento em kg/ha; e (2) <strong className="text-bege">Classificação Logística</strong> focada em recall para alertar sobre probabilidade de quebra de safra.
                  </p>
                </div>
                <div className="md:col-span-5 rounded-2xl border border-linha/80 bg-card p-6 text-sm">
                  <div className="font-mono text-xs text-salvia uppercase">Base Científica dos Modelos:</div>
                  <ul className="mt-3 space-y-2 text-texto-2">
                    <li>• <strong>IBGE SIDRA:</strong> Tabela 1612 (Produção Agrícola Municipal de 2005 a 2024).</li>
                    <li>• <strong>Open-Meteo:</strong> Chuva acumulada na safra, dias acima de 35°C e veranicos.</li>
                    <li>• <strong>NOAA:</strong> Índice ONI para mensuração da intensidade do El Niño/La Niña.</li>
                  </ul>
                </div>
              </div>
            )}

            {etapaFluxoAtiva === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4">
                  <div className="inline-block rounded-full bg-salvia/20 text-salvia px-3 py-1 font-mono text-xs uppercase font-bold">
                    Passo 04 · Informação Acionável
                  </div>
                  <h3 className="font-titulo text-3xl font-extrabold uppercase text-bege">
                    Tela "Hoje": Alertas decodificados em 4 níveis oficiais
                  </h3>
                  <p className="text-base text-texto-2 leading-relaxed">
                    Ao abrir o Argos pela manhã, o produtor não encontra gráficos complexos de satélite. Ele visualiza diretamente os alertas de seu município sob a regra <strong className="text-bege">Cor + Ícone + Palavra Curta</strong>.
                  </p>
                  <p className="text-base text-texto-2 leading-relaxed">
                    Seguindo os moldes do INMET, os avisos variam de 1 (Tudo Certo) a 4 (Grande Perigo), sempre acompanhados da data de vigência e da citação expressa da fonte oficial responsável (RN04).
                  </p>
                </div>
                <div className="md:col-span-5 rounded-2xl border border-linha/80 bg-card p-6 text-sm">
                  <div className="font-mono text-xs text-salvia uppercase">Exemplos de Mensagens Decodificadas:</div>
                  <ul className="mt-3 space-y-2 text-texto-2">
                    <li>• <span className="text-amber-400 font-semibold">Seca:</span> "Guarde água. Pouca chuva nos próximos 10 dias."</li>
                    <li>• <span className="text-blue-300 font-semibold">Chuva:</span> "Chuva forte amanhã. Abra os drenos da encosta."</li>
                    <li>• <span className="text-salvia font-semibold">Calor:</span> "Sol forte acima de 35°C. Cubra as sementes cedo."</li>
                  </ul>
                </div>
              </div>
            )}

            {etapaFluxoAtiva === 5 && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4">
                  <div className="inline-block rounded-full bg-salvia/20 text-salvia px-3 py-1 font-mono text-xs uppercase font-bold">
                    Passo 05 · Ação & Comunidade
                  </div>
                  <h3 className="font-titulo text-3xl font-extrabold uppercase text-bege">
                    Guia visual comparativo e radar colaborativo de pragas
                  </h3>
                  <p className="text-base text-texto-2 leading-relaxed">
                    Caso tenha dúvidas sobre a saúde da planta, o produtor consulta o Guia Visual comparando fotografias reais da planta sadia contra os quatro estados críticos: praga, seca, frio e excesso de água.
                  </p>
                  <p className="text-base text-texto-2 leading-relaxed">
                    Ao notar qualquer sinal incomum, ele aciona o botão <strong className="text-bege">"Vi essa praga aqui"</strong>. Esse registro georreferenciado é processado pela API e disseminado aos produtores vizinhos do mesmo município antes que o surto se alastre.
                  </p>
                </div>
                <div className="md:col-span-5 rounded-2xl border border-linha/80 bg-card p-6 text-sm">
                  <div className="font-mono text-xs text-salvia uppercase">Segurança Agronômica:</div>
                  <ul className="mt-3 space-y-2 text-texto-2">
                    <li>• O Argos não receita agrotóxicos ou produtos químicos sem laudo.</li>
                    <li>• Em casos de severidade alta, orienta: "Procure o técnico da cooperativa".</li>
                    <li>• Rede municipal cria escudo preventivo para culturas compartilhadas.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          7. MODELO DE NEGÓCIO B2B2C: QUEM PAGA E POR QUÊ
          (Sustentabilidade financeira e institucional)
      ========================================================= */}
      <section className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
          <div data-reveal className="max-w-[820px]">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-ambar">Sustentabilidade & Viabilidade</span>
            <h2 className="font-titulo text-[clamp(32px,4vw,52px)] font-extrabold uppercase leading-[1.08] text-bege mt-2">
              Quem financia a ferramenta se o produtor não paga?
            </h2>
            <p className="mt-4 text-lg text-texto-2 leading-relaxed">
              Cobrar mensalidade de quem perdeu a colheita ou vive na linha da subsistência inviabilizaria o impacto social do projeto. Por isso, o Argos opera sob a lógica <strong className="text-bege">B2B2C (Business to Business to Citizen)</strong>.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bloco 1: Cooperativas Agropecuárias */}
            <div data-reveal className="rounded-3xl border border-linha bg-card/70 p-8 flex flex-col justify-between">
              <div>
                <div className="text-3xl font-extrabold font-titulo text-salvia">Cooperativas</div>
                <h3 className="font-titulo text-xl font-bold uppercase text-bege mt-2">
                  Cliente-Modelo de 900 Cooperados
                </h3>
                <p className="mt-4 text-sm text-texto-2 leading-relaxed">
                  Conforme o Anuário do Cooperativismo Brasileiro 2026 (ano-base 2025, Sistema OCB [F20]), o Brasil conta com 1.254 cooperativas agropecuárias somando mais de 1,13 milhão de cooperados (média nacional de ~900 produtores por cooperativa).
                </p>
                <p className="mt-3 text-sm text-texto-2 leading-relaxed">
                  Para a cooperativa, cada safra perdida por um associado representa quebra de contratos de entrega e inadimplência financeira. Custear o Argos a um valor estimado de R$ 3 a R$ 6 por produtor/mês gera um <strong className="text-bege">ROI positivo direto nas primeiras perdas evitadas</strong>.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-linha/50 text-xs font-mono text-salvia">
                AnuárioCoop 2026 [F20]
              </div>
            </div>

            {/* Bloco 2: Prefeituras e Secretarias Municipais */}
            <div data-reveal className="rounded-3xl border border-linha bg-card/70 p-8 flex flex-col justify-between">
              <div>
                <div className="text-3xl font-extrabold font-titulo text-ambar">Poder Público</div>
                <h3 className="font-titulo text-xl font-bold uppercase text-bege mt-2">
                  Secretarias de Agricultura & ATER
                </h3>
                <p className="mt-4 text-sm text-texto-2 leading-relaxed">
                  O Brasil possui 5.570 municípios e cerca de 3,89 milhões de estabelecimentos familiares (uma média de ~700 produtores por município [F1]). Quando uma seca ou enchente dizima a produção, a prefeitura decreta estado de emergência e gasta recursos massivos com cestas e caminhões-pipa.
                </p>
                <p className="mt-3 text-sm text-texto-2 leading-relaxed">
                  Ao implantar o Argos como plataforma municipal de CitizenTech, o poder público direciona seus poucos técnicos de extensão rural (ATER) cirurgicamente para as áreas de maior risco identificado.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-linha/50 text-xs font-mono text-ambar">
                Média: ~700 produtores/cidade
              </div>
            </div>

            {/* Bloco 3: Impacto Social e ODS */}
            <div data-reveal className="rounded-3xl border border-linha bg-card/70 p-8 flex flex-col justify-between">
              <div>
                <div className="text-3xl font-extrabold font-titulo text-bege">Impacto ODS</div>
                <h3 className="font-titulo text-xl font-bold uppercase text-bege mt-2">
                  Metas das Nações Unidas
                </h3>
                <p className="mt-4 text-sm text-texto-2 leading-relaxed">
                  A solução dialoga diretamente com metas mensuráveis dos Objetivos de Desenvolvimento Sustentável da ONU:
                </p>
                <ul className="mt-3 space-y-2 text-xs text-texto-2">
                  <li>• <strong className="text-bege">ODS 2 (Fome Zero e Agricultura Sustentável):</strong> Aumentar a resiliência dos pequenos produtores de alimentos.</li>
                  <li>• <strong className="text-bege">ODS 13 (Ação Climática):</strong> Fortalecer a capacidade de adaptação a riscos climáticos e desastres.</li>
                  <li>• <strong className="text-bege">ODS 10 (Redução das Desigualdades):</strong> Acesso equitativo à tecnologia de dados no campo.</li>
                  <li>• <strong className="text-bege">ODS 9 (Inovação):</strong> Infraestrutura resiliente e software acessível.</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-linha/50 text-xs font-mono text-bege">
                Pacto Global ONU 2030
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
