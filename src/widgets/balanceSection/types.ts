// Типы для весов и размещённых грузиков
export type Weight = {
    id: number;
    mass: number;
};

export type PlacedWeight = {
    id: number;
    mass: number;
    side: "left" | "right";
    position: number; // расстояние от центра (1-8)
};
