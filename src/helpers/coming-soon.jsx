import React from "react";

// Coming Soon Popup
const ComingSoon = (props) => {
  return (
    <div className="model-popup ">
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            <div className="modal-body text-center">
              <button type="button" className="close" onClick={() => props.handleComingSoon()}>
                <span aria-hidden="true">&times;</span>
              </button>
              <h5 className="modal-title">Coming Soon</h5>
              <button
                type="button"
                className="mt-3 btn btn-primary btn-sm"
                onClick={() => props.handleComingSoon()}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default ComingSoon;
