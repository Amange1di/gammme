import React, { useState, useRef } from "react";
import { Weight, PlacedWeight } from "./type";
import WeightsBar from "./WeightsBar/WeightsBar";
import Board from "./Board/Board";
import Modal from "./Modal/Modal";
import './balanceSection.scss';
import weightSound from "./weight-sounddd.mp3";
import finshSound from "./finsh.mp3";

const initialWeights: Weight[] = [
  { id: 1, mass: 1 },
  { id: 2, mass: 2 },
  { id: 3, mass: 5 },
  { id: 4, mass: 10 },
];

const leftPositions = [8, 7, 6, 5, 4, 3, 2, 1];
const rightPositions = [1, 2, 3, 4, 5, 6, 7, 8];

export const BalanceSection = () => {

  const [available, setAvailable] = useState<Weight[]>(initialWeights);
  const [placed, setPlaced] = useState<PlacedWeight[]>([]);
  const [dragged, setDragged] = useState<Weight | null>(null);
  const [draggedPlaced, setDraggedPlaced] = useState<PlacedWeight | null>(null);
  const [hoveredPlate, setHoveredPlate] = useState<{ side: "left" | "right" | "board", pos: number } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const wasBalanced = useRef(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const finshAudioRef = React.useRef<HTMLAudioElement>(null);

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

  // Показываем модалку только при первом появлении баланса
  React.useEffect(() => {
    if (leftMoment === rightMoment && placed.length > 0) {
      if (!wasBalanced.current) {
        setModalOpen(true);
        wasBalanced.current = true;
        if (finshAudioRef.current) {
          finshAudioRef.current.currentTime = 0;
          finshAudioRef.current.play();
        }
      }
    } else {
      wasBalanced.current = false;
    }
  }, [leftMoment, rightMoment, placed.length]);

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
  function reset() {
    setAvailable(initialWeights);
    setPlaced([]);
    setDragged(null);
    setDraggedPlaced(null);
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
        {/* <div className="momentInfo">
        <b>Левый :</b> {leftMoment} &nbsp;
        <b>Правый :</b> {rightMoment} &nbsp;
        {leftMoment === rightMoment && placed.length > 0 ? (
          <span className="balanceSuccess">Баланс!</span>
        ) : (
          <span className="balanceFail">Не уравновешено</span>
        )}
      </div> */}
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
    
      {modalOpen && (
        <Modal example={getExample()} onClose={() => setModalOpen(false)} />
      )}

      <audio ref={audioRef} src={weightSound} preload="auto" />
      <audio ref={finshAudioRef} src={finshSound} preload="auto" />
    </div>
  );
}
