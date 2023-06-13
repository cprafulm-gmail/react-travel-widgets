import React, { Component } from "react";
import SearchWidgetModeQuotationWidget from "./search-widget-mode-quotation-widget";
import SearchWidgetModeQuotationTabs from "./search-widget-mode-quotation-tabs";

class SearchWidgetModeQuotation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { isSearch, isShowSearch } = this.props;
    return (
      <React.Fragment>
        <SearchWidgetModeQuotationTabs {...this.props} userInfo={this.props.userInfo} />
        {isSearch && isShowSearch && <SearchWidgetModeQuotationWidget {...this.props} userInfo={this.props.userInfo} />}
      </React.Fragment>
    );
  }
}

export default SearchWidgetModeQuotation;
