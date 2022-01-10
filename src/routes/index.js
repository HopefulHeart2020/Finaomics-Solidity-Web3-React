import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Header from "pages/Header";
import Main from "pages/Main";  
import Footer from "pages/Footer";
import Explore from "pages/Explore";
import Activity from "pages/Activity";
import Asset from "pages/Asset";
import Token from "pages/Token";
import Blog from "pages/Blog";
import Faq from "pages/Faq";
import Contact from "pages/Contact";
import Creators from "pages/Creators";
import Creator from "pages/Creator";
import Collection from "pages/Collection";
import Create from "pages/Create";
import SignIn from "pages/SignIn";
import SignUp from "pages/SignUp";
import Forgot from "pages/ForgotPassword";
import Error from "pages/404";
import Privacy from "pages/Privacy";
import Profile from "pages/Profile";
import Admin from "pages/Admin";

function Routes(props) {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/explore" component={Explore} />
          <Route path="/activity" component={Activity} />
          <Route path="/item/:id" component={Asset} />
          <Route path="/token" component={Token} />
          <Route path="/faq" component={Faq} />
          <Route path="/blog" component={Blog} />
          <Route path="/contacts" component={Contact} />
          <Route path="/creators" component={Creators} />
          <Route path="/creator/:id" component={Creator} />
          <Route path="/collection" component={Collection} />
          <Route path="/create" component={Create} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/forgot" component={Forgot} />
          <Route path="/404" component={Error} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/profile" component={Profile} />
          <Route path="/admin" component={Admin} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default Routes;
