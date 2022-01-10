import React from "react";
import "./style.css";
function Spinner(props) {
  const { play, absolute } = props;
  return (
    play && (
      <div className={`spinner${absolute ? " absolute" : ""}`} disabled>
        <p>
          <span className="loader__dot">. </span>
          <span className="loader__dot">. </span>
          <span className="loader__dot">.</span>
        </p>
      </div>
    )
  );
}

export default Spinner;
