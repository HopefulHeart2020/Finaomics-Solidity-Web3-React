import React from "react";
import VideoImage from "../Card/VideoImage";
import "./style.css";
function Preview(props) {
  const { type, image } = props.data;
  return (
    <div className="asset__item pb-4">
      {type === "image" ? (
        <a className="asset__img" href={image} target="_blank" rel="noreferrer">
          <div className="preview-container">
            <img src={image} alt="" />
          </div>
        </a>
      ) : (
        <div className="relative item-video">
          <VideoImage src={image} />
        </div>
      )}
    </div>
  );
}
export default Preview;
