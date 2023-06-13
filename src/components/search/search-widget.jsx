import React from "react";
import SearchWidgetModeHome from "./search-widget-mode-home";
import SearchWidgetModeModifyWidget from "./search-widget-mode-modify-widget";
import SearchCommon from "./search-common";
import moment from "moment";
import * as Global from "../../helpers/global";

class SearchWidget extends SearchCommon {
  constructor(props) {
    super(props);
    var newState = this.initialize_State();
    newState.isPaperRateMode = this.props.match.path.toLowerCase().startsWith('/paperratesresults');
    newState.businessName = newState.isPaperRateMode ? this.props.match.params.businessName.toLowerCase() : newState.businessName;
    if (newState.isPaperRateMode && newState.businessName === "air" && this.props.match.params.checkInDate === undefined) {
      newState.pax = [
        {
          type: "ADT",
          count: 1
        },
        {
          type: "CHD",
          count: 0
        },
        {
          type: "INF",
          count: 0
        }
      ];
      newState.dates = { checkInDate: moment().format(Global.DateFormate), checkOutDate: moment().format(Global.DateFormate) };
    }

    this.state = newState;

    if (localStorage.getItem("isUmrahPortal") && props.type !== "umrah-package")
      localStorage.removeItem("umrahPackageDetails");
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.mode === "modify" &&
      (this.props.match.params.checkInDate !== prevProps.match.params.checkInDate ||
        this.props.match.params.checkOutDate !== prevProps.match.params.checkOutDate ||
        this.props.match.params.roomDetails !== prevProps.match.params.roomDetails)
    ) {
      let stateData = this.initialize_State();
      stateData.isPaperRateMode = this.props.match.path.toLowerCase().startsWith('/paperratesresults');
      stateData.businessName = stateData.isPaperRateMode ? this.props.match.params.businessName.toLowerCase() : stateData.businessName;
      if (stateData.isPaperRateMode && stateData.businessName === "air" && this.props.match.params.checkInDate === undefined) {
        stateData.pax = [
          {
            type: "ADT",
            count: 1
          },
          {
            type: "CHD",
            count: 0
          },
          {
            type: "INF",
            count: 0
          }
        ];

        stateData.dates = { checkInDate: moment().format(Global.DateFormate), checkOutDate: moment().format(Global.DateFormate) };
      }
      this.setState(stateData);
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.mode === "home" && (
          <SearchWidgetModeHome
            key={this.state.searchKey} //do not delete : on change tab reset all elements
            history={this.props.history}
            match={this.props.match}
            businessName={this.state.businessName}
            changeTab={this.changeTab}
            getRedirectToListPage={this.getRedirectToListPage}
            handlePax={this.setPax}
            handleAdditionalServicesPax={this.setAdditionalServices}
            handleDateChange={this.setDate}
            handleFromLocation={this.setFromLocation}
            handleToLocation={this.setToLocation}
            ShowHidePaxInfoPopup={this.ShowHidePaxInfoPopup}
            validateSearch={this.validateSearch}
            changeairTripType={this.changeairTripType}
            changeairType={this.changeairType}
            handleNationality={this.handleNationality}
            handleGroundServiceNationality={this.handleGroundServiceNationality}
            handleACPercentage={this.handleACPercentage}
            handleTransportationRoute={this.handleTransportationRoute}
            handleTransportationPax={this.handleTransportationPax}
            handleTransportationCompany={this.handleTransportationCompany}
            handleGroundServiceCategory={this.handleGroundServiceCategory}
            handleGroundservicePax={this.handleGroundservicePax}
            handleCountryofResidence={this.handleCountryofResidence}
            handleAdvanceSearch={this.handleAdvanceSearch}
            handleAirCabinClass={this.handleAirCabinClass}
            handleAirAirline={this.handleAirAirline}
            handleAirRefundable={this.handleAirRefundable}
            handleAirDirectFlight={this.handleAirDirectFlight}
            handleIsIndividualRoute={this.handleIsIndividualRoute}
            handleGroundServiceCompany={this.handleGroundServiceCompany}
            handleSwapLocation={this.handleSwapLocation}
            handleSpecialCode={this.handleSpecialCode}
            handleSubPCCCode={this.handleSubPCCCode}
            handlePickupType={this.setPickupType}
            handleDropoffType={this.setDropoffType}
            handleTransferStartHour={this.setTransferStartHour}
            handleTransferReturnStartHour={this.setTransferReturnStartHour}
            handleDriverAge={this.handleDriverAge}
            handlegetpromotions={this.handlegetpromotions}
            handleVehiclePromotionProvider={this.handleVehiclePromotionProvider}
            handlevehiclePromotionCode={this.handlevehiclePromotionCode}
            handlePaperRates_ViewAll={this.handlePaperRates_ViewAll}
            handleMultidestinationData={this.handleMultidestinationData}
            addRemoveMultidestinationData={this.addRemoveMultidestinationData}
            ShowHideMulityCityInfoPopup={this.ShowHideMulityCityInfoPopup}
            {...this.state}
          />
        )}
        {this.props.mode === "modify" && (
          <div className="title-bg mod-search">
            <div className="container">
              <SearchWidgetModeModifyWidget
                //do not delete : on change tab reset all elements
                key={this.getSearchWidgetKey()}
                history={this.props.history}
                match={this.props.match}
                businessName={this.state.businessName}
                getRedirectToListPage={this.getRedirectToListPage}
                handlePax={this.setPax}
                handleDateChange={this.setDate}
                handleFromLocation={this.setFromLocation}
                handleToLocation={this.setToLocation}
                ShowHidePaxInfoPopup={this.ShowHidePaxInfoPopup}
                validateSearch={this.validateSearch}
                handleGroundServiceNationality={this.handleGroundServiceNationality}
                handleAdditionalServicesPax={this.setAdditionalServices}
                GetStateForListPage={this.GetStateForListPage}
                changeairTripType={this.changeairTripType}
                changeairType={this.changeairType}
                handleTransportationRoute={this.handleTransportationRoute}
                handleTransportationPax={this.handleTransportationPax}
                handleTransportationCompany={this.handleTransportationCompany}
                handleGroundServiceCategory={this.handleGroundServiceCategory}
                handleGroundServiceCompany={this.handleGroundServiceCompany}
                handleCountryofResidence={this.handleCountryofResidence}
                handleGroundservicePax={this.handleGroundservicePax}
                handleSwapLocation={this.handleSwapLocation}
                handlePickupType={this.setPickupType}
                handleDropoffType={this.setDropoffType}
                handleTransferStartHour={this.setTransferStartHour}
                handleTransferReturnStartHour={this.setTransferReturnStartHour}
                handleDriverAge={this.handleDriverAge}
                handlePaperRates_ViewAll={this.handlePaperRates_ViewAll}
                handleMultidestinationData={this.handleMultidestinationData}
                addRemoveMultidestinationData={this.addRemoveMultidestinationData}
                ShowHideMulityCityInfoPopup={this.ShowHideMulityCityInfoPopup}
                {...this.state}
              />
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default SearchWidget;
