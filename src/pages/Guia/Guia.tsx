import { Link, useParams } from 'react-router'
import CatalogoPragas from '../../components/CatalogoPragas/CatalogoPragas'
import IconeCultura from '../../components/IconeCultura/IconeCultura'
import { FONTE_DA_PRODUCAO, buscarCultura, descreverProducao } from '../../data/culturas'

export default function Guia() {
    // A rota é /guia/:cultura. O useParams lê o trecho depois de /guia/.
    const { cultura: slug } = useParams()
    const cultura = buscarCultura(slug)

    if (!cultura) {
        return (
            <main className="min-h-svh bg-[#FBF8F1] px-5 py-12 text-[#1E1E1E] md:px-8">
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-3xl font-bold text-[#1F6B3A]">Não achamos essa lavoura.</h1>
                    <p className="mt-3 text-lg">Volte ao mapa e escolha uma das seis lavouras.</p>
                    <Link
                        to="/"
                        className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[#1F6B3A] px-7 text-lg font-bold text-white"
                    >
                        Voltar ao mapa
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-svh bg-[#FBF8F1] px-5 py-12 text-[#1E1E1E] md:px-8">
            <div className="mx-auto max-w-3xl">
                <Link to="/" className="text-lg font-semibold text-[#1565C0] underline underline-offset-4">
                    Voltar ao mapa
                </Link>
                <h1 className="mt-6 flex items-center gap-3 text-4xl font-bold text-[#1F6B3A] sm:text-5xl">
                    <IconeCultura slug={cultura.slug} className="size-11" />
                    {cultura.nome}
                </h1>
                <p className="mt-4 text-xl leading-relaxed">
                    {cultura.municipio}, {cultura.uf}, é a cidade que mais colhe {cultura.nome.toLowerCase()} no Brasil:{' '}
                    {descreverProducao(cultura.toneladas)} em {FONTE_DA_PRODUCAO.ano}.
                </p>
                <p className="mt-3 text-base text-[#1E1E1E]/75">
                    Fonte: {FONTE_DA_PRODUCAO.nome}, {FONTE_DA_PRODUCAO.ano}.
                </p>
            </div>
            <section className="mx-auto mt-12 max-w-6xl">
                <h2 className="font-display text-3xl font-bold text-[#14251A] uppercase sm:text-4xl">
                    Pragas de {cultura.nome.toLowerCase()}
                </h2>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed">
                    Como é cada bicho, o estrago que ele deixa na planta e em que parte procurar.
                </p>
                <CatalogoPragas lavouraFixa={cultura.slug} />
            </section>
        </main>
    )
}
