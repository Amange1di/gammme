import React, { useState, useEffect } from "react";
import axios from "axios";
import { Weight, PlacedWeight } from "./types";
import WeightsBar from "./WeightsBar/WeightsBar";
import Board from "./Board/Board";
import Modal from "./Modal/Modal";
import './balanceSection.scss';
import weightSound from "./weight-sounddd.mp3";
import finshSound from "./finsh.mp3";
import SuccessAnimation from "./SuccessAnimation";
import rest from "../../shared/rest.png"
const MOCKAPI_URL = "https://682857da6b7628c52912fd96.mockapi.io/a";

export const BalanceSection = () => {

  const [available, setAvailable] = useState<Weight[]>([]);
  const [placed, setPlaced] = useState<PlacedWeight[]>([]);
  const [dragged, setDragged] = useState<Weight | null>(null);
  const [draggedPlaced, setDraggedPlaced] = useState<PlacedWeight | null>(null);
  const [hoveredPlate, setHoveredPlate] = useState<{ side: "left" | "right", pos: number } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const finshAudioRef = React.useRef<HTMLAudioElement>(null);
  const [checkResult, setCheckResult] = useState<null | 'success' | 'fail'>(null);
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<{ id: string; task: string; mass: number[] }[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [allUsedError, setAllUsedError] = useState("");

  // Считаем моменты
  const leftMoment = placed.filter(w => w.side === "left").reduce((sum, w) => sum + w.mass * w.position, 0);
  const rightMoment = placed.filter(w => w.side === "right").reduce((sum, w) => sum + w.mass * w.position, 0);

  // Визуальный наклон
  const angle = Math.max(Math.min((rightMoment - leftMoment) * 2, 10), -10);

  // Формируем пример для модального окна из текущих грузиков
  function getExample() {
    // Вернуть прежний формат: [{mass, pos}, ...]
    const left = placed.filter(w => w.side === "left").map(w => ({ mass: w.mass, pos: w.position }));
    const right = placed.filter(w => w.side === "right").map(w => ({ mass: w.mass, pos: w.position }));
    return { left, right };
  }

  useEffect(() => {
    async function fetchTaskWeights() {
      try {
        const res = await axios.get(MOCKAPI_URL);
        if (res.data && res.data.length > 0) {
          setTasks(res.data);
          setCurrentTaskIndex(0);
          const firstTask = res.data[0];
          const weights: Weight[] = (firstTask.mass || []).map((m: number, idx: number) => ({ id: idx + 1, mass: m }));
          setAvailable(weights);
          setTask(firstTask.task || "");
        } else {
          setTasks([]);
          setAvailable([]);
          setTask("");
        }
      } catch {
        setTasks([]);
        setAvailable([]);
        setTask("");
      }
    }
    fetchTaskWeights();
  }, []);

  function nextTask() {
    if (tasks.length > 0 && currentTaskIndex < tasks.length - 1) {
      const nextIndex = currentTaskIndex + 1;
      setCurrentTaskIndex(nextIndex);
      const next = tasks[nextIndex];
      setAvailable((next.mass || []).map((m: number, idx: number) => ({ id: idx + 1, mass: m })));
      setTask(next.task || "");
      setPlaced([]);
      setDragged(null);
      setDraggedPlaced(null);
      setCheckResult(null);
      setModalOpen(false);
    }
  }

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

  // Проверка: все ли грузики были использованы
  function allWeightsUsed() {
    if (!available.length && tasks[currentTaskIndex]?.mass?.length) {
      // Все грузики использованы, если available пуст и mass не пуст
      return true;
    }
    return false;
  }

  function checkBalance() {
    // Проверяем, что все грузики использованы
    const totalWeights = tasks[currentTaskIndex]?.mass?.length || 0;
    const usedWeights = placed.length;
    if (usedWeights < totalWeights) {
      setCheckResult(null);
      setAllUsedError('Используйте все грузики для решения задачи!');
      return;
    }
    setAllUsedError("");
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
    // При сбросе возвращаем грузики текущей задачи
    const currentMass = tasks[currentTaskIndex]?.mass || [];
    setAvailable(currentMass.map((m, i) => ({ id: i + 1, mass: m })));
    setPlaced([]);
    setDragged(null);
    setDraggedPlaced(null);
    setCheckResult(null);
    setAllUsedError("");
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
      <h4 className="task">{task}</h4>
      <div className="btns-bar">
        <button onClick={checkBalance} className="check-btn">Проверить</button>
        <button onClick={reset} className="reset-btn"> <img height={50} src={rest} alt="" /></button>
      </div>
      {checkResult === 'success' && (
        <div className="balanceSuccess">Верно! Весы в равновесии 🎉</div>
      )}
      {checkResult === 'fail' && (
        <div className="balanceFail">Ошибка: весы не уравновешены. Попробуйте ещё раз!</div>
      )}
      {allUsedError && (
        <div className="allUsedError">{allUsedError}</div>
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
        <Modal example={getExample()} onClose={nextTask} buttonText="Далее" />
      )}

      {/* Показываем все задачи и выделяем текущую */}
      <div className="tasks-list">
        {tasks.map((t, idx) => (
          <button
            key={t.id}
            className={"task-btn" + (idx === currentTaskIndex ? " active" : "")}
            onClick={() => {
              setCurrentTaskIndex(idx);
              setAvailable((t.mass || []).map((m, i) => ({ id: i + 1, mass: m })));
              setTask(t.task || "");
              setPlaced([]);
              setDragged(null);
              setDraggedPlaced(null);
              setCheckResult(null);
              setModalOpen(false);
            }}
          >
            {t.task || ` ${idx + 1}`}
          </button>
        ))}
      </div>

      <audio ref={audioRef} src={weightSound} preload="auto" />
      <audio ref={finshAudioRef} src={finshSound} preload="auto" />
    </div>
  );
}
