import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getSites } from "../../../functions/site";
import "./Hero.css";

function Hero() {
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
  const history = useHistory();
  const toShop = () => {
    history.push("/shop");
    window.location.reload();
  };

  return (
    <header className="hero">
      <div className="banner">
        {sites.map((s, i) => (
          <h1 className="banner-title" key={i}>
            {s.name}
          </h1>
        ))}

        <button className="banner-btn" onClick={toShop}>
          Shop now
        </button>
      </div>
    </header>
  );
}

export default Hero;
