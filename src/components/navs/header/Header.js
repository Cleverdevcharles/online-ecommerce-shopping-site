import SearchIcon from "@material-ui/icons/Search";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap";
import Modal from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated, signout } from "../../../functions/auth";
import { getCategories, getSites, list } from "../../apiCore";
import Site from "../../card/Site";
import ProductCard from "../../card/ProductCard";
import { itemTotal } from "../../cart/cartHelpers";
import "./Header.css";

function Header() {
  const [data, setData] = useState({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false,
  });
  const [show, setShow] = useState(false);
  const [showlogout, setShowLogout] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseLogout = () => setShowLogout(false);
  const handleShowLogout = () => setShowLogout(true);
  const [sitesByArrival, setSitesByArrival] = useState([]);
  const [sites, setSites] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const { user } = isAuthenticated();

  const { categories, category, search, results, searched } = data;

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({ ...data, categories: data });
      }
    });
  };

  const loadSitesByArrival = () => {
    getSites("createdAt").then((data) => {
      console.log(data);
      if (data.error) {
        setError(data.error);
      } else {
        setSitesByArrival(data);
      }
    });
  };

  useEffect(() => {
    loadCategories();
    loadSitesByArrival();
  }, []);

  const searchData = () => {
    // console.log(search, category);
    if (search) {
      list({ search: search || undefined, category: category }).then(
        (response) => {
          if (response.error) {
            console.log(response.error);
          } else {
            history.push(`?${search}`);
            // history.push("/shop");
            setData({ ...data, results: response, searched: true });
          }
        }
      );
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  const handleChange = (name) => (event) => {
    setData({ ...data, [name]: event.target.value, searched: false });
  };

  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} product(s)`;
    }
    if (searched && results.length < 1) {
      return `No product found`;
    }
  };

  const searchedProducts = (results = []) => {
    return (
      <div>
        <center>
          <h2 style={{ marginTop: "40px" }}>
            {searchMessage(searched, results)}
          </h2>
        </center>

        <div className="row">
          {results.map((product, i) => (
            <div className="col-4 mb-3">
              <ProductCard key={i} product={product} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const loadSites = () => {
    getSites().then((data) => {
      if (data.error) {
        console.log(data.error);
        setLoading(false);
      } else {
        setLoading(false);
        setSites(data);
      }
    });
  };

  useEffect(() => {
    loadSites();
  }, []);

  const searchForm = () => (
    <form onSubmit={searchSubmit} className="header__search">
      {sites.map((s, i) => (
        <>
          <span className="header__search">
            <div>
              <select
                className="mr-5"
                style={{
                  border: "2px solid #f09d51",
                  padding: "10px",
                  borderRadius: "6px",
                  backgroundColor: "transparent",
                  color: "#fff",
                }}
                onChange={handleChange("category")}
              >
                <option
                  value="All"
                  style={{
                    color: "#000",
                  }}
                >
                  All Categories
                </option>
                {categories.map((c, i) => (
                  <option
                    style={{
                      color: "#000",
                    }}
                    key={i}
                    value={c._id}
                  >
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </span>
          <input
            className="header__searchInput"
            onChange={handleChange("search")}
            type="search"
            placeholder={`Search now on ${s.name}.....`}
          />
          <button style={{ border: "none", backgroundColor: "transparent" }}>
            <SearchIcon
              className="header__searchIcon"
              style={{ marginLeft: "-20px" }}
            />
          </button>
        </>
      ))}
    </form>
  );

  const searchFormTwo = () => (
    <form onSubmit={searchSubmit} className="header__searchTwo">
      {sites.map((s, i) => (
        <>
          <span className="header__searchTwo">
            <div>
              <select
                className="mr-5"
                style={{
                  border: "2px solid #f09d51",
                  padding: "10px",
                  borderRadius: "6px",
                  backgroundColor: "transparent",
                  color: "#fff",
                }}
                onChange={handleChange("category")}
              >
                <option
                  value="All"
                  style={{
                    color: "#000",
                  }}
                >
                  All Categories
                </option>
                {categories.map((c, i) => (
                  <option
                    style={{
                      color: "#000",
                    }}
                    key={i}
                    value={c._id}
                  >
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </span>
          <input
            className="header__searchInputTwo"
            onChange={handleChange("search")}
            type="search"
            placeholder={`Search now on ${s.name}.....`}
          />
          <button style={{ border: "none", backgroundColor: "transparent" }}>
            <SearchIcon
              className="header__searchIcon"
              style={{ marginLeft: "-20px" }}
            />
          </button>
        </>
      ))}
    </form>
  );

  const dashboard = () => {
    if (user.role === "admin") {
      history.push("/admin/dashboard");
      window.location.reload();
    } else {
      history.push("/user/dashboard");
      window.location.reload();
    }
  };

  const register = () => {
    history.push("/register");
    window.location.reload();
  };
  const login = () => {
    history.push("/login");
    window.location.reload();
  };
  const home = () => {
    history.push("/");
    window.location.reload();
  };
  const shop = () => {
    history.push("/shop");
    window.location.reload();
  };
  const about = () => {
    history.push("/about");
    window.location.reload();
  };
  const contact = () => {
    history.push("/contact");
    window.location.reload();
  };
  const cart = () => {
    history.push("/cart");
    window.location.reload();
  };

  return (
    <>
      <div className="header">
        <Link to="/" className="a">
          {sitesByArrival.map((site, i) => (
            <div key={i} className="header__logo">
              <Site site={site} />
            </div>
          ))}
        </Link>

        <div className="header__search">{searchForm()}</div>
        <div className="smallJoint"></div>

        <div className="header__nav">
          {user ? (
            <div>
              <div className="header__option">
                <span className="header__optionLineOne">{user.name} </span>
                <span
                  className="header__optionLineTwo header__optionLineTwo__logout"
                  onClick={handleShow}
                >
                  Account
                </span>
              </div>
            </div>
          ) : (
            <Link to="#" className="a">
              <div className="header__option">
                <span className="header__optionLineOne">Hello Guest</span>
                <span className="header__optionLineTwo" onClick={handleShow}>
                  Account
                </span>
              </div>
            </Link>
          )}



          <Link to="/cart" onClick={cart} className="a">
            <div className="header__optionBasket" style={{ color: "#fff" }}>
              <span className="header__optionLineTwo cart__items header__basketCount">
                <span className="cart__count" style={{ marginLeft: "3px"}}>{itemTotal()}</span>
                <ShoppingBasketIcon />
              </span>
            </div>
          </Link>
        </div>

        {user ? (
          <>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body className="center__logout">
                <center>
                  Hello, {user.name}.<br /> Hope you are having a great day.
                </center>
              </Modal.Body>

              <Modal.Footer>
                {user.role === "admin" ? (
                  <Link to="/admin/dashboard" onClick={dashboard}>
                    <Button variant="danger">Dashboard</Button>
                  </Link>
                ) : (
                  <Link to="/user/dashboard" onClick={dashboard}>
                    <Button variant="danger">Dashboard</Button>
                  </Link>
                )}
                <Button variant="warning" onClick={handleShowLogout}>
                  Logout
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal show={showlogout} onHide={handleCloseLogout}>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body className="center__logout">
                <center>
                  Hello, {user.name}.<br /> Please confrirm you are about to
                  logout.
                </center>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleCloseLogout}>
                  Cancle
                </Button>
                <Button
                  variant="warning"
                  onClick={() => {
                    signout(() => {
                      toast.success("Signout Successfully");
                      history.push("/");
                      setTimeout(function () {
                        window.location.reload();
                      }, 700);
                    });
                  }}
                >
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        ) : (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body className="center__logout">Hello Guest</Modal.Body>
            <Modal.Footer>
              <Link to="/register" onClick={register}>
                <Button variant="danger" className="a">
                  Rigister
                </Button>
              </Link>
              <Link to="/login" className="a" onClick={login}>
                <Button variant="warning">Login</Button>
              </Link>
            </Modal.Footer>
          </Modal>
        )}
      </div>

      <div className="secondSearch">
      <div className="header__searchTwo">{searchFormTwo()}</div>
      </div>
      
      <ul class="nav justify-content-center small__nav">
        <li class="nav-item" onClick={home}>
          <Link to="/" class="nav-link active" aria-current="page">
            <i className="fas fa-home"></i> <b>HOME</b>
          </Link>
        </li>
        <li class="nav-item" onClick={shop}>
          <Link to="/shop" class="nav-link" href="#">
            <b>SHOP</b>
          </Link>
        </li>
        <li class="nav-item" onClick={about}>
          <Link to="/about" class="nav-link">
            <b>ABOUT US</b>
          </Link>
        </li>
        <li class="nav-item" onClick={contact}>
          <Link to="/contact" class="nav-link">
            <b>CONTACT US</b>
          </Link>
        </li>
      </ul>
   
      <div className="searchedProduct">{searchedProducts(results)}</div>
    </>
  );
}

export default Header;
