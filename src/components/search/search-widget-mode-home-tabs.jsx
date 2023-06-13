import React from "react";
import { Trans } from "../../helpers/translate";
import * as Global from "../../helpers/global";
import SVGIcon from "../../helpers/svg-icon";

const SearchWidgetModeHomeTabs = (props) => {
  const { businessName, isPaperRateMode } = props;
  return (
    <ul className="list-unstyled search-tabs mt-4 border-left border-bottom">
      {Global.getEnvironmetKeyValue("availableBusinesses").filter(x =>
        x.name !== "custom" && (Global.getEnvironmetKeyValue("removeFlightFromSearchWidget", "cobrand") === "true" ? x.name !== "air" : x.name !== "custom")
      ).map((item, index) => {
        if (localStorage.getItem("isUmrahPortal") && item.name === "activity") {
          return null; // Skip rendering this item
        } else {
          return (
            <React.Fragment key={index}>
              <li className={businessName === item.name && !isPaperRateMode ? "active" : null}>
                <button
                  className="btn btn-light text-left border-top rounded-0 w-100 pt-2 pb-2"
                  onClick={() => props.changeTab(item.name, null, false)}
                >
                  <SVGIcon name={item.name} className="mr-2" width="16" type="fill" />
                  {Trans("_widgetTab" + item.name + "")}
                </button>
              </li>
            </React.Fragment>
          );
        }
      })}
    </ul>
  );
};

export default SearchWidgetModeHomeTabs;
