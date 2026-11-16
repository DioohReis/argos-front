import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface RevelarProps {
    children: ReactNode
    /** Espera, em milissegundos, antes de aparecer: serve para itens vizinhos entrarem um depois do outro. */
    atraso?: number
    className?: string
}

/**
 * Faz o conteúdo surgir, subindo um pouco, quando ele entra na tela durante a rolagem. Usa o
 * IntersectionObserver do navegador. Quem pediu menos movimento no aparelho vê tudo já no lugar
 * (a regra está no CSS, na classe `.revelar`).
 */
export default function Revelar({ children, atraso = 0, className = '' }: RevelarProps) {
    const caixaRef = useRef<HTMLDivElement>(null)
    const [visivel, setVisivel] = useState(false)

    useEffect(() => {
        const caixa = caixaRef.current
        if (!caixa) return
        const observador = new IntersectionObserver(
            ([entrada]) => {
                if (!entrada.isIntersecting) return
                setVisivel(true)
                // Apareceu uma vez, fica: não some de novo ao rolar para cima.
                observador.disconnect()
            },
            { rootMargin: '0px 0px -8% 0px' },
        )
        observador.observe(caixa)
        return () => observador.disconnect()
    }, [])

    return (
        <div
            ref={caixaRef}
            style={{ transitionDelay: `${atraso}ms` }}
            className={`revelar ${visivel ? 'visivel' : ''} ${className}`}
        >
            {children}
        </div>
    )
}
