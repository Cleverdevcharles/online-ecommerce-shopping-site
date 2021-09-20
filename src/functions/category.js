import { BACKEND_API } from "../config";

export const getCategories = () => {
  return fetch(`${BACKEND_API}/categories`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// export const getCategory = async (categoryId) =>
//   await axios.get(`${BACKEND_API}/category/${categoryId}`);

export const deleteCategory = (categoryId, userId, token) => {
  return fetch(`${BACKEND_API}/category/${categoryId}/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateCategory = (categoryId, userId, token, category) => {
  return fetch(`${BACKEND_API}/category/update/${categoryId}/${userId}`, {
    method: "PUT",
    headers: {
      // content type?
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const createCategory = (userId, token, category) => {
  return fetch(`${BACKEND_API}/category/create/${userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
      console.log(`Bearer ${token}`);
    });
};

export const getCategory = (categoryId) => {
  console.log(`${BACKEND_API}/category/${categoryId}`);
  return fetch(`${BACKEND_API}/category/${categoryId}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};