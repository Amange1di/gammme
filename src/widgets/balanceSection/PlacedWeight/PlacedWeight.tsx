import React from "react";
import { PlacedWeight } from "../types";
import './PlacedWeight.scss';

interface PlacedWeightProps {
  w: PlacedWeight;
  draggedPlaced: PlacedWeight | null;
  onPlacedDragStart: (w: PlacedWeight) => void;
}

const PlacedWeightComponent: React.FC<PlacedWeightProps> = ({ w, draggedPlaced, onPlacedDragStart }) => (
  <div
    className={
      "placedweight" +
      (draggedPlaced && draggedPlaced.id === w.id ? " placedweight_dragged" : "")
    }
    draggable
    onDragStart={() => onPlacedDragStart(w)}
  >
    {w.mass}
  </div>
);

export default PlacedWeightComponent;
