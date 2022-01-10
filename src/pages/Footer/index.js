import React from "react";
import { Link } from "react-router-dom";
import "styles/footer.css";

function Routes() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-4 ">
            <p className="footer__tagline text-center text-md-left">
              Flokinomics Marketplace is a next generation marketplace where
              artists and collectors can create, sell and collect digital items
              secured with blockchain.
            </p>

            <div className="footer__lang text-center text-md-left">
              <a
                className="footer__lang-btn"
                href="/"
                role="button"
                id="dropdownLang"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img src="assets/img/flags/uk.svg" alt="" />
                <span>English</span>
              </a>

              <ul
                className="dropdown-menu footer__lang-dropdown"
                aria-labelledby="dropdownLang"
              >
                {/* <li>
                  <a href="/">
                    <img src="assets/img/flags/spain.svg" alt="" />
                    <span>Spanish</span>
                  </a>
                </li>
                <li>
                  <a href="/">
                    <img src="assets/img/flags/russia.svg" alt="" />
                    <span>Russian</span>
                  </a>
                </li>
                <li>
                  <a href="/">
                    <img src="assets/img/flags/china.svg" alt="" />
                    <span>Chinese</span>
                  </a>
                </li> */}
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-4 text-center text-md-left">
            <h6 className="footer__title">Marketplace</h6>
            <div className="footer__nav w-100">
              <Link to="/explore" className="footerLink w-100">
                Explore
              </Link>
              <Link to="/creators" className="footerLink">
                Creators
              </Link>
              <a
                href="/assets/terms/Website_General_Terms_of_Use_Flokinomics.pdf"
                target="_blank"
                rel="noreferrer"
                className="footerLink"
              >
                Website General Terms of Use
              </a>
              <a
                href="/assets/terms/Website_Privacy_Policy_Flokinomics.pdf"
                target="_blank"
                rel="noreferrer"
                className="footerLink"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          {/* <div className="col-12 col-md-5 col-lg-6 col-xl-4 order-3 order-lg-2 order-md-3 order-xl-3">
            <div className="row">
              <div className="col-12">
                <h6 className="footer__title">Explore</h6>
              </div>

              <div className="col-6">
                <div className="footer__nav">
                  <a href="/">Art</a>
                  <a href="/">Music</a>
                  <a href="/">Film</a>
                  <a href="/">Sports</a>
                </div>
              </div>

              <div className="col-6">
                <div className="footer__nav">
                  <a href="/">Education</a>
                  <a href="/">Photography</a>
                  <a href="/">Games</a>
                  <a href="/">Other</a>
                </div>
              </div>
            </div>
          </div> */}

          <div className="col-12 col-md-4 text-center text-md-left">
            <h6 className="footer__title">Resources</h6>
            <div className="footer__nav">
              <a
                href="/assets/terms/WhitePaper.pdf"
                target="_blank"
                rel="noreferrer"
                className="footerLink"
              >
                White Paper
              </a>
              {/* <a
                href="https://cakeshoplabs.com/"
                target="_blank"
                rel="noreferrer"
              >
                Design an NFT
              </a> */}
              <a
                href=" https://t.me/club"
                target="_blank"
                rel="noreferrer"
                className="footerLink"
              >
                Telegram Community
              </a>
              {/* <a
                href="/assets/terms/StrategicPartners.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Become a Partner
              </a> */}
              {/* <a href="/contacts" target="_blank" rel="noreferrer">
                Contact Us
              </a> */}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="footer__content">
              <div className="footer__social">
                <div class="d-flex footerLink">
                  <a
                    href="https://www.instagram.com/flokinomicstoken/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M17.34,5.46h0a1.2,1.2,0,1,0,1.2,1.2A1.2,1.2,0,0,0,17.34,5.46Zm4.6,2.42a7.59,7.59,0,0,0-.46-2.43,4.94,4.94,0,0,0-1.16-1.77,4.7,4.7,0,0,0-1.77-1.15,7.3,7.3,0,0,0-2.43-.47C15.06,2,14.72,2,12,2s-3.06,0-4.12.06a7.3,7.3,0,0,0-2.43.47A4.78,4.78,0,0,0,3.68,3.68,4.7,4.7,0,0,0,2.53,5.45a7.3,7.3,0,0,0-.47,2.43C2,8.94,2,9.28,2,12s0,3.06.06,4.12a7.3,7.3,0,0,0,.47,2.43,4.7,4.7,0,0,0,1.15,1.77,4.78,4.78,0,0,0,1.77,1.15,7.3,7.3,0,0,0,2.43.47C8.94,22,9.28,22,12,22s3.06,0,4.12-.06a7.3,7.3,0,0,0,2.43-.47,4.7,4.7,0,0,0,1.77-1.15,4.85,4.85,0,0,0,1.16-1.77,7.59,7.59,0,0,0,.46-2.43c0-1.06.06-1.4.06-4.12S22,8.94,21.94,7.88ZM20.14,16a5.61,5.61,0,0,1-.34,1.86,3.06,3.06,0,0,1-.75,1.15,3.19,3.19,0,0,1-1.15.75,5.61,5.61,0,0,1-1.86.34c-1,.05-1.37.06-4,.06s-3,0-4-.06A5.73,5.73,0,0,1,6.1,19.8,3.27,3.27,0,0,1,5,19.05a3,3,0,0,1-.74-1.15A5.54,5.54,0,0,1,3.86,16c0-1-.06-1.37-.06-4s0-3,.06-4A5.54,5.54,0,0,1,4.21,6.1,3,3,0,0,1,5,5,3.14,3.14,0,0,1,6.1,4.2,5.73,5.73,0,0,1,8,3.86c1,0,1.37-.06,4-.06s3,0,4,.06a5.61,5.61,0,0,1,1.86.34A3.06,3.06,0,0,1,19.05,5,3.06,3.06,0,0,1,19.8,6.1,5.61,5.61,0,0,1,20.14,8c.05,1,.06,1.37.06,4S20.19,15,20.14,16ZM12,6.87A5.13,5.13,0,1,0,17.14,12,5.12,5.12,0,0,0,12,6.87Zm0,8.46A3.33,3.33,0,1,1,15.33,12,3.33,3.33,0,0,1,12,15.33Z" />
                    </svg>
                  </a>

                  <a
                    href="https://twitter.com/Flokinomics"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z" />
                    </svg>
                  </a>

                  <a
                    href="https://t.me/flokinomicsofficial"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M11.99432,2a10,10,0,1,0,10,10A9.99917,9.99917,0,0,0,11.99432,2Zm3.17951,15.15247a.70547.70547,0,0,1-1.002.3515l-2.71467-2.10938L9.71484,17.002a.29969.29969,0,0,1-.285.03894l.334-2.98846.01069.00848.00683-.059s4.885-4.44751,5.084-4.637c.20147-.189.135-.23.135-.23.01147-.23053-.36152,0-.36152,0L8.16632,13.299l-2.69549-.918s-.414-.1485-.453-.475c-.041-.324.46649-.5.46649-.5l10.717-4.25751s.881-.39252.881.25751Z" />
                    </svg>
                  </a>
                </div>
              </div>

              <small className="footer__copyright   text-center text-md-left">
                © 2021 Flokinomics All Rights Reserved.{" "}
              </small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Routes;
