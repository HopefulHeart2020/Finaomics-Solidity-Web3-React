import React from "react";
import BreadCrumb from "../../components/BreadCrumb";
import Filter from "../../components/Filter";
import Activity from "../../components/Activity";
const breadcrumb = [
	{title:"Home", page:'/'},
	{title:"Activity", page:"/activity"},
];
const activityData=[
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"list", nickName:"@Nickname", kcsPrice:0.049, timeAgo:4},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"purchase", nickName:"@johndoe",kcsPrice:0.011, timeAgo:21},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"transfer", fromName:"@johndoe", toName:"@Nickname", timeAgo:21},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"offer",nickName:"@johndoe", kcsPrice:0.011, timeAgo:23},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"like",nickName:"@johndoe", timeAgo:23},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"start",nickName:"@johndoe", timeAgo:23},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"list", nickName:"@Nickname", kcsPrice:0.049, timeAgo:4},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"purchase", nickName:"@johndoe",kcsPrice:0.011, timeAgo:21},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"transfer", fromName:"@johndoe", toName:"@Nickname", timeAgo:21},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"offer",nickName:"@johndoe", kcsPrice:0.011, timeAgo:23},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"like",nickName:"@johndoe", timeAgo:23},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"start",nickName:"@johndoe", timeAgo:23},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"transfer", fromName:"@johndoe", toName:"@Nickname", timeAgo:21},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"offer",nickName:"@johndoe", kcsPrice:0.011, timeAgo:23},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"like",nickName:"@johndoe", timeAgo:23},
  {cover:"assets/img/cover/cover1.jpg", title:"Walking on Air", method:"start",nickName:"@johndoe", timeAgo:23}
];
function Routes() {
  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          <BreadCrumb data={breadcrumb}/>

          {/* <!-- title --> */}
          <div className="col-12">
            <div className="main__title main__title--page">
              <h1>Activity</h1>
            </div>
          </div>
          {/* <!-- end title --> */}
        </div>

        <div className="row">
          <div className="col-12 col-xl-3 order-xl-2">
            <div className="filter-wrap">
              <button className="filter-wrap__btn" type="button" data-toggle="collapse" data-target="#collapseFilter" aria-expanded="false" aria-controls="collapseFilter">Open filter</button>
              <div className="collapse filter-wrap__content" id="collapseFilter">
                <Filter/>
              </div>
            </div>
          </div>

          {/* <!-- content --> */}
          <div className="col-12 col-xl-9 order-xl-1">
            <div className="row row--grid">
              {activityData.map((activity,index)=>(
                index < 8 &&
                <div className="col-12 col-lg-6" key={`activity-${index}`}>
                  <Activity data={activity} id={index}/>
                </div>           
              ))}           
            </div>
            <div className="row row--grid collapse" id="collapsemore">
              {activityData.map((activity,index)=>(
              index >= 8 &&
                <div className="col-12 col-lg-6"  key={`activity${index}`}>
                  <Activity data={activity} id={index}/>
                </div>
              ))}  
            </div>      

            <div className="row row--grid">
              <div className="col-12">
                <button className="main__load" type="button" data-toggle="collapse" data-target="#collapsemore" aria-expanded="false" aria-controls="collapsemore">Load more</button>
              </div>
            </div>
          </div>
        </div>	
      </div>
    </main>
  );
}

export default Routes;
