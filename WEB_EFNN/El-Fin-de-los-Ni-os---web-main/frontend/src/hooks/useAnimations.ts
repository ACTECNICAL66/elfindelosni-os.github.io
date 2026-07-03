import { useEffect, useRef, useState, useCallback } from 'react'

export function useCountUp(end: number, duration = 2000) {
    const [count, setCount] = useState(0)
    const [started, setStarted] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started) setStarted(true)
        }, { threshold: 0.2 })
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [started])

    useEffect(() => {
        if (!started) return
        let startTime: number
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            setCount(Math.floor(progress * end))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [started, end, duration])

    return { count, ref }
}

export function useScrollAnimation() {
    const ref = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true)
                observer.disconnect()
            }
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return { ref, isVisible }
}

export function useScrollProgress() {
    const [progress, setProgress] = useState(0)

    const handleScroll = useCallback(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight
        const currentProgress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
        setProgress(currentProgress)
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    return progress
}
