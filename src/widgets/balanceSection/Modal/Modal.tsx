import React from "react";
import './Modal.scss';

interface ModalProps {
  example: {
    left: { mass: number; pos: number }[];
    right: { mass: number; pos: number }[];
  };
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ example, onClose }) => (
  <div className="modaloverlay">
    <div className="modalcontent">
      <div className="modalformula">
        <span className="modalformula_strong">
          {example.left.map(e => `${e.mass}×${e.pos}`).join(" + ")}
          {" = "}
          {example.right.map(e => `${e.mass}×${e.pos}`).join(" + ")}
        </span>
      </div>
      <button
        onClick={onClose}
        className="modalbtn"
      >Далее</button>
    </div>
  </div>
);

export default Modal;
