import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import logo from "../../Logo/LogoOficial.png";
import cartImg from "../../Logo/cart.png";
import { useLocalStorage } from "../../useLocalStorage";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Container,
  NavbarToggler,
  Nav,
  NavItem,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { getUserLogin, getTotalProducts } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";

import i18n from "../../i18n";

export default function Navbar() {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [cart, setCart] = useLocalStorage("cartProducts", []);
  const userLogin = useSelector((state) => state.userLogin);
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const getToken = async () => {
    const token = await getAccessTokenSilently();
    return `${token}`;
  };
  const setCartLogout = () => {
    setCart([]);
  };

  useEffect(() => {
    if (cart) {
      let cartTotal = cart.reduce(
        (acc, currentValue) => acc + currentValue.cartTotalQuantity,
        0
      );
      dispatch(getTotalProducts(cartTotal));
    }
    if (user && Object.hasOwn(userLogin, "isAdmin") === false) {
      dispatch(getUserLogin(user, cart, getToken));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user, cart, userLogin.isAdmin]);

  const totalItems = useSelector((state) => state.totalProducts);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin + "/home",
    });

  return (
    <nav className={styles.nav}>
      <div className={styles.div}>
        <Link to={"/home"}>
          <img src={logo} title="Home" className={styles.logo} alt="logo" />
        </Link>
        <Container
          style={{ maxWidth: "120px", marginInline: "40px", placeContent: 'center' }}
          className={styles.desplegable}
        >
          <NavbarToggler onClick={toggle} />
          <Nav  navbar>
            {!isAuthenticated && (
              <NavItem >
                <Button
               
                  id="qsLoginBtn"
                  color="light"
                  className="btn-margin"
                  onClick={() => loginWithRedirect()}
                >
                  {i18n.t("navbar.log-in")}
                </Button>
              </NavItem>
            )}
            {isAuthenticated && (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle   nav caret id="profileDropDown">
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="nav-user-profile rounded-circle"
                    width="50px"
                    
                  />
                </DropdownToggle>
                <DropdownMenu style={{ position: "absolute", width: "fit-content"}}>
                  <DropdownItem header>{user.name}</DropdownItem>
                  <DropdownItem
                    tag={RouterNavLink}
                    to="/user/account"
                    className="dropdown-profile"
                    activeclassname="router-link-exact-active"
                  >
                    <FontAwesomeIcon icon="tools" className="mr-3" />
                    {i18n.t("navbar.account")}
                  </DropdownItem>
                  <DropdownItem
                    tag={RouterNavLink}
                    to={"/userProfile/" + user.email}
                    className="dropdown-profile"
                    activeclassname="router-link-exact-active"
                  >
                    <FontAwesomeIcon icon="user" className="mr-3" />
                    {i18n.t("navbar.profile")}
                  </DropdownItem>
                  <DropdownItem
                    tag={RouterNavLink}
                    to="/user/purchases"
                    className="dropdown-profile"
                    activeclassname="router-link-exact-active"
                  >
                    <FontAwesomeIcon icon="box" className="mr-3" />
                    {i18n.t("navbar.purchases")}
                  </DropdownItem>
                  <DropdownItem
                    id="qsLogoutBtn"
                    onClick={() => {
                      logoutWithRedirect();
                      setCartLogout();
                    }}
                  >
                    <FontAwesomeIcon icon="power-off" className="mr-3" />
                    {i18n.t("navbar.log-out")}
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </Nav>
        </Container>
        <ul>
          <li className={styles.shoppingCart}>
            <div className={styles.itemsCart}>{totalItems}</div>
            <Link to={"/cart"}>
              <img src={cartImg} className={styles.cart} alt="cart" />
            </Link>
          </li>
          {userLogin.isAdmin ? (
            <li className={styles.lista}>
              {" "}
              <Link to={"/dashboard/adminProducts"} className={styles.anchor}>
                {i18n.t("navbar.dashboard")}
              </Link>
            </li>
          ) : null}
          <li className={styles.lista}>
            <Link to={"/catalogue"} className={styles.anchor}>
              {i18n.t("navbar.catalogue")}
            </Link>
          </li>
          <li className={styles.lista}>
            <Link to={"/about"} className={styles.anchor}>
              {i18n.t("navbar.about-us")}
            </Link>
          </li>
          <li className={styles.lista}>
            <Link to={"/contact"} className={styles.anchor}>
              {i18n.t("navbar.contact")}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
