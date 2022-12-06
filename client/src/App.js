import "./App.css";
import React from "react";
import { Route, BrowserRouter, Routes, useNavigate } from "react-router-dom";
import logo from "./logo.svg";
import Home from "./pages/home/Home";
import Catalogue from "./pages/catalogue/Catalogue";
import ContactForm from "./pages/contactForm/ContactForm";
import Cart from "./pages/cart/Cart";
import Detail from "./pages/detail/Detail";
import About from "./pages/about/About";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Create from "./pages/create/Create";
import UserAccount from "./pages/userAccount/UserAccount";
import Profile from "./pages/profile/Profile";
import Dashboard from "./pages/dashboard/Dashboard";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Loading from "./components/Loading";
import { Auth0Provider, withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();


const ProtectedRoute = ({ component, ...args }) => {
  const Component = withAuthenticationRequired(component, args);
  return <Component />;
};

const Auth0ProviderWithRedirectCallback = ({ children, ...props }) => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState) => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };
  return (
    <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
      {children}
    </Auth0Provider>
  );
};


function App() {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="App">
      <Auth0ProviderWithRedirectCallback
        domain="dev-a3kheszuwvfvuoad.us.auth0.com"
        clientId="zVBOjQQhQSTxp3S8KRXOfLaMVMruuk2u"
        redirectUri={window.location.origin}
        audience="https://dev-a3kheszuwvfvuoad.us.auth0.com/api/v2/"
        scope="read:current_user update:current_user_metadata"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute component={Dashboard} />}
          />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/user/account"
            element={<ProtectedRoute component={UserAccount} />}
          />
          <Route path="/:email" element={<Profile />} />
        </Routes>
      </Auth0ProviderWithRedirectCallback>
    </div>
  );
}

export default App;
