import React, { useState } from 'react';
import "./woterSection.scss"
import { BigGlass, SmallGlass } from '../../shared/GlassSet';
import splashSound from "../../shared/water-splash.mp3";

const BIG_CAP = 52;
const SMALL_CAP = 3;

type Source = 'big' | 'small' | null;

export const WoterSection = () => {
  const [big, setBig] = useState(0);
  const [small, setSmall] = useState(0);
  const [dragSource, setDragSource] = useState<Source>(null);
  const [dragOver, setDragOver] = useState<Source>(null);
  const [isPouring, setIsPouring] = useState<Source>(null);
  const [pourAnim, setPourAnim] = useState<{ big: number, small: number } | null>(null);
  const [showStream, setShowStream] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const splashAudio = React.useRef<HTMLAudioElement>(null);
  const successAudio = React.useRef<HTMLAudioElement>(null);

  // Маленький сосуд всегда автоматически наполнен
  React.useEffect(() => {
    if (small !== SMALL_CAP) setSmall(SMALL_CAP);
    // eslint-disable-next-line
  }, []);

  // Следим за изменением small: если он стал 0, сразу наполняем обратно
  React.useEffect(() => {
    if (small === 0) setTimeout(() => setSmall(SMALL_CAP), 200);
  }, [small]);

  // Drag & Drop логика
  const handleDragStart = (source: Source) => {
    if ((source === 'big' && big > 0) || (source === 'small' && small > 0)) {
      setDragSource(source);
    }
  };
  const handleDragOver = (target: Source, e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(target);
  };
  const handleDragLeave = () => {
    setDragOver(null);
  };
  // Счётчик наливаний из маленького в большой
  const [pourCount, setPourCount] = useState(0);

  // Целевой объём для задания
  const TARGET = 4;
  const [showModal, setShowModal] = useState(false);

  // Модифицируем handleDrop для подсчёта наливаний
  const handleDrop = (target: Source) => {
    if (!dragSource || dragSource === target) {
      setDragSource(null);
      setDragOver(null);
      return;
    }
    setIsPouring(dragSource);
    setShowStream(true);
    if (splashAudio.current) {
      splashAudio.current.currentTime = 0;
      splashAudio.current.play();
    }
    const from = dragSource === 'big' ? big : small;
    const to = target === 'big' ? big : small;
    const toCap = target === 'big' ? BIG_CAP : SMALL_CAP;
    const space = toCap - to;
    const amount = Math.min(from, space);
    const steps = 12;
    let step = 0;
    const bigStart = big;
    const smallStart = small;
    const bigTarget = dragSource === 'big' ? big - amount : big + (dragSource === 'small' ? amount : 0);
    const smallTarget = dragSource === 'small' ? small - amount : small + (dragSource === 'big' ? amount : 0);
    const interval = setInterval(() => {
      step++;
      const t = step / steps;
      setPourAnim({
        big: bigStart + (bigTarget - bigStart) * t,
        small: smallStart + (smallTarget - smallStart) * t
      });
      if (step === steps) {
        clearInterval(interval);
        setTimeout(() => {
          if (dragSource === 'big' && target === 'small') {
            setBig(big - amount);
            setSmall(small + amount);
          } else if (dragSource === 'small' && target === 'big') {
            setSmall(small - amount);
            setBig(big + amount);
            setPourCount(prev => prev + 1); // увеличиваем счётчик
          }
          setIsPouring(null);
          setPourAnim(null);
          setDragSource(null);
          setDragOver(null);
          setShowStream(false);
          if (successAudio.current && ((dragSource === 'big' && target === 'small' && small + amount === SMALL_CAP) || (dragSource === 'small' && target === 'big' && big + amount === BIG_CAP))) {
            successAudio.current.currentTime = 0;
            successAudio.current.play();
          }
        }, 200);
      }
    }, 25);
  };

  // Двойной клик больше не нужен, так как маленький всегда наполнен

  // Для анимации воды используем pourAnim, если она есть
  const bigValue = pourAnim ? pourAnim.big : big;
  const smallValue = pourAnim ? pourAnim.small : small;

  // --- Визуальная анимация воды внутри сосуда ---
  // Для BigGlass и SmallGlass прокидываем дополнительный пропорциональный параметр waterLevel
  // (ожидается, что GlassSet.tsx поддерживает проп waterLevel: 0..1 для анимации уровня воды)

  // Координаты и смещение для реалистичного переливания
  // Горлышко BigGlass — центр (x=50), SmallGlass — x=60*0.8=48
  const bigPouringStyle = isPouring === 'big' ? {
    transform: 'rotate(-90deg) translateY(-80px) translateX(-30px)',
    zIndex: 2,
    background: 'rgba(0,234,255,0.08)',
    position: 'absolute' as const,
    left: '50%' as const,
    top: 0 as const,
    marginLeft: '-20px',
    transition: 'all 0.4s cubic-bezier(.4,2,.6,1)'
  } : {};
  const smallPouringStyle = isPouring === 'small' ? {
    transform: 'rotate(90deg) translateY(-80px) translateX(30px)',
    zIndex: 2,
    background: 'rgba(0,234,255,0.08)',
    position: 'absolute' as const,
    left: '50%' as const,
    top: 0 as const,
    marginLeft: '-48px',
    transition: 'all 0.4s cubic-bezier(.4,2,.6,1)'
  } : {};

  // --- Новое позиционирование для "наливания сверху" ---
  let stream = null;
  let splash = null;
  const isVerticalPour = isPouring && showStream;

  return (
    <div className='woterSection' >
      <div className="woterSection-inner">
        <div className={isVerticalPour ? "big-glass-wrapper vertical" : "big-glass-wrapper"}>
          <div
            draggable={big > 0 && !isPouring}
            onDragStart={() => handleDragStart('big')}
            onDragOver={e => handleDragOver('big', e)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop('big')}
            className={
              [
                'glass-draggable',
                'big',
                big > 0 && !isPouring ? 'grab' : 'pointer',
                dragSource === 'big' ? 'outline-green' : dragOver === 'big' ? 'outline-blue' : ''
              ].join(' ')
            }
            style={bigPouringStyle}
          >
            <BigGlass value={bigValue} />
          </div>
        </div>
        <div className={isVerticalPour ? "small-glass-wrapper vertical" : "small-glass-wrapper"}>
          <div
            draggable={small > 0 && !isPouring}
            onDragStart={() => handleDragStart('small')}
            onDragOver={e => handleDragOver('small', e)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop('small')}
            className={
              [
                'glass-draggable',
                'small',
                small > 0 && !isPouring ? 'grab' : 'pointer',
                dragSource === 'small' ? 'outline-green' : dragOver === 'small' ? 'outline-blue' : ''
              ].join(' ')
            }
            style={smallPouringStyle}
          >
            <SmallGlass value={smallValue} />
          </div>
        </div>
        {stream}
        {splash}
      </div>

      <div className="pour-counter">
        <b>Счётчик наливаний:</b> {pourCount}
      </div>
      <div style={{ marginTop: 12, color: '#888', fontSize: 15 }}>
      </div>
      <audio ref={splashAudio} src={splashSound} preload="auto" />
      <div style={{ marginTop: 16 }}>
        <button
          className="check-btn"
          onClick={() => {
            if (big === TARGET) {
              setShowModal(true);
              setErrorMsg("");
            } else {
              setErrorMsg(`Нужно налить ровно ${TARGET} литра! Сейчас: ${Math.round(big)} л.`);
            }
          }}
          disabled={big === 0}
        >
          Проверить
        </button>
        <button
          className="remove-btn"
          onClick={() => {
            if (big > 0) setBig(big - 1);
          }}
          disabled={big === 0}
        >
          Убрать лишнюю воду
        </button>
      </div>
      {errorMsg && (
        <div className="error-msg">{errorMsg}</div>
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">Молодец! Всё правильно!</div>
            <button onClick={() => {
              setShowModal(false);
              setBig(0);
              setPourCount(0);
              setErrorMsg("");
            }} className="modal-close-btn">Закрыть</button>
          </div>
        </div>
      )}
      <div className="task-desc">
        <b>Задание:</b> Налей ровно <b>{TARGET} литра</b> в большой сосуд, используя маленький!
      </div>
    </div>
  );
}
