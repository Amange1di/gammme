// Колба (Erlenmeyer flask)
export const Flask = ({ value }: { value?: number }) => (
    <svg width="80" height="110" viewBox="0 0 80 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Контур колбы */}
        <path d="M20 10 H60 V20 L50 90 Q40 100 30 90 L20 20 Z" stroke="#2ecc40" strokeWidth="4" fill="#fff6" />
        {/* Вода */}
        <path d="M25 80 Q40 95 55 80 L50 90 Q40 100 30 90 Z" fill="#00eaff" fillOpacity="0.7" />
        {/* Деления */}
        <g stroke="#fff" strokeWidth="2">
            <line x1="28" y1="30" x2="52" y2="30" />
            <line x1="28" y1="40" x2="52" y2="40" />
            <line x1="28" y1="50" x2="52" y2="50" />
            <line x1="28" y1="60" x2="52" y2="60" />
            <line x1="28" y1="70" x2="52" y2="70" />
        </g>
        {/* Значение */}
        {value !== undefined && (
            <circle cx="40" cy="75" r="12" fill="#222" />
        )}
        {value !== undefined && (
            <text x="40" y="80" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="bold">{value}</text>
        )}
    </svg>
);

// Большой стакан с ручкой
export const BigGlass = ({ value, pouring, pourSize, vesselCap }: { value?: number; pouring?: boolean; pourSize?: number; vesselCap?: number }) => {
    // value: 0..vesselCap (по умолчанию 5)
    const cap = vesselCap ?? 5;
    const waterLevel = value !== undefined ? Math.max(0, Math.min(1, value / cap)) : 0;
    // y воды: 98 (пусто) -> 42 (полный)
    const y = 98 - (98 - 42) * waterLevel;
    const h = 98 - y;
    // Для слоя новой воды (если идет выливание)
    let newY = y;
    let newH = 0;
    if (pouring && pourSize && value !== undefined) {
        const nextLevel = Math.max(0, Math.min(1, (value + pourSize) / cap));
        newY = 98 - (98 - 42) * nextLevel;
        newH = y - newY; // только прирост
    }
    return (
        <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Контур стакана */}
            <rect x="15" y="10" width="60" height="90" rx="8" stroke="#2ecc40" strokeWidth="4" fill="#fff6" />
            {/* Ручка */}
            <rect x="75" y="30" width="12" height="50" rx="6" stroke="#2ecc40" strokeWidth="4" fill="none" />
            {/* Старая вода */}
            <rect x="17" y={y} width="56" height={h} rx="6" fill="#00eaff" fillOpacity="0.7" style={{ transition: 'y 0.3s, height 0.3s' }} />
            {/* Новый слой воды (поверх) */}
            {pouring && pourSize && newH > 0 && (
                <rect x="17" y={newY} width="56" height={newH} rx="6" fill="#00eaff" fillOpacity="0.95" style={{ transition: 'y 0.3s, height 0.3s' }} />
            )}
            {/* Деления */}
            <g stroke="#fff" strokeWidth="2">
                <line x1="20" y1="20" x2="30" y2="20" />
                <line x1="20" y1="30" x2="30" y2="30" />
                <line x1="20" y1="40" x2="30" y2="40" />
                <line x1="20" y1="50" x2="30" y2="50" />
                <line x1="20" y1="60" x2="30" y2="60" />
                <line x1="20" y1="70" x2="30" y2="70" />
                <line x1="20" y1="80" x2="30" y2="80" />
                <line x1="20" y1="90" x2="30" y2="90" />
            </g>
            {/* Значение */}
            {value !== undefined && (
                <circle cx="60" cy="90" r="12" fill="#222" />
            )}
            {value !== undefined && (
                <text x="60" y="95" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="bold">{value}</text>
            )}
        </svg>
    );
};

// Маленький стакан с ручкой
export const SmallGlass = ({ value }: { value?: number }) => {
    // value: 0..3
    const waterLevel = value !== undefined ? Math.max(0, Math.min(1, value / 3)) : 0;
    // y воды: 63 (пусто) -> 24 (полный)
    const y = 63 - (63 - 24) * waterLevel;
    const h = 63 - y;
    return (
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Контур стакана */}
            <rect x="10" y="10" width="30" height="55" rx="6" stroke="#2ecc40" strokeWidth="4" fill="#fff6" />
            {/* Ручка */}
            <rect x="40" y="25" width="8" height="30" rx="4" stroke="#2ecc40" strokeWidth="4" fill="none" />
            {/* Вода (анимируем уровень) */}
            <rect x="12" y={y} width="26" height={h} rx="4" fill="#00eaff" fillOpacity="0.7" style={{ transition: 'y 0.3s, height 0.3s' }} />
            {/* Деления */}
            <g stroke="#fff" strokeWidth="2">
                <line x1="15" y1="20" x2="25" y2="20" />
                <line x1="15" y1="30" x2="25" y2="30" />
                <line x1="15" y1="40" x2="25" y2="40" />
                <line x1="15" y1="50" x2="25" y2="50" />
                <line x1="15" y1="60" x2="25" y2="60" />
            </g>
            {/* Значение */}
            {value !== undefined && (
                <circle cx="30" cy="60" r="10" fill="#222" />
            )}
            {value !== undefined && (
                <text x="30" y="65" textAnchor="middle" fontSize="14" fill="#fff" fontWeight="bold">{value}</text>
            )}
        </svg>
    );
};

// Альтернативный маленький стакан (другая форма)
export const SmallGlass2 = ({ value }: { value?: number }) => (
    <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Контур стакана с чуть скошенными стенками */}
        <path d="M18 12 L42 12 Q48 14 46 68 Q45 74 30 74 Q15 74 14 68 Q12 14 18 12 Z" stroke="#2ecc40" strokeWidth="4" fill="#fff6" />
        {/* Ручка */}
        <rect x="44" y="28" width="8" height="24" rx="4" stroke="#2ecc40" strokeWidth="4" fill="none" />
        {/* Вода */}
        <path d="M17 60 Q30 72 43 60 Q44 68 30 70 Q16 68 17 60 Z" fill="#00eaff" fillOpacity="0.7" />
        {/* Деления */}
        <g stroke="#fff" strokeWidth="2">
            <line x1="20" y1="22" x2="32" y2="22" />
            <line x1="20" y1="32" x2="32" y2="32" />
            <line x1="20" y1="42" x2="32" y2="42" />
            <line x1="20" y1="52" x2="32" y2="52" />
            <line x1="20" y1="62" x2="32" y2="62" />
        </g>
        {/* Значение */}
        {value !== undefined && (
            <circle cx="30" cy="65" r="10" fill="#222" />
        )}
        {value !== undefined && (
            <text x="30" y="70" textAnchor="middle" fontSize="14" fill="#fff" fontWeight="bold">{value}</text>
        )}
    </svg>
);

// Групповой экспорт
export default { Flask, BigGlass, SmallGlass, SmallGlass2 };
