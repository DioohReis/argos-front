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
    return (
        <main className="w-full overflow-hidden bg-fundo font-corpo text-lg leading-relaxed text-bege">
            <ScrollReveal />

            <Footer />
        </main>
    );
}
