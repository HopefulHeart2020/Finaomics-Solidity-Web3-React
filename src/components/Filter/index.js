import React from "react";
import "./style.css";
function Filter() { 
  return(
    <div className="filter filter--sticky">
      <h4 className="filter__title">Filters <button type="button">Clear all</button></h4>

      <div className="filter__group">
        <ul className="filter__checkboxes">
          <li>
            <input id="type5" type="checkbox" name="type5" defaultChecked/>
            <label htmlFor="type5">Listings</label>
          </li>
          <li>
            <input id="type6" type="checkbox" name="type6"/>
            <label htmlFor="type6">Purchases</label>
          </li>
          <li>
            <input id="type7" type="checkbox" name="type7" defaultChecked/>
            <label htmlFor="type7">Sales</label>
          </li>
          <li>
            <input id="type8" type="checkbox" name="type8" defaultChecked/>
            <label htmlFor="type8">Transfers</label>
          </li>
          <li>
            <input id="type9" type="checkbox" name="type9" />
            <label htmlFor="type9">Bids</label>
          </li>
          <li>
            <input id="type10" type="checkbox" name="type10" />
            <label htmlFor="type10">Likes</label>
          </li>
          <li>
            <input id="type11" type="checkbox" name="type11" />
            <label htmlFor="type11">Followings</label>
          </li>
        </ul>
      </div>
    </div>
    );
  }
  export default Filter;