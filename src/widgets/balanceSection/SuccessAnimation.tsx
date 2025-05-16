import React from "react";
import './SuccessAnimation.scss';

const SuccessAnimation: React.FC = () => (
    <div className="success-animation">
        <div className="emoji-burst">
            <span role="img" aria-label="smile" className="emoji">😃</span>
            <span className="burst burst1" />
            <span className="burst burst2" />
            <span className="burst burst3" />
        </div>
    </div>
);

export default SuccessAnimation;
