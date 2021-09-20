import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import { getSites } from "../../../functions/site";

import "./About_Us.css";

const About_Us = () => {
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
    <div className="about__us">
      <Header />
      <div class="about">
        <div className="banner">
          <h1 className="banner-title mt-4">ABOUT US</h1>
        </div>
        <div class="inner-section">
          <h1>About Us</h1>
          {sites.map((s, i) => (
            <p class="text" key={i}>
              {s.about}
            </p>
          ))}
          <Link to="/contact" class="skills">
            <button>Contact Us</button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About_Us;
