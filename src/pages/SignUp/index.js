import React from "react";
import { useHistory } from "react-router-dom";
import BreadCrumb from "components/BreadCrumb";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

import { auth } from "firebase.js";
import "styles/auth.css";
import logo from "../../assets/img/logo.png";
const breadCrumb = [
  { title: "Home", page: "/" },
  { title: "SignUp", page: "/" },
];

function SignUp() {
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Must be at least 6 characters")
        .max(100, "Must be 20 characters or less")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values) => {
      auth
        .createUserWithEmailAndPassword(values.email, values.password)
        .then((user) => {
          user.user.sendEmailVerification();
          auth.signOut();
          toast.success("Sent Email Verification Link to your email");
          history.push("/signin");
        })
        .catch((error) => {
          toast.error(error);
        });
    },
  });

  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          {/* breadcrumb */}
          <BreadCrumb data={breadCrumb} />
          {/* end breadcrumb */}

          {/* sign in */}
          <div className="col-12">
            <div className="sign">
              <div className="sign__content">
                <form className="sign__form" onSubmit={formik.handleSubmit}>
                  <h1 className="signHeadline" >Sign up</h1>
                  <a href="/" className="sign__logo d-none">
                    <img src={logo} alt="" />
                  </a>

                  <div className="sign__group">
                    <input
                      type="text"
                      className="sign__input"
                      placeholder="Name"
                      {...formik.getFieldProps("name")}
                    />
                  </div>
                  {formik.touched.name && formik.errors.name ? (
                    <label className="text-warning">{formik.errors.name}</label>
                  ) : null}
                  <div className="sign__group">
                    <input
                      type="text"
                      className="sign__input"
                      placeholder="Email"
                      {...formik.getFieldProps("email")}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email ? (
                    <label className="text-warning">
                      {formik.errors.email}
                    </label>
                  ) : null}
                  <div className="sign__group">
                    <input
                      type="password"
                      className="sign__input"
                      placeholder="Password"
                      {...formik.getFieldProps("password")}
                    />
                  </div>
                  {formik.touched.password && formik.errors.password ? (
                    <label className="text-warning">
                      {formik.errors.password}
                    </label>
                  ) : null}
                  <div className="sign__group">
                    <input
                      id="confPwd"
                      type="password"
                      className="sign__input"
                      placeholder="Confirm Password"
                      {...formik.getFieldProps("confirmPassword")}
                    />
                  </div>
                  {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword ? (
                    <label className="text-warning">
                      {formik.errors.confirmPassword}
                    </label>
                  ) : null}
                  <div className="sign__group sign__group--checkbox">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      defaultChecked
                    />
                    <label htmlFor="remember" >
                      I agree to the{" "}
                      <a
                        href="assets/terms/Busiess Sales Agreement.pdf"
                        target="_blank"
                        className="linkSign"

                      >
                        Business Sales Agreement
                      </a>
                    </label>
                  </div>

                  <button className="sign__btnPink" type="submit">
                    Sign up
                  </button>

                  <span className="sign__text">
                    Already have an account? <a href="/signin" className="linkSign">Sign in!</a>
                  </span>
                </form>
              </div>
            </div>
          </div>
          {/* end sign in */}
        </div>
      </div>
    </main>
  );
}
export default SignUp;
