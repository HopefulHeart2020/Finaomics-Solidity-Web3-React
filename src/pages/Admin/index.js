import React from "react";
import BreadCrumb from "components/BreadCrumb";
import "styles/activity.css";
import PaymentToken from "./paymentToken";
import SetMarketFee from "./setMarketFee";
const breadcrumb = [
  { title: "Home", page: "/" },
  { title: "Admin", page: "/admin" },
];

function Admin() {
  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          {/* <!-- breadcrumb --> */}
          <div className="col-12">
            <BreadCrumb data={breadcrumb} />
            {/* <button onClick={sss}>
              <span>sdfsdfsdfsd</span>
            </button> */}
          </div>
          {/* <!-- end breadcrumb --> */}

          <div className="col-9">
            <div className="main__title main__title--page">
              <h1>Admin Panel</h1>
            </div>
          </div>
        </div>

        <div className="row row--grid">
          <ul className="nav nav-tabs asset__tabs" role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active"
                data-toggle="tab"
                href="#tab-1"
                role="tab"
                aria-controls="tab-1"
                aria-selected="true"
              >
                Set Payment Token
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                data-toggle="tab"
                href="#tab-2"
                role="tab"
                aria-controls="tab-2"
                aria-selected="true"
              >
                Set Market Fee
              </a>
            </li>
          </ul>

          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="tab-1"
              role="tabpanel"
            >
              <PaymentToken />
            </div>
            <div className="tab-pane fade show" id="tab-2" role="tabpanel">
              <SetMarketFee />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Admin;
