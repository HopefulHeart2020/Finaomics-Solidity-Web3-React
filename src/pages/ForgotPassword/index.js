import React from "react";
import BreadCrumb from "components/BreadCrumb";
import "styles/auth.css";
const breadCrumb = [
  { title: "Home", page: "/" },
  { title: "Restore Password", page: "/" },
];

function Forgot(props) {
  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          {/* breadcrumb */}
          <BreadCrumb data={breadCrumb} />
          {/* end breadcrumb */}

          {/* sign in */}
          <div className="col-12">
            <div className="col-12">
              <div className="sign">
                <div className="sign__content">
                  <form action="#" className="sign__form">
                    <a href="/" className="sign__logo">
                      <img src="assets/img/nft_logo1.png" alt="" />
                    </a>

                    <div className="sign__group">
                      <input
                        type="text"
                        className="sign__input"
                        placeholder="Email"
                      />
                    </div>

                    <div className="sign__group sign__group--checkbox">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        defaultChecked
                      />
                      <label htmlFor="remember">
                        I agree to the{" "}
                        <a
                          href="assets/terms/WebsitePrivacyPolicy.pdf"
                          target="_blank"
                          className="ml-1"
                        >
                          Terms of Service
                        </a>
                      </label>
                    </div>

                    <button className="sign__btn" type="button">
                      Send
                    </button>

                    <span className="sign__text">
                      We will send a password to your Email
                    </span>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default Forgot;
