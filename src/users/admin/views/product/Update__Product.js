import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "../../../../components/forms/category/categoryForm.css";
import { isAuthenticated } from "../../../../functions/auth";
import { getCategories } from "../../../../functions/category";
import { getProduct, updateProduct } from "../../../../functions/product";
import SideBar from "../../layouts/SideBar";
import "../dashboard/Dashboard.css";
import "../styles.css";

const UpdateProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    oldprice: "",
    categories: [],
    category: "",
    shipping: "",
    shipping_fee: "",
    amazon_url: "",
    quantity: "",
    photo: "",
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    formData: "",
  });

  const [categories, setCategories] = useState([]);

  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [button, setbutton] = useState("Update Product");

  const toggleMenu = () => {
    setMenu(menu ? false : true);
  };

  const history = useHistory();

  const { user, token } = isAuthenticated();
  const {
    name,
    description,
    price,
    oldprice,
    category,
    shipping,
    shipping_fee,
    photo,
    error,
    quantity,
    amazon_url,
    createdProduct,
    redirectToProfile,
    formData,
  } = values;

  const init = (productId) => {
    getProduct(productId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        // populate the state
        setValues({
          ...values,
          name: data.name,
          description: data.description,
          oldprice: data.oldprice,
          price: data.price,
          category: data.category._id,
          shipping: "",
          shipping_fee: 0,
          amazon_url: data.amazon_url,
          quantity: data.quantity,
          formData: new FormData(),
        });
        // load categories
        initCategories();
      }
    });
  };

  // load categories and set form data
  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };

  useEffect(() => {
    init(match.params.productId);
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setValues({ ...values });

    if (!name) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Product name is required.");
      }, 1000);
      return;
    }
    if (name.length > 32) {
      setTimeout(() => {
        setLoading(false);
        toast.error(
          "Product name is long, should be between 2 to 32 characters."
        );
      }, 1000);
      return;
    }
    if (name.length <= 2) {
      setTimeout(() => {
        setLoading(false);
        toast.error(
          "Product name is short, should be between 2 to 32 characters."
        );
      }, 1000);
      return;
    }
    if (!category) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Category  is required. ");
      }, 1000);
      return;
    }
    if (!description) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Description  is required. ");
      }, 1000);
      return;
    }
    if (description.length <= 20) {
      setTimeout(() => {
        setLoading(false);
        toast.error(
          "Description is short, should be between 20 characters to 2000 characters."
        );
      }, 1000);
      return;
    }
    if (description.length > 2000) {
      setTimeout(() => {
        setLoading(false);
        toast.error(
          "Description is long, should be between 20 characters to 2000 characters."
        );
      }, 1000);
      return;
    }
    if (!price) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Please product price is required.");
      }, 1000);
      return;
    }
    if (!price) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Please product price is required.");
      }, 1000);
      return;
    }
    if (!quantity) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Please product quantity is required.");
      }, 1000);
      return;
    }
    if (quantity < 1 && !amazon_url) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Please provide your amazon link to product.");
      }, 1000);
      return;
    }
    if (shipping == 1 && !shipping_fee) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Please product shipping fee is required.");
      }, 1000);

      return;
    }

    if (!shipping && !shipping_fee && !amazon_url) {
      setTimeout(() => {
        setLoading(false);
        toast.error(
          "Please select shipping and input shipping fee or kindly provide an amazon link to your product."
        );
      }, 1000);

      return;
    }

    if (shipping == 0 && !shipping_fee && !amazon_url) {
      setTimeout(() => {
        setLoading(false);
        toast.error("Please provide an amazon link to your product.");
      }, 1000);

      return;
    }

    updateProduct(match.params.productId, user._id, token, formData).then(
      (data) => {
        if (data.error) {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          console.log(data);
        } else {
          setLoading(true);
          setLoading(false);
          toast.success(`Product updated successfully.`);
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            oldprice: "",
            category: "",
            shipping: "",
            shipping_fee: "",
            amazon_url: "",
            quantity: "",
            photo: "",
            createdProduct: data.name,
          });
        }
      }
    );
  };

  const newPostForm = () => (
    <form className="mb-3" onSubmit={handleSubmit}>
      <h4>Upload Product Image</h4>
      <div className="form-group">
        <label className="btn btn-secondary">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image/*"
          />
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          type="text"
          className="formInput"
          value={name}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea
          onChange={handleChange("description")}
          className="formInput"
          value={description}
          rows="10"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Former Price</label>
        <input
          onChange={handleChange("oldprice")}
          type="number"
          placeholder="Optional"
          className="formInput"
          value={oldprice}
        />
        <label className="text-muted">Price</label>
        <input
          onChange={handleChange("price")}
          type="number"
          className="formInput"
          value={price}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Category</label>
        <select onChange={handleChange("category")} className="formInput">
          <option>Please select</option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id} selected={c._id === c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input
          onChange={handleChange("quantity")}
          type="number"
          min="0"
          className="formInput"
          value={quantity}
        />
      </div>

      {quantity < 1 ? (
        <div
          className="form-group"
          style={shipping == 0 ? { display: "none" } : { display: "block" }}
        >
          <label className="text-muted">Amazon Link</label>
          <input
            onChange={handleChange("amazon_url")}
            type="text"
            className="formInput"
            value={amazon_url}
          />
        </div>
      ) : (
        <div className="form-group">
          <label className="text-muted">Shipping</label>
          <select onChange={handleChange("shipping")} className="formInput">
            <option selected={shipping === shipping}>Please select</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
      )}

      {shipping == 0 ? (
        <div className="form-group">
          <label className="text-muted">Amazon Link</label>
          <input
            onChange={handleChange("amazon_url")}
            type="text"
            className="formInput"
            value={amazon_url}
          />
        </div>
      ) : (
        <div className="form-group">
          <label className="text-muted">Shipping Fee</label>
          <input
            onChange={handleChange("shipping_fee")}
            type="number"
            className="formInput"
            value={shipping_fee}
          />
        </div>
      )}

      {/* <button className="btn btn-outline-primary">Create Product</button> */}
      {loading ? (
        <button className="btn__category">
          <div class="loader"></div>
        </button>
      ) : (
        <button className="btn__category">{button}</button>
      )}
    </form>
  );

  const redirectUser = () => {
    if (redirectToProfile) {
      if (!error) {
        return <Redirect to="/" />;
      }
    }
  };

  const goBack = () => (
    <div className="mt-2 pb-5">
      <Link to="/admin/products" className="text-dark">
        <b>Back to Products</b>
      </Link>
    </div>
  );

  const viewSite = () => {
    history.push("/");
    window.location.reload();
  };

  return (
    <>
      <div className="sidebar" style={menu ? { marginLeft: "-280px" } : null}>
        <SideBar />
      </div>
      <header style={menu ? { marginLeft: "0px" } : { marginLeft: "280px" }}>
        <div className="menu__toggle header__icons">
          <label htmlFor="nav__toggle" onClick={toggleMenu}>
            <span
              className={menu ? "las la-bars" : "fas fa-times-circle"}
            ></span>
          </label>
          <label htmlFor="">
            <span className="las la-search"></span>
          </label>
          <Link to="/" className="header__link" onClick={viewSite}>
            <label htmlFor="" className="view__site">
              <span className="las la-store-alt">
                <small style={{ fontSize: "10px" }}>View&nbsp;Site</small>
              </span>
            </label>
          </Link>
        </div>
        <div
          className="admin__info"
          style={menu ? { display: "block" } : { display: "none" }}
        >
          <label htmlFor="">
            <small style={{ color: "gray", marginRight: "10px" }}>
              {user.email}
            </small>
            <span>
              <img
                src="https://res.cloudinary.com/dt1q2a20t/image/upload/v1620401647/fkriioooip6rqj59qjvn.jpg"
                width="40px"
                height="40px"
                alt="admin__image"
              />
            </span>
          </label>
        </div>
      </header>
      <div
        className="main__content"
        style={
          menu
            ? { marginLeft: "0px", backgroundColor: "#fff" }
            : { marginLeft: "280px", backgroundColor: "#fff" }
        }
      >
        <main>
          <div className="page__header ">
            <div>
              <h1>Analytics Dashboard</h1>
              <small>
                Monitor your dashboard, processing customer orders and many
                more...
              </small>
            </div>

            <div
              className="header__actions"
              style={
                menu
                  ? null
                  : { display: "none", transition: "all 0.5s ease-in-out" }
              }
            >
              <button>
                <span className="las la-tools">Settings</span>
              </button>
            </div>
          </div>

          <div className="recent__grid">
            <div className="orders">
              <div className="category">
                <div className="card__header">
                  <div className="offset-md-4">
                    <h3>Update Product</h3>
                  </div>
                </div>

                <div className="row mt-5">
                  <div className="col-md-8 offset-md-2">
                    {newPostForm()}
                    {redirectUser()}
                    {goBack()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UpdateProduct;
