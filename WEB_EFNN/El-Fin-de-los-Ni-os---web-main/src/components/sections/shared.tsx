import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

export function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { count, ref };
}

export function StatCard({
  number,
  label,
  suffix = "",
}: {
  number: number;
  label: string;
  suffix?: string;
}) {
  const { count, ref } = useCountUp(number);
  return (
    <div
      ref={ref}
      className="glass-card p-6 text-center min-w-[180px] hover-lift group"
    >
      <span className="stat-number block">
        {count}
        {suffix}
      </span>
      <span className="text-xs font-medium uppercase tracking-wider text-white/50 mt-2 block">
        {label}
      </span>
    </div>
  );
}

export function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: ElementType;
  title: string;
}) {
  return (
    <div className="mb-10">
      <h2 className="font-display font-bold text-3xl lg:text-4xl text-white flex items-center gap-3">
        <Icon className="w-8 h-8 text-water-400" />
        {title}
      </h2>
      <div className="w-24 h-0.5 bg-gradient-to-r from-water-400 to-eco-400 mt-3 rounded-full" />
    </div>
  );
}

export function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: ElementType;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="glass-card p-8 hover-lift group">
      <h3 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-water-400" />
        {title}
      </h3>
      <div className="text-white/60 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
