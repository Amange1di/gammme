import React, { useState } from "react";
import { Weight, PlacedWeight } from "./types";
import WeightsBar from "./WeightsBar/WeightsBar";
import Board from "./Board/Board";
import Modal from "./Modal/Modal";
import './balanceSection.scss';
import weightSound from "./weight-sounddd.mp3";
import finshSound from "./finsh.mp3";
import SuccessAnimation from "./SuccessAnimation";

const initialWeights: Weight[] = [
  { id: 1, mass: 1 },
  { id: 2, mass: 2 },
  { id: 3, mass: 5 },
  { id: 4, mass: 10 },
];

export const BalanceSection = () => {

  const [available, setAvailable] = useState<Weight[]>(initialWeights);
  const [placed, setPlaced] = useState<PlacedWeight[]>([]);
  const [dragged, setDragged] = useState<Weight | null>(null);
  const [draggedPlaced, setDraggedPlaced] = useState<PlacedWeight | null>(null);
  const [hoveredPlate, setHoveredPlate] = useState<{ side: "left" | "right", pos: number } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const finshAudioRef = React.useRef<HTMLAudioElement>(null);
  const [checkResult, setCheckResult] = useState<null | 'success' | 'fail'>(null);

  // Считаем моменты
  const leftMoment = placed.filter(w => w.side === "left").reduce((sum, w) => sum + w.mass * w.position, 0);
  const rightMoment = placed.filter(w => w.side === "right").reduce((sum, w) => sum + w.mass * w.position, 0);

  // Визуальный наклон
  const angle = Math.max(Math.min((rightMoment - leftMoment) * 2, 20), -20);

  // Формируем пример для модального окна из текущих грузиков
  function getExample() {
    const left = placed.filter(w => w.side === "left").map(w => ({ mass: w.mass, pos: w.position }));
    const right = placed.filter(w => w.side === "right").map(w => ({ mass: w.mass, pos: w.position }));
    return { left, right };
  }

  // useEffect больше не открывает модалку
  // React.useEffect(() => {
  //   if (leftMoment === rightMoment && placed.length > 0) {
  //     if (!wasBalanced.current) {
  //       setModalOpen(true);
  //       wasBalanced.current = true;
  //       if (finshAudioRef.current) {
  //         finshAudioRef.current.currentTime = 0;
  //         finshAudioRef.current.play();
  //       }
  //     }
  //   } else {
  //     wasBalanced.current = false;
  //   }
  // }, [leftMoment, rightMoment, placed.length]);

  // Drag & Drop
  function onDragStart(weight: Weight) {
    setDragged(weight);
    setDraggedPlaced(null);
  }
  function onPlacedDragStart(w: PlacedWeight) {
    setDragged(null);
    setDraggedPlaced(w);
  }
  function onPlateDragOver(side: "left" | "right", pos: number, e: React.DragEvent) {
    e.preventDefault();
    setHoveredPlate({ side, pos });
  }
  function onPlateDragLeave() {
    setHoveredPlate(null);
  }
  function onDrop(side: "left" | "right", pos: number) {
    if (dragged) {
      setPlaced([...placed, { ...dragged, side, position: pos }]);
      setAvailable(available.filter(w => w.id !== dragged.id));
      setDragged(null);
      playWeightSound();
    } else if (draggedPlaced) {
      setPlaced(
        placed.map(w =>
          w.id === draggedPlaced.id
            ? { ...w, side, position: pos }
            : w
        )
      );
      setDraggedPlaced(null);
      playWeightSound();
    }
    setHoveredPlate(null);
  }
  function onAvailableDrop() {
    if (draggedPlaced) {
      setAvailable([...available, { id: draggedPlaced.id, mass: draggedPlaced.mass }]);
      setPlaced(placed.filter(w => w.id !== draggedPlaced.id));
      setDraggedPlaced(null);
    }
  }
  function checkBalance() {
    if (placed.length === 0) {
      setCheckResult(null);
      return;
    }
    if (leftMoment === rightMoment) {
      setCheckResult('success');
      setModalOpen(true);
      if (finshAudioRef.current) {
        finshAudioRef.current.currentTime = 0;
        finshAudioRef.current.play();
      }
    } else {
      setCheckResult('fail');
    }
  }
  function reset() {
    setAvailable(initialWeights);
    setPlaced([]);
    setDragged(null);
    setDraggedPlaced(null);
    setCheckResult(null);
  }

  function playWeightSound() {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }

  return (
    <div className="appRoot">
      <h2 className="header">Балансировка весов</h2>

      <WeightsBar
        available={available}
        dragged={dragged}
        draggedPlaced={draggedPlaced}
        onDragStart={onDragStart}
        onPlacedDrop={onAvailableDrop}
        onReset={reset}
      />
      <div style={{ textAlign: 'center', marginBottom: 18, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
        <button onClick={checkBalance} style={{ fontSize: 22, padding: '14px 32px', borderRadius: 16, background: '#ffe066', border: 'none', fontWeight: 'bold', marginRight: 8, marginBottom: 8, boxShadow: '0 2px 8px #ffe06688', cursor: 'pointer', transition: 'background 0.2s' }}>Проверить</button>
        <button onClick={reset} style={{ fontSize: 22, padding: '14px 32px', borderRadius: 16, background: 'linear-gradient(90deg, #f7b733, #fc4a1a)', border: 'none', fontWeight: 'bold', color: '#fff', marginBottom: 8, boxShadow: '0 2px 8px #fc4a1a33', cursor: 'pointer', transition: 'background 0.2s' }}>Сбросить</button>
      </div>
      {checkResult === 'success' && (
        <div className="balanceSuccess" style={{ textAlign: 'center', marginBottom: 12 }}>Верно! Весы в равновесии 🎉</div>
      )}
      {checkResult === 'fail' && (
        <div className="balanceFail" style={{ textAlign: 'center', marginBottom: 12 }}>Ошибка: весы не уравновешены. Попробуйте ещё раз!</div>
      )}
      <Board
        placed={placed}
        dragged={dragged}
        draggedPlaced={draggedPlaced}
        hoveredPlate={hoveredPlate}
        onPlacedDragStart={onPlacedDragStart}
        onPlateDragOver={onPlateDragOver}
        onPlateDragLeave={onPlateDragLeave}
        onDrop={onDrop}
        angle={angle}
      />

      {modalOpen && <SuccessAnimation />}

      {modalOpen && (
        <Modal example={getExample()} onClose={() => { setModalOpen(false); reset(); }} />
      )}

      <audio ref={audioRef} src={weightSound} preload="auto" />
      <audio ref={finshAudioRef} src={finshSound} preload="auto" />
    </div>
  );
}
