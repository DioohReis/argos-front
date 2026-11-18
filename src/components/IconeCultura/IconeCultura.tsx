interface IconeCulturaProps {
    /** O `slug` da lavoura: soja, milho, algodao, cana, cafe ou trigo. */
    slug: string
    className?: string
}

/** Ícone de traço fino de cada lavoura, desenhado em SVG. Pega a cor do texto em volta. */
export default function IconeCultura({ slug, className = '' }: IconeCulturaProps) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {slug === 'soja' && (
                <>
                    {/* A vagem, com três grãos dentro. */}
                    <path d="M5 16c-1-5 3-11 10-11 3 0 4 1 4 3 0 6-6 11-11 11-2 0-3-1-3-3Z" />
                    <circle cx="9" cy="14.5" r="1.4" />
                    <circle cx="12.3" cy="11.6" r="1.4" />
                    <circle cx="15.3" cy="8.6" r="1.3" />
                </>
            )}
            {slug === 'milho' && (
                <>
                    {/* A espiga no meio e a palha dos lados. */}
                    <path d="M12 3c-2 2-3 5-3 9s1 7 3 9c2-2 3-5 3-9s-1-7-3-9Z" />
                    <path d="M9.4 9h5.2M9.1 12.5h5.8M9.6 16h4.8" />
                    <path d="M9 14c-3 0-5 2-5 6 3 0 5-1 6-3M15 14c3 0 5 2 5 6-3 0-5-1-6-3" />
                </>
            )}
            {slug === 'algodao' && (
                <>
                    {/* O capulho aberto, em quatro gomos, e o cabo. */}
                    <circle cx="9" cy="8.5" r="3.4" />
                    <circle cx="15" cy="8.5" r="3.4" />
                    <circle cx="8" cy="13.5" r="3.4" />
                    <circle cx="16" cy="13.5" r="3.4" />
                    <path d="M12 16v5M9.5 19 12 17l2.5 2" />
                </>
            )}
            {slug === 'cana' && (
                <>
                    {/* Dois colmos com os nós e as folhas no alto. */}
                    <path d="M9 21V7M15 21V9" />
                    <path d="M7.5 17h3M7.5 12.5h3M13.5 18h3M13.5 13.5h3" />
                    <path d="M9 7c-1-3-3-4-6-4M9 7c0-2 1-4 4-4M15 9c1-3 3-4 6-4M15 9c0-2-1-3-3-3" />
                </>
            )}
            {slug === 'cafe' && (
                <>
                    {/* Dois grãos, cada um com o seu risco no meio. */}
                    <ellipse cx="8.5" cy="13" rx="4.5" ry="6.5" transform="rotate(-18 8.5 13)" />
                    <path d="M7.5 7c2 3 0 9 2 12" />
                    <ellipse cx="16.5" cy="10" rx="3.6" ry="5.4" transform="rotate(20 16.5 10)" />
                    <path d="M18 5.2c-2 2.5-.5 7-2.6 9.6" />
                </>
            )}
            {slug === 'trigo' && (
                <>
                    {/* A espiga: o talo e os grãos em pares. */}
                    <path d="M12 21V8" />
                    <path d="M12 8c0-2 0-4 0-5M12 11c-2 0-4-1-4-4 2 0 4 1 4 4ZM12 11c2 0 4-1 4-4-2 0-4 1-4 4ZM12 15c-2 0-4-1-4-4 2 0 4 1 4 4ZM12 15c2 0 4-1 4-4-2 0-4 1-4 4ZM12 19c-2 0-4-1-4-4 2 0 4 1 4 4ZM12 19c2 0 4-1 4-4-2 0-4 1-4 4Z" />
                </>
            )}
        </svg>
    )
}
