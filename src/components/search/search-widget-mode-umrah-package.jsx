import React, { Component } from "react";
import SearchWidgetModeUmrahPackageWidget from "./search-widget-mode-umrah-package-widget";
import SearchWidgetModeUmrahPackageTabs from "./search-widget-mode-umrah-package-tabs";

class SearchWidgetModeUmrahPackage extends Component {
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
        <SearchWidgetModeUmrahPackageTabs {...this.props} />
        {isSearch && isShowSearch && <SearchWidgetModeUmrahPackageWidget {...this.props} />}
      </React.Fragment>
    );
  }
}

export default SearchWidgetModeUmrahPackage;
