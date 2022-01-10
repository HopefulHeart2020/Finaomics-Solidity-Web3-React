import React from "react";
import "./style.css";
function Post(props) {
  const { image, category, title, date, comment } = props.data;
  return (
    <div className="post">
      <a href="article.html" className="post__img">
        <img src={image} alt="" />
      </a>

      <div className="post__content">
        <a href="/" className="post__category">
          {category}
        </a>
        <h3 className="post__title">
          <a href="/">{title}</a>
        </h3>
        <div className="post__meta">
          <span className="post__date">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12,2A10,10,0,1,0,22,12,10.01114,10.01114,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.00917,8.00917,0,0,1,12,20ZM14.09814,9.63379,13,10.26807V7a1,1,0,0,0-2,0v5a1.00025,1.00025,0,0,0,1.5.86621l2.59814-1.5a1.00016,1.00016,0,1,0-1-1.73242Z" />
            </svg>
            {date}
          </span>
          <span className="post__comments">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M17,9H7a1,1,0,0,0,0,2H17a1,1,0,0,0,0-2Zm-4,4H7a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2ZM12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,2.26,6.33l-2,2a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,22h9A10,10,0,0,0,12,2Zm0,18H5.41l.93-.93a1,1,0,0,0,0-1.41A8,8,0,1,1,12,20Z" />
            </svg>
            {comment}
          </span>
        </div>
      </div>
    </div>
  );
}
export default Post;
