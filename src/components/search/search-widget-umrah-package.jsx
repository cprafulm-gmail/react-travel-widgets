import React from "react";
import SearchWidgetModeUmrahPackage from "./search-widget-mode-umrah-package";
import SearchCommon from "./search-common";

class SearchWidgetUmrahPackage extends SearchCommon {
  constructor(props) {
    super(props);
    let state = this.initialize_State(this.props.isUmrahPackage);
    state.businessName = "";
    this.state = state;
  }

  handleSearchRequest = (searchParam) => {
    this.props.handleSearchRequest(searchParam);
    this.setState({ isSearch: false });
  };

  changeQuotationTab = (businessName, mode) => {
    this.setState({ isSearch: true });
    this.props.changeQuotationTab(businessName);
    let quotationInfo = this.props.quotationInfo;
    quotationInfo.mode = mode;
    this.changeTab(businessName, this.props.quotationInfo);
  };

  render() {
    return (
      <React.Fragment>
        {this.props.mode === "home" && (
          <SearchWidgetModeUmrahPackage
            key={this.state.businessName} //do not delete : on change tab reset all elements
            history={this.props.history}
            match={this.props.match}
            businessName={this.state.businessName}
            changeTab={this.changeQuotationTab}
            getRedirectToListPage={this.getRedirectToListPage}
            handlePax={this.setPax}
            handleDateChange={this.setDate}
            handleFromLocation={this.setFromLocation}
            handleToLocation={this.setToLocation}
            ShowHidePaxInfoPopup={this.ShowHidePaxInfoPopup}
            validateSearch={this.validateSearch}
            changeairTripType={this.changeairTripType}
            handleNationality={this.handleNationality}
            handleACPercentage={this.handleACPercentage}
            handleTransportationRoute={this.handleTransportationRoute}
            handleTransportationPax={this.handleTransportationPax}
            handleGroundservicePax={this.handleGroundservicePax}
            handleGroundServiceCategory={this.handleGroundServiceCategory}
            handleGroundServiceCompany={this.handleGroundServiceCompany}
            //handleLocation={this.handleLocation}
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
            isUmrahPackage={this.props.isUmrahPackage}
            handleAdditionalServicesPax={this.setAdditionalServices}
            {...this.state}
          />
        )}
      </React.Fragment>
    );
  }
}

export default SearchWidgetUmrahPackage;
