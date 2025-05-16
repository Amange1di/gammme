import React from "react";
import { PlacedWeight } from "../types";
import PlacedWeightComponent from "../PlacedWeight/PlacedWeight";
import './Plate.scss';

// props для Plate
interface PlateProps {
  side: "left" | "right";
  pos: number;
  placed: PlacedWeight[];
  draggedPlaced: PlacedWeight | null;
  hoveredPlate: { side: "left" | "right", pos: number } | null;
  onPlacedDragStart: (w: PlacedWeight) => void;
  onPlateDragOver: (side: "left" | "right", pos: number, e: React.DragEvent) => void;
  onPlateDragLeave: () => void;
  onDrop: (side: "left" | "right", pos: number) => void;
}

const Plate: React.FC<PlateProps> = ({
  side,
  pos,
  placed,
  draggedPlaced,
  hoveredPlate,
  onPlacedDragStart,
  onPlateDragOver,
  onPlateDragLeave,
  onDrop
}) => {
  const isHovered = hoveredPlate && hoveredPlate.side === side && hoveredPlate.pos === pos;
  return (
    <div className="plate">
      <div className="plate_drop">

        <div
          className={"platedrop" + (isHovered ? " platedrop_hovered" : "")}
          onDragOver={e => onPlateDragOver(side, pos, e)}
          onDragLeave={onPlateDragLeave}
          onDrop={() => onDrop(side, pos)}
        >
          {placed.filter(w => w.side === side && w.position === pos).map(w => (
            <PlacedWeightComponent
              key={w.id}
              w={w}
              draggedPlaced={draggedPlaced}
              onPlacedDragStart={onPlacedDragStart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plate;
