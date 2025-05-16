import React from "react";
import { Weight, PlacedWeight } from "../types";
import './WeightsBar.scss';

type WeightsBarProps = {
  available: Weight[];
  dragged: Weight | null;
  draggedPlaced: PlacedWeight | null;
  onDragStart: (w: Weight) => void;
  onPlacedDrop: () => void;
  onReset: () => void;
};

const WeightsBar: React.FC<WeightsBarProps> = ({
  available,
  dragged,
  draggedPlaced,
  onDragStart,
  onPlacedDrop,
  onReset
}) => (
  <div
    className={`weightsbar${draggedPlaced ? ' weightsbar_active' : ''}`}
    onDragOver={e => {
      if (draggedPlaced) e.preventDefault();
    }}
    onDrop={onPlacedDrop}
  >
    <b className="weightsbar_title">Грузики:</b>
    {available.map(w => (
      <span
        key={w.id}
        draggable
        onDragStart={() => onDragStart(w)}
        className={`weight${dragged && dragged.id === w.id ? ' weight_dragged' : ''}`}
      >
        {w.mass}
      </span>
    ))}
    <button
      onClick={onReset}
      className="resetbtn"
    >Сбросить</button>
    {draggedPlaced && (
      <span className="weightsbar_hint">Отпустите здесь, чтобы вернуть грузик</span>
    )}
  </div>
);

export default WeightsBar;
