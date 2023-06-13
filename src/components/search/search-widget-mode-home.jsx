import React from "react";
import SearchWidgetModeHomeWidget from "./search-widget-mode-home-widget";
import SearchWidgetModeHomeTabs from "./search-widget-mode-home-tabs";

const SearchWidgetModeHome = (props) => {
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className=""></div>
        <div className="col-lg-8">
          <div className="row mt-4">
            <div className="col-lg-3 pr-lg-0">
              <SearchWidgetModeHomeTabs {...props} />
            </div>
            <div className="col-lg-9 pl-lg-0">
              <SearchWidgetModeHomeWidget {...props} />
            </div>
            <div className="col-lg-3 pl-lg-0">&nbsp;</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchWidgetModeHome;
