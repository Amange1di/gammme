import React from "react";
import { PlacedWeight } from "../types";
import Plate from "../Plate/Plate";
import './Board.scss';

type BoardProps = {
  placed: PlacedWeight[];
  draggedPlaced: PlacedWeight | null;
  hoveredPlate: { side: "left" | "right", pos: number } | null;
  onPlacedDragStart: (w: PlacedWeight) => void;
  onPlateDragOver: (side: "left" | "right", pos: number, e: React.DragEvent) => void;
  onPlateDragLeave: () => void;
  onDrop: (side: "left" | "right", pos: number) => void;
  angle: number;
};

const leftPositions = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const rightPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Board: React.FC<BoardProps> = ({
  placed,
  draggedPlaced,
  hoveredPlate,
  onPlacedDragStart,
  onPlateDragOver,
  onPlateDragLeave,
  onDrop,
  angle
}) => (
  <div className="board">
    <div
      className="board_rotate"
      style={{ transform: `rotate(${angle}deg)` }}
    >
      {/* Левая часть */}
      <div className="board_leftPlates">
        {leftPositions.map(pos => (
          <div key={"left" + pos} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Plate
              side="left"
              pos={pos}
              placed={placed}
              draggedPlaced={draggedPlaced}
              hoveredPlate={hoveredPlate}
              onPlacedDragStart={onPlacedDragStart}
              onPlateDragOver={onPlateDragOver}
              onPlateDragLeave={onPlateDragLeave}
              onDrop={onDrop}
            />
            <span className="plate_posnum">{pos}</span>
          </div>
        ))}
      </div>
      {/* Центральная балка с делениями и цифрами */}
      <div className="board_beam">

      </div>
      {/* Правая часть */}
      <div className="board_rightPlates">
        {rightPositions.map(pos => (
          <div key={"right" + pos} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Plate
              side="right"
              pos={pos}
              placed={placed}
              draggedPlaced={draggedPlaced}
              hoveredPlate={hoveredPlate}
              onPlacedDragStart={onPlacedDragStart}
              onPlateDragOver={onPlateDragOver}
              onPlateDragLeave={onPlateDragLeave}
              onDrop={onDrop}
            />
            <span className="plate_posnum">{pos}</span>
          </div>
        ))}
      </div>
    </div>
    {/* Центральная опора */}
    <div className="board_support" />
    <div className="board_pillar" />
  </div>
);

export default Board;

