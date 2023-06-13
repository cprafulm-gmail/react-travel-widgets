import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import AutoComplete from "./auto-complete";
import DateRangePicker from "./../common/date-range";
import HotelPaxWidget from "./hotel-pax-widget";
import GroundServiceAdditionalServiceWidget from "./groundservice-additionalsearvice-widget";
import HotelPaxWidgetUmrah from "./hotel-pax-widget-umrah";
import ActivityPaxWidget from "./activity-pax-widget";
import TransfersPaxWidget from "./transfers-pax-widget";
import AirPaxWidget from "./air-pax-widget";
import * as Global from "../../helpers/global";
import * as DropdownList from "../../helpers/dropdown-list";
import SVGIcon from "../../helpers/svg-icon";
import Loader from "./../common/loader";
import AirLocationMultiDestination from "./air-location-multidestination";

class SearchWidgetModeHomeWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let isShowIndividualRoutes = Global.getEnvironmetKeyValue("INDIVIDUALROUTES", "cobrand") ? true : false;
    isShowIndividualRoutes = isShowIndividualRoutes && !Global.getEnvironmetKeyValue("INDIVIDUALROUTESCOUNTRYID", "cobrand");
    const availableBusinesses = Global.getEnvironmetKeyValue("availableBusinesses");
    const isCRSRoomSelectionFlowEnable = Global.getEnvironmetKeyValue("IsCRSRoomSelectionFlowEnable", "cobrand") ? true : false;
    const businessName = this.props.businessName;
    let isAllowAirMultiDestination = businessName === "air"
      ? Global.getEnvironmetKeyValue("IsAllowMultiDestinationForFlightBusiness", "cobrand")
      : false;
    let isAllowTransfersRoundTrip =
      businessName === "transfers"
        ? Global.getEnvironmetKeyValue("ISTRANSFERROUNDTRIPALLOWED", "cobrand")
        : false;
    return (
      <div className="search-widget border bg-white p-4 shadow-sm">
        {this.props.isPaperRateMode
          ? <h2 className="mb-4 font-weight-bold">Flight Paper Rates</h2>
          : <h2 className="mb-4 font-weight-bold">{Trans("_widget" + businessName + "Title")}</h2>
        }

        {(businessName === "air" ||
          (businessName === "transfers" && isAllowTransfersRoundTrip)) && (
            <div className="row">
              <div className={"form-group" + (isAllowAirMultiDestination && businessName === "air" ? " col-lg-12" : " col-lg-6")}>
                <div className="BE-Search-Radio">
                  <ul>
                    <li className="checked">
                      <input
                        checked={this.props.tripDirection === "RoundTrip"}
                        value="RoundTrip"
                        name="Direction"
                        type="radio"
                        onChange={() => this.props.changeairTripType("RoundTrip")}
                      />
                      <label>{Trans("_airTripDirection_Roundtrip")}</label>
                    </li>
                    <li>
                      <input
                        value="OneWay"
                        name="Direction"
                        type="radio"
                        checked={this.props.tripDirection === "OneWay"}
                        onChange={() => this.props.changeairTripType("OneWay")}
                      />
                      <label>{Trans("_airTripDirection_Oneway")}</label>
                    </li>
                    {isAllowAirMultiDestination && businessName === "air" &&
                      <li>
                        <input
                          value="MultiCity"
                          name="multicity"
                          type="radio"
                          checked={this.props.tripDirection === "MultiCity"}
                          onChange={() => this.props.changeairTripType("MultiCity")}
                        />
                        <label>{Trans("_airTripDirection_multidestination")}</label>
                      </li>
                    }
                  </ul>
                </div>
              </div>
              <div className="form-group col-lg-6" style={{ display: isShowIndividualRoutes ? "block" : "none" }}>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="isIndividualRoute"
                    name="isIndividualRoute"
                    checked={this.props.isIndividualRoute}
                    onChange={this.props.handleIsIndividualRoute}
                  />
                  <label className="custom-control-label text-secondary" htmlFor="isIndividualRoute">
                    {"Domestic"}
                  </label>
                </div>
              </div>
            </div>
          )}

        {(businessName === "transfers" || businessName === "vehicle") && (
          <div className="row position-relative">
            <div className={"form-group col-lg-" + (businessName === "transfers" ? "8" : "12")}>
              <label htmlFor="fromlocation">
                {businessName === "transfers" ? Trans("_widget" + businessName + "PickupLocationTitle")
                  : Trans("_widget" + businessName + "FromLocationTitle")}
              </label>
              <AutoComplete
                isValid={this.props.fromLocationIsValid}
                businessName={businessName}
                handleLocation={this.props.handleFromLocation}
                mode="From"
                selectedOptions={
                  this.props.fromLocation && this.props.fromLocation.id
                    ? [this.props.fromLocation]
                    : []
                }
              />
            </div>
            {businessName === "transfers" &&
              <div className="form-group col-lg-4">
                <label htmlFor="PickupType">{Trans("_widget" + businessName + "TypeTitle")}</label>
                <select
                  className={"form-control"}
                  onChange={(e) => this.props.handlePickupType(e.target.value)}
                >
                  <option value="Airport">{Trans("_widget" + businessName + "Airport")}</option>
                  <option value="Accommodation">
                    {Trans("_widget" + businessName + "Accommodation")}
                  </option>
                </select>
              </div>
            }
          </div>
        )}
        {(businessName === "transfers" || businessName === "vehicle") && (
          <div className="row">
            <div className={"form-group col-lg-" + (businessName === "transfers" ? "8" : "12")}>
              <label htmlFor="tolocation">
                {businessName === "transfers" ? Trans("_widget" + businessName + "DropoffLocationTitle")
                  : Trans("_widget" + businessName + "ToLocationTitle")}
              </label>
              <AutoComplete
                isValid={this.props.toLocationIsValid}
                businessName={businessName}
                handleLocation={this.props.handleToLocation}
                mode="To"
                selectedOptions={
                  this.props.toLocation && this.props.toLocation.id ? [this.props.toLocation] : []
                }
                key={
                  (businessName === "transfers" || businessName === "vehicle") && this.props.toLocation && this.props.toLocation.id
                    ? this.props.toLocation.id
                    : ""
                }
              />
            </div>
            {businessName === "transfers" &&
              <div className="form-group col-lg-4">
                <label htmlFor="ReturnType">{Trans("_widget" + businessName + "TypeTitle")}</label>
                <select
                  className={"form-control"}
                  onChange={(e) => this.props.handleDropoffType(e.target.value)}
                >
                  <option value="Airport">{Trans("_widget" + businessName + "Airport")}</option>
                  <option value="Accommodation">
                    {Trans("_widget" + businessName + "Accommodation")}
                  </option>
                </select>
              </div>
            }
          </div>
        )}

        {businessName !== "groundservice" && businessName !== "transportation" && businessName !== "transfers" && businessName !== "vehicle" && this.props.tripDirection !== "MultiCity" && (
          <div className="row position-relative">
            <div className="form-group col-lg-12">
              <label htmlFor="fromlocation">
                {Trans("_widget" + businessName + "FromLocationTitle")}
              </label>
              {businessName === "hotel" && localStorage.getItem("isUmrahPortal") ? (
                <select
                  className={
                    "form-control" +
                    (this.props.fromLocationIsValid === "invalid" ? " border-danger" : "")
                  }
                  onChange={(e) => this.props.handleFromLocation(e.target.value)}
                >
                  {/* <option value="">{Trans("_ddlSelect")}</option> */}
                  <option value="SA26_Makkah, Saudi Arabia - Location">
                    {Trans("_umrahLocationSA26")}
                  </option>
                  <option value="SA25_Madinah, Saudi Arabia - Location">
                    {Trans("_umrahLocationSA25")}
                  </option>
                </select>
              ) : (
                <AutoComplete
                  isValid={this.props.fromLocationIsValid}
                  businessName={businessName}
                  handleLocation={this.props.handleFromLocation}
                  mode="From"
                  selectedOptions={
                    this.props.fromLocation && this.props.fromLocation.id
                      ? [this.props.fromLocation]
                      : []
                  }
                />
              )}
            </div>
            {businessName === "air" && (
              <button
                className="btn-remove-room page-link border-0 text-secondary m-0 mt-2 p-0 swap-icon"
                onClick={this.props.handleSwapLocation}
              >
                <SVGIcon name="swap" width="16" height="16" type="lineal" />
              </button>
            )}
          </div>
        )}

        {businessName === "transportation" && (
          <div className="row">
            <div className="form-group col-lg-12">
              <label htmlFor="route">{Trans("_widget" + businessName + "Route")}</label>
              <select
                defaultValue={this.props.transportation_Route}
                className={
                  "form-control" +
                  (this.props.transportation_RouteIsValid === "invalid" ? " border-danger" : "")
                }
                onChange={(e) => this.props.handleTransportationRoute(e.target.value)}
              >
                <option value="">--Select--</option>
                {this.props.transportation_Data_Route.map((route) => {
                  return (
                    <option key={route.id} value={route.id}>
                      {route.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        )}

        {businessName === "air" && this.props.tripDirection !== "MultiCity" && (
          <div className="row">
            <div className="form-group col-lg-12">
              <label htmlFor="tolocation">
                {Trans("_widget" + businessName + "ToLocationTitle")}
              </label>
              <AutoComplete
                isValid={this.props.toLocationIsValid}
                businessName={businessName}
                handleLocation={this.props.handleToLocation}
                mode="To"
                selectedOptions={
                  this.props.toLocation && this.props.toLocation.id ? [this.props.toLocation] : []
                }
              />
            </div>
          </div>
        )}
        {this.props.tripDirection === "MultiCity" &&
          <AirLocationMultiDestination
            airMultiDestincationData={this.props.airMultiDestincationData}
            handleMultidestinationData={this.props.handleMultidestinationData}
            addRemoveMultidestinationData={this.props.addRemoveMultidestinationData}
          />
        }
        <div className="row">
          {this.props.tripDirection !== "MultiCity" &&
            <div className={"col-lg-" + ((businessName === "transportation" || businessName === "groundservice") ? "6" : "12")}>
              <DateRangePicker
                isValid={this.props.datesIsValid}
                cutOfDays={this.props.isPaperRateMode ? 3 : availableBusinesses.find((x) => x.name === businessName).cutOffDays}
                stayInDays={this.props.isPaperRateMode ? 0 : availableBusinesses.find((x) => x.name === businessName).stayInDays}
                minDays={localStorage.getItem("isUmrahPortal") ? 5 : 1}
                maxDays={localStorage.getItem("isUmrahPortal") ? 30 : 5}
                dates={this.props.dates === "" ? undefined : this.props.dates}
                isSingleDateRangePicker={
                  businessName === "air" || businessName === "transfers"
                    ? this.props.tripDirection === "OneWay"
                    : (businessName === "transportation" || businessName === "groundservice")
                      ? true
                      : false
                }
                handleDateChange={this.props.handleDateChange}
                business={businessName}
                isPaperRateMode={this.props.isPaperRateMode}
              />
            </div>
          }

          {businessName === "groundservice" && (
            <React.Fragment>
              <div className="form-group col-lg-6">
                <label htmlFor="category">
                  {Trans("_widget" + businessName + "Category")}
                </label>
                <select
                  className={"form-control"}
                  onChange={(e) => this.props.handleGroundServiceCategory(e.target.value)}
                >
                  <option value="">--All--</option>
                  {this.props.groundservice_Data_Category.map((category) => {
                    return (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </React.Fragment>
          )}
          {businessName === "groundservice" && (
            <React.Fragment>
              <div className="form-group col-lg-6">
                <label htmlFor="noofpersion">
                  {Trans("_widget" + businessName + "NoOfPerson")}
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  name={"noofperson"}
                  className={
                    "form-control" +
                    (this.props.groundservice_NoOfPersonIsValid === "invalid"
                      ? " border-danger"
                      : "")
                  }
                  onChange={(e) => this.props.handleGroundservicePax(e)}
                  value={this.props.groundservice_NoOfPerson}
                />
              </div>
              <div className="form-group col-lg-6">
                <label htmlFor="groundserviceUOCompany">
                  {Trans("_widget" + businessName + "Company")}
                </label>
                <AutoComplete
                  isValid="valid"
                  name={"groundserviceUOCompany"}
                  businessName={businessName}
                  handleLocation={this.props.handleGroundServiceCompany}
                  mode="company"
                />
              </div>
            </React.Fragment>
          )}
          {businessName === "transportation" && (
            <React.Fragment>
              <div className="form-group col-lg-3 pl-lg-0">
                <label htmlFor="noofvehicle">
                  {Trans("_widget" + businessName + "NoOfVehicle")}
                </label>
                <input
                  name={"noofvehicle"}
                  type="number"
                  className={
                    "form-control" +
                    (this.props.transportation_NoOfVehicleIsValid === "invalid"
                      ? " border-danger"
                      : "")
                  }
                  min="1"
                  max="10"
                  placeholder={Trans("_widgettransportationMaxVehicle")}
                  onChange={(e) => this.props.handleTransportationPax(e)}
                  value={this.props.transportation_NoOfVehicle}
                />
              </div>
              <div className="form-group col-lg-3 pl-lg-0">
                <label htmlFor="noofpersion">
                  {Trans("_widget" + businessName + "NoOfPerson")}
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  placeholder={Trans("_widgettransportationMaxPerson")}
                  name={"noofperson"}
                  className={
                    "form-control" +
                    (this.props.transportation_NoOfPersonIsValid === "invalid"
                      ? " border-danger"
                      : "")
                  }
                  onChange={(e) => this.props.handleTransportationPax(e)}
                  value={this.props.transportation_NoOfPerson}
                />
              </div>
            </React.Fragment>
          )}
        </div>

        {(businessName === "transfers" || businessName === "vehicle") && (
          <div className="row">
            <div className="form-group col-lg-6">
              <label htmlFor="ReturnType">
                {Trans("_widget" + businessName + "StartTimeTitle")}
              </label>
              <select
                className={
                  "form-control" +
                  (this.props.transfer_HourIsValid === "invalid" ? " border-danger" : "")
                }
                onChange={(e) => this.props.handleTransferStartHour(e.target.value)}
                defaultValue={businessName === "vehicle" ? this.props.transfer_Hour : ""}
              >
                <option value="-Select Hour-">{Trans("_ddlSelect")}</option>
                {TransfersStartHour.map((item, key) => {
                  return (
                    <option value={item.data} key={key}>
                      {item.display}
                    </option>
                  );
                })}
              </select>
            </div>
            {((businessName === "transfers" &&
              isAllowTransfersRoundTrip &&
              this.props.tripDirection === "RoundTrip") || (businessName === "vehicle")) && (
                <div className="form-group col-lg-6">
                  <label htmlFor="ReturnType">
                    {Trans("_widget" + businessName + "ReturnStartTimeTitle")}
                  </label>
                  <select
                    className={
                      "form-control" +
                      (this.props.transfer_ReturnHourIsValid === "invalid" ? " border-danger" : "")
                    }
                    onChange={(e) => this.props.handleTransferReturnStartHour(e.target.value)}
                    defaultValue={businessName === "vehicle" ? this.props.transfer_ReturnHour : ""}
                  >
                    <option value="-Select Hour-">{Trans("_ddlSelect")}</option>
                    {TransfersStartHour.map((item, key) => {
                      return (
                        <option value={item.data} key={key}>
                          {item.display}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            {this.props.tripDirection === "OneWay" && (
              <div className="form-group col-lg-6">
                <TransfersPaxWidget
                  handlePax={this.props.handlePax}
                  isValid={this.props.paxIsValid}
                  ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                  isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                />
              </div>
            )}
          </div>
        )}

        <div className="row">
          {(businessName === "hotel" ||
            businessName === "activity" ||
            businessName === "package" ||
            (businessName === "transfers" && this.props.tripDirection === "RoundTrip") ||
            businessName === "air") && (
              <div className="col-lg-6" style={{ display: isCRSRoomSelectionFlowEnable && businessName === "package" ? "none" : "" }}>
                {businessName === "hotel" && localStorage.getItem("isUmrahPortal") ? (
                  <HotelPaxWidgetUmrah
                    handlePax={this.props.handlePax}
                    isValid={this.props.paxIsValid}
                  />
                ) : businessName === "hotel" ? (
                  <HotelPaxWidget handlePax={this.props.handlePax} isValid={this.props.paxIsValid} />
                ) : (businessName === "activity" || businessName === "package") ? (
                  <ActivityPaxWidget
                    handlePax={this.props.handlePax}
                    isValid={this.props.paxIsValid}
                    ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                    isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                    businessName={businessName}
                  />
                ) : businessName === "transfers" && this.props.tripDirection === "RoundTrip" ? (
                  <TransfersPaxWidget
                    handlePax={this.props.handlePax}
                    isValid={this.props.paxIsValid}
                    ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                    isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                  />
                )
                  : businessName === "air" && !this.props.isPaperRateMode ? (
                    <AirPaxWidget
                      handlePax={this.props.handlePax}
                      isValid={this.props.paxIsValid}
                      ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                      isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                      mode={"home"}
                    />
                  ) : null}
              </div>
            )}

          {businessName === "vehicle" && (
            <React.Fragment>
              <div className="col-lg-6">
                <label htmlFor="driverage">{Trans("_widgetvehicledriverage")}</label>
                <input
                  maxLength="2"
                  min="1"
                  max="100"
                  type="number"
                  name="driverAge"
                  className={
                    "form-control" +
                    ((this.props.driverAgeIsValid === "invalid" || this.props.minimumdriverAgeIsValid === "invalid")
                      ? " border-danger"
                      : "")
                  }
                  onChange={e => {
                    if (e.target.value.indexOf(".") > -1) {
                      return false;
                    } else { this.props.handleDriverAge(e) }
                    return true;
                  }}
                  value={this.props.driverAge}
                />
              </div>
            </React.Fragment>
          )}

          {businessName === "hotel" && localStorage.getItem("isUmrahPortal") && localStorage.getItem("portalType").toLocaleLowerCase() !== "b2c" && (
            <React.Fragment>
              <div className="col-lg-6">
                <label htmlFor="specialCode">{Trans("_widgethotelSpecialCode")}</label>
                <input
                  type="text"
                  name="specialCode"
                  className={"form-control"}
                  onChange={(e) => this.props.handleSpecialCode(e)}
                  value={this.props.specialCode}
                />
              </div>
              <div className="col-lg-6">
                <label htmlFor="subPCCCode">{Trans("_widgethotelsubPCCCode")}</label>
                <input
                  type="text"
                  name="subPCCCode"
                  className={"form-control"}
                  onChange={(e) => this.props.handleSubPCCCode(e)}
                  value={this.props.subPCCCode}
                />
              </div>
            </React.Fragment>
          )}

          {(businessName === "groundservice") && (
            <div className="form-group col-lg-6">
              <label htmlFor="countryofresidence">{Trans("_countryofresidence")}</label>
              <select
                className={
                  "form-control" +
                  (this.props.groundservice_CountryofResidenceIsValid === "invalid" ? " border-danger" : "")
                }
                defaultValue={this.props.groundservice_CountryofResidence}
                onChange={(e) => this.props.handleCountryofResidence(e)}
              >
                <option value="Select Country">{Trans("Select Country")}</option>
                {DropdownList.CountryList.map((country) => {
                  return (
                    <option value={country.isoCode} key={country.isoCode}>
                      {country.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {((businessName === "package" && Global.getEnvironmetKeyValue("SETACTIVITYDEFAULTNATIONALITY", "cobrand")) || Global.getEnvironmetKeyValue("SET" + (businessName.toUpperCase() === "VEHICLE" ? (businessName.toUpperCase() + "LDEFAULTNATIONALITY") : businessName.toUpperCase() + "DEFAULTNATIONALITY"), "cobrand") || businessName === "groundservice") && (
            <div className="form-group col-lg-6">
              <label htmlFor="nationality">{Trans("_nationality")}</label>
              {businessName !== "groundservice" && (
                <select
                  className="form-control"
                  defaultValue={this.props.nationalityCode}
                  onChange={(e) => this.props.handleNationality(e)}
                >
                  {DropdownList.CountryList.map((country) => {
                    return (
                      <option value={country.isoCode} key={country.isoCode}>
                        {country.name}
                      </option>
                    );
                  })}
                </select>)}
              {businessName === "groundservice" && (
                <select
                  className={
                    "form-control" +
                    (this.props.groundservice_NationalityIsValid === "invalid" ? " border-danger" : "")
                  }
                  onChange={(e) => this.props.handleGroundServiceNationality(e)}
                  value={this.props.groundservice_nationalityCode}
                >
                  {businessName === "groundservice" && (
                    <option value="Select Nationality">{Trans("Select Nationality")}</option>
                  )}
                  {DropdownList.CountryList.map((country) => {
                    return (
                      <option value={country.isoCode} key={country.isoCode}>
                        {country.name}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
          )}



          {businessName === "transportation" && (
            <React.Fragment>
              <div className="col-lg-12 mb-3 d-none">
                <label htmlFor="transportationCompany">
                  {Trans("_widget" + businessName + "Company")}
                </label>
                <AutoComplete
                  isValid="valid"
                  name={"transportationCompany"}
                  businessName={businessName}
                  handleLocation={this.props.handleTransportationCompany}
                  mode="company"
                />
              </div>
            </React.Fragment>
          )}

          {Global.getEnvironmetKeyValue("portalType") !== "b2c" &&
            (Global.getEnvironmetKeyValue("HIDEADDITIONALCOMMISSIONPERCENTAGE", "cobrand") ===
              null ||
              Global.getEnvironmetKeyValue("HIDEADDITIONALCOMMISSIONPERCENTAGE", "cobrand") ===
              "false") && (
              <div className="col-lg-6">
                <label htmlFor="ACPercentage">{Trans("_ACPercentage")}</label>
                <input
                  type="text"
                  className={
                    "form-control" +
                    (this.props.ACPercentageIsValid === "invalid" ? " border-danger" : "")
                  }
                  onChange={(e) => this.props.handleACPercentage(e)}
                  value={this.props.ACPercentage}
                />
              </div>
            )}
        </div>

        {(businessName === "groundservice" && this.props.groundservice_Data_AdditionalService.length > 0) && (
          <div className="row">
            <div className="form-group col-lg-12 d-none">
              <GroundServiceAdditionalServiceWidget
                selectedadditionalservices={this.props.groundservice_AdditionalServices}
                additionalservice={this.props.groundservice_Data_AdditionalService}
                isValid={this.props.paxIsValid}
                handleAdditionalServicesPax={this.props.handleAdditionalServicesPax} />
            </div>
          </div>
        )}

        {businessName === "air" && this.props.isAdvanceSearch && (
          <React.Fragment>
            <div className="row">
              <div className="form-group col-lg-6">
                <label htmlFor="airline">{Trans("_widget" + businessName + "AirLine")}</label>
                <AutoComplete
                  isValid="valid"
                  businessName={businessName}
                  handleLocation={this.props.handleAirAirline}
                  mode="airline"
                  selectedOptions={this.props.airAirLine}
                />
              </div>

              <div className="form-group col-lg-6">
                <label htmlFor="cabinclass">{Trans("_widget" + businessName + "CabinClass")}</label>
                <select
                  name="cabinclass"
                  className="form-control"
                  defaultValue={this.props.airCabinClass}
                  onChange={this.props.handleAirCabinClass}
                >
                  <option value="">{Trans("_ddlSelect")}</option>
                  <option value="economy">{Trans("_airSearchFilterEconomy")}</option>
                  <option value="premiumeconomy">
                    {Trans("_airSearchFilterEconomyPremiumEconomy")}
                  </option>
                  <option value="firstclass">{Trans("_airSearchFilterFirstClass")}</option>
                  <option value="business">{Trans("_airSearchFilterBusiness")}</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="form-group col-lg-6">
                <div className=" custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="directflight"
                    name="directflight"
                    checked={this.props.airDirectFlight}
                    onChange={this.props.handleAirDirectFlight}
                  />
                  <label className="custom-control-label text-secondary" htmlFor="directflight">
                    {Trans("_airSearchFilterDirectFlightOnly")}
                  </label>
                </div>
              </div>

              <div className="form-group col-lg-6">
                <div className=" custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="isrefundable"
                    name="isrefundable"
                    checked={this.props.airRefundable}
                    onChange={this.props.handleAirRefundable}
                  />
                  <label className="custom-control-label text-secondary" htmlFor="isrefundable">
                    {Trans("_airSearchFilterRefundableFlightsOnly")}
                  </label>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
        {this.props.minimumdriverAgeIsValid === "invalid" &&
          <label className="d-block text-danger float-left mt-2">
            {Trans("_widgetAgeofDriverNote")}
          </label>}
        {businessName === "vehicle" && Global.getEnvironmetKeyValue("portalType").toLowerCase() !== "b2c" &&
          <div className="row">
            <div className="col-lg-6">
              <label></label>
              <div className=" custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="getpromotions"
                  name="getpromotions"
                  checked={this.props.getpromotion}
                  onChange={this.props.handlegetpromotions}
                />
                <label className="custom-control-label text-secondary" htmlFor="getpromotions">
                  {Trans("GetPromotionofferslabel")}
                </label>
              </div>
            </div>
          </div>
        }

        {businessName === "vehicle" && Global.getEnvironmetKeyValue("portalType") !== "b2c"
          && this.props.getpromotion && this.props.showLoader &&
          <div className="row">
            <div className="form-group col-lg-12">
              {<Loader />}
            </div>
          </div>
        }
        {businessName === "vehicle" && Global.getEnvironmetKeyValue("portalType") !== "b2c"
          && this.props.showvehiclepromotion && !this.props.showLoader &&
          this.props.vehiclepromotion_data.length > 0 &&
          <div className="row">
            <div className="form-group col-lg-12">
              <React.Fragment>
                <label></label>
                <select
                  className="form-control"
                  onChange={(e) => this.props.handleVehiclePromotionProvider(e.target.value)}
                >
                  <option value="">--Select--</option>
                  {this.props.vehiclepromotion_data.map((route) => {
                    return (
                      <option key={route.code} value={route.code + "_" + route.name}>
                        {route.name}
                      </option>
                    );
                  })}
                </select>
              </React.Fragment>
            </div>
          </div>
        }
        {this.props.showcodetextbox &&
          <div className="row">
            <div className="form-group col-lg-12">
              <label>{Trans("PromotionCodelabel")}</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => this.props.handlevehiclePromotionCode(e)}
              />
            </div>
          </div>
        }
        {businessName === "vehicle" && Global.getEnvironmetKeyValue("portalType") !== "b2c"
          && this.props.getpromotion && !this.props.showLoader && this.props.vehiclepromotion_data.length === 0 &&
          <div className="row">
            <div className="form-group col-lg-12">
              <label></label>
              <div>
                {Trans("noPromotionOffersFound")}
              </div>
            </div>
          </div>
        }
        <div className="row">
          <div className="col-lg-12">
            {businessName === "air" && !this.props.isPaperRateMode && (
              <button
                className="btn btn-link text-primary mt-2 p-0"
                onClick={this.props.handleAdvanceSearch}
              >
                <SVGIcon
                  name={this.props.isAdvanceSearch ? "minus" : "plus"}
                  className="mr-2"
                  width="12"
                  height="12"
                  type="fill"
                />
                {Trans("_widgetAdvanceOptions")}
              </button>
            )}
            {this.props.isPaperRateMode &&
              <button
                className="btn btn-primary mt-2 pull-right ml-2"
                onClick={() => this.props.handlePaperRates_ViewAll()}
              >
                View All Flights
              </button>
            }
            <button
              className="btn btn-primary mt-2 pull-right"
              onClick={() => this.props.validateSearch()}
            >
              {Trans("_widgetSearch" + businessName)}
            </button>

          </div>
        </div>
      </div>
    );
  }
}

export default SearchWidgetModeHomeWidget;

const TransfersStartHour = [
  { data: "00:00", display: "12:00 am" },
  { data: "12:30", display: "12:30 am" },
  { data: "12:59", display: "12:59 am" },
  { data: "01:00", display: "01:00 am" },
  { data: "01:30", display: "01:30 pm" },
  { data: "01:59", display: "01:59 am" },
  { data: "02:00", display: "02:00 am" },
  { data: "02:30", display: "02:30 am" },
  { data: "02:59", display: "02:59 am" },
  { data: "03:00", display: "03:00 am" },
  { data: "03:30", display: "03:30 am" },
  { data: "03:59", display: "03:59 am" },
  { data: "04:00", display: "04:00 am" },
  { data: "04:30", display: "04:30 am" },
  { data: "04:59", display: "04:59 am" },
  { data: "05:00", display: "05:00 am" },
  { data: "05:30", display: "05:30 am" },
  { data: "05:59", display: "05:59 am" },
  { data: "06:00", display: "06:00 am" },
  { data: "06:30", display: "06:30 am" },
  { data: "06:59", display: "06:59 am" },
  { data: "07:00", display: "07:00 am" },
  { data: "07:30", display: "07:30 am" },
  { data: "07:59", display: "07:59 am" },
  { data: "08:00", display: "08:00 am" },
  { data: "08:30", display: "08:30 am" },
  { data: "08:59", display: "08:59 am" },
  { data: "09:00", display: "09:00 am" },
  { data: "09:30", display: "09:30 am" },
  { data: "09:59", display: "09:59 am" },
  { data: "10:00", display: "10:00 am" },
  { data: "10:30", display: "10:30 am" },
  { data: "10:59", display: "10:59 am" },
  { data: "11:00", display: "11:00 am" },
  { data: "11:30", display: "11:30 am" },
  { data: "11:59", display: "11:59 am" },
  { data: "12:00", display: "12:00 pm" },
  { data: "12:30", display: "12:30 pm" },
  { data: "12:59", display: "12:59 pm" },
  { data: "13:00", display: "01:00 pm" },
  { data: "13:30", display: "01:30 pm" },
  { data: "13:59", display: "01:59 pm" },
  { data: "14:00", display: "02:00 pm" },
  { data: "14:30", display: "02:30 pm" },
  { data: "14:59", display: "02:59 pm" },
  { data: "15:00", display: "03:00 pm" },
  { data: "15:30", display: "03:30 pm" },
  { data: "15:59", display: "03:59 pm" },
  { data: "16:00", display: "04:00 pm" },
  { data: "16:30", display: "04:30 pm" },
  { data: "16:59", display: "04:59 pm" },
  { data: "17:00", display: "05:00 pm" },
  { data: "17:30", display: "05:30 pm" },
  { data: "17:59", display: "05:59 pm" },
  { data: "18:00", display: "06:00 pm" },
  { data: "18:30", display: "06:30 pm" },
  { data: "18:59", display: "06:59 pm" },
  { data: "19:00", display: "07:00 pm" },
  { data: "19:30", display: "07:30 pm" },
  { data: "19:59", display: "07:59 pm" },
  { data: "20:00", display: "08:00 pm" },
  { data: "20:30", display: "08:30 pm" },
  { data: "20:59", display: "08:59 pm" },
  { data: "21:00", display: "09:00 pm" },
  { data: "21:30", display: "09:30 pm" },
  { data: "21:59", display: "09:59 pm" },
  { data: "22:00", display: "10:00 pm" },
  { data: "22:30", display: "10:30 pm" },
  { data: "22:59", display: "10:59 pm" },
  { data: "23:00", display: "11:00 pm" },
  { data: "23:30", display: "11:30 pm" },
  { data: "23:59", display: "11:59 pm" },
];
