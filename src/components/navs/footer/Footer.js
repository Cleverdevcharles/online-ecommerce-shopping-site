import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSites } from "../../../functions/site";
import "./Footer.css";

const Footer = () => {
  const [sites, setSites] = useState([]);

  const loadSites = () => {
    getSites().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setSites(data);
      }
    });
  };

  useEffect(() => {
    loadSites();
  }, []);
  return (
    <div>
      {sites.map((s, i) => (
        <footer class="site-footer" key={i}>
          <div class="container">
            <div class="row">
              <div class="col-sm-12 col-md-6">
                <h6>About</h6>
                <p class="text-justify">{s.about.substring(0, 300)}...</p>
              </div>

              <div class="col-xs-6 col-md-3">
                <h6></h6>
                <ul class="footer-links">
                  <li>
                    <a></a>
                  </li>
                  <li>
                    <a></a>
                  </li>
                  <li>
                    <a></a>
                  </li>
                  <li>
                    <a></a>
                  </li>
                  <li>
                    <a></a>
                  </li>
                  <li>
                    <a></a>
                  </li>
                </ul>
              </div>

              <div class="col-xs-6 col-md-3">
                <h6>Quick Links</h6>
                <ul class="footer-links">
                  <li>
                    <Link to="/about" className="all_links">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="all_links">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <a href={`tel:${s.phone}`} className="all_links">
                      Phone : {s.phone}
                    </a>
                  </li>
                  <li>
                    <a a href={`mailto:${s.email}`} className="all_links">
                      Email : {s.email}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <hr />
          </div>
          <div class="container">
            <div class="row">
              <div class="col-md-8 col-sm-6 col-xs-12">
                <p class="copyright-text">
                  Copyright &copy; 2021 All Rights Reserved by
                  <Link to="/"> {s.name}</Link>.
                </p>
              </div>

              <div class="col-md-4 col-sm-6 col-xs-12">
                <ul class="social-icons">
                  <li>
                    <Link to={s.facebook_url} class="facebook" href="#">
                      <i class="fab fa-facebook-f"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to={s.twitter_url} class="twitter" href="#">
                      <i class="fab fa-twitter"></i>{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to={s.instagram_url} class="instagram" href="#">
                      <i class="fab fa-instagram"></i>{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to={s.whatsapp_url} class="whatsapp" href="#">
                      <i class="fab fa-whatsapp"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      ))}
    </div>
  );
};

export default Footer;
