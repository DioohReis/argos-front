import type { Camada } from '../../types/condicoes'
import IconeCultura from '../IconeCultura/IconeCultura'

interface IconeCamadaProps {
    camada: Camada
    /** A lavoura aberta: a camada "cultura" usa o ícone dela. */
    slugDaCultura: string
    className?: string
}

/** Ícone de traço fino de cada camada da lavoura, desenhado em SVG. Pega a cor do texto em volta. */
export default function IconeCamada({ camada, slugDaCultura, className = '' }: IconeCamadaProps) {
    if (camada === 'cultura') return <IconeCultura slug={slugDaCultura} className={className} />
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {camada === 'clima' && (
                <>
                    {/* O termômetro, com a coluna e as marcas da régua. */}
                    <path d="M10 14.2V5a2 2 0 0 1 4 0v9.2a4 4 0 1 1-4 0Z" />
                    <path d="M12 17.6V9" />
                    <circle cx="12" cy="17.6" r="1.3" />
                    <path d="M16.5 6h2M16.5 9h1.2M16.5 12h2" />
                </>
            )}
            {camada === 'ar' && (
                <>
                    {/* A altitude: uma seta para cima, outra para baixo e a linha do chão no meio. */}
                    <path d="M12 9V3M9.5 5.5 12 3l2.5 2.5" />
                    <path d="M12 15v6M9.5 18.5 12 21l2.5-2.5" />
                    <path d="M6 12h12" />
                </>
            )}
            {camada === 'umidade' && (
                <>
                    {/* A gota de água, com um brilho dentro. */}
                    <path d="M12 3c3.2 4 5.5 7 5.5 10.2a5.5 5.5 0 0 1-11 0C6.5 10 8.8 7 12 3Z" />
                    <path d="M9.3 13.6a2.8 2.8 0 0 0 2.2 2.6" />
                </>
            )}
            {camada === 'solo' && (
                <>
                    {/* O broto saindo da terra, com as duas folhas. */}
                    <path d="M12 17V9.5" />
                    <path d="M12 12c0-3-2-5-5.5-5 0 3.2 2 5 5.5 5ZM12 10c0-2.6 1.8-4.5 5-4.5 0 2.9-1.8 4.5-5 4.5Z" />
                    <path d="M4 17h16M6.5 20h11" />
                </>
            )}
        </svg>
    )
}
