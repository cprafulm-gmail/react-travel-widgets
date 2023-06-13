import React from "react";

const Loader = () => {
  return (
    <div className="d-flex justify-content-center m-5">
      <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}>
        <span className="spinnerLanding-only">Loading...</span>
      </div>
      {/* <div className="spinner-border" role="status">
        <span className="sr-only">{Trans("_loadingText")}</span>
      </div> */}
    </div>
  );
};

export default Loader;
