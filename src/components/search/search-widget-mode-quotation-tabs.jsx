import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import * as Global from "../../helpers/global";
import SVGIcon from "../../helpers/svg-icon";

class SearchWidgetModeQuotationTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type } = this.props;
    return (
      <div className="quotation-btn text-center">
        <h5 className="mb-4">
          <span className="d-inline-block bg-light border p-2">
            <SVGIcon name={"plus"} className="mr-2" width="10" type="fill"></SVGIcon>
            {(type === "Quotation" || type === "Quotation_Master") && Trans("_addItemsToQuotation").replace("##Quotation##", Trans("_quotationReplaceKey"))}
            {(type === "Itinerary" || type === "Itinerary_Master") && Trans("_addItemsToItinerary")}
          </span>
        </h5>

        {Global.getEnvironmetKeyValue("availableBusinesses").map((item, index) => {
          return (
            <React.Fragment key={index}>
              {(item.name === "hotel" ||
                item.name === "air" ||
                item.name === "activity" ||
                item.name === "transfers") && (
                  <button className="btn" onClick={() => this.props.changeTab(item.name)}>
                    <SVGIcon name={item.name + "new"} width="28" type="fill"></SVGIcon>{" "}
                    <small>{Trans("_widgetTab" + item.name + "")}</small>
                  </button>
                )}
            </React.Fragment>
          );
        })}

        <button className="btn" onClick={() => this.props.changeTab("custom")}>
          <SVGIcon name={"customnew"} width="28" type="fill"></SVGIcon>{" "}
          <small>{Trans("_widgetTabcustom")}</small>
        </button>
      </div>
    );
  }
}

export default SearchWidgetModeQuotationTabs;
