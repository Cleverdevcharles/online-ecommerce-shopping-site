import React from "react";
import "./categoryForm.css";

function categoryForm({ handleSubmit, name, setName, loading, button }) {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <br />
          <input
            type="text"
            className="formInput"
            placeholder="Enter a unique category name..."
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        {loading ? (
          <button className="btn__category">
            <div class="loader"></div>
          </button>
        ) : (
          <button className="btn__category">{button}</button>
        )}
      </form>
    </div>
  );
}

export default categoryForm;
