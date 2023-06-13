import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import AutoComplete from "./auto-complete";
import DateRangePicker from "./../common/date-range";
import HotelPaxWidget from "./hotel-pax-widget";
import HotelPaxWidgetUmrah from "./hotel-pax-widget-umrah";
import ActivityPaxWidget from "./activity-pax-widget";
import TransfersPaxWidget from "./transfers-pax-widget";
import AirPaxWidget from "./air-pax-widget";
import * as Global from "../../helpers/global";
import * as DropdownList from "../../helpers/dropdown-list";
import SVGIcon from "../../helpers/svg-icon";
import QuotationAddOffline from "../quotation/quotation-add-offline";
import ComingSoon from "../../helpers/coming-soon";
import { convertNodeToElement } from "react-html-parser";
import GroundServiceAdditionalServiceWidget from "./groundservice-additionalsearvice-widget";
import moment from "moment";

class SearchWidgetModeUmrahPackageWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { isOffline: false, comingsoon: false };
  }

  handleComingSoon = () => {
    this.setState({
      comingsoon: !this.state.comingsoon,
    });
  };

  render() {
    const availableBusinesses = Global.getEnvironmetKeyValue("availableBusinesses");
    let businessName = this.props.businessName;

    businessName = (businessName === 'air_arrival' || businessName === 'air_departure') ? "air" : (businessName === 'hotel_makkah' || businessName === 'hotel_madinah') ? 'hotel' : businessName;

    let isAllowTransfersRoundTrip =
      businessName === "transfers"
        ? Global.getEnvironmetKeyValue("ISTRANSFERROUNDTRIPALLOWED", "cobrand")
        : false;
    const type = this.props.type;

    let itineraryDates = this.props.dates;
    return (
      <div className="quotation-add-items border shadow-sm mt-4" >
        <div className="d-flex border-bottom p-2 pl-3 pr-3 m-0 bg-light">
          <div className="mr-auto d-flex align-items-center">
            <SVGIcon
              className="mr-2 d-flex align-items-center"
              name={businessName + "new"}
              width="24"
              type="fill"
            ></SVGIcon>

            {type === "Quotation" && !this.state.isOffline && businessName !== "custom" && (
              <h6 className="font-weight-bold m-0 p-0">
                {Trans("_widget" + businessName + "Title")}
              </h6>
            )}

            {(type === "Itinerary" || this.state.isOffline || businessName === "custom") && (
              <h6 className="font-weight-bold m-0 p-0 text-capitalize">
                Add {businessName !== "custom" && type === "Quotation" && "Offline"} {businessName}
                {businessName === "custom" && " Item"}
              </h6>
            )}
          </div>

          {!this.props.isUmrahPackage && businessName !== "custom" && (
            <React.Fragment>
              {!this.state.isOffline && (
                <button
                  className="btn btn-sm btn-info pull-right ml-2"
                  onClick={() => this.setState({ isOffline: true })}
                >
                  {Trans("_addOffline")}
                </button>
              )}

              {this.state.isOffline && (
                <button
                  className="btn btn-sm btn-info pull-right ml-2"
                  onClick={() => this.setState({ isOffline: false })}
                >
                  Search Online
                </button>
              )}

              <button
                className="btn btn-sm btn-info pull-right ml-2"
                onClick={() => this.handleComingSoon()}
              >
                {Trans("_importFromBRN")}
              </button>

              {this.state.comingsoon && <ComingSoon handleComingSoon={this.handleComingSoon} />}
            </React.Fragment>
          )}
        </div>

        {(this.state.isOffline || businessName === "custom") && (
          <QuotationAddOffline
            business={businessName}
            handleOffline={this.props.handleOffline}
            handleDateChange={this.props.setDate}
            type={type}
          />
        )}

        {!this.state.isOffline && businessName !== "custom" && (
          <div className="p-3">
            <div className="row">
              {(businessName === "air" ||
                (businessName === "transfers" && isAllowTransfersRoundTrip)) && (
                  <div className={isAllowTransfersRoundTrip ? "d-none" : "col-lg-2"}>
                    <div className="row">
                      <div className="form-group col-lg-12 mb-2">
                        <label className="d-block">Trip Type</label>
                        <div className="BE-Search-Radio mt-1">
                          <ul>
                            <li className="checked">
                              <input
                                disabled="disabled"
                                checked={this.props.isTripDirectionRoundtrip}
                                value="RoundTrip"
                                name="Direction"
                                type="radio"
                                onChange={() => this.props.changeairTripType()}
                              />
                              <label>{Trans("_airTripDirection_Roundtrip")}</label>
                            </li>
                            <li>
                              <input
                                disabled="disabled"
                                value="OneWay"
                                name="Direction"
                                type="radio"
                                checked={!this.props.isTripDirectionRoundtrip}
                                onChange={() => this.props.changeairTripType()}
                              />
                              <label>{Trans("_airTripDirection_Oneway")}</label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {businessName === "transfers" && (
                <div className="col-lg-4">
                  <div className="row position-relative">
                    <div className="form-group col-lg-6">
                      <label htmlFor="fromlocation">
                        {Trans("_widget" + businessName + "PickupLocationTitle")}
                      </label>
                      <AutoComplete
                        isValid={this.props.fromLocationIsValid}
                        businessName={businessName}
                        handleLocation={this.props.handleFromLocation}
                        mode="From"
                        key={
                          businessName === "air" &&
                            this.props.fromLocation &&
                            this.props.fromLocation.id
                            ? this.props.fromLocation.id
                            : ""
                        }
                        selectedOptions={
                          this.props.fromLocation && this.props.fromLocation.id
                            ? [this.props.fromLocation]
                            : []
                        }
                      />
                    </div>

                    <div className="form-group col-lg-6">
                      <label htmlFor="PickupType">
                        {Trans("_widget" + businessName + "TypeTitle")}
                      </label>
                      <select
                        className={"form-control"}
                        onChange={(e) => this.props.handlePickupType(e.target.value)}
                      >
                        <option value="Airport">
                          {Trans("_widget" + businessName + "Airport")}
                        </option>
                        <option value="Accommodation">
                          {Trans("_widget" + businessName + "Accommodation")}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {businessName === "transfers" && (
                <div className="col-lg-4">
                  <div className="row">
                    <div className="form-group col-lg-6">
                      <label htmlFor="tolocation">
                        {Trans("_widget" + businessName + "DropoffLocationTitle")}
                      </label>
                      <AutoComplete
                        isValid={this.props.toLocationIsValid}
                        businessName={businessName}
                        handleLocation={this.props.handleToLocation}
                        mode="To"
                        key={
                          businessName === "air" &&
                            this.props.toLocation &&
                            this.props.toLocation.id
                            ? this.props.toLocation.id
                            : ""
                        }
                        selectedOptions={
                          this.props.toLocation && this.props.toLocation.id
                            ? [this.props.toLocation]
                            : []
                        }
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <label htmlFor="ReturnType">
                        {Trans("_widget" + businessName + "TypeTitle")}
                      </label>
                      <select
                        className={"form-control"}
                        onChange={(e) => this.props.handleDropoffType(e.target.value)}
                      >
                        <option value="Airport">
                          {Trans("_widget" + businessName + "Airport")}
                        </option>
                        <option value="Accommodation">
                          {Trans("_widget" + businessName + "Accommodation")}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {businessName !== "transportation" && businessName !== "groundservice" && businessName !== "transfers" && (
                <div
                  className={
                    type === "Itinerary"
                      ? businessName === "air"
                        ? "col-lg-4"
                        : "col-lg-6"
                      : "col-lg-4"
                  }
                >
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
                          defaultValue={type === "umrah-package" && this.props.mode === "makkah" ?
                            "SA26_Makkah, Saudi Arabia - Location" : "SA25_Madinah, Saudi Arabia - Location"}
                        >
                          {type === "umrah-package" && this.props.mode === "makkah" &&
                            <option value="SA26_Makkah, Saudi Arabia - Location">
                              {Trans("_umrahLocationSA26")}
                            </option>
                          }
                          {type === "umrah-package" && this.props.mode === "madinah" &&
                            <option value="SA25_Madinah, Saudi Arabia - Location">
                              {Trans("_umrahLocationSA25")}
                            </option>
                          }
                        </select>
                      ) : (
                          <React.Fragment>
                            {this.props.mode === "departure" ?
                              <input
                                readOnly="readonly"
                                className="form-control"
                                value={this.props.fromLocation.name}
                              /> : <AutoComplete
                                isValid={this.props.fromLocationIsValid}
                                businessName={businessName}
                                handleLocation={this.props.handleFromLocation}
                                mode="From"
                                key={
                                  businessName === "air" &&
                                    this.props.fromLocation &&
                                    this.props.fromLocation.id
                                    ? this.props.fromLocation.id
                                    : ""
                                }
                                selectedOptions={
                                  this.props.fromLocation && this.props.fromLocation.id
                                    ? [this.props.fromLocation]
                                    : []
                                }
                              />
                            }
                          </React.Fragment>
                        )}
                    </div>
                    {businessName === "air" && (
                      <button
                        className="btn btn-link text-secondary m-0 p-0 swap-icon"
                        onClick={this.props.handleSwapLocation}
                        style={{ top: "38px", right: "-10px" }}
                      >
                        <SVGIcon name="swap" width="16" height="16" type="lineal" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {businessName === "transportation" && (
                <div className="form-group col-lg-3">
                  <label htmlFor="route">{Trans("_widget" + businessName + "Route")}</label>
                  <select
                    readOnly="readOnly"
                    className={
                      "form-control" +
                      (this.props.transportation_RouteIsValid === "invalid"
                        ? " border-danger"
                        : "")
                    }
                    onChange={(e) => this.props.handleTransportationRoute(e.target.value)}
                    defaultValue={this.props.quotationInfo?.umrahRoute}
                  >
                    <option value="">{Trans("_ddlSelect")}</option>
                    {this.props.transportation_Data_Route.map((route) => {
                      return (
                        <option key={route.id} value={route.id}>
                          {route.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {businessName === "air" && (
                <div
                  className={
                    type === "Itinerary"
                      ? businessName === "air"
                        ? "col-lg-4"
                        : "col-lg-5"
                      : "col-lg-4"
                  }
                >
                  <div className="row">
                    <div className="form-group col-lg-12">
                      <label htmlFor="tolocation">
                        {Trans("_widget" + businessName + "ToLocationTitle")}
                      </label>
                      {this.props.mode === "arrival" ?
                        <input
                          readOnly="readonly"
                          className="form-control"
                          value={this.props.toLocation?.name}
                        /> :
                        <AutoComplete
                          isValid={this.props.toLocationIsValid}
                          businessName={businessName}
                          handleLocation={this.props.handleToLocation}
                          mode="To"
                          key={
                            businessName === "air" &&
                              this.props.toLocation &&
                              this.props.toLocation.id
                              ? this.props.toLocation.id
                              : ""
                          }
                          selectedOptions={
                            this.props.toLocation && this.props.toLocation.id
                              ? [this.props.toLocation]
                              : []
                          }
                        />
                      }
                    </div>
                  </div>
                </div>
              )}

              <div className={"col-lg-" + (businessName === "transportation" ? "2" : "4") + (type === "Itinerary" ? " d-none" : "")}>
                <div className="row">
                  <div className={"col-lg-12"}>
                    <DateRangePicker
                      readOnly={businessName === "hotel" || businessName === "air" ? false : true}
                      isValid={this.props.datesIsValid}
                      cutOfDays={5}
                      stayInDays={5}
                      minDays={5}
                      maxDays={30}
                      dates={
                        type === "umrah-package"
                          ? itineraryDates
                          : this.props.dates === ""
                            ? undefined
                            : this.props.dates
                      }
                      isSingleDateRangePicker={
                        businessName === "air" || businessName === "transfers"
                          ? !this.props.isTripDirectionRoundtrip
                          : businessName === "transportation" || businessName === "groundservice"
                            ? true
                            : false
                      }
                      handleDateChange={this.props.handleDateChange}
                      business={businessName}
                      type={"umrah-package"}
                      umrahMinDate={this.props.isTripDirectionRoundtrip ? moment(new Date(this.props.quotationInfo.startDate)).add(-1, "days") : this.props.mode === "arrival" ? moment(new Date(this.props.quotationInfo.startDate)).add(-1, "days") : moment(new Date(this.props.quotationInfo.endDate))}
                      umrahMaxDate={this.props.isTripDirectionRoundtrip ? moment(new Date(this.props.quotationInfo.endDate)) : this.props.mode === "arrival" ? moment(new Date(this.props.quotationInfo.startDate)) : moment(new Date(this.props.quotationInfo.endDate))}
                    />
                  </div>

                </div>
              </div>

              {(businessName === "transportation" || businessName === "groundservice") && (
                <div className={"col-lg-" + (businessName === "groundservice" ? "2" : "3") + (type === "Itinerary" ? " d-none" : "")}>
                  <div className="row">
                    <React.Fragment>
                      {businessName === "transportation" && <div className="form-group col-lg-6 pl-lg-0">
                        <label htmlFor="noofvehicle">
                          {Trans("_widget" + businessName + "NoOfVehicle")}
                        </label>
                        <input
                          readOnly="readOnly"
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
                          value={this.props.quotationInfo?.umrahNoOfVehicle ? this.props.quotationInfo?.umrahNoOfVehicle : this.props.transportation_NoOfVehicle}
                        />
                      </div>}
                      {businessName === "transportation" &&
                        <div className={"form-group col-lg-6 pl-lg-0"}>
                          <label htmlFor="noofpersion">
                            {Trans("_widget" + businessName + "NoOfPerson")}
                          </label>
                          <input
                            readOnly="readOnly"
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
                            value={this.props.transportation_NoOfPerson ? this.props.transportation_NoOfPerson : this.props.quotationInfo?.umrahPax.reduce((itemName, item) => itemName + (item.noOfRooms * item.noOfAdults) + (item.noOfRooms * item.noOfChild), 0)}
                          />
                        </div>}
                      {businessName === "groundservice" &&

                        <div className="form-group col-lg-12">
                          <label htmlFor="noofpersion">
                            {Trans("_widget" + businessName + "NoOfPerson")}
                          </label>
                          <input
                            readOnly="readOnly"
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
                        </div>}
                    </React.Fragment>

                  </div>
                </div>
              )}

              {businessName === "transfers" && (
                <div className={type === "Itinerary" ? "col-lg-2" : "col-lg-4"}>
                  <div className="row">
                    <div
                      className={
                        type === "Itinerary" ? "form-group col-lg-12" : "form-group col-lg-6"
                      }
                    >
                      <label htmlFor="ReturnType">
                        {Trans("_widget" + businessName + "StartTimeTitle")}
                      </label>
                      <select
                        className={
                          "form-control" +
                          (this.props.transfer_HourIsValid === "invalid" ? " border-danger" : "")
                        }
                        onChange={(e) => this.props.handleTransferStartHour(e.target.value)}
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
                    {businessName === "transfers" &&
                      isAllowTransfersRoundTrip &&
                      this.props.isTripDirectionRoundtrip && (
                        <div className={"form-group col-lg-6"}>
                          <label htmlFor="ReturnType">
                            {Trans("_widget" + businessName + "ReturnStartTimeTitle")}
                          </label>
                          <select
                            className={
                              "form-control" +
                              (this.props.transfer_ReturnHourIsValid === "invalid"
                                ? " border-danger"
                                : "")
                            }
                            onChange={(e) =>
                              this.props.handleTransferReturnStartHour(e.target.value)
                            }
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
                    {!this.props.isTripDirectionRoundtrip && (
                      <div
                        className={"form-group col-lg-6" + (type === "Itinerary" ? " d-none" : "")}
                      >
                        <TransfersPaxWidget
                          handlePax={this.props.handlePax}
                          isValid={this.props.paxIsValid}
                          ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                          isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(businessName === "hotel" ||
                businessName === "activity" ||
                businessName === "package" ||
                (businessName === "transfers" && this.props.isTripDirectionRoundtrip) ||
                businessName === "air") && (
                  <div className={"col-lg-3" + (type === "Itinerary" ? " d-none" : "")}>
                    <div className="row">
                      <div className="col-lg-12">
                        {businessName === "hotel" && localStorage.getItem("isUmrahPortal") ? (
                          <HotelPaxWidgetUmrah
                            roomDetails={this.props.quotationInfo?.umrahPax}
                            handlePax={this.props.handlePax}
                            isValid={this.props.paxIsValid}
                            type={"umrah-package"}
                          />
                        ) : businessName === "hotel" ? (
                          <HotelPaxWidget
                            handlePax={this.props.handlePax}
                            isValid={this.props.paxIsValid}
                          />
                        ) : businessName === "activity" || businessName === "package" ? (
                          !type === "Itinerary" ? (
                            <ActivityPaxWidget
                              handlePax={this.props.handlePax}
                              isValid={this.props.paxIsValid}
                              ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                              isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                            />
                          ) : (
                              <TransfersPaxWidget
                                handlePax={this.props.handlePax}
                                isValid={this.props.paxIsValid}
                                ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                                isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                              />
                            )
                        ) : businessName === "transfers" && this.props.isTripDirectionRoundtrip ? (
                          <TransfersPaxWidget
                            handlePax={this.props.handlePax}
                            isValid={this.props.paxIsValid}
                            ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                            isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                          />
                        ) : businessName === "air" ? (
                          <AirPaxWidget
                            handlePax={this.props.handlePax}
                            isValid={this.props.paxIsValid}
                            ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                            isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                            paxDetails={this.props.pax}
                            mode={"home"}
                            type={"umrah-package"}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}

              {businessName === "transportation" && (
                <React.Fragment>
                  <div className="col-lg-3 mb-3 d-none">
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
              {businessName === "groundservice" && (
                <React.Fragment>
                  <div className="form-group col-lg-3">
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
                  <div className="form-group col-lg-3 d-none">
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
                  <div className="col-lg-2">
                    <label htmlFor="countryofresidence">{Trans("_countryofresidence")}</label>
                    <select
                      readOnly="readOnly"
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
                </React.Fragment>
              )}

              {((businessName === "hotel" && Global.getEnvironmetKeyValue("SETHOTELDEFAULTNATIONALITY", "cobrand")) || businessName === "groundservice") && (
                <div className="col-lg-2">
                  <label htmlFor="nationality">{Trans("_nationality")}</label>
                  <select
                    readOnly="readOnly"
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
                  </select>
                </div>
              )}

              {(businessName === "groundservice" && this.props.groundservice_Data_AdditionalService.length > 0) && (
                <div className="form-group col-lg-4 d-none">
                  <GroundServiceAdditionalServiceWidget
                    selectedadditionalservices={this.props.groundservice_AdditionalServices}
                    additionalservice={this.props.groundservice_Data_AdditionalService}
                    isValid={this.props.paxIsValid}
                    handleAdditionalServicesPax={this.props.handleAdditionalServicesPax} />
                </div>
              )}

              <div style={{ display: "none" }}>
                {businessName === "hotel" && localStorage.getItem("isUmrahPortal") && (
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



                {Global.getEnvironmetKeyValue("portalType") !== "b2c" &&
                  (Global.getEnvironmetKeyValue("HIDEADDITIONALCOMMISSIONPERCENTAGE", "cobrand") ===
                    null ||
                    Global.getEnvironmetKeyValue(
                      "HIDEADDITIONALCOMMISSIONPERCENTAGE",
                      "cobrand"
                    ) === "false") && (
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
                      <label htmlFor="cabinclass">
                        {Trans("_widget" + businessName + "CabinClass")}
                      </label>
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
                        <label
                          className="custom-control-label text-secondary"
                          htmlFor="directflight"
                        >
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
                        <label
                          className="custom-control-label text-secondary"
                          htmlFor="isrefundable"
                        >
                          {Trans("_airSearchFilterRefundableFlightsOnly")}
                        </label>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}

              <div className={type === "Itinerary" ? "col-lg-2" : "col-lg-1"}>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label>&nbsp;</label>
                      <div style={{ display: "none" }}>
                        {businessName === "air" && (
                          <button
                            className="btn btn-link text-primary p-0"
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
                      </div>
                      <button
                        className="form-control btn btn-sm btn-primary"
                        onClick={() => this.props.validateSearch("umrah-package")}
                      >
                        {type === "Itinerary"
                          ? Trans("_widgetSearch") + " Live Inventory"
                          : Trans("_widgetSearch")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {type === "Itinerary" && (
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-12 text-center">
                      <div className="or-sprt">
                        <b>OR</b>
                      </div>
                    </div>
                    <div className="col-lg-12 text-center">
                      <div className="d-inline-block mt-3">
                        <div className="form-group">
                          <button
                            className="form-control btn btn-sm btn-primary"
                            onClick={() => this.setState({ isOffline: true })}
                          >
                            {Trans("_addOffline")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
        }
      </div>
    );
  }
}

export default SearchWidgetModeUmrahPackageWidget;

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
