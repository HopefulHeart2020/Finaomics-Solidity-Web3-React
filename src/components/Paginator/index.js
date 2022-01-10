import React from "react";
import "./style.css";
function Paginator(props) {
  return (
    <div className="row row--grid">
      <div className="col-12">
        <div className="paginator">
          <span className="paginator__pages">8 from 169</span>

          <ul className="paginator__list">
            <li>
              <a href="/"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17,11H9.41l3.3-3.29a1,1,0,1,0-1.42-1.42l-5,5a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l5,5a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L9.41,13H17a1,1,0,0,0,0-2Z"/></svg></a>
            </li>
            <li className="active"><a href="/">1</a></li>
            <li><a href="/">2</a></li>
            <li><a href="/">3</a></li>
            <li><a href="/">4</a></li>
            <li>
              <a href="/"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z"/></svg></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Paginator; 
          