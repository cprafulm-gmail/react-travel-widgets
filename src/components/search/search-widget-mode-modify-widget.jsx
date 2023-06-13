import React, { Component } from "react";
import { Trans } from "../../helpers/translate";
import AutoComplete from "./auto-complete";
import DateRangePicker from "./../common/date-range";
import HotelPaxWidget from "./hotel-pax-widget";
import HotelPaxWidgetUmrah from "./hotel-pax-widget-umrah";
import ActivityPaxWidget from "./activity-pax-widget";
import TransfersPaxWidget from "./transfers-pax-widget";
import AirPaxWidget from "./air-pax-widget";
import SVGIcon from "../../helpers/svg-icon";
import * as Global from "../../helpers/global";
import * as DropdownList from "../../helpers/dropdown-list";
import GroundServiceAdditionalServiceWidget from "./groundservice-additionalsearvice-widget";
import AirLocationMultiDestination from "./air-location-multidestination";
import DateHelper from "../../helpers/date";

class SearchWidgetModeModifyWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  render() {
    const businessName = this.props.businessName;
    let isAllowAirMultiDestination = businessName === "air"
      ? Global.getEnvironmetKeyValue("IsAllowMultiDestinationForFlightBusiness", "cobrand")
      : false;
    const availableBusinesses = Global.getEnvironmetKeyValue("availableBusinesses");
    const isCRSRoomSelectionFlowEnable = Global.getEnvironmetKeyValue("IsCRSRoomSelectionFlowEnable", "cobrand") ? true : false;
    let isAllowTransfersRoundTrip =
      businessName === "transfers"
        ? Global.getEnvironmetKeyValue("ISTRANSFERROUNDTRIPALLOWED", "cobrand")
        : false;
    return (
      <div className={"search-widget pt-3 pb-3 search-widget-" + businessName}>
        <div className="row">
          {(businessName === "air" ||
            (businessName === "transfers" && isAllowTransfersRoundTrip)) && (
              <div className={"form-group pr-lg-0 mb-3" + (isAllowAirMultiDestination && businessName === "air" ? " col-lg-4" : " col-lg-2")}>
                <div className={"BE-Search-Radio"}>
                  <ul className={(isAllowAirMultiDestination && businessName === "air" ? " multicity" : "")}>
                    <li className="checked">
                      <input
                        checked={this.props.tripDirection.toLowerCase() === "roundtrip"}
                        value="RoundTrip"
                        name="Direction"
                        type="radio"
                        onChange={() => this.props.changeairTripType("roundtrip")}
                      />
                      <label>{Trans("_airTripDirection_Roundtrip")}</label>
                    </li>
                    <li>
                      <input
                        value="OneWay"
                        name="Direction"
                        type="radio"
                        checked={this.props.tripDirection.toLowerCase() === "oneway"}
                        onChange={() => this.props.changeairTripType("oneway")}
                      />
                      <label>{Trans("_airTripDirection_Oneway")}</label>
                    </li>
                    {isAllowAirMultiDestination && businessName === "air" &&
                      <li>
                        <input
                          value="OneWay"
                          name="Direction"
                          type="radio"
                          checked={this.props.tripDirection.toLowerCase() === "multicity"}
                          onChange={() => this.props.changeairTripType("MultiCity")}
                        />
                        <label>{Trans("_airTripDirection_multidestination")}</label>
                      </li>
                    }
                  </ul>
                </div>
              </div>
            )}

          {businessName !== "transportation" &&
            businessName !== "groundservice" &&
            businessName !== "transfers" &&
            businessName !== "vehicle" && (
              <React.Fragment>
                <div
                  className={
                    "form-group col-lg-" + (businessName === "air" && isAllowAirMultiDestination ? "4" : businessName === "air" ? "5" : "4") + " pr-lg-0"
                  }
                >
                  <label htmlFor="from">
                    {Trans("_widget" + businessName + "FromLocationTitle")}
                  </label>
                  {businessName === "hotel" && localStorage.getItem("isUmrahPortal") ? (
                    <select
                      className={
                        "form-control" +
                        (this.props.fromLocationIsValid === "invalid" ? " border-danger" : "")
                      }
                      onChange={(e) => this.props.handleFromLocation(e.target.value)}
                      defaultValue={
                        Array.isArray(this.props.fromLocation)
                          ? this.props.fromLocation[0].id + "_" + this.props.fromLocation[0].name
                          : this.props.fromLocation.id + "_" + this.props.fromLocation.name
                      }
                    >
                      <option value="">--Select--</option>
                      <option value="SA26_Makkah, Saudi Arabia - Location">
                        Makkah, Saudi Arabia - Location
                      </option>
                      <option value="SA25_Madinah, Saudi Arabia - Location">
                        Madinah, Saudi Arabia - Location
                      </option>
                    </select>
                  ) : this.props.tripDirection.toLowerCase() === "multicity" ?
                    <input
                      type="text"
                      name="fromLocation"
                      value={Array.isArray(this.props.fromLocation)
                        ? this.props.fromLocation[0].address : ""
                      }
                      className={"form-control"}
                      readOnly="true"
                      onClick={() => this.props.ShowHideMulityCityInfoPopup()}
                    />
                    : (
                      <AutoComplete
                        isValid={this.props.fromLocationIsValid}
                        selectedOptions={
                          Array.isArray(this.props.fromLocation)
                            ? this.props.fromLocation
                            : this.props.fromLocation && this.props.fromLocation.id
                              ? [this.props.fromLocation]
                              : []
                        }
                        businessName={businessName}
                        handleLocation={this.props.handleFromLocation}
                        mode="From"
                      />
                    )}

                  {businessName === "air" && this.props.tripDirection.toLowerCase() !== "multicity" && (
                    <button
                      className="btn-remove-room page-link border-0 text-secondary m-0 p-0 swap-icon-modify"
                      onClick={this.props.handleSwapLocation}
                    >
                      <SVGIcon name="swap" width="16" height="16" type="lineal" />
                    </button>
                  )}
                </div>
              </React.Fragment>
            )}

          {(businessName === "transfers" || businessName === "vehicle") && (
            <React.Fragment>
              <div className={"form-group col-lg-3 mb-3"}>
                <label htmlFor="fromlocation">
                  {businessName === "transfers"
                    ? Trans("_widget" + businessName + "PickupLocationTitle")
                    : Trans("_widget" + businessName + "FromLocationTitle")}
                </label>
                <AutoComplete
                  isValid={this.props.fromLocationIsValid}
                  selectedOptions={
                    Array.isArray(this.props.fromLocation)
                      ? this.props.fromLocation
                      : this.props.fromLocation && this.props.fromLocation.id
                        ? [this.props.fromLocation]
                        : []
                  }
                  businessName={businessName}
                  handleLocation={this.props.handleFromLocation}
                  mode="From"
                />
              </div>
            </React.Fragment>
          )}

          {businessName === "transfers" && (
            <React.Fragment>
              <div className={"form-group col-lg-2 pl-lg-0 pr-lg-0"}>
                <label htmlFor="PickupType">{Trans("_widget" + businessName + "TypeTitle")}</label>
                <select
                  className={"form-control"}
                  onChange={(e) => this.props.handlePickupType(e.target.value)}
                  defaultValue={this.props.transfer_PickupType}
                >
                  <option value="Airport">{Trans("_widget" + businessName + "Airport")}</option>
                  <option value="Accommodation">
                    {Trans("_widget" + businessName + "Accommodation")}
                  </option>
                </select>
              </div>
            </React.Fragment>
          )}

          {(businessName === "transfers" || businessName === "vehicle") && (
            <React.Fragment>
              <div className={"form-group col-lg-3"}>
                <label htmlFor="tolocation">
                  {businessName === "transfers"
                    ? Trans("_widget" + businessName + "DropoffLocationTitle")
                    : Trans("_widget" + businessName + "ToLocationTitle")}
                </label>
                <AutoComplete
                  isValid={this.props.toLocationIsValid}
                  selectedOptions={
                    Array.isArray(this.props.toLocation)
                      ? this.props.toLocation
                      : this.props.toLocation && this.props.toLocation.id
                        ? [this.props.toLocation]
                        : []
                  }
                  businessName={businessName}
                  handleLocation={this.props.handleToLocation}
                  mode="To"
                />
              </div>
            </React.Fragment>
          )}

          {businessName === "transfers" && (
            <React.Fragment>
              <div className={"form-group col-lg-2 pl-lg-0"}>
                <label htmlFor="ReturnType">{Trans("_widget" + businessName + "TypeTitle")}</label>
                <select
                  className={"form-control"}
                  onChange={(e) => this.props.handleDropoffType(e.target.value)}
                  defaultValue={this.props.transfer_DropoffType}
                >
                  <option value="Airport">{Trans("_widget" + businessName + "Airport")}</option>
                  <option value="Accommodation">
                    {Trans("_widget" + businessName + "Accommodation")}
                  </option>
                </select>
              </div>
            </React.Fragment>
          )}

          {businessName === "transportation" && (
            <div className="form-group col-lg-4 pr-lg-0">
              <label htmlFor="from">{Trans("_widget" + businessName + "Route")}</label>
              <select
                className={
                  "form-control" +
                  (this.props.transportation_RouteIsValid === "invalid" ? " border-danger" : "")
                }
                onChange={(e) => this.props.handleTransportationRoute(e.target.value)}
                defaultValue={this.props.transportation_Route}
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
          {this.props.tripDirection.toLowerCase() === "multicity" &&
            <div className={"form-group col-lg-" + (businessName === "air" && isAllowAirMultiDestination ? "4" : "5")}>
              <label htmlFor="to">{Trans("_widget" + businessName + "ToLocationTitle")}</label>
              <input
                type="text"
                name="fromLocation"
                value={Array.isArray(this.props.toLocation)
                  ? this.props.toLocation[0].address : ""
                }
                className={"form-control"}
                readOnly="true"
                onClick={() => this.props.ShowHideMulityCityInfoPopup()}
              />
            </div>
          }
          {businessName === "air" && this.props.tripDirection.toLowerCase() !== "multicity" && (
            <div className={"form-group col-lg-" + (businessName === "air" && isAllowAirMultiDestination ? "4" : "5")}>
              <label htmlFor="to">{Trans("_widget" + businessName + "ToLocationTitle")}</label>
              <AutoComplete
                isValid={this.props.toLocationIsValid}
                selectedOptions={
                  Array.isArray(this.props.toLocation)
                    ? this.props.toLocation
                    : this.props.toLocation && this.props.toLocation.id
                      ? [this.props.toLocation]
                      : []
                }
                businessName={businessName}
                handleLocation={this.props.handleToLocation}
                mode="To"
              />
            </div>
          )}

          {this.props.tripDirection.toLowerCase() === "multicity" ?
            <div className="col-lg-4 pr-lg-0" >
              <input
                type="text"
                value={DateHelper({ date: this.props.dates.checkInDate, format: Global.getEnvironmetKeyValue("DisplayDateFormate") })}
                readOnly="true"
                name="fromDate"
                className={"form-control"}
                onClick={() => this.props.ShowHideMulityCityInfoPopup()}
              />
              <SVGIcon name="calendar" width="16" height="16" style={{
                position: "absolute",
                bottom: "10px",
                right: "24px"
              }}></SVGIcon>
            </div> : <div
              className={
                "col-lg-" +
                (businessName === "air" && isAllowAirMultiDestination ? "4" : businessName === "air" || businessName === "transfers"
                  ? this.props.tripDirection.toLowerCase() === "roundtrip"
                    ? "4"
                    : "2"
                  : (businessName === "transportation" || businessName === "groundservice")
                    ? "2"
                    : "4") +
                ((businessName === "transportation" || businessName === "groundservice") ? " pr-lg-0" : "")
              }
            >
              <DateRangePicker
                isValid={this.props.datesIsValid}
                cutOfDays={this.props.isPaperRateMode ? 3 : availableBusinesses.find((x) => x.name === businessName).cutOffDays}
                stayInDays={this.props.isPaperRateMode ? 0 : availableBusinesses.find((x) => x.name === businessName).stayInDays}
                minDays={localStorage.getItem("isUmrahPortal") ? 5 : 1}
                maxDays={localStorage.getItem("isUmrahPortal") ? 30 : 5}
                isSingleDateRangePicker={
                  this.props.tripDirection.toLowerCase() === "multicity" ? true : businessName === "air" || businessName === "transfers"
                    ? this.props.tripDirection.toLowerCase() === "oneway"
                    : (businessName === "transportation" || businessName === "groundservice")
                      ? true
                      : false
                }
                handleDateChange={this.props.handleDateChange}
                dates={this.props.dates}
                business={businessName}
                isPaperRateMode={this.props.isPaperRateMode}
              />
            </div>
          }

          {(businessName === "transfers" || businessName === "vehicle") && (
            <React.Fragment>
              <div
                className={
                  "form-group pr-lg-0 col-lg-" + (businessName === "transfers" ? "2" : "4")
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
                  defaultValue={this.props.transfer_Hour}
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
            </React.Fragment>
          )}

          {((businessName === "transfers" &&
            isAllowTransfersRoundTrip &&
            this.props.tripDirection.toLowerCase() === "roundtrip") ||
            businessName === "vehicle") && (
              <React.Fragment>
                <div
                  className={
                    "form-group col-lg-" + (businessName === "transfers" ? "2" : "4") + " pr-lg-0"
                  }
                >
                  <label htmlFor="ReturnType">
                    {Trans("_widget" + businessName + "ReturnStartTimeTitle")}
                  </label>
                  <select
                    className={
                      "form-control" +
                      (this.props.transfer_ReturnHourIsValid === "invalid" ? " border-danger" : "")
                    }
                    onChange={(e) => this.props.handleTransferReturnStartHour(e.target.value)}
                    defaultValue={this.props.transfer_ReturnHour}
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
              </React.Fragment>
            )}

          {(businessName === "hotel" ||
            businessName === "activity" ||
            businessName === "package" ||
            businessName === "transfers" ||
            (businessName === "air" && !this.props.isPaperRateMode)) && (
              <div
                className={
                  "col-lg-" +
                  (this.props.tripDirection.toLowerCase() === "multicity" ? "4" : businessName === "air" && this.props.tripDirection.toLowerCase() === "roundtrip" ? "3 " : "3") +
                  " pr-lg-0"
                }
                style={{ display: isCRSRoomSelectionFlowEnable && businessName === "package" ? "none" : "" }}
              >
                {businessName === "hotel" && localStorage.getItem("isUmrahPortal") ? (
                  <HotelPaxWidgetUmrah
                    key={
                      this.props.match.params.checkInDate +
                      this.props.match.params.checkOutDate +
                      this.props.match.params.roomDetails
                    }
                    handlePax={this.props.handlePax}
                    isValid={this.props.paxIsValid}
                    roomDetails={this.props.pax}
                    totalNoOfAdult={this.props.totalNoOfAdult}
                    totalNoOfChild={this.props.totalNoOfChild}
                  />
                ) : businessName === "hotel" ? (
                  <HotelPaxWidget
                    key={
                      this.props.match.params.checkInDate +
                      this.props.match.params.checkOutDate +
                      this.props.match.params.roomDetails
                    }
                    handlePax={this.props.handlePax}
                    isValid={this.props.paxIsValid}
                    roomDetails={this.props.pax}
                    totalNoOfAdult={this.props.totalNoOfAdult}
                    totalNoOfChild={this.props.totalNoOfChild}
                  />
                ) : businessName === "activity" || businessName === "package" ? (
                  <ActivityPaxWidget
                    key={
                      this.props.match.params.checkInDate +
                      this.props.match.params.checkOutDate +
                      this.props.match.params.roomDetails
                    }
                    handlePax={this.props.handlePax}
                    isValid={this.props.paxIsValid}
                    paxDetails={this.props.pax}
                    ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                    isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                    businessName={businessName}
                  />
                ) : businessName === "transfers" ? (
                  <TransfersPaxWidget
                    key={
                      this.props.match.params.checkInDate +
                      this.props.match.params.checkOutDate +
                      this.props.match.params.roomDetails
                    }
                    handlePax={this.props.handlePax}
                    isValid={this.props.paxIsValid}
                    paxDetails={this.props.pax}
                    ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                    isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                  />
                ) : businessName === "air" ? (
                  <AirPaxWidget
                    key={
                      this.props.match.params.checkInDate +
                      this.props.match.params.checkOutDate +
                      this.props.match.params.roomDetails
                    }
                    handlePax={this.props.handlePax}
                    isValid={this.props.paxIsValid}
                    paxDetails={this.props.pax}
                    ShowHidePaxInfoPopup={this.props.ShowHidePaxInfoPopup}
                    isShowPaxInfoPopup={this.props.isShowPaxInfoPopup}
                    mode={"modify"}
                  />
                ) : null}
              </div>
            )}
          {this.props.isShowMultiCityInfoPopup &&
            <div className="border shadow bg-white p-4 room-selection"
              style={{
                top: "198px",
                position: "absolute",
                left: "300px",
                width: "65%"
              }}>
              {this.props.tripDirection.toLowerCase() === "multicity" &&
                <AirLocationMultiDestination
                  airMultiDestincationData={this.props.airMultiDestincationData}
                  handleMultidestinationData={this.props.handleMultidestinationData}
                  addRemoveMultidestinationData={this.props.addRemoveMultidestinationData}
                  mode={"modify"}
                />
              }
            </div>
          }
          {businessName === "vehicle" && (
            <React.Fragment>
              <div className="form-group col-lg-2">
                <label htmlFor="driverage">{Trans("_widgetvehicledriverage")}</label>
                <input
                  maxLength="2"
                  min="1"
                  max="100"
                  type="number"
                  name="driverAge"
                  value={this.props.driverAge}
                  className={
                    "form-control" +
                    ((this.props.driverAgeIsValid === "invalid" || this.props.minimumdriverAgeIsValid === "invalid") ? " border-danger" : "")
                  }
                  onChange={(e) => {
                    if (e.target.value.indexOf(".") > -1) {
                      return false;
                    } else {
                      this.props.handleDriverAge(e);
                    }
                    return true;
                  }}
                />
              </div>
            </React.Fragment>
          )}

          {businessName === "transportation" && (
            <React.Fragment>
              <div className="form-group col-lg-2">
                <label htmlFor="from">{Trans("_widget" + businessName + "NoOfVehicle")}</label>
                <input
                  placeholder={Trans("_widget" + businessName + "NoOfVehicle")}
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
                  onChange={(e) => this.props.handleTransportationPax(e)}
                  value={this.props.transportation_NoOfVehicle}
                />
                <SVGIcon
                  name="bus-alt"
                  className="mr-2"
                  width="16"
                  height="16"
                  type="fill"
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "44px",
                  }}
                />
              </div>

              <div className="form-group col-lg-2">
                <label htmlFor="from">{Trans("_widget" + businessName + "NoOfPerson")}</label>
                <input
                  placeholder={Trans("_widget" + businessName + "NoOfPerson")}
                  type="number"
                  min="1"
                  max="60"
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
                <SVGIcon
                  name="user-alt"
                  className="mr-2"
                  width="16"
                  height="16"
                  type="fill"
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "44px",
                  }}
                />
              </div>
            </React.Fragment>
          )}

          {this.props.tripDirection.toLowerCase() === "multicity" &&
            <div className="col-3 form-group pr-lg-0">
              <button className="btn btn-primary w-100" onClick={() => this.props.ShowHideMulityCityInfoPopup()}>
                {Trans("_widgetAirChangeLocationAndDates")}
              </button>
            </div>
          }

          <div className={"col-" + (businessName === "transportation" ? "2" : "1") + " form-group" + (businessName === "groundservice" ? " mt-3-tmp" : "")}>
            <button className="btn btn-primary w-100" onClick={() => this.props.validateSearch()}>
              {Trans("_widgetSearch")}
            </button>
          </div>
          {this.props.minimumdriverAgeIsValid === "invalid" &&
            <label className="d-block text-danger float-left mt-2">
              {Trans("_widgetAgeofDriverNote")}
            </label>}
        </div>
      </div>
    );
  }
}

export default SearchWidgetModeModifyWidget;

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
