import React from "react";
import { BACKEND_API } from "../../config";

const ShowImage = ({ item, url, product }) => (
  <>
    <img
      className="product-img"
      src={`${BACKEND_API}/${url}/photo/${item._id}`}
      width="40px"
      height="40px"
      alt={item.name}
    />
  </>
);

export default ShowImage;
