import React from "react";
import SearchWidgetModeQuotation from "./search-widget-mode-quotation";
import SearchCommon from "./search-common";
import AuthorizeComponent, { AuthorizeComponentCheck } from "../common/authorize-component";

class SearchWidgetQuotation extends SearchCommon {
  constructor(props) {
    super(props);
    this.state = this.initialize_State();
  }

  handleSearchRequest = (searchParam) => {
    this.props.handleSearchRequest(searchParam);
    this.setState({ isSearch: false });
  };

  changeQuotationTab = (businessName) => {
    this.props.changeQuotationTab(businessName);
    if (AuthorizeComponentCheck(this.props.userInfo.rolePermissions, (this.props.type === "Quotation" ? "dashboard-menu~quotation-create-quotation" : "dashboard-menu~itineraries-create-itineraries"))) {
      this.setState({ isSearch: true });
      this.changeTab(businessName);
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.props.mode === "home" && (
          <SearchWidgetModeQuotation
            key={this.state.businessName} //do not delete : on change tab reset all elements
            history={this.props.history}
            match={this.props.match}
            businessName={this.state.businessName}
            changeTab={this.changeQuotationTab}
            getRedirectToListPage={this.getRedirectToListPage}
            handlePax={this.setPax}
            handleStartDate={this.handleStartDate}
            handleEndDate={this.handleEndDate}
            handleDateChange={this.setDate}
            handleFromLocation={this.setFromLocation}
            handleToLocation={this.setToLocation}
            ShowHidePaxInfoPopup={this.ShowHidePaxInfoPopup}
            validateSearch={this.validateSearch}
            changeairTripType={this.changeairTripType}
            changeairType={this.changeairType}
            handleNationality={this.handleNationality}
            handleACPercentage={this.handleACPercentage}
            handleTransportationRoute={this.handleTransportationRoute}
            handleTransportationPax={this.handleTransportationPax}
            handleAdvanceSearch={this.handleAdvanceSearch}
            handleAirCabinClass={this.handleAirCabinClass}
            handleAirAirline={this.handleAirAirline}
            handleAirRefundable={this.handleAirRefundable}
            handleAirDirectFlight={this.handleAirDirectFlight}
            handleTransportationCompany={this.handleTransportationCompany}
            handleSwapLocation={this.handleSwapLocation}
            handleSpecialCode={this.handleSpecialCode}
            handleSubPCCCode={this.handleSubPCCCode}
            handlePickupType={this.setPickupType}
            handleDropoffType={this.setDropoffType}
            handleTransferStartHour={this.setTransferStartHour}
            handleTransferReturnStartHour={this.setTransferReturnStartHour}
            handleSearchRequest={this.handleSearchRequest}
            handleOffline={this.props.handleOffline}
            type={this.props.type}
            quotationInfo={this.props.quotationInfo}
            isShowSearch={this.props.isShowSearch}
            {...this.state}
            userInfo={this.props.userInfo}
          />
        )}
      </React.Fragment>
    );
  }
}

export default SearchWidgetQuotation;
